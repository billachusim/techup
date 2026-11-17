-- Daily talent-pool Slack sync (src/lib/talent-slack-pool.server.ts via /api/talent-slack-sync).
-- Every open-to-work talent joins #general once they have Slack with their profile email;
-- talent without Slack get at most three "join Slack" reminders, a week apart.

-- 1. Reminder tracking on the profile.
ALTER TABLE public.talent_profiles
  ADD COLUMN IF NOT EXISTS slack_invite_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS slack_invite_count integer NOT NULL DEFAULT 0;

-- 2. The secret the schedule sends, so only it can trigger the sync.
INSERT INTO public.cron_secrets (job, secret)
VALUES ('talent-slack-sync', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''))
ON CONFLICT (job) DO NOTHING;

-- 3. Every day at 06:00 UTC (07:00 Lagos).
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'talent-slack-sync';

SELECT cron.schedule(
  'talent-slack-sync',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://techfaculty.ng/api/talent-slack-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (SELECT secret FROM public.cron_secrets WHERE job = 'talent-slack-sync')
    ),
    body := '{"trigger": "cron"}'::jsonb,
    timeout_milliseconds := 120000
  ) as request_id;
  $$
);
