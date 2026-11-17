-- Client briefs and /services orders: quotes with a Flutterwave pay link, payment
-- tracking, and automatic client follow-ups (src/lib/brief-followups.server.ts).

ALTER TABLE public.business_briefs
  ADD COLUMN IF NOT EXISTS quote_amount integer,
  ADD COLUMN IF NOT EXISTS quote_note text,
  ADD COLUMN IF NOT EXISTS quote_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS pay_link_url text,
  ADD COLUMN IF NOT EXISTS pay_tx_ref text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_reference text,
  ADD COLUMN IF NOT EXISTS followup_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_followup_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS business_briefs_pay_tx_ref_key
  ON public.business_briefs (pay_tx_ref) WHERE pay_tx_ref IS NOT NULL;

-- Daily client follow-ups at 08:00 UTC (09:00 Lagos).
INSERT INTO public.cron_secrets (job, secret)
VALUES ('brief-followups', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''))
ON CONFLICT (job) DO NOTHING;

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'brief-followups';

SELECT cron.schedule(
  'brief-followups',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := 'https://techfaculty.ng/api/brief-followups',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (SELECT secret FROM public.cron_secrets WHERE job = 'brief-followups')
    ),
    body := '{"trigger": "cron"}'::jsonb,
    timeout_milliseconds := 60000
  ) as request_id;
  $$
);
