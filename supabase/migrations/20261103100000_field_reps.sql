-- Field reps. People who recruit students in person (schools, churches,
-- businesses) each get a code and a link, techfaculty.ng/?ref=CODE. The site
-- remembers the code and stamps it on leads and enrolments; /admin/reps shows
-- what each rep brought in, the commission they've earned on payments
-- received, and what has been paid out to them.
--
-- Unlike alumni referral codes (20261012101500_alumni_referrals.sql), a rep
-- code gives the student no discount and the rep needs no student account.
-- Commission is worked out from enrolments, so instalment balances count as
-- they come in.

CREATE TABLE IF NOT EXISTS public.field_reps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE CHECK (code ~ '^[A-Z0-9-]{3,24}$'),
  name text NOT NULL CHECK (length(trim(name)) > 0),
  phone text,
  area text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'left')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

CREATE TABLE IF NOT EXISTS public.field_rep_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rep_id uuid NOT NULL REFERENCES public.field_reps(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  paid_on date NOT NULL DEFAULT current_date,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);
CREATE INDEX IF NOT EXISTS field_rep_payouts_rep_idx ON public.field_rep_payouts (rep_id);

ALTER TABLE public.field_reps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_rep_payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage field reps" ON public.field_reps
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage field rep payouts" ON public.field_rep_payouts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- A code means one thing: a rep code can't reuse an alumni code.
CREATE OR REPLACE FUNCTION public.field_rep_code_is_free()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.code := upper(trim(NEW.code));
  IF EXISTS (SELECT 1 FROM public.referral_codes WHERE code = NEW.code) THEN
    RAISE EXCEPTION 'That code already belongs to a graduate. Pick another.';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS field_rep_code_is_free ON public.field_reps;
CREATE TRIGGER field_rep_code_is_free
  BEFORE INSERT OR UPDATE OF code ON public.field_reps
  FOR EACH ROW EXECUTE FUNCTION public.field_rep_code_is_free();

-- The ?ref= code the visitor arrived with (any code: rep or alumni).
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS ref_code text;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS ref_code text;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'leads_ref_code_check') THEN
    ALTER TABLE public.leads ADD CONSTRAINT leads_ref_code_check
      CHECK (ref_code IS NULL OR ref_code ~ '^[A-Z0-9-]{3,24}$');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enrollments_ref_code_check') THEN
    ALTER TABLE public.enrollments ADD CONSTRAINT enrollments_ref_code_check
      CHECK (ref_code IS NULL OR ref_code ~ '^[A-Z0-9-]{3,24}$');
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS leads_ref_code_idx ON public.leads (ref_code) WHERE ref_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS enrollments_ref_code_idx ON public.enrollments (ref_code) WHERE ref_code IS NOT NULL;

-- Per rep: what they brought in during the window, and their money all time.
-- Commission = 10% (FIELD_REP_COMMISSION_PERCENT in supabase/functions/_shared/pricing.ts)
-- of what was actually received on paid, confirmed naira enrolments.
CREATE OR REPLACE FUNCTION public.field_rep_summary(_days integer DEFAULT 7)
RETURNS TABLE (
  id uuid,
  code text,
  name text,
  phone text,
  area text,
  status text,
  notes text,
  created_at timestamptz,
  leads bigint,
  bootcamp_signups bigint,
  paid_enrolments bigint,
  received numeric,
  commission numeric,
  paid_out numeric,
  owed numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH since AS (
    SELECT now() - make_interval(days => GREATEST(1, LEAST(COALESCE(_days, 7), 3650))) AS t
  ),
  paid AS (
    SELECT e.ref_code, COALESCE(e.amount_paid, e.amount_due, 0) AS received, e.created_at
    FROM public.enrollments e
    WHERE e.ref_code IS NOT NULL
      AND e.status IN ('active', 'confirmed')
      AND e.plan_name NOT IN ('Bootcamp Starter', 'Free Bootcamp')
      AND COALESCE(e.currency, 'NGN') = 'NGN'
  ),
  money AS (
    SELECT r.id,
           COALESCE((SELECT sum(p.received) FROM paid p WHERE p.ref_code = r.code), 0) AS received,
           COALESCE((SELECT sum(x.amount) FROM public.field_rep_payouts x WHERE x.rep_id = r.id), 0) AS paid_out
    FROM public.field_reps r
  )
  SELECT r.id, r.code, r.name, r.phone, r.area, r.status, r.notes, r.created_at,
    (SELECT count(*) FROM public.leads l, since WHERE l.ref_code = r.code AND l.created_at >= since.t),
    (SELECT count(*) FROM public.enrollments e, since
      WHERE e.ref_code = r.code AND e.plan_name IN ('Bootcamp Starter', 'Free Bootcamp') AND e.created_at >= since.t),
    (SELECT count(*) FROM paid p, since WHERE p.ref_code = r.code AND p.created_at >= since.t),
    m.received,
    round(m.received * 0.10),
    m.paid_out,
    round(m.received * 0.10) - m.paid_out
  FROM public.field_reps r
  JOIN money m ON m.id = r.id
  ORDER BY r.status = 'active' DESC, r.created_at;
$$;
REVOKE EXECUTE ON FUNCTION public.field_rep_summary(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.field_rep_summary(integer) TO service_role;

-- Admin wrapper for the dashboard.
CREATE OR REPLACE FUNCTION public.admin_field_rep_summary(_days integer DEFAULT 7)
RETURNS TABLE (
  id uuid,
  code text,
  name text,
  phone text,
  area text,
  status text,
  notes text,
  created_at timestamptz,
  leads bigint,
  bootcamp_signups bigint,
  paid_enrolments bigint,
  received numeric,
  commission numeric,
  paid_out numeric,
  owed numeric
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admins only' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY SELECT * FROM public.field_rep_summary(_days);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.admin_field_rep_summary(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_field_rep_summary(integer) TO authenticated;

-- One rep's sign-ups, newest first, for the dashboard and the HR API.
CREATE OR REPLACE FUNCTION public.field_rep_activity(_code text, _days integer DEFAULT 30)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH since AS (
    SELECT now() - make_interval(days => GREATEST(1, LEAST(COALESCE(_days, 30), 3650))) AS t
  )
  SELECT jsonb_build_object(
    'leads', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('created_at', l.created_at, 'name', l.name, 'contact', l.contact,
                                          'interest', l.interest, 'status', l.status) ORDER BY l.created_at DESC)
      FROM (SELECT * FROM public.leads, since WHERE ref_code = upper(_code) AND created_at >= since.t
            ORDER BY created_at DESC LIMIT 200) l
    ), '[]'::jsonb),
    'enrolments', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('created_at', e.created_at, 'name', p.name, 'phone', p.phone,
                                          'faculty_id', e.faculty_id, 'plan_name', e.plan_name, 'status', e.status,
                                          'received', CASE WHEN e.status IN ('active', 'confirmed')
                                                           AND e.plan_name NOT IN ('Bootcamp Starter', 'Free Bootcamp')
                                                      THEN COALESCE(e.amount_paid, e.amount_due) END,
                                          'currency', e.currency) ORDER BY e.created_at DESC)
      FROM (SELECT * FROM public.enrollments, since WHERE ref_code = upper(_code) AND created_at >= since.t
            ORDER BY created_at DESC LIMIT 200) e
      LEFT JOIN public.profiles p ON p.faculty_id = e.faculty_id
    ), '[]'::jsonb)
  );
$$;
REVOKE EXECUTE ON FUNCTION public.field_rep_activity(text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.field_rep_activity(text, integer) TO service_role;

CREATE OR REPLACE FUNCTION public.admin_field_rep_activity(_code text, _days integer DEFAULT 30)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admins only' USING ERRCODE = '42501';
  END IF;
  RETURN public.field_rep_activity(_code, _days);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.admin_field_rep_activity(text, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_field_rep_activity(text, integer) TO authenticated;
