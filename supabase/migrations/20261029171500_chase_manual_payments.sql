-- Chase plans requested over WhatsApp or email (bank transfer) that are still
-- unpaid: a Flutterwave pay link an hour after the request, one reminder two
-- days after the link, and cancellation 14 days after the link.
-- See supabase/functions/_shared/manual-payments.ts and src/lib/pay-link-followups.server.ts.

-- requested_selection: what the student chose on the pricing page, saved with
--   the request so the server can price it (never trusted as a price).
-- pay_link_*: the link recover-checkouts made, and the emails about it.
-- pay_link_skipped_reason: why a request is left to an admin instead.
-- auto_cancelled_at / cancel_email_sent_at: cancelled for non-payment, and the
--   student was told.
ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS requested_selection jsonb,
  ADD COLUMN IF NOT EXISTS pay_link_url text,
  ADD COLUMN IF NOT EXISTS pay_link_created_at timestamptz,
  ADD COLUMN IF NOT EXISTS pay_link_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS pay_link_reminder_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS pay_link_disabled_at timestamptz,
  ADD COLUMN IF NOT EXISTS pay_link_skipped_reason text,
  ADD COLUMN IF NOT EXISTS auto_cancelled_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancel_email_sent_at timestamptz;

-- Students may send their selection, but none of the chase columns.
DROP POLICY IF EXISTS "Students request own enrollments" ON public.enrollments;
CREATE POLICY "Students request own enrollments"
ON public.enrollments
FOR INSERT
TO authenticated
WITH CHECK (
  faculty_id = (SELECT faculty_id FROM public.profiles WHERE id = auth.uid())
  AND tx_ref IS NULL
  AND amount_due IS NULL
  AND paid_at IS NULL
  AND payment_reference IS NULL
  AND recovered_at IS NULL
  AND recovered_email_sent_at IS NULL
  AND payment_reminder_sent_at IS NULL
  AND instalment_total IS NULL
  AND balance_due IS NULL
  AND balance_due_by IS NULL
  AND balance_paid_at IS NULL
  AND pay_link_url IS NULL
  AND pay_link_created_at IS NULL
  AND pay_link_sent_at IS NULL
  AND pay_link_reminder_sent_at IS NULL
  AND pay_link_disabled_at IS NULL
  AND pay_link_skipped_reason IS NULL
  AND auto_cancelled_at IS NULL
  AND cancel_email_sent_at IS NULL
  AND (
    status = 'pending'
    OR (status = 'active' AND plan_name IN ('Bootcamp Starter', 'Free Bootcamp'))
  )
);
