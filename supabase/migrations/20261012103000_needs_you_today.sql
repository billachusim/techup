-- "Needs you today" on /admin and a morning email digest of the same numbers.

-- 1. The counts. Internal: only the service role (the digest) and the admin
--    wrapper below can run it.
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
  -- The referral programme ships separately; count its owed rewards once it exists.
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
    'referral_rewards', referral_rewards
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.needs_you_today_counts() FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.needs_you_today_counts() TO service_role;

-- 2. What the /admin strip calls. Admins only.
CREATE OR REPLACE FUNCTION public.admin_needs_you_today()
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
  RETURN public.needs_you_today_counts();
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_needs_you_today() FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_needs_you_today() TO authenticated;

-- 3. One row per digest day, claimed before sending so extra calls never send twice.
CREATE TABLE IF NOT EXISTS public.admin_digest_sends (
  sent_on date PRIMARY KEY,
  sent_at timestamptz NOT NULL DEFAULT now(),
  counts jsonb NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE public.admin_digest_sends ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.admin_digest_sends FROM anon, authenticated;
GRANT ALL ON public.admin_digest_sends TO service_role;

-- 4. Every morning at 06:00 UTC (07:00 in Lagos). The site sends nothing on
--    days when nothing is waiting.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule('admin-morning-digest') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'admin-morning-digest');

SELECT cron.schedule(
  'admin-morning-digest',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://techfaculty.ng/api/admin-digest',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb
  ) as request_id;
  $$
);
