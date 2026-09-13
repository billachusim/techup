-- Faculty ID sequence helper that guarantees uniqueness across all issued IDs
CREATE OR REPLACE FUNCTION public.next_faculty_id(dept_name text, learn_mode text, cohort_mo integer, cohort_yr integer)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prefix text;
  next_seq integer;
  candidate text;
BEGIN
  prefix := 'TF-' || get_department_code(dept_name) || '-' ||
    CASE
      WHEN learn_mode ILIKE '%hybrid%' THEN 'HYB'
      WHEN learn_mode ILIKE '%physical%' THEN 'PHY'
      ELSE 'ONL'
    END || '-' || LPAD(cohort_mo::text, 2, '0') || RIGHT(cohort_yr::text, 2) || '-';

  SELECT COUNT(*) + 1 INTO next_seq FROM public.faculty_ids WHERE faculty_id LIKE prefix || '%';

  LOOP
    candidate := prefix || LPAD(next_seq::text, 4, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.faculty_ids WHERE faculty_id = candidate)
          AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE faculty_id = candidate);
    next_seq := next_seq + 1;
  END LOOP;

  RETURN candidate;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.next_faculty_id(text, text, integer, integer) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.next_faculty_id(text, text, integer, integer) TO service_role;

-- Store the Faculty ID on the talent profile itself
ALTER TABLE public.talent_profiles ADD COLUMN IF NOT EXISTS faculty_id text;

-- Issue (or return the existing) Faculty ID for a talent. Staff only.
CREATE OR REPLACE FUNCTION public.issue_talent_faculty_id(_talent_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  t record;
  new_id text;
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Only staff can issue Faculty IDs';
  END IF;

  SELECT * INTO t FROM public.talent_profiles WHERE id = _talent_id;
  IF t.id IS NULL THEN
    RAISE EXCEPTION 'Talent not found';
  END IF;
  IF t.faculty_id IS NOT NULL THEN
    RETURN t.faculty_id;
  END IF;

  new_id := public.next_faculty_id(
    COALESCE(NULLIF(btrim(COALESCE(t.headline, '')), ''), COALESCE(t.skills[1], 'general')),
    'online',
    EXTRACT(MONTH FROM COALESCE(t.created_at, now()))::integer,
    EXTRACT(YEAR FROM COALESCE(t.created_at, now()))::integer
  );

  INSERT INTO public.faculty_ids (faculty_id, name, email, phone, course_interest, hear_about_us, status, department)
  VALUES (
    new_id,
    t.full_name,
    COALESCE(t.email, ''),
    COALESCE(t.phone, t.whatsapp, ''),
    COALESCE(NULLIF(btrim(COALESCE(t.headline, '')), ''), COALESCE(t.skills[1], 'general')),
    'talent_marketplace',
    'approved',
    COALESCE(NULLIF(btrim(COALESCE(t.headline, '')), ''), COALESCE(t.skills[1], 'general'))
  );

  UPDATE public.talent_profiles SET faculty_id = new_id, updated_at = now() WHERE id = _talent_id;

  IF t.user_id IS NOT NULL THEN
    UPDATE public.profiles SET faculty_id = new_id, updated_at = now()
    WHERE id = t.user_id AND faculty_id IS NULL;
  END IF;

  RETURN new_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.issue_talent_faculty_id(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.issue_talent_faculty_id(uuid) TO authenticated, service_role;

-- Approve a talent: vetted + public + Faculty ID in one step. Staff only.
CREATE OR REPLACE FUNCTION public.approve_talent(_talent_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id text;
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Only staff can approve talent';
  END IF;

  UPDATE public.talent_profiles
  SET is_vetted = true,
      vetted_at = COALESCE(vetted_at, now()),
      is_public = true,
      updated_at = now()
  WHERE id = _talent_id;

  new_id := public.issue_talent_faculty_id(_talent_id);
  RETURN new_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.approve_talent(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.approve_talent(uuid) TO authenticated, service_role;

-- Public directory functions now expose the Faculty ID as a display-only field
DROP FUNCTION IF EXISTS public.list_public_talent();
CREATE FUNCTION public.list_public_talent()
RETURNS TABLE(id uuid, full_name text, faculty_id text, headline text, city text, country text, skills text[], tools text[], years_experience integer, hours_per_week integer, work_mode text, availability text, is_vetted boolean, is_client_interested boolean, profile_strength integer, is_matched boolean, is_working boolean, created_at timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.full_name, p.faculty_id, p.headline, p.city, p.country, p.skills, p.tools,
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

GRANT EXECUTE ON FUNCTION public.list_public_talent() TO anon, authenticated, service_role;

DROP FUNCTION IF EXISTS public.get_public_talent(uuid);
CREATE FUNCTION public.get_public_talent(profile_id uuid)
RETURNS TABLE(id uuid, full_name text, faculty_id text, headline text, bio text, city text, country text, skills text[], tools text[], skill_details jsonb, years_experience integer, hours_per_week integer, work_mode text, availability text, linkedin_url text, github_url text, portfolio_url text, is_vetted boolean, is_client_interested boolean, profile_strength integer, is_matched boolean, is_working boolean)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.full_name, p.faculty_id, p.headline, p.bio, p.city, p.country, p.skills, p.tools,
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

GRANT EXECUTE ON FUNCTION public.get_public_talent(uuid) TO anon, authenticated, service_role;