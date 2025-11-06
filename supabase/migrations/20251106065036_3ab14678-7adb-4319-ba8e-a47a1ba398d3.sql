-- Add department field to faculty_ids
ALTER TABLE public.faculty_ids ADD COLUMN department text;

-- Create courses table
CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  department text NOT NULL,
  whatsapp_group_link text,
  plan_required text NOT NULL DEFAULT 'free',
  duration_weeks integer DEFAULT 12,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view courses"
ON public.courses FOR SELECT
USING (true);

-- Create lectures table
CREATE TABLE public.lectures (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  scheduled_at timestamp with time zone NOT NULL,
  duration_minutes integer DEFAULT 90,
  meeting_link text,
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lectures"
ON public.lectures FOR SELECT
USING (true);

-- Create course_enrollments table
CREATE TABLE public.course_enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faculty_id text NOT NULL REFERENCES public.faculty_ids(faculty_id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrollment_date timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(faculty_id, course_id)
);

ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own course enrollments"
ON public.course_enrollments FOR SELECT
USING (true);

CREATE POLICY "Anyone can enroll in courses"
ON public.course_enrollments FOR INSERT
WITH CHECK (true);

-- Create course_progress table
CREATE TABLE public.course_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faculty_id text NOT NULL REFERENCES public.faculty_ids(faculty_id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress_percentage integer NOT NULL DEFAULT 0,
  last_accessed timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(faculty_id, course_id)
);

ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
ON public.course_progress FOR SELECT
USING (true);

CREATE POLICY "Users can update their own progress"
ON public.course_progress FOR UPDATE
USING (true);

CREATE POLICY "Users can create their own progress"
ON public.course_progress FOR INSERT
WITH CHECK (true);

-- Add triggers for updated_at
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lectures_updated_at
BEFORE UPDATE ON public.lectures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_progress_updated_at
BEFORE UPDATE ON public.course_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();