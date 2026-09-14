ALTER TABLE public.talent_profiles
  ADD COLUMN IF NOT EXISTS experiences jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS education jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS certifications jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS languages text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS cv_parsed_at timestamptz;

DROP FUNCTION IF EXISTS public.get_public_talent(uuid);

CREATE FUNCTION public.get_public_talent(profile_id uuid)
RETURNS TABLE(id uuid, full_name text, faculty_id text, headline text, bio text, city text, country text,
  skills text[], tools text[], skill_details jsonb, years_experience integer, hours_per_week integer,
  work_mode text, availability text, linkedin_url text, github_url text, portfolio_url text,
  is_vetted boolean, is_client_interested boolean, profile_strength integer, is_matched boolean, is_working boolean,
  experiences jsonb, education jsonb, certifications jsonb, languages text[])
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT p.id, p.full_name, p.faculty_id, p.headline, p.bio, p.city, p.country, p.skills, p.tools,
         p.skill_details, p.years_experience, p.hours_per_week, p.work_mode, p.availability,
         p.linkedin_url, p.github_url, p.portfolio_url,
         p.is_vetted, p.is_client_interested, p.profile_strength,
         EXISTS (SELECT 1 FROM public.role_matches m
                 WHERE m.talent_profile_id = p.id AND m.status IN ('approved','accepted')),
         EXISTS (SELECT 1 FROM public.talent_engagements e
                 WHERE e.talent_profile_id = p.id AND e.status = 'active'),
         p.experiences, p.education, p.certifications, p.languages
  FROM public.talent_profiles p
  WHERE p.id = profile_id AND p.is_public = true AND p.profile_strength >= 40
  LIMIT 1;
$function$;

GRANT EXECUTE ON FUNCTION public.get_public_talent(uuid) TO anon, authenticated, service_role;