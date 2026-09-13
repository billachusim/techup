CREATE OR REPLACE FUNCTION public.get_department_code(dept text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN CASE
    WHEN dept ILIKE '%cyber%' OR dept ILIKE '%security%' OR dept ILIKE '%shield%' THEN 'CYSEC'
    WHEN dept ILIKE '%data%' OR dept ILIKE '%wizard%' THEN 'DATA'
    WHEN dept ILIKE '%ai%' OR dept ILIKE '%machine%' OR dept ILIKE '%innovator%' THEN 'AI'
    WHEN dept ILIKE '%cloud%' OR dept ILIKE '%architect%' THEN 'CLOUD'
    WHEN dept ILIKE '%design%' OR dept ILIKE '%ui%' OR dept ILIKE '%ux%' OR dept ILIKE '%brand%' OR dept ILIKE '%master%' THEN 'DESIGN'
    WHEN dept ILIKE '%marketing%' OR dept ILIKE '%digital%' OR dept ILIKE '%growth%' THEN 'MKTG'
    WHEN dept ILIKE '%web%' OR dept ILIKE '%developer%' OR dept ILIKE '%software%' OR dept ILIKE '%develop%' THEN 'WEBDEV'
    WHEN dept ILIKE '%product%' OR dept ILIKE '%project%' THEN 'PDM'
    WHEN dept ILIKE '%video%' OR dept ILIKE '%media%' OR dept ILIKE '%content%' OR dept ILIKE '%writing%' OR dept ILIKE '%creative%' OR dept ILIKE '%social%' THEN 'MEDIA'
    WHEN dept ILIKE '%custom%' THEN 'CUSTOM'
    ELSE 'GEN'
  END;
END;
$$;

CREATE OR REPLACE FUNCTION public.issue_talent_faculty_id(_talent_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
  VALUES (new_id, t.full_name, COALESCE(t.email, ''), COALESCE(t.phone, t.whatsapp, ''), track, 'talent_marketplace', 'active', track);

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