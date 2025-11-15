-- Create table for caching AI-generated class content
CREATE TABLE public.ai_class_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  class_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  resources JSONB DEFAULT '[]'::jsonb,
  handout_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(course_id, class_number)
);

-- Enable RLS on ai_class_content
ALTER TABLE public.ai_class_content ENABLE ROW LEVEL SECURITY;

-- Anyone can view cached AI content
CREATE POLICY "Anyone can view AI class content"
ON public.ai_class_content
FOR SELECT
USING (true);

-- Create table for course completion certificates
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id TEXT NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  certificate_number TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(faculty_id, course_id)
);

-- Enable RLS on certificates
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Users can view their own certificates
CREATE POLICY "Users can view own certificates"
ON public.certificates
FOR SELECT
USING (faculty_id = (SELECT faculty_id FROM profiles WHERE id = auth.uid()));

-- Users can insert their own certificates
CREATE POLICY "Users can create own certificates"
ON public.certificates
FOR INSERT
WITH CHECK (faculty_id = (SELECT faculty_id FROM profiles WHERE id = auth.uid()));

-- Create table for internal job applications
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id TEXT NOT NULL,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on job_applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view own job applications"
ON public.job_applications
FOR SELECT
USING (faculty_id = (SELECT faculty_id FROM profiles WHERE id = auth.uid()));

-- Users can create their own applications
CREATE POLICY "Users can create own job applications"
ON public.job_applications
FOR INSERT
WITH CHECK (faculty_id = (SELECT faculty_id FROM profiles WHERE id = auth.uid()));

-- Users can update their own applications
CREATE POLICY "Users can update own job applications"
ON public.job_applications
FOR UPDATE
USING (faculty_id = (SELECT faculty_id FROM profiles WHERE id = auth.uid()));

-- Create trigger for updated_at on job_applications
CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on ai_class_content
CREATE TRIGGER update_ai_class_content_updated_at
BEFORE UPDATE ON public.ai_class_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();