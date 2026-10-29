DROP POLICY IF EXISTS "Anyone can view AI class content" ON public.ai_class_content;
DROP POLICY IF EXISTS "Staff can view AI class content" ON public.ai_class_content;

CREATE POLICY "Staff can view AI class content"
ON public.ai_class_content
FOR SELECT
TO authenticated
USING (public.is_staff(auth.uid()));

REVOKE ALL ON public.ai_class_content FROM anon;