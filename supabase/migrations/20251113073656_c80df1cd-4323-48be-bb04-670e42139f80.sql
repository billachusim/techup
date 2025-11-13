-- Add department code mapping function
CREATE OR REPLACE FUNCTION public.get_department_code(dept text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN CASE 
    WHEN dept ILIKE '%web%' OR dept ILIKE '%developer%' THEN 'WEBDEV'
    WHEN dept ILIKE '%data%' OR dept ILIKE '%wizard%' THEN 'DATA'
    WHEN dept ILIKE '%cyber%' OR dept ILIKE '%security%' OR dept ILIKE '%shield%' THEN 'CYSEC'
    WHEN dept ILIKE '%ai%' OR dept ILIKE '%machine%' OR dept ILIKE '%innovator%' THEN 'AI'
    WHEN dept ILIKE '%cloud%' OR dept ILIKE '%architect%' THEN 'CLOUD'
    WHEN dept ILIKE '%design%' OR dept ILIKE '%ui%' OR dept ILIKE '%ux%' OR dept ILIKE '%master%' THEN 'DESIGN'
    WHEN dept ILIKE '%marketing%' OR dept ILIKE '%digital%' THEN 'MKTG'
    WHEN dept ILIKE '%custom%' THEN 'CUSTOM'
    ELSE 'GEN'
  END;
END;
$$;

-- Create function to generate new faculty IDs
CREATE OR REPLACE FUNCTION public.generate_faculty_id(
  dept_name text,
  learn_mode text,
  cohort_mo integer,
  cohort_yr integer
)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  dept_code text;
  mode_code text;
  cohort_code text;
  seq_num text;
  next_seq integer;
BEGIN
  -- Get department code
  dept_code := get_department_code(dept_name);
  
  -- Get mode code
  mode_code := CASE 
    WHEN learn_mode ILIKE '%hybrid%' THEN 'HYB'
    WHEN learn_mode ILIKE '%physical%' THEN 'PHY'
    ELSE 'ONL'
  END;
  
  -- Format cohort as MMYY
  cohort_code := LPAD(cohort_mo::text, 2, '0') || RIGHT(cohort_yr::text, 2);
  
  -- Get next sequence number for this cohort
  SELECT COUNT(*) + 1 INTO next_seq
  FROM profiles
  WHERE department = dept_name
    AND learning_mode = learn_mode
    AND cohort_month = cohort_mo
    AND cohort_year = cohort_yr;
  
  seq_num := LPAD(next_seq::text, 4, '0');
  
  RETURN 'TF-' || dept_code || '-' || mode_code || '-' || cohort_code || '-' || seq_num;
END;
$$;