DROP POLICY IF EXISTS "Users can create own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users can insert own certificates" ON public.certificates;
REVOKE INSERT ON public.certificates FROM authenticated, anon;
GRANT INSERT ON public.certificates TO service_role;