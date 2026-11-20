ALTER TABLE public.talent_profiles ADD COLUMN IF NOT EXISTS approved_at timestamptz;
UPDATE public.talent_profiles SET approved_at = COALESCE(vetted_at, updated_at, now()) WHERE is_vetted AND approved_at IS NULL;

-- A Faculty ID counts as a student/alumni ID when it came from registering for a
-- course (or was issued by staff), or the person has enrolled with it.
-- Runs with the caller's rights; the approval functions below call it as owner.
CREATE OR REPLACE FUNCTION public.is_student_faculty_id(_fid text)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT coalesce(btrim(_fid), '') <> '' AND (
    EXISTS (SELECT 1 FROM public.enrollments e WHERE e.faculty_id = _fid)
    OR EXISTS (SELECT 1 FROM public.faculty_ids f WHERE f.faculty_id = _fid AND coalesce(f.hear_about_us, '') <> 'talent_marketplace')
  );
$$;
REVOKE ALL ON FUNCTION public.is_student_faculty_id(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_student_faculty_id(text) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.approve_talent(_talent_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  t record;
  pid text;
  student_id text;
BEGIN
  IF auth.role() IS DISTINCT FROM 'service_role' AND NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Only staff can approve talent';
  END IF;

  SELECT * INTO t FROM public.talent_profiles WHERE id = _talent_id;
  IF t.id IS NULL THEN
    RAISE EXCEPTION 'Talent not found';
  END IF;

  IF t.user_id IS NOT NULL THEN
    SELECT faculty_id INTO pid FROM public.profiles WHERE id = t.user_id;
  END IF;
  IF public.is_student_faculty_id(pid) THEN
    student_id := pid;
  ELSIF public.is_student_faculty_id(t.faculty_id) THEN
    student_id := t.faculty_id;
  END IF;

  UPDATE public.talent_profiles
  SET approved_at = COALESCE(approved_at, now()),
      is_public = true,
      faculty_id = COALESCE(student_id, faculty_id),
      is_vetted = is_vetted OR student_id IS NOT NULL,
      vetted_at = CASE WHEN student_id IS NOT NULL THEN COALESCE(vetted_at, now()) ELSE vetted_at END,
      updated_at = now()
  WHERE id = _talent_id;

  RETURN student_id;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.approve_talent(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.approve_talent(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.claim_talent_faculty_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  t record;
  pid text;
  student_id text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Please sign in first';
  END IF;

  SELECT * INTO t FROM public.talent_profiles WHERE user_id = auth.uid() LIMIT 1;
  IF t.id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT faculty_id INTO pid FROM public.profiles WHERE id = auth.uid();
  IF public.is_student_faculty_id(pid) THEN
    student_id := pid;
  ELSIF public.is_student_faculty_id(t.faculty_id) THEN
    student_id := t.faculty_id;
  ELSE
    RETURN NULL;
  END IF;

  UPDATE public.talent_profiles
  SET faculty_id = student_id,
      is_vetted = true,
      vetted_at = COALESCE(vetted_at, now()),
      updated_at = now()
  WHERE id = t.id
    AND (faculty_id IS DISTINCT FROM student_id OR NOT is_vetted);

  RETURN student_id;
END;
$function$;
REVOKE ALL ON FUNCTION public.claim_talent_faculty_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_talent_faculty_id() TO authenticated;

CREATE OR REPLACE FUNCTION public.issue_talent_faculty_id(_talent_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  t record;
  new_id text;
  track text;
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

  track := COALESCE(NULLIF(btrim(COALESCE(t.headline, '')), ''), COALESCE(t.skills[1], 'general'));

  new_id := public.next_faculty_id(
    track,
    'online',
    EXTRACT(MONTH FROM COALESCE(t.created_at, now()))::integer,
    EXTRACT(YEAR FROM COALESCE(t.created_at, now()))::integer
  );

  INSERT INTO public.faculty_ids (faculty_id, name, email, phone, course_interest, hear_about_us, status, department)
  VALUES (new_id, t.full_name, COALESCE(t.email, ''), COALESCE(t.phone, t.whatsapp, ''), track, 'staff_issued', 'active', track);

  UPDATE public.talent_profiles SET faculty_id = new_id, updated_at = now() WHERE id = _talent_id;

  IF t.user_id IS NOT NULL THEN
    UPDATE public.profiles SET faculty_id = new_id, updated_at = now()
    WHERE id = t.user_id AND faculty_id IS NULL;
  END IF;

  RETURN new_id;
END;
$function$;
REVOKE EXECUTE ON FUNCTION public.issue_talent_faculty_id(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.issue_talent_faculty_id(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.guard_talent_profile_fields()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  s integer := 0;
  n integer;
BEGIN
  IF current_user NOT IN ('authenticated', 'anon') OR public.is_staff(auth.uid()) THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.is_vetted := false;
    NEW.vetted_at := NULL;
    NEW.approved_at := NULL;
    NEW.is_client_interested := false;
    NEW.client_interest_note := NULL;
    NEW.admin_notes := NULL;
    NEW.faculty_id := NULL;
    NEW.slack_user_id := NULL;
    NEW.slack_general_joined_at := NULL;
  ELSE
    NEW.is_vetted := OLD.is_vetted;
    NEW.vetted_at := OLD.vetted_at;
    NEW.approved_at := OLD.approved_at;
    NEW.is_client_interested := OLD.is_client_interested;
    NEW.client_interest_note := OLD.client_interest_note;
    NEW.admin_notes := OLD.admin_notes;
    NEW.source := OLD.source;
    NEW.faculty_id := OLD.faculty_id;
    NEW.user_id := OLD.user_id;
    NEW.slack_user_id := OLD.slack_user_id;
    NEW.slack_general_joined_at := OLD.slack_general_joined_at;
  END IF;

  IF coalesce(NEW.full_name, '') <> '' THEN s := s + 10; END IF;
  IF coalesce(NEW.city, '') <> '' THEN s := s + 5; END IF;
  IF coalesce(NEW.phone, '') <> '' THEN s := s + 10; END IF;
  n := coalesce(array_length(NEW.skills, 1), 0);
  IF n >= 3 THEN s := s + 15; ELSIF n > 0 THEN s := s + 7; END IF;
  IF coalesce(NEW.cv_path, '') <> '' THEN s := s + 15; END IF;
  IF coalesce(NEW.headline, '') <> '' THEN s := s + 10; END IF;
  IF length(coalesce(NEW.bio, '')) > 80 THEN s := s + 10; END IF;
  IF coalesce(NEW.linkedin_url, '') <> '' THEN s := s + 5; END IF;
  IF coalesce(NEW.github_url, '') <> '' OR coalesce(NEW.portfolio_url, '') <> '' THEN s := s + 5; END IF;
  IF NEW.years_experience IS NOT NULL THEN s := s + 5; END IF;
  IF NEW.hours_per_week IS NOT NULL THEN s := s + 5; END IF;
  IF NEW.rate_amount IS NOT NULL THEN s := s + 5; END IF;
  NEW.profile_strength := least(100, s);

  RETURN NEW;
END;
$function$;