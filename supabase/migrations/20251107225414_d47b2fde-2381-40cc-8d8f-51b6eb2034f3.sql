-- Add department column to profiles table
ALTER TABLE public.profiles
ADD COLUMN department TEXT DEFAULT 'General Tech';