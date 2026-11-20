DROP POLICY IF EXISTS "Authenticated users create own course progress" ON public.course_progress;
DROP POLICY IF EXISTS "Authenticated users update own course progress" ON public.course_progress;
REVOKE INSERT, UPDATE, DELETE ON public.course_progress FROM anon, authenticated;
REVOKE SELECT ON public.course_progress FROM anon;
GRANT SELECT ON public.course_progress TO authenticated;
GRANT ALL ON public.course_progress TO service_role;

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
  -- Email/password sign-ups are confirmed instantly, so only a sign-in provider (e.g. Google)
  -- proves the person owns the email address.
  email_proven := coalesce(NEW.raw_app_meta_data ->> 'provider', 'email') NOT IN ('email', 'phone')
    AND coalesce(NEW.email, '') <> ''
    AND coalesce((NEW.raw_user_meta_data ->> 'email_verified')::boolean, true);

  IF email_proven THEN
    -- Only a student/alumni Faculty ID is linked (never one the old talent pages created).
    SELECT faculty_id INTO existing_faculty FROM public.faculty_ids
    WHERE lower(email) = lower(NEW.email)
      AND public.is_student_faculty_id(faculty_id)
    ORDER BY created_at LIMIT 1;

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