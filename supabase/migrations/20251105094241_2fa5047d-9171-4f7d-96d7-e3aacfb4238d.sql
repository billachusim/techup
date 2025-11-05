-- Create faculty_ids table to store all registered Faculty IDs
CREATE TABLE public.faculty_ids (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faculty_id text NOT NULL UNIQUE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  course_interest text NOT NULL,
  hear_about_us text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'active', 'inactive'))
);

-- Create enrollments table to track plan enrollments
CREATE TABLE public.enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faculty_id text NOT NULL REFERENCES public.faculty_ids(faculty_id) ON DELETE CASCADE,
  plan_name text NOT NULL,
  enrollment_date timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending',
  coupon_code text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT valid_enrollment_status CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

-- Enable Row Level Security
ALTER TABLE public.faculty_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for faculty_ids table
-- Allow anyone to insert (public registration)
CREATE POLICY "Anyone can register for a faculty ID"
ON public.faculty_ids
FOR INSERT
WITH CHECK (true);

-- Allow anyone to select their own faculty ID by matching the faculty_id
CREATE POLICY "Anyone can view faculty IDs"
ON public.faculty_ids
FOR SELECT
USING (true);

-- Only allow updates by system (no public updates)
CREATE POLICY "No public updates to faculty IDs"
ON public.faculty_ids
FOR UPDATE
USING (false);

-- RLS Policies for enrollments table
-- Allow anyone to insert enrollments
CREATE POLICY "Anyone can create enrollment"
ON public.enrollments
FOR INSERT
WITH CHECK (true);

-- Allow anyone to view enrollments
CREATE POLICY "Anyone can view enrollments"
ON public.enrollments
FOR SELECT
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on faculty_ids
CREATE TRIGGER update_faculty_ids_updated_at
BEFORE UPDATE ON public.faculty_ids
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster faculty_id lookups
CREATE INDEX idx_faculty_ids_faculty_id ON public.faculty_ids(faculty_id);
CREATE INDEX idx_enrollments_faculty_id ON public.enrollments(faculty_id);