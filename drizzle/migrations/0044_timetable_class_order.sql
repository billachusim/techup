-- Fix: number each course's classes in lecture date order, not by title.
-- The class handout, the class task (class_tasks) and the class videos all
-- count classes in lecture date order, but the timetable counted them by
-- title, so the Slack post for "Class 1" of Everyday AI Basics showed the
-- title "AI for writing, emails and documents" with the task for
-- "What AI is and how ChatGPT works". Pace rules are unchanged.

CREATE OR REPLACE FUNCTION public.student_timetable(_faculty_id text)
RETURNS TABLE(lecture_id uuid, course_id uuid, course_name text, title text, description text,
              duration_minutes integer, class_number integer, scheduled_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  day date;
  rec record;
BEGIN
  -- Students see only their own timetable; staff and the server can see anyone's
  IF auth.role() <> 'service_role'
     AND NOT public.is_staff(auth.uid())
     AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.faculty_id = _faculty_id) THEN
    RAISE EXCEPTION 'not allowed';
  END IF;

  SELECT (min(ce.enrollment_date) AT TIME ZONE 'Africa/Lagos')::date + 1 INTO day
    FROM course_enrollments ce WHERE ce.faculty_id = _faculty_id AND ce.status = 'active';
  IF day IS NULL THEN RETURN; END IF;

  -- Courses in sort order; classes in lecture date order, the same order the
  -- class handout, its task and its videos use (classes were ordered by title,
  -- so Class 1 could show the title of a later class).
  -- Each class takes the next free day that suits its course's pace.
  FOR rec IN
    SELECT l.id, l.course_id, c.name AS cname, l.title, l.description, l.duration_minutes, c.level,
           row_number() OVER (PARTITION BY l.course_id ORDER BY l.scheduled_at, l.id) AS cn,
           row_number() OVER (ORDER BY c.sort_order, c.name, c.id, l.scheduled_at, l.id) AS k
      FROM lectures l
      JOIN courses c ON c.id = l.course_id
      JOIN course_enrollments ce ON ce.course_id = l.course_id
                                AND ce.faculty_id = _faculty_id AND ce.status = 'active'
     ORDER BY k
  LOOP
    WHILE NOT public.class_day_ok(day, rec.level) LOOP
      day := day + 1;
    END LOOP;
    lecture_id := rec.id;
    course_id := rec.course_id;
    course_name := rec.cname;
    title := rec.title;
    description := rec.description;
    duration_minutes := rec.duration_minutes;
    class_number := rec.cn::integer;
    scheduled_at := (day + time '18:00') AT TIME ZONE 'Africa/Lagos';
    RETURN NEXT;
    day := day + 1;
  END LOOP;
END $$;

REVOKE ALL ON FUNCTION public.student_timetable(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.student_timetable(text) TO authenticated, service_role;
