-- lovable-cron-fallback-reviewed: backstop for card payments whose students closed the tab before the success page; webhook covers most cases
ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS recovered_at timestamptz,
  ADD COLUMN IF NOT EXISTS recovered_email_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_reminder_sent_at timestamptz;

DROP POLICY IF EXISTS "Students request own enrollments" ON public.enrollments;
CREATE POLICY "Students request own enrollments"
ON public.enrollments
FOR INSERT
TO authenticated
WITH CHECK (
  faculty_id = (SELECT faculty_id FROM public.profiles WHERE id = auth.uid())
  AND tx_ref IS NULL
  AND amount_due IS NULL
  AND paid_at IS NULL
  AND payment_reference IS NULL
  AND recovered_at IS NULL
  AND recovered_email_sent_at IS NULL
  AND payment_reminder_sent_at IS NULL
  AND (
    status = 'pending'
    OR (status = 'active' AND plan_name IN ('Bootcamp Starter', 'Free Bootcamp'))
  )
);

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule('recover-checkouts') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'recover-checkouts');

SELECT cron.schedule(
  'recover-checkouts',
  '*/30 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://flxwtwzjslufglpwfjdx.supabase.co/functions/v1/recover-checkouts',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb
  ) as request_id;
  $$
);