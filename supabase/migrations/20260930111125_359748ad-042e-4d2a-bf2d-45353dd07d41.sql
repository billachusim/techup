-- Slack linkage for students
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS slack_user_id text,
  ADD COLUMN IF NOT EXISTS slack_channel_id text,
  ADD COLUMN IF NOT EXISTS slack_channel_name text,
  ADD COLUMN IF NOT EXISTS slack_joined_at timestamptz,
  ADD COLUMN IF NOT EXISTS onboarding_email_sent_at timestamptz;

-- Weekly student assignment / proof-of-work log
CREATE TABLE IF NOT EXISTS public.student_deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  faculty_id text NOT NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  course_name text,
  class_number integer,
  title text NOT NULL,
  proof_url text,
  summary text,
  week_of date NOT NULL DEFAULT date_trunc('week', now())::date,
  status text NOT NULL DEFAULT 'submitted',
  score integer,
  reviewer_note text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_deliverables TO authenticated;
GRANT ALL ON public.student_deliverables TO service_role;

ALTER TABLE public.student_deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students manage their own deliverables"
ON public.student_deliverables FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE POLICY "Students insert their own deliverables"
ON public.student_deliverables FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Students update their own submitted deliverables"
ON public.student_deliverables FOR UPDATE TO authenticated
USING ((user_id = auth.uid() AND status = 'submitted') OR public.is_staff(auth.uid()))
WITH CHECK (user_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE POLICY "Students delete their own submitted deliverables"
ON public.student_deliverables FOR DELETE TO authenticated
USING ((user_id = auth.uid() AND status = 'submitted') OR public.is_staff(auth.uid()));

CREATE INDEX IF NOT EXISTS student_deliverables_user_idx ON public.student_deliverables(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS student_deliverables_faculty_idx ON public.student_deliverables(faculty_id);
CREATE INDEX IF NOT EXISTS student_deliverables_status_idx ON public.student_deliverables(status);

CREATE TRIGGER update_student_deliverables_updated_at
BEFORE UPDATE ON public.student_deliverables
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
