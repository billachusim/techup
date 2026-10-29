-- Reminders for instalment balances, and receipts once a balance is paid online.
-- /api/payment-followups (called by recover-checkouts every 30 minutes) emails
-- each student on an instalment plan up to three times: 7 days before the
-- balance is due, the day before, and once the day after it was missed. Each
-- email carries a pay link (/pay-balance?t=<pay_token>) that opens a
-- Flutterwave checkout for the balance without signing in. Card payments are
-- then confirmed by verify-payment / recover-checkouts as before, and the
-- student gets a receipt. Overdue balances are only flagged; access is not cut off.

CREATE TABLE IF NOT EXISTS public.balance_reminders (
  enrollment_id uuid PRIMARY KEY REFERENCES public.enrollments(id) ON DELETE CASCADE,
  -- Secret in the pay link. It only lets the holder pay this plan's balance.
  pay_token uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  due_soon_sent_at timestamptz,
  due_tomorrow_sent_at timestamptz,
  overdue_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Written only by server code (service key). Admins read them.
ALTER TABLE public.balance_reminders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins read balance reminders" ON public.balance_reminders;
CREATE POLICY "Admins read balance reminders" ON public.balance_reminders
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Claimed before the "balance paid" receipt is sent, so it goes out once.
ALTER TABLE public.enrollment_payments
  ADD COLUMN IF NOT EXISTS receipt_sent_at timestamptz;
