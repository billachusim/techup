ALTER TABLE public.profiles ALTER COLUMN faculty_id DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN name SET DEFAULT '';
ALTER TABLE public.profiles ALTER COLUMN email SET DEFAULT '';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE existing_faculty text;
BEGIN
  SELECT faculty_id INTO existing_faculty
  FROM public.faculty_ids
  WHERE lower(email) = lower(coalesce(NEW.email, ''))
  ORDER BY created_at
  LIMIT 1;

  INSERT INTO public.profiles (id, name, email, phone, faculty_id)
  VALUES (
    NEW.id,
    coalesce(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    coalesce(NEW.email, ''),
    NEW.raw_user_meta_data ->> 'phone',
    existing_faculty
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.profiles (id, name, email, phone, faculty_id)
SELECT u.id,
       coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', ''),
       coalesce(u.email, ''),
       u.raw_user_meta_data ->> 'phone',
       (SELECT f.faculty_id FROM public.faculty_ids f WHERE lower(f.email) = lower(coalesce(u.email, '')) ORDER BY f.created_at LIMIT 1)
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;