-- Certificates issued automatically when a student finishes a course they have
-- paid for in full (see src/lib/certificate-auto-issue.server.ts).

-- 1. Which certificates the site issued on its own, and when the student was
--    emailed the verify link. The email is claimed on the row before sending,
--    so a repeat run never sends it twice. Older certificates are left as they are.
ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS auto_issued boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS issued_email_sent_at timestamptz;

-- 2. Monthly, on the 1st at 06:40 UTC (Bill's choice, 2026-10-29). The student's dashboard also asks for their
--    certificate the moment they tick their last class, so this run mostly
--    catches students whose payment or balance was confirmed later.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule('certificate-auto-issue') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'certificate-auto-issue');

SELECT cron.schedule(
  'certificate-auto-issue',
  '40 6 1 * *',
  $$
  SELECT net.http_post(
    url := 'https://techfaculty.ng/api/certificate-auto-issue',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb,
    timeout_milliseconds := 60000
  ) as request_id;
  $$
);
