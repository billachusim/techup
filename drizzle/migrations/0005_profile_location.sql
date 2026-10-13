ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_location_len CHECK (location IS NULL OR char_length(location) <= 160);
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  existing_faculty text;
  talent_faculty text;
  loc text;
BEGIN
  SELECT faculty_id INTO existing_faculty FROM public.faculty_ids
  WHERE lower(email) = lower(coalesce(NEW.email, '')) ORDER BY created_at LIMIT 1;

  UPDATE public.talent_profiles SET user_id = NEW.id, updated_at = now()
  WHERE user_id IS NULL AND lower(coalesce(email, '')) = lower(coalesce(NEW.email, '')) AND coalesce(NEW.email, '') <> '';

  SELECT faculty_id INTO talent_faculty FROM public.talent_profiles
  WHERE user_id = NEW.id AND faculty_id IS NOT NULL LIMIT 1;

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