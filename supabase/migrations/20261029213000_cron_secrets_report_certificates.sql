-- The weekly admin report and the certificate check now need the same
-- x-cron-secret header as the other scheduled jobs, so nobody else can trigger them.
-- Run this BEFORE publishing the matching site change, or the next scheduled
-- runs are refused.

INSERT INTO public.cron_secrets (job, secret)
VALUES
  ('admin-weekly-report', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '')),
  ('certificate-auto-issue', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''))
ON CONFLICT (job) DO NOTHING;

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule('admin-weekly-report') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'admin-weekly-report');

-- Mondays at 06:30 UTC (07:30 Lagos).
SELECT cron.schedule(
  'admin-weekly-report',
  '30 6 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://techfaculty.ng/api/admin-weekly-report',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (SELECT secret FROM public.cron_secrets WHERE job = 'admin-weekly-report')
    ),
    body := '{"trigger": "cron"}'::jsonb,
    timeout_milliseconds := 60000
  ) as request_id;
  $$
);

SELECT cron.unschedule('certificate-auto-issue') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'certificate-auto-issue');

-- Monthly, on the 1st at 06:40 UTC.
SELECT cron.schedule(
  'certificate-auto-issue',
  '40 6 1 * *',
  $$
  SELECT net.http_post(
    url := 'https://techfaculty.ng/api/certificate-auto-issue',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (SELECT secret FROM public.cron_secrets WHERE job = 'certificate-auto-issue')
    ),
    body := '{"trigger": "cron"}'::jsonb,
    timeout_milliseconds := 60000
  ) as request_id;
  $$
);
