CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule('weekly-scrape-jobs') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'weekly-scrape-jobs');

SELECT cron.schedule(
  'weekly-scrape-jobs',
  '0 5 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://flxwtwzjslufglpwfjdx.supabase.co/functions/v1/scrape-jobs',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb
  ) as request_id;
  $$
);