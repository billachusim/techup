ALTER TABLE public.talent_roles
  ADD COLUMN IF NOT EXISTS slack_channel_url text,
  ADD COLUMN IF NOT EXISTS task_board_url text,
  ADD COLUMN IF NOT EXISTS drive_url text,
  ADD COLUMN IF NOT EXISTS project_brief text,
  ADD COLUMN IF NOT EXISTS applications_closed boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.get_project_workspace(_role_id uuid)
RETURNS TABLE (
  role_id uuid,
  whatsapp_group_url text,
  slack_channel_url text,
  task_board_url text,
  drive_url text,
  project_brief text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT r.id, r.whatsapp_group_url, r.slack_channel_url, r.task_board_url, r.drive_url, r.project_brief
  FROM public.talent_roles r
  WHERE r.id = _role_id
    AND (
      public.is_staff(auth.uid())
      OR EXISTS (
        SELECT 1
        FROM public.role_matches m
        JOIN public.talent_profiles p ON p.id = m.talent_profile_id
        WHERE m.role_id = r.id
          AND p.user_id = auth.uid()
          AND m.status IN ('approved','accepted','assessment','interview','hired')
      )
    )
  LIMIT 1;
$$;

CREATE TABLE IF NOT EXISTS public.talent_deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES public.talent_roles(id) ON DELETE CASCADE,
  talent_profile_id uuid NOT NULL REFERENCES public.talent_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  link_url text,
  summary text,
  week_of date NOT NULL DEFAULT current_date,
  status text NOT NULL DEFAULT 'submitted',
  reviewer_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.talent_deliverables TO authenticated;
GRANT ALL ON public.talent_deliverables TO service_role;

ALTER TABLE public.talent_deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Talent read own deliverables"
ON public.talent_deliverables FOR SELECT TO authenticated
USING (
  public.is_staff(auth.uid())
  OR EXISTS (SELECT 1 FROM public.talent_profiles p WHERE p.id = talent_profile_id AND p.user_id = auth.uid())
);

CREATE POLICY "Talent log own deliverables"
ON public.talent_deliverables FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.talent_profiles p WHERE p.id = talent_profile_id AND p.user_id = auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.role_matches m
    JOIN public.talent_profiles p2 ON p2.id = m.talent_profile_id
    WHERE m.role_id = talent_deliverables.role_id
      AND p2.user_id = auth.uid()
      AND m.status IN ('approved','accepted','assessment','interview','hired')
  )
);

CREATE POLICY "Talent edit own submitted deliverables"
ON public.talent_deliverables FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.talent_profiles p WHERE p.id = talent_profile_id AND p.user_id = auth.uid()) AND status = 'submitted')
WITH CHECK (EXISTS (SELECT 1 FROM public.talent_profiles p WHERE p.id = talent_profile_id AND p.user_id = auth.uid()));

CREATE POLICY "Talent delete own submitted deliverables"
ON public.talent_deliverables FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.talent_profiles p WHERE p.id = talent_profile_id AND p.user_id = auth.uid()) AND status = 'submitted');

CREATE POLICY "Staff review deliverables"
ON public.talent_deliverables FOR UPDATE TO authenticated
USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff delete deliverables"
ON public.talent_deliverables FOR DELETE TO authenticated
USING (public.is_staff(auth.uid()));

CREATE INDEX IF NOT EXISTS talent_deliverables_role_idx ON public.talent_deliverables (role_id, week_of DESC);
CREATE INDEX IF NOT EXISTS talent_deliverables_profile_idx ON public.talent_deliverables (talent_profile_id, week_of DESC);

CREATE TRIGGER update_talent_deliverables_updated_at
BEFORE UPDATE ON public.talent_deliverables
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();