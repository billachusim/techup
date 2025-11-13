-- Add learning mode and cohort tracking to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS learning_mode text DEFAULT 'online-only',
ADD COLUMN IF NOT EXISTS cohort_month integer,
ADD COLUMN IF NOT EXISTS cohort_year integer;

-- Add learning mode to enrollments
ALTER TABLE public.enrollments
ADD COLUMN IF NOT EXISTS learning_mode text DEFAULT 'online-only';