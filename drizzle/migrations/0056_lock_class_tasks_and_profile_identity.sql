-- 1. Class tasks: only for classes the student has reached (completed + 1), in a course they are still enrolled in.
DROP POLICY IF EXISTS "Enrolled students read class tasks" ON public.class_tasks;
DROP POLICY IF EXISTS "Students read tasks for classes they have reached" ON public.class_tasks;
CREATE POLICY "Students read tasks for classes they have reached" ON public.class_tasks
  FOR SELECT TO authenticated
  USING (
    public.is_staff(auth.uid())
    OR EXISTS (
      SELECT 1
      FROM public.profiles p
      JOIN public.course_enrollments ce
        ON ce.faculty_id = p.faculty_id
       AND ce.course_id = class_tasks.course_id
       AND ce.status <> 'cancelled'
      LEFT JOIN public.course_progress cp
        ON cp.faculty_id = p.faculty_id
       AND cp.course_id = class_tasks.course_id
      WHERE p.id = auth.uid()
        AND class_tasks.class_number <= COALESCE(cp.classes_completed, 0) + 1
    )
  );

-- 2. Students cannot change their own Faculty ID or email. Direct website writes
-- run as anon/authenticated; trusted database functions and server code run as
-- their owner or service_role and are not affected. Staff may still edit.
CREATE OR REPLACE FUNCTION public.guard_profile_identity()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF current_user NOT IN ('authenticated', 'anon') THEN
    RETURN NEW;
  END IF;
  IF public.is_staff(auth.uid()) THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.faculty_id := NULL;
    NEW.email := COALESCE(NULLIF(auth.jwt() ->> 'email', ''), NEW.email);
    RETURN NEW;
  END IF;
  IF NEW.faculty_id IS DISTINCT FROM OLD.faculty_id THEN
    RAISE EXCEPTION 'Your Faculty ID can only be changed by Tech Faculty staff' USING ERRCODE = '42501';
  END IF;
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    RAISE EXCEPTION 'Your email can only be changed by Tech Faculty staff' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_profile_identity ON public.profiles;
CREATE TRIGGER guard_profile_identity
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_identity();

-- 3. Enrolment: the system generates and saves the student's new Faculty ID in one step.
CREATE OR REPLACE FUNCTION public.assign_my_faculty_id(_department text, _learning_mode text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  mode text := left(COALESCE(NULLIF(btrim(_learning_mode), ''), 'online-only'), 60);
  dept text := left(btrim(COALESCE(_department, '')), 120);
  mo int := extract(month FROM (now() AT TIME ZONE 'Africa/Lagos'))::int;
  yr int := extract(year FROM (now() AT TIME ZONE 'Africa/Lagos'))::int;
  new_id text;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Please sign in first';
  END IF;
  IF dept = '' THEN
    RAISE EXCEPTION 'Choose a programme first';
  END IF;
  FOR attempt IN 1..3 LOOP
    new_id := public.generate_faculty_id(dept, mode, mo, yr);
    BEGIN
      UPDATE public.profiles
         SET faculty_id = new_id,
             department = dept,
             learning_mode = mode,
             cohort_month = mo,
             cohort_year = yr
       WHERE id = uid;
      IF NOT FOUND THEN
        RAISE EXCEPTION 'Profile not found';
      END IF;
      RETURN new_id;
    EXCEPTION WHEN unique_violation THEN
      IF attempt = 3 THEN
        RAISE;
      END IF;
    END;
  END LOOP;
  RAISE EXCEPTION 'Could not create a Faculty ID, please try again';
END;
$$;

REVOKE ALL ON FUNCTION public.assign_my_faculty_id(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.assign_my_faculty_id(text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.assign_my_faculty_id(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_my_faculty_id(text, text) TO service_role;