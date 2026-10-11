-- Keep the /events directory fresh and make every scrape run visible.

-- 1. Run log: one row per scrape-events run, readable by admins on /admin.
CREATE TABLE IF NOT EXISTS public.event_scrape_runs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ran_at timestamptz NOT NULL DEFAULT now(),
  trigger text NOT NULL DEFAULT 'manual',
  success boolean NOT NULL,
  upserted integer NOT NULL DEFAULT 0,
  report jsonb NOT NULL DEFAULT '{}'::jsonb,
  error text,
  duration_ms integer
);

CREATE INDEX IF NOT EXISTS event_scrape_runs_ran_at_idx ON public.event_scrape_runs (ran_at DESC);

ALTER TABLE public.event_scrape_runs ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.event_scrape_runs TO authenticated;
GRANT ALL ON public.event_scrape_runs TO service_role;

DROP POLICY IF EXISTS "Admins can view event scrape runs" ON public.event_scrape_runs;
CREATE POLICY "Admins can view event scrape runs" ON public.event_scrape_runs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 2. One event, one row: listing sites add per-visit tracking (?recId=, ?aff=) to links,
--    so the same event was stored up to three times. Keep the most recently seen copy.
DELETE FROM public.events e
USING public.events newer
WHERE e.is_featured = false
  AND newer.is_featured = false
  AND e.id <> newer.id
  AND regexp_replace(regexp_replace(e.source_url, '[?#].*$', ''), '/$', '')
    = regexp_replace(regexp_replace(newer.source_url, '[?#].*$', ''), '/$', '')
  AND (newer.last_seen_at, newer.id) > (e.last_seen_at, e.id);

UPDATE public.events
SET source_url = regexp_replace(regexp_replace(source_url, '[?#].*$', ''), '/$', '')
WHERE is_featured = false
  AND source_url ~ '[?#]|/$';

-- 3. Housekeeping, run at the end of every scrape. Adds two rules to the old version:
--    undated third-party rows (stored before dates were required) are archived, and so is
--    any third-party listing the scraper has not seen for 4 weeks.
CREATE OR REPLACE FUNCTION public.archive_stale_listings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.jobs
  SET is_expired = true
  WHERE is_expired = false
    AND last_seen_at < now() - interval '14 days';

  DELETE FROM public.jobs
  WHERE is_expired = true
    AND last_seen_at < now() - interval '60 days';

  UPDATE public.events
  SET is_expired = true
  WHERE is_expired = false
    AND is_featured = false
    AND (
      COALESCE(ends_at, starts_at) < now()
      OR (starts_at IS NULL AND ends_at IS NULL)
      OR last_seen_at < now() - interval '28 days'
    );

  DELETE FROM public.events
  WHERE is_expired = true
    AND is_featured = false
    AND COALESCE(ends_at, starts_at, last_seen_at) < now() - interval '90 days';

  DELETE FROM public.event_scrape_runs
  WHERE ran_at < now() - interval '180 days';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.archive_stale_listings() FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.archive_stale_listings() TO service_role;

SELECT public.archive_stale_listings();

-- 4. Re-assert the schedule: every Monday and Thursday at 05:30 UTC (06:30 WAT).
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule('weekly-scrape-events') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'weekly-scrape-events');
SELECT cron.unschedule('scrape-events') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'scrape-events');

SELECT cron.schedule(
  'scrape-events',
  '30 5 * * 1,4',
  $$
  SELECT net.http_post(
    url := 'https://flxwtwzjslufglpwfjdx.supabase.co/functions/v1/scrape-events',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb,
    timeout_milliseconds := 150000
  ) as request_id;
  $$
);
