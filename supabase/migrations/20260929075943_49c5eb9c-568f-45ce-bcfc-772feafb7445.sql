DROP POLICY IF EXISTS "Public can register faculty ID" ON public.faculty_ids;
REVOKE INSERT, UPDATE, DELETE ON public.faculty_ids FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.faculty_ids FROM authenticated;
GRANT ALL ON public.faculty_ids TO service_role;