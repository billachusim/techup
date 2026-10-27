-- Online card payment for Virtual SIWES, the logbook service and the SIWES
-- Success Kit, without a Faculty ID. create-order-checkout saves each order
-- as pending; verify-payment / recover-checkouts mark it paid only after
-- Flutterwave's verify API confirms the full amount. Admins see paid orders
-- on /admin/leads and mark them fulfilled once the letter, pickup or kit is sent.

CREATE TABLE IF NOT EXISTS public.product_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tx_ref text NOT NULL UNIQUE,
  items text[] NOT NULL CHECK (cardinality(items) > 0),
  amount_due numeric NOT NULL CHECK (amount_due > 0),
  currency text NOT NULL DEFAULT 'NGN',
  name text,
  email text NOT NULL,
  phone text,
  school text,
  notes text,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  payment_reference text,
  paid_at timestamptz,
  recovered_at timestamptz,
  buyer_email_sent_at timestamptz,
  admin_email_sent_at timestamptz,
  fulfilled_at timestamptz,
  fulfilled_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS product_orders_status_created_idx ON public.product_orders (status, created_at DESC);
CREATE INDEX IF NOT EXISTS product_orders_lead_idx ON public.product_orders (lead_id);

ALTER TABLE public.product_orders ENABLE ROW LEVEL SECURITY;
-- Buyers never read this table directly; the edge functions use the service role.
REVOKE ALL ON public.product_orders FROM anon;
GRANT SELECT, UPDATE ON public.product_orders TO authenticated;
GRANT ALL ON public.product_orders TO service_role;

DROP POLICY IF EXISTS "Admins read orders" ON public.product_orders;
CREATE POLICY "Admins read orders" ON public.product_orders FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update orders" ON public.product_orders;
CREATE POLICY "Admins update orders" ON public.product_orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- "Needs you today" gains paid orders waiting to be sent. Same as
-- 20261012103000_needs_you_today.sql plus orders_to_fulfil.
CREATE OR REPLACE FUNCTION public.needs_you_today_counts()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referral_rewards integer;
BEGIN
  IF to_regclass('public.referrals') IS NOT NULL THEN
    EXECUTE 'SELECT count(*) FROM public.referrals WHERE status = ''earned''' INTO referral_rewards;
  END IF;

  RETURN jsonb_build_object(
    'new_leads', (SELECT count(*) FROM public.leads WHERE status = 'new'),
    'payments_to_confirm', (SELECT count(*) FROM public.enrollments WHERE status = 'pending'),
    'work_to_review', (SELECT count(*) FROM public.student_deliverables WHERE status = 'submitted'),
    'talent_requests',
      (SELECT count(*) FROM public.business_briefs WHERE status = 'new')
      + (SELECT count(*) FROM public.talent_interest_requests WHERE status = 'new'),
    'referral_rewards', referral_rewards,
    'orders_to_fulfil', (SELECT count(*) FROM public.product_orders WHERE status = 'paid' AND fulfilled_at IS NULL)
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.needs_you_today_counts() FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.needs_you_today_counts() TO service_role;
