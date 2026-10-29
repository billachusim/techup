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

-- 3. Let the site's server (service role) approve talent and issue Faculty IDs,
--    so profiles at 70%+ strength are approved automatically. Staff checks are unchanged.

CREATE OR REPLACE FUNCTION public.issue_talent_faculty_id(_talent_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  t record;
  new_id text;
  track text;
BEGIN
  IF auth.role() IS DISTINCT FROM 'service_role' AND NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Only staff can issue Faculty IDs';
  END IF;

  SELECT * INTO t FROM public.talent_profiles WHERE id = _talent_id;
  IF t.id IS NULL THEN
    RAISE EXCEPTION 'Talent not found';
  END IF;
  IF t.faculty_id IS NOT NULL THEN
    RETURN t.faculty_id;
  END IF;

  track := COALESCE(NULLIF(btrim(COALESCE(t.headline, '')), ''), COALESCE(t.skills[1], 'general'));

  new_id := public.next_faculty_id(
    track,
    'online',
    EXTRACT(MONTH FROM COALESCE(t.created_at, now()))::integer,
    EXTRACT(YEAR FROM COALESCE(t.created_at, now()))::integer
  );

  INSERT INTO public.faculty_ids (faculty_id, name, email, phone, course_interest, hear_about_us, status, department)
  VALUES (new_id, t.full_name, COALESCE(t.email, ''), COALESCE(t.phone, t.whatsapp, ''), track, 'talent_marketplace', 'active', track);

  UPDATE public.talent_profiles SET faculty_id = new_id, updated_at = now() WHERE id = _talent_id;

  IF t.user_id IS NOT NULL THEN
    UPDATE public.profiles SET faculty_id = new_id, updated_at = now()
    WHERE id = t.user_id AND faculty_id IS NULL;
  END IF;

  RETURN new_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.issue_talent_faculty_id(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.issue_talent_faculty_id(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.approve_talent(_talent_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id text;
BEGIN
  IF auth.role() IS DISTINCT FROM 'service_role' AND NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Only staff can approve talent';
  END IF;

  UPDATE public.talent_profiles
  SET is_vetted = true,
      vetted_at = COALESCE(vetted_at, now()),
      is_public = true,
      updated_at = now()
  WHERE id = _talent_id;

  new_id := public.issue_talent_faculty_id(_talent_id);
  RETURN new_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.approve_talent(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.approve_talent(uuid) TO authenticated, service_role;
