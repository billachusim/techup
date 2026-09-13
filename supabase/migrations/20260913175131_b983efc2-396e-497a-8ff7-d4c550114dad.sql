-- 1. ROLES / PERMISSIONS
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'recruiter', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','recruiter'))
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Bootstrap the owner account as admin if it exists
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users WHERE lower(email) = 'nnewitech@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. TALENT PROFILES
CREATE TABLE public.talent_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  faculty_id text,
  full_name text NOT NULL,
  email text,
  phone text,
  whatsapp text,
  city text,
  country text NOT NULL DEFAULT 'Nigeria',
  headline text,
  bio text,
  linkedin_url text,
  github_url text,
  portfolio_url text,
  intro_video_url text,
  cv_path text,
  skills text[] NOT NULL DEFAULT '{}',
  skill_details jsonb NOT NULL DEFAULT '[]'::jsonb,
  tools text[] NOT NULL DEFAULT '{}',
  years_experience integer,
  hours_per_week integer,
  work_mode text NOT NULL DEFAULT 'remote',
  rate_amount numeric,
  rate_currency text NOT NULL DEFAULT 'NGN',
  availability text NOT NULL DEFAULT 'open',
  is_vetted boolean NOT NULL DEFAULT false,
  vetted_at timestamptz,
  profile_strength integer NOT NULL DEFAULT 0,
  source text NOT NULL DEFAULT 'self',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.talent_profiles TO authenticated;
GRANT ALL ON public.talent_profiles TO service_role;
ALTER TABLE public.talent_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Talent can view own profile" ON public.talent_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Talent can create own profile" ON public.talent_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Talent can update own profile" ON public.talent_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Staff can view all talent profiles" ON public.talent_profiles
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update talent profiles" ON public.talent_profiles
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Admins can insert talent profiles" ON public.talent_profiles
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_talent_profiles_updated_at BEFORE UPDATE ON public.talent_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. OPENINGS
CREATE TABLE public.talent_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  role_kind text NOT NULL DEFAULT 'internal',
  company text NOT NULL DEFAULT 'Tech Faculty',
  city text,
  country text NOT NULL DEFAULT 'Nigeria',
  is_remote boolean NOT NULL DEFAULT true,
  employment_type text NOT NULL DEFAULT 'full_time',
  summary text NOT NULL,
  description text NOT NULL,
  responsibilities text[] NOT NULL DEFAULT '{}',
  required_skills text[] NOT NULL DEFAULT '{}',
  nice_to_have text[] NOT NULL DEFAULT '{}',
  seniority text NOT NULL DEFAULT 'mid',
  budget_min numeric,
  budget_max numeric,
  budget_currency text NOT NULL DEFAULT 'NGN',
  budget_unit text NOT NULL DEFAULT 'MONTH',
  openings integer NOT NULL DEFAULT 1,
  apply_deadline date,
  status text NOT NULL DEFAULT 'draft',
  is_featured boolean NOT NULL DEFAULT false,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.talent_roles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.talent_roles TO authenticated;
GRANT ALL ON public.talent_roles TO service_role;
ALTER TABLE public.talent_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published roles" ON public.talent_roles
  FOR SELECT USING (status = 'published');
CREATE POLICY "Staff can view all roles" ON public.talent_roles
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can create roles" ON public.talent_roles
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update roles" ON public.talent_roles
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Admins can delete roles" ON public.talent_roles
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_talent_roles_updated_at BEFORE UPDATE ON public.talent_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. MATCHES
CREATE TABLE public.role_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES public.talent_roles(id) ON DELETE CASCADE,
  talent_profile_id uuid NOT NULL REFERENCES public.talent_profiles(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  reason text,
  status text NOT NULL DEFAULT 'suggested',
  source text NOT NULL DEFAULT 'ai',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (role_id, talent_profile_id)
);

GRANT SELECT, UPDATE ON public.role_matches TO authenticated;
GRANT ALL ON public.role_matches TO service_role;
ALTER TABLE public.role_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Talent can view own approved matches" ON public.role_matches
  FOR SELECT TO authenticated USING (
    status IN ('approved','accepted','declined')
    AND EXISTS (SELECT 1 FROM public.talent_profiles p WHERE p.id = talent_profile_id AND p.user_id = auth.uid())
  );
CREATE POLICY "Talent can respond to own matches" ON public.role_matches
  FOR UPDATE TO authenticated USING (
    status IN ('approved','accepted','declined')
    AND EXISTS (SELECT 1 FROM public.talent_profiles p WHERE p.id = talent_profile_id AND p.user_id = auth.uid())
  ) WITH CHECK (
    status IN ('approved','accepted','declined')
    AND EXISTS (SELECT 1 FROM public.talent_profiles p WHERE p.id = talent_profile_id AND p.user_id = auth.uid())
  );
CREATE POLICY "Staff can view all matches" ON public.role_matches
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can insert matches" ON public.role_matches
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update matches" ON public.role_matches
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Admins can delete matches" ON public.role_matches
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

GRANT INSERT, DELETE ON public.role_matches TO authenticated;

CREATE TRIGGER update_role_matches_updated_at BEFORE UPDATE ON public.role_matches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. APPLICATIONS
CREATE TABLE public.talent_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES public.talent_roles(id) ON DELETE CASCADE,
  talent_profile_id uuid NOT NULL REFERENCES public.talent_profiles(id) ON DELETE CASCADE,
  message text,
  status text NOT NULL DEFAULT 'applied',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (role_id, talent_profile_id)
);

GRANT SELECT, INSERT, UPDATE ON public.talent_applications TO authenticated;
GRANT ALL ON public.talent_applications TO service_role;
ALTER TABLE public.talent_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Talent can view own applications" ON public.talent_applications
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.talent_profiles p WHERE p.id = talent_profile_id AND p.user_id = auth.uid())
  );
CREATE POLICY "Talent can apply" ON public.talent_applications
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.talent_profiles p WHERE p.id = talent_profile_id AND p.user_id = auth.uid())
  );
CREATE POLICY "Staff can view all applications" ON public.talent_applications
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update applications" ON public.talent_applications
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER update_talent_applications_updated_at BEFORE UPDATE ON public.talent_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. BUSINESS BRIEFS
CREATE TABLE public.business_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  contact_name text NOT NULL,
  email text,
  phone text NOT NULL,
  city text,
  country text NOT NULL DEFAULT 'Nigeria',
  project_title text NOT NULL,
  description text NOT NULL,
  skills_needed text[] NOT NULL DEFAULT '{}',
  budget_text text,
  timeline text,
  engagement text NOT NULL DEFAULT 'project',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.business_briefs TO anon;
GRANT SELECT, INSERT, UPDATE ON public.business_briefs TO authenticated;
GRANT ALL ON public.business_briefs TO service_role;
ALTER TABLE public.business_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a brief" ON public.business_briefs
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can view briefs" ON public.business_briefs
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update briefs" ON public.business_briefs
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER update_business_briefs_updated_at BEFORE UPDATE ON public.business_briefs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_role_matches_role ON public.role_matches(role_id);
CREATE INDEX idx_role_matches_profile ON public.role_matches(talent_profile_id);
CREATE INDEX idx_talent_roles_status ON public.talent_roles(status);