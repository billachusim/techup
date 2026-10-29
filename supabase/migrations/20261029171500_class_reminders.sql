-- Daily class reminder emails, sent by the site route /api/class-reminders
-- (src/lib/class-reminders.server.ts). Replaces the send-class-reminders edge
-- function, which only logged reminders and read columns that no longer exist.

-- 1. One row per reminder sent, claimed before sending so a class never
--    reminds the same student twice.
CREATE TABLE IF NOT EXISTS public.class_reminder_sends (
  lecture_id uuid NOT NULL REFERENCES public.lectures(id) ON DELETE CASCADE,
  faculty_id text NOT NULL,
  email text,
  sent_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (lecture_id, faculty_id)
);

ALTER TABLE public.class_reminder_sends ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.class_reminder_sends FROM anon, authenticated;
GRANT ALL ON public.class_reminder_sends TO service_role;
GRANT SELECT ON public.class_reminder_sends TO authenticated;
DROP POLICY IF EXISTS "Admins can read class reminder sends" ON public.class_reminder_sends;
CREATE POLICY "Admins can read class reminder sends" ON public.class_reminder_sends
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 2. The secret the schedule sends, so only it can trigger the emails.
INSERT INTO public.cron_secrets (job, secret)
VALUES ('class-reminders', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''))
ON CONFLICT (job) DO NOTHING;

-- 3. Every day at 06:30 UTC (07:30 Lagos). Each run covers classes starting in
--    the next 24 hours. Drops any older schedule that called the edge function.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule(jobid) FROM cron.job
WHERE jobname = 'class-reminders' OR command ILIKE '%send-class-reminders%';

SELECT cron.schedule(
  'class-reminders',
  '30 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://techfaculty.ng/api/class-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (SELECT secret FROM public.cron_secrets WHERE job = 'class-reminders')
    ),
    body := '{"trigger": "cron"}'::jsonb,
    timeout_milliseconds := 60000
  ) as request_id;
  $$
);
