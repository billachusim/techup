-- Online classes are spaced by difficulty and every class has a task.
--
-- Bill, 9 Nov 2026: online classes were Tuesday and Thursday for every course.
-- Now each course has a pace:
--   beginner      3 classes a week  Mon, Wed, Fri 18:00 Lagos
--   intermediate  2 classes a week  Tue, Thu      18:00 Lagos
--   advanced      1 class a week    Tue           18:00 Lagos (a week-long project)
-- Classes before Mon 16 Nov 2026 keep the old Tue/Thu dates, so nobody's
-- upcoming class moves this week.
--
-- Online classes have no tutor in the loop: each class's task is written by
-- the AI the first time it is needed (public.class_tasks), the
-- student submits it on the dashboard and the AI tutor marks it.

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS level text NOT NULL DEFAULT 'intermediate';

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'courses_level_check') THEN
    ALTER TABLE public.courses
      ADD CONSTRAINT courses_level_check CHECK (level IN ('beginner', 'intermediate', 'advanced'));
  END IF;
END $$;

COMMENT ON COLUMN public.courses.level IS
  'Online class pace: beginner = Mon/Wed/Fri, intermediate = Tue/Thu, advanced = Tue only (see student_timetable)';

-- Starting levels. The free Everyday AI programme is all beginner. In every
-- other programme the first course is beginner, the last is advanced (when
-- the programme has 3 or more courses) and the rest are intermediate.
WITH ranked AS (
  SELECT id, plan_required,
         row_number() OVER (PARTITION BY plan_required ORDER BY sort_order, name, id) AS rk,
         count(*)     OVER (PARTITION BY plan_required) AS n
    FROM public.courses
)
UPDATE public.courses c
   SET level = CASE
                 WHEN r.plan_required = 'bootcamp_starter' THEN 'beginner'
                 WHEN r.rk = 1 THEN 'beginner'
                 WHEN r.n >= 3 AND r.rk = r.n THEN 'advanced'
                 ELSE 'intermediate'
               END
  FROM ranked r
 WHERE c.id = r.id;

-- Each class's task: written once by the AI (the first time anyone needs it)
-- and then the same for every student of that class. Staff may rewrite one.
CREATE TABLE IF NOT EXISTS public.class_tasks (
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  class_number integer NOT NULL CHECK (class_number BETWEEN 1 AND 52),
  task text NOT NULL CHECK (length(trim(task)) > 0),
  written_by text NOT NULL DEFAULT 'ai' CHECK (written_by IN ('ai', 'staff')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (course_id, class_number)
);
ALTER TABLE public.class_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Signed-in users read class tasks" ON public.class_tasks;
CREATE POLICY "Signed-in users read class tasks" ON public.class_tasks
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Staff manage class tasks" ON public.class_tasks;
CREATE POLICY "Staff manage class tasks" ON public.class_tasks
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.class_tasks TO authenticated;
GRANT ALL ON public.class_tasks TO service_role;

-- True when an online class may fall on this day for a course of this level.
CREATE OR REPLACE FUNCTION public.class_day_ok(_day date, _level text)
RETURNS boolean
LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT CASE
    WHEN _day < date '2026-11-16' THEN extract(isodow FROM _day) IN (2, 4)
    WHEN _level = 'beginner'      THEN extract(isodow FROM _day) IN (1, 3, 5)
    WHEN _level = 'advanced'      THEN extract(isodow FROM _day) = 2
    ELSE                               extract(isodow FROM _day) IN (2, 4)
  END
$$;

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

  -- Same class order as before: courses in sort order, classes by title.
  -- Each class takes the next free day that suits its course's pace.
  FOR rec IN
    SELECT l.id, l.course_id, c.name AS cname, l.title, l.description, l.duration_minutes, c.level,
           row_number() OVER (PARTITION BY l.course_id ORDER BY l.title) AS cn,
           row_number() OVER (ORDER BY c.sort_order, c.name, l.title) AS k
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
GRANT EXECUTE ON FUNCTION public.class_day_ok(date, text) TO authenticated, service_role;
