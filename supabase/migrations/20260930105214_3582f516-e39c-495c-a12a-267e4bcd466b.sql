CREATE OR REPLACE FUNCTION public.record_my_faculty_id(_old_id text, _department text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE p record;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Please sign in first'; END IF;
  SELECT * INTO p FROM public.profiles WHERE id = auth.uid();
  IF p.faculty_id IS NULL THEN RAISE EXCEPTION 'No Faculty ID on profile'; END IF;
  IF EXISTS (SELECT 1 FROM public.faculty_ids WHERE faculty_id = p.faculty_id) THEN RETURN p.faculty_id; END IF;
  IF _old_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.faculty_ids WHERE faculty_id = _old_id AND lower(email) = lower(p.email)) THEN
    UPDATE public.faculty_ids SET faculty_id = p.faculty_id, department = left(_department,120), updated_at = now() WHERE faculty_id = _old_id;
  ELSE
    INSERT INTO public.faculty_ids (faculty_id, name, email, phone, course_interest, hear_about_us, status, department)
    VALUES (p.faculty_id, coalesce(p.name,''), coalesce(p.email,''), coalesce(p.phone,''), left(_department,120), 'programme_enrolment', 'active', left(_department,120));
  END IF;
  RETURN p.faculty_id;
END; $$;
REVOKE EXECUTE ON FUNCTION public.record_my_faculty_id(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_my_faculty_id(text, text) TO authenticated;