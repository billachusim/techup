DROP POLICY IF EXISTS "Anyone can view lectures" ON public.lectures;
DROP POLICY IF EXISTS "Public can view lectures" ON public.lectures;
DROP POLICY IF EXISTS "Lectures are viewable by everyone" ON public.lectures;
REVOKE SELECT ON public.lectures FROM anon;
GRANT SELECT ON public.lectures TO authenticated;
CREATE POLICY "Authenticated users can view lectures"
  ON public.lectures FOR SELECT TO authenticated USING (true);