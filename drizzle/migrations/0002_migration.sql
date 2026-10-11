CREATE OR REPLACE FUNCTION public.archive_stale_listings()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  UPDATE public.jobs SET is_expired = true
  WHERE is_expired = false AND last_seen_at < now() - interval '21 days';
  DELETE FROM public.jobs WHERE is_expired = true AND last_seen_at < now() - interval '60 days';
  UPDATE public.events SET is_expired = true
  WHERE is_expired = false AND is_featured = false
    AND COALESCE(ends_at, starts_at) IS NOT NULL AND COALESCE(ends_at, starts_at) < now();
  DELETE FROM public.events WHERE is_expired = true AND is_featured = false
    AND COALESCE(ends_at, starts_at) < now() - interval '90 days';
END; $$;
REVOKE EXECUTE ON FUNCTION public.archive_stale_listings() FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.archive_stale_listings() TO service_role;

SELECT cron.unschedule('weekly-scrape-jobs') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'weekly-scrape-jobs');
SELECT cron.schedule('weekly-scrape-jobs', '0 5 1,15 * *', $$
  SELECT net.http_post(
    url := 'https://flxwtwzjslufglpwfjdx.supabase.co/functions/v1/scrape-jobs',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb
  ) as request_id;
$$);