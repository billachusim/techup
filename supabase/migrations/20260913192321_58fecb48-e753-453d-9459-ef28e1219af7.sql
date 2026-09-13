ALTER TABLE public.talent_roles
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS is_paid_training boolean NOT NULL DEFAULT false;

-- New signups inherit a pre-seeded talent profile (and its Faculty ID) by email match
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  existing_faculty text;
  talent_faculty text;
BEGIN
  SELECT faculty_id INTO existing_faculty
  FROM public.faculty_ids
  WHERE lower(email) = lower(coalesce(NEW.email, ''))
  ORDER BY created_at
  LIMIT 1;

  UPDATE public.talent_profiles
  SET user_id = NEW.id, updated_at = now()
  WHERE user_id IS NULL
    AND lower(coalesce(email, '')) = lower(coalesce(NEW.email, ''))
    AND coalesce(NEW.email, '') <> '';

  SELECT faculty_id INTO talent_faculty
  FROM public.talent_profiles
  WHERE user_id = NEW.id AND faculty_id IS NOT NULL
  LIMIT 1;

  INSERT INTO public.profiles (id, name, email, phone, faculty_id)
  VALUES (
    NEW.id,
    coalesce(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    coalesce(NEW.email, ''),
    NEW.raw_user_meta_data ->> 'phone',
    coalesce(existing_faculty, talent_faculty)
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$function$;

-- Let an already signed-in person claim a pre-seeded profile with their email
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

  SELECT lower(email) INTO my_email FROM auth.users WHERE id = auth.uid();
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

REVOKE ALL ON FUNCTION public.claim_my_talent_profile() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_my_talent_profile() TO authenticated;

-- Auto-issue a Faculty ID once a talent profile is fully complete
CREATE OR REPLACE FUNCTION public.claim_talent_faculty_id()
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
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Please sign in first';
  END IF;

  SELECT * INTO t FROM public.talent_profiles WHERE user_id = auth.uid() LIMIT 1;
  IF t.id IS NULL THEN
    RETURN NULL;
  END IF;
  IF t.faculty_id IS NOT NULL THEN
    RETURN t.faculty_id;
  END IF;
  IF coalesce(t.profile_strength, 0) < 100 THEN
    RETURN NULL;
  END IF;

  track := COALESCE(NULLIF(btrim(COALESCE(t.headline, '')), ''), COALESCE(t.skills[1], 'general'));

  new_id := public.next_faculty_id(
    track,
    'online',
    EXTRACT(MONTH FROM now())::integer,
    EXTRACT(YEAR FROM now())::integer
  );

  INSERT INTO public.faculty_ids (faculty_id, name, email, phone, course_interest, hear_about_us, status, department)
  VALUES (new_id, t.full_name, COALESCE(t.email, ''), COALESCE(t.phone, t.whatsapp, ''), track, 'talent_marketplace', 'active', track);

  UPDATE public.talent_profiles
  SET faculty_id = new_id, is_vetted = true, vetted_at = COALESCE(vetted_at, now()), updated_at = now()
  WHERE id = t.id;

  UPDATE public.profiles SET faculty_id = new_id, updated_at = now()
  WHERE id = auth.uid() AND faculty_id IS NULL;

  RETURN new_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.claim_talent_faculty_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_talent_faculty_id() TO authenticated;