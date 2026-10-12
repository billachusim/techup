-- Jobs board scrape twice a month (like events) and a health view of every scheduled job on /admin.

-- 1. Run log for scheduled edge functions other than scrape-events (which has event_scrape_runs).
CREATE TABLE IF NOT EXISTS public.scheduled_job_runs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job text NOT NULL,
  ran_at timestamptz NOT NULL DEFAULT now(),
  trigger text NOT NULL DEFAULT 'manual',
  success boolean NOT NULL,
  items integer NOT NULL DEFAULT 0,
  report jsonb NOT NULL DEFAULT '{}'::jsonb,
  error text,
  duration_ms integer
);

CREATE INDEX IF NOT EXISTS scheduled_job_runs_job_ran_at_idx ON public.scheduled_job_runs (job, ran_at DESC);

ALTER TABLE public.scheduled_job_runs ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.scheduled_job_runs TO authenticated;
GRANT ALL ON public.scheduled_job_runs TO service_role;

DROP POLICY IF EXISTS "Admins can view scheduled job runs" ON public.scheduled_job_runs;
CREATE POLICY "Admins can view scheduled job runs" ON public.scheduled_job_runs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 2. Jobs board: every Monday -> the 1st and 15th of each month at 05:00 UTC (06:00 WAT),
--    half an hour before the events scrape. Halves the Firecrawl spend.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule('weekly-scrape-jobs') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'weekly-scrape-jobs');
SELECT cron.unschedule('scrape-jobs') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'scrape-jobs');

SELECT cron.schedule(
  'scrape-jobs',
  '0 5 1,15 * *',
  $$
  SELECT net.http_post(
    url := 'https://flxwtwzjslufglpwfjdx.supabase.co/functions/v1/scrape-jobs',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb,
    timeout_milliseconds := 150000
  ) as request_id;
  $$
);

-- 3. Every pg_cron job with its latest run, for the /admin health card. Admins only.
--    Covers jobs created outside migrations too (for example from the SQL editor).
CREATE OR REPLACE FUNCTION public.admin_scheduled_jobs()
RETURNS TABLE (
  jobname text,
  schedule text,
  active boolean,
  edge_function text,
  last_started_at timestamptz,
  last_status text,
  last_message text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'cron'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'admins only' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
    j.jobname::text,
    j.schedule::text,
    j.active,
    substring(j.command FROM 'functions/v1/([A-Za-z0-9_-]+)')::text,
    r.start_time,
    r.status::text,
    left(r.return_message, 500)::text
  FROM cron.job j
  LEFT JOIN LATERAL (
    SELECT d.start_time, d.status, d.return_message
    FROM cron.job_run_details d
    WHERE d.jobid = j.jobid
    ORDER BY d.start_time DESC NULLS LAST
    LIMIT 1
  ) r ON true
  ORDER BY j.jobname;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_scheduled_jobs() FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_scheduled_jobs() TO authenticated;
