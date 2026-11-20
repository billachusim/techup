CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  existing_faculty text;
  talent_faculty text;
  loc text;
  email_proven boolean;
BEGIN
  email_proven := coalesce(NEW.raw_app_meta_data ->> 'provider', 'email') NOT IN ('email', 'phone')
    AND coalesce(NEW.email, '') <> '';

  -- Only a student/alumni Faculty ID is linked (never one the old talent pages created).
  SELECT faculty_id INTO existing_faculty FROM public.faculty_ids
  WHERE lower(email) = lower(coalesce(NEW.email, ''))
    AND public.is_student_faculty_id(faculty_id)
  ORDER BY created_at LIMIT 1;

  IF email_proven THEN
    UPDATE public.talent_profiles SET user_id = NEW.id, updated_at = now()
    WHERE user_id IS NULL AND lower(coalesce(email, '')) = lower(NEW.email);

    SELECT faculty_id INTO talent_faculty FROM public.talent_profiles
    WHERE user_id = NEW.id AND faculty_id IS NOT NULL AND public.is_student_faculty_id(faculty_id) LIMIT 1;
  END IF;

  loc := nullif(left(btrim(coalesce(NEW.raw_user_meta_data ->> 'location', '')), 160), '');

  INSERT INTO public.profiles (id, name, email, phone, faculty_id, location)
  VALUES (NEW.id,
    coalesce(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    coalesce(NEW.email, ''), NEW.raw_user_meta_data ->> 'phone',
    coalesce(existing_faculty, talent_faculty), loc)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$;

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

  SELECT id INTO claimed FROM public.talent_profiles
  WHERE user_id = auth.uid() LIMIT 1;
  IF claimed IS NOT NULL THEN
    RETURN claimed;
  END IF;

  -- Only an email verified by a sign-in provider (e.g. Google) can claim a profile.
  SELECT lower(i.email) INTO my_email
  FROM auth.identities i
  JOIN auth.users u ON u.id = i.user_id
  WHERE i.user_id = auth.uid()
    AND i.provider NOT IN ('email', 'phone')
    AND coalesce(i.email, '') <> ''
    AND lower(i.email) = lower(coalesce(u.email, ''))
    AND coalesce((i.identity_data ->> 'email_verified')::boolean, false)
  LIMIT 1;
  IF my_email IS NULL OR my_email = '' THEN
    RETURN NULL;
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
      AND p.faculty_id IS NULL AND t.faculty_id IS NOT NULL
      AND public.is_student_faculty_id(t.faculty_id);
  END IF;

  RETURN claimed;
END;
$function$;