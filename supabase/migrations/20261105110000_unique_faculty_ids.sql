-- Faculty IDs must be unique across all students.
--
-- generate_faculty_id() counted matching profiles as the calling student, so
-- row-level security let it see only the caller's own profile. Every student
-- got sequence 0001, and the second student to enrol in the same department,
-- mode and month hit the UNIQUE constraint on profiles.faculty_id
-- ("Enrollment failed / Failed to update profile").
--
-- Now it runs as the owner, numbers from the highest ID already issued with
-- the same prefix (counting rows breaks once a department is renamed or a
-- profile moves), and skips any ID that is already taken.

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
