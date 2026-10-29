-- Admin automation: weekly admin report (Mondays) and automatic talent approval.
-- See src/lib/admin-weekly-report.server.ts and src/lib/talent-auto-approve.server.ts.

-- 1. One row per sent report, claimed before sending so a repeat call never sends twice.
CREATE TABLE IF NOT EXISTS public.admin_weekly_report_sends (
  week_of date PRIMARY KEY,
  report jsonb NOT NULL DEFAULT '{}'::jsonb,
  sent_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_weekly_report_sends ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.admin_weekly_report_sends FROM anon, authenticated;
GRANT ALL ON public.admin_weekly_report_sends TO service_role;

-- 2. Mondays at 06:30 UTC (07:30 in Lagos), after the morning digest.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule('admin-weekly-report') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'admin-weekly-report');

SELECT cron.schedule(
  'admin-weekly-report',
  '30 6 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://techfaculty.ng/api/admin-weekly-report',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb
  ) as request_id;
  $$
);

-- 3. Approving a talent no longer mints a Faculty ID. Faculty IDs belong to
--    students and alumni: approval links the student's existing ID (from
--    profiles) when they have one, and otherwise leaves it empty. The site's
--    server (service role) may now approve, so profiles at 70%+ strength are
--    approved automatically. Staff can still issue an ID by hand.
CREATE OR REPLACE FUNCTION public.approve_talent(_talent_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  t record;
  student_id text;
BEGIN
  IF auth.role() IS DISTINCT FROM 'service_role' AND NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Only staff can approve talent';
  END IF;

  SELECT * INTO t FROM public.talent_profiles WHERE id = _talent_id;
  IF t.id IS NULL THEN
    RAISE EXCEPTION 'Talent not found';
  END IF;

  IF t.faculty_id IS NULL AND t.user_id IS NOT NULL THEN
    SELECT faculty_id INTO student_id FROM public.profiles WHERE id = t.user_id;
  END IF;

  UPDATE public.talent_profiles
  SET is_vetted = true,
      vetted_at = COALESCE(vetted_at, now()),
      is_public = true,
      faculty_id = COALESCE(faculty_id, student_id),
      updated_at = now()
  WHERE id = _talent_id;

  RETURN COALESCE(t.faculty_id, student_id);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.approve_talent(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.approve_talent(uuid) TO authenticated, service_role;

-- 4. A talent profile no longer earns a new Faculty ID at 100%. Signing in links
--    the student's existing Faculty ID (from registering for a course), if any.
CREATE OR REPLACE FUNCTION public.claim_talent_faculty_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  t record;
  student_id text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Please sign in first';
  END IF;

  SELECT * INTO t FROM public.talent_profiles WHERE user_id = auth.uid() LIMIT 1;
  IF t.id IS NULL THEN
    RETURN NULL;
  END IF;
  IF t.faculty_id IS NOT NULL THEN
    RETURN t.faculty_id;
  END IF;

  SELECT faculty_id INTO student_id FROM public.profiles WHERE id = auth.uid();
  IF student_id IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE public.talent_profiles SET faculty_id = student_id, updated_at = now() WHERE id = t.id;
  RETURN student_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.claim_talent_faculty_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_talent_faculty_id() TO authenticated;
