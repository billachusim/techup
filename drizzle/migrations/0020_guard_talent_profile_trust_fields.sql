CREATE OR REPLACE FUNCTION public.guard_talent_profile_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  s integer := 0;
  n integer;
BEGIN
  -- Only direct writes from signed-in/anonymous app users are limited.
  -- Staff and trusted SECURITY DEFINER functions run unchanged.
  IF current_user NOT IN ('authenticated', 'anon') OR public.is_staff(auth.uid()) THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.is_vetted := false;
    NEW.vetted_at := NULL;
    NEW.is_client_interested := false;
    NEW.client_interest_note := NULL;
    NEW.admin_notes := NULL;
    NEW.faculty_id := NULL;
    NEW.slack_user_id := NULL;
    NEW.slack_general_joined_at := NULL;
  ELSE
    NEW.is_vetted := OLD.is_vetted;
    NEW.vetted_at := OLD.vetted_at;
    NEW.is_client_interested := OLD.is_client_interested;
    NEW.client_interest_note := OLD.client_interest_note;
    NEW.admin_notes := OLD.admin_notes;
    NEW.source := OLD.source;
    NEW.faculty_id := OLD.faculty_id;
    NEW.user_id := OLD.user_id;
    NEW.slack_user_id := OLD.slack_user_id;
    NEW.slack_general_joined_at := OLD.slack_general_joined_at;
  END IF;

  -- Same scoring as profileStrength() in src/lib/talent.ts, computed here so it can't be faked.
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
$$;

DROP TRIGGER IF EXISTS guard_talent_profile_fields ON public.talent_profiles;
CREATE TRIGGER guard_talent_profile_fields
BEFORE INSERT OR UPDATE ON public.talent_profiles
FOR EACH ROW EXECUTE FUNCTION public.guard_talent_profile_fields();

-- Only a confirmed email address can claim a pre-seeded talent profile.
CREATE OR REPLACE FUNCTION public.claim_my_talent_profile()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  my_email text;
  claimed uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Please sign in first';
  END IF;

  SELECT lower(email) INTO my_email FROM auth.users
  WHERE id = auth.uid() AND email_confirmed_at IS NOT NULL;
  IF my_email IS NULL OR my_email = '' THEN
    RETURN NULL;
  END IF;

  SELECT id INTO claimed FROM public.talent_profiles
  WHERE user_id = auth.uid() LIMIT 1;
  IF claimed IS NOT NULL THEN
    RETURN claimed;
  END IF;

  UPDATE public.talent_profiles
  SET user_id = auth.uid(), updated_at = now()
  WHERE user_id IS NULL AND lower(coalesce(email, '')) = my_email
  RETURNING id INTO claimed;

  IF claimed IS NOT NULL THEN
    UPDATE public.profiles p
    SET faculty_id = t.faculty_id, updated_at = now()
    FROM public.talent_profiles t
    WHERE t.id = claimed AND p.id = auth.uid()
      AND p.faculty_id IS NULL AND t.faculty_id IS NOT NULL;
  END IF;

  RETURN claimed;
END;
$function$;