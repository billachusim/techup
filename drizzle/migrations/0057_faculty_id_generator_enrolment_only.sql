REVOKE ALL ON FUNCTION public.generate_faculty_id(text, text, integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.generate_faculty_id(text, text, integer, integer) FROM anon;
REVOKE ALL ON FUNCTION public.generate_faculty_id(text, text, integer, integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.generate_faculty_id(text, text, integer, integer) TO service_role;