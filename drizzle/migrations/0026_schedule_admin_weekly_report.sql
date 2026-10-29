CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
SELECT cron.unschedule('admin-weekly-report') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'admin-weekly-report');
SELECT cron.schedule('admin-weekly-report','30 6 * * 1',
  $$ SELECT net.http_post(url := 'https://techfaculty.ng/api/admin-weekly-report', headers := '{"Content-Type": "application/json"}'::jsonb, body := '{"trigger": "cron"}'::jsonb) as request_id; $$);