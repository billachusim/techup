-- Create function to generate lectures for a course
CREATE OR REPLACE FUNCTION public.ensure_course_lectures(course_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  lecture_count integer;
  course_name_val text;
  course_desc_val text;
  base_date date;
BEGIN
  -- Check how many lectures exist for this course
  SELECT COUNT(*) INTO lecture_count
  FROM lectures
  WHERE course_id = course_uuid;
  
  -- If course already has lectures, skip
  IF lecture_count >= 4 THEN
    RETURN;
  END IF;
  
  -- Get course details
  SELECT name, description INTO course_name_val, course_desc_val
  FROM courses
  WHERE id = course_uuid;
  
  -- Set base date for scheduling (start next week)
  base_date := CURRENT_DATE + INTERVAL '7 days';
  
  -- Create 4 lectures for the course
  FOR i IN 1..4 LOOP
    INSERT INTO lectures (
      course_id,
      title,
      description,
      scheduled_at,
      duration_minutes,
      status
    ) VALUES (
      course_uuid,
      course_name_val || ' - Session ' || i,
      'Class ' || i || ' covering key concepts from ' || course_name_val || '. ' || COALESCE(course_desc_val, 'Comprehensive training session.'),
      base_date + ((i - 1) * INTERVAL '7 days'),
      90,
      'scheduled'
    );
  END LOOP;
END;
$$;

-- Create function to ensure all courses have lectures
CREATE OR REPLACE FUNCTION public.seed_all_course_lectures()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  course_record RECORD;
BEGIN
  FOR course_record IN SELECT id FROM courses
  LOOP
    PERFORM ensure_course_lectures(course_record.id);
  END LOOP;
END;
$$;

-- Seed lectures for all existing courses
SELECT seed_all_course_lectures();