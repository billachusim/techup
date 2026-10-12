-- Recover card checkouts left pending when the student closed the payment tab.

-- recovered_at: the scheduled re-check (recover-checkouts) confirmed this payment.
-- recovered_email_sent_at: the "payment confirmed" email went out for it.
-- payment_reminder_sent_at: the "finish your enrolment" email went out for it.
ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS recovered_at timestamptz,
  ADD COLUMN IF NOT EXISTS recovered_email_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_reminder_sent_at timestamptz;

-- Students cannot set these on their own enrolment requests.
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

-- Re-check pending card payments with Flutterwave every 30 minutes.
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
