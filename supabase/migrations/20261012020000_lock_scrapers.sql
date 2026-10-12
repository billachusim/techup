-- Only the schedule and signed-in admins may run the scrapers (each run spends Firecrawl credits).
-- Before this, anyone who knew the function URLs could call them as often as they liked.

-- 1. One random secret per scheduled scraper. Readable only by the service role (the edge
--    functions) and postgres (the cron jobs); no policies, so signed-in users can't read it.
CREATE TABLE IF NOT EXISTS public.cron_secrets (
  job text PRIMARY KEY,
  secret text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cron_secrets ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.cron_secrets FROM anon, authenticated, PUBLIC;
GRANT ALL ON public.cron_secrets TO service_role;

INSERT INTO public.cron_secrets (job, secret)
VALUES
  ('scrape-events', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '')),
  ('scrape-jobs', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''))
ON CONFLICT (job) DO NOTHING;

-- 2. Re-create both schedules (same times as before) so each call sends its secret.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule(jobname) FROM cron.job
WHERE jobname IN ('scrape-jobs', 'weekly-scrape-jobs', 'scrape-events', 'weekly-scrape-events');

SELECT cron.schedule(
  'scrape-jobs',
  '0 5 1,15 * *',
  $$
  SELECT net.http_post(
    url := 'https://flxwtwzjslufglpwfjdx.supabase.co/functions/v1/scrape-jobs',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (SELECT secret FROM public.cron_secrets WHERE job = 'scrape-jobs')
    ),
    body := '{"trigger": "cron"}'::jsonb,
    timeout_milliseconds := 150000
  ) as request_id;
  $$
);

SELECT cron.schedule(
  'scrape-events',
  '30 5 1,15 * *',
  $$
  SELECT net.http_post(
    url := 'https://flxwtwzjslufglpwfjdx.supabase.co/functions/v1/scrape-events',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (SELECT secret FROM public.cron_secrets WHERE job = 'scrape-events')
    ),
    body := '{"trigger": "cron"}'::jsonb,
    timeout_milliseconds := 150000
  ) as request_id;
  $$
);
