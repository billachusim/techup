-- Intake dates shown on the department pages, set by admins on /admin/intakes,
-- and instalment plans: a checkout that charges a deposit now and leaves a
-- balance the student pays later. The instalment terms live in
-- supabase/functions/_shared/pricing.ts (INSTALMENTS).

-- Intakes ---------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.intakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- A department slug from src/data/departments.ts, or null for every department.
  department_slug text,
  starts_on date NOT NULL,
  -- Last day to enrol, if there is one.
  enrol_by date CHECK (enrol_by IS NULL OR enrol_by <= starts_on),
  learning_mode text NOT NULL DEFAULT 'any'
    CHECK (learning_mode IN ('any', 'online-only', 'hybrid', 'physical')),
  -- Where it runs, for hybrid and physical intakes (e.g. "Nnewi").
  campus text,
  seats integer CHECK (seats IS NULL OR seats > 0),
  note text CHECK (note IS NULL OR length(note) <= 200),
  published boolean NOT NULL DEFAULT true,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS intakes_starts_on_idx ON public.intakes (starts_on);

ALTER TABLE public.intakes ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.intakes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.intakes TO authenticated;

-- Visitors see published intakes; admins also see drafts. (anon may not
-- call has_role, so it gets its own policy.)
DROP POLICY IF EXISTS "Anyone reads published intakes" ON public.intakes;
CREATE POLICY "Anyone reads published intakes" ON public.intakes
  FOR SELECT TO anon
  USING (published);
DROP POLICY IF EXISTS "Signed-in users read published intakes" ON public.intakes;
CREATE POLICY "Signed-in users read published intakes" ON public.intakes
  FOR SELECT TO authenticated
  USING (published OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage intakes" ON public.intakes;
CREATE POLICY "Admins manage intakes" ON public.intakes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_intake()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS touch_intake ON public.intakes;
CREATE TRIGGER touch_intake BEFORE UPDATE ON public.intakes
  FOR EACH ROW EXECUTE FUNCTION public.touch_intake();

-- On /admin/activity, like the other admin changes.
CREATE OR REPLACE FUNCTION public.audit_intake_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row_ public.intakes;
BEGIN
  IF TG_OP = 'DELETE' THEN row_ := OLD; ELSE row_ := NEW; END IF;
  PERFORM public.log_admin_action(
    'intake.' || lower(TG_OP),
    'intakes',
    row_.id::text,
    NULL,
    COALESCE(row_.department_slug, 'All departments') || ' · ' || row_.starts_on::text,
    jsonb_build_object('starts_on', row_.starts_on, 'department', row_.department_slug,
                       'mode', row_.learning_mode, 'published', row_.published)
  );
  RETURN row_;
END;
$$;
DROP TRIGGER IF EXISTS audit_intake_change ON public.intakes;
CREATE TRIGGER audit_intake_change AFTER INSERT OR UPDATE OR DELETE ON public.intakes
  FOR EACH ROW EXECUTE FUNCTION public.audit_intake_change();

-- Instalments -----------------------------------------------------------

-- On an instalment plan, amount_due is the deposit charged at checkout,
-- instalment_total the whole plan and balance_due what is still owed.
-- Once the balance is paid, amount_paid is set to instalment_total so the
-- admin dashboard counts the full plan as revenue.
ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS instalment_total numeric CHECK (instalment_total IS NULL OR instalment_total > 0),
  ADD COLUMN IF NOT EXISTS balance_due numeric CHECK (balance_due IS NULL OR balance_due >= 0),
  ADD COLUMN IF NOT EXISTS balance_due_by date,
  ADD COLUMN IF NOT EXISTS balance_paid_at timestamptz;

-- Students may still only request plans with no payment fields set
-- (the policy from 20261011221000, plus the instalment columns).
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
  AND (
    status = 'pending'
    OR (status = 'active' AND plan_name IN ('Bootcamp Starter', 'Free Bootcamp'))
  )
);

-- Each balance checkout. create-checkout adds it, and confirmPayment marks it
-- paid once Flutterwave confirms it.
CREATE TABLE IF NOT EXISTS public.enrollment_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  tx_ref text NOT NULL UNIQUE,
  amount numeric NOT NULL CHECK (amount > 0),
  currency text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  paid_at timestamptz,
  payment_reference text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS enrollment_payments_enrollment_idx ON public.enrollment_payments (enrollment_id);
CREATE INDEX IF NOT EXISTS enrollment_payments_pending_idx ON public.enrollment_payments (created_at) WHERE status = 'pending';

-- Written only by the payment functions (service key). Admins read them.
ALTER TABLE public.enrollment_payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins read balance payments" ON public.enrollment_payments;
CREATE POLICY "Admins read balance payments" ON public.enrollment_payments
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));