DROP POLICY IF EXISTS "Authenticated users can view lectures" ON public.lectures;
CREATE POLICY "Enrolled users can view their lectures"
  ON public.lectures FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.course_enrollments ce
      JOIN public.profiles p ON p.faculty_id = ce.faculty_id
      WHERE ce.course_id = lectures.course_id
        AND p.id = auth.uid()
    )
  );