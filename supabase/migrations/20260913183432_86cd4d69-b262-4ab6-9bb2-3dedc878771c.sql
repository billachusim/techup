ALTER TABLE public.talent_profiles
  ADD COLUMN IF NOT EXISTS is_client_interested BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS client_interest_note TEXT,
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.talent_roles
  ADD COLUMN IF NOT EXISTS whatsapp_group_url TEXT;

CREATE TABLE IF NOT EXISTS public.talent_engagements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  talent_profile_id UUID NOT NULL REFERENCES public.talent_profiles(id) ON DELETE CASCADE,
  role_id UUID REFERENCES public.talent_roles(id) ON DELETE SET NULL,
  weekly_amount NUMERIC,
  currency TEXT NOT NULL DEFAULT 'NGN',
  started_on DATE NOT NULL DEFAULT CURRENT_DATE,
  ended_on DATE,
  status TEXT NOT NULL DEFAULT 'active',
  note TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.talent_engagements TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.talent_engagements TO authenticated;
GRANT ALL ON public.talent_engagements TO service_role;

ALTER TABLE public.talent_engagements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view all engagements" ON public.talent_engagements
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE POLICY "Talent can view own engagements" ON public.talent_engagements
  FOR SELECT TO authenticated USING (
    talent_profile_id IN (SELECT id FROM public.talent_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Staff can insert engagements" ON public.talent_engagements
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update engagements" ON public.talent_engagements
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Admins can delete engagements" ON public.talent_engagements
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_talent_engagements_updated_at
  BEFORE UPDATE ON public.talent_engagements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.list_public_talent()
RETURNS TABLE (
  id uuid,
  full_name text,
  headline text,
  city text,
  country text,
  skills text[],
  tools text[],
  years_experience integer,
  hours_per_week integer,
  work_mode text,
  availability text,
  is_vetted boolean,
  is_client_interested boolean,
  profile_strength integer,
  is_matched boolean,
  is_working boolean,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.full_name, p.headline, p.city, p.country, p.skills, p.tools,
         p.years_experience, p.hours_per_week, p.work_mode, p.availability,
         p.is_vetted, p.is_client_interested, p.profile_strength,
         EXISTS (SELECT 1 FROM public.role_matches m
                 WHERE m.talent_profile_id = p.id AND m.status IN ('approved','accepted')),
         EXISTS (SELECT 1 FROM public.talent_engagements e
                 WHERE e.talent_profile_id = p.id AND e.status = 'active'),
         p.created_at
  FROM public.talent_profiles p
  WHERE p.is_public = true AND p.profile_strength >= 40
  ORDER BY p.is_vetted DESC, p.profile_strength DESC, p.created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.list_public_talent() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_public_talent(profile_id uuid)
RETURNS TABLE (
  id uuid,
  full_name text,
  headline text,
  bio text,
  city text,
  country text,
  skills text[],
  tools text[],
  skill_details jsonb,
  years_experience integer,
  hours_per_week integer,
  work_mode text,
  availability text,
  linkedin_url text,
  github_url text,
  portfolio_url text,
  is_vetted boolean,
  is_client_interested boolean,
  profile_strength integer,
  is_matched boolean,
  is_working boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.full_name, p.headline, p.bio, p.city, p.country, p.skills, p.tools,
         p.skill_details, p.years_experience, p.hours_per_week, p.work_mode, p.availability,
         p.linkedin_url, p.github_url, p.portfolio_url,
         p.is_vetted, p.is_client_interested, p.profile_strength,
         EXISTS (SELECT 1 FROM public.role_matches m
                 WHERE m.talent_profile_id = p.id AND m.status IN ('approved','accepted')),
         EXISTS (SELECT 1 FROM public.talent_engagements e
                 WHERE e.talent_profile_id = p.id AND e.status = 'active')
  FROM public.talent_profiles p
  WHERE p.id = profile_id AND p.is_public = true AND p.profile_strength >= 40
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_talent(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_project_group_url(_role_id uuid)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.whatsapp_group_url
  FROM public.talent_roles r
  WHERE r.id = _role_id
    AND r.whatsapp_group_url IS NOT NULL
    AND (
      public.is_staff(auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.role_matches m
        JOIN public.talent_profiles p ON p.id = m.talent_profile_id
        WHERE m.role_id = r.id
          AND p.user_id = auth.uid()
          AND m.status IN ('approved','accepted')
      )
    )
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_project_group_url(uuid) TO authenticated;