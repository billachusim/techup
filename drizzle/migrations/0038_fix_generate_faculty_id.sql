CREATE OR REPLACE FUNCTION public.generate_faculty_id(
  dept_name text,
  learn_mode text,
  cohort_mo integer,
  cohort_yr integer
)
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
  prefix := 'TF-' || public.get_department_code(dept_name) || '-' ||
    CASE
      WHEN learn_mode ILIKE '%hybrid%' THEN 'HYB'
      WHEN learn_mode ILIKE '%physical%' THEN 'PHY'
      ELSE 'ONL'
    END || '-' ||
    LPAD(cohort_mo::text, 2, '0') || RIGHT(cohort_yr::text, 2) || '-';

  SELECT COALESCE(MAX(NULLIF(regexp_replace(substr(faculty_id, length(prefix) + 1), '\D', '', 'g'), '')::integer), 0) + 1
    INTO next_seq
    FROM public.profiles
   WHERE faculty_id LIKE prefix || '%';

  LOOP
    candidate := prefix || LPAD(next_seq::text, 4, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE faculty_id = candidate)
          AND NOT EXISTS (SELECT 1 FROM public.enrollments WHERE faculty_id = candidate);
    next_seq := next_seq + 1;
  END LOOP;

  RETURN candidate;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.generate_faculty_id(text, text, integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.generate_faculty_id(text, text, integer, integer) TO authenticated, service_role;