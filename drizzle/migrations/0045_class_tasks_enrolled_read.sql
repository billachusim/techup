DROP POLICY IF EXISTS "Signed-in users read class tasks" ON public.class_tasks;
CREATE POLICY "Enrolled students read class tasks" ON public.class_tasks
  FOR SELECT TO authenticated
  USING (
    public.is_staff(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.course_enrollments ce
      JOIN public.profiles p ON p.faculty_id = ce.faculty_id
      WHERE p.id = auth.uid() AND ce.course_id = class_tasks.course_id
    )
  );