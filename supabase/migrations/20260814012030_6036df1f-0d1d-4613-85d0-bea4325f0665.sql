REVOKE EXECUTE ON FUNCTION public.archive_stale_listings() FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.archive_stale_listings() TO service_role;