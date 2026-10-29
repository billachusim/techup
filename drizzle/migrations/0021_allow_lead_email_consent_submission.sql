-- Preserve the existing column-only insert boundary; consent audit fields remain server-controlled.
GRANT INSERT (email_marketing_opt_in) ON public.leads TO anon, authenticated;