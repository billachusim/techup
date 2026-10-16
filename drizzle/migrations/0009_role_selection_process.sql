ALTER TABLE public.talent_roles
  ADD COLUMN IF NOT EXISTS selection_process text NOT NULL DEFAULT 'direct' CHECK (selection_process IN ('direct','assessment','interview','assessment_interview')),
  ADD COLUMN IF NOT EXISTS assessment_url text,
  ADD COLUMN IF NOT EXISTS interview_url text,
  ADD COLUMN IF NOT EXISTS interview_channel text NOT NULL DEFAULT 'whatsapp' CHECK (interview_channel IN ('whatsapp','google_meet'));
ALTER TABLE public.business_briefs
  ADD COLUMN IF NOT EXISTS selection_process text NOT NULL DEFAULT 'direct' CHECK (selection_process IN ('direct','assessment','interview','assessment_interview'));