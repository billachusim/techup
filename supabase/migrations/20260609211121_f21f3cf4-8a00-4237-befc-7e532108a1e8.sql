
-- Restrict certificates: remove fully-public SELECT; provide single-lookup RPC
DROP POLICY IF EXISTS "Public can verify certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users can view own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users can create own certificates" ON public.certificates;

CREATE POLICY "Users can view own certificates"
  ON public.certificates FOR SELECT
  TO authenticated
  USING (faculty_id = (SELECT profiles.faculty_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can create own certificates"
  ON public.certificates FOR INSERT
  TO authenticated
  WITH CHECK (faculty_id = (SELECT profiles.faculty_id FROM profiles WHERE profiles.id = auth.uid()));

-- Public verification only by exact certificate number, returning only display fields
CREATE OR REPLACE FUNCTION public.verify_certificate(cert_number text)
RETURNS TABLE (
  certificate_number text,
  student_name text,
  course_name text,
  certificate_type text,
  issued_by text,
  date_issued text,
  issued_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.certificate_number, c.student_name, c.course_name,
         c.certificate_type, c.issued_by, c.date_issued, c.issued_at
  FROM public.certificates c
  WHERE c.certificate_number = upper(trim(cert_number))
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.verify_certificate(text) FROM public;
GRANT EXECUTE ON FUNCTION public.verify_certificate(text) TO anon, authenticated;

-- Re-scope job_applications policies to authenticated
DROP POLICY IF EXISTS "Users can view own job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Users can create own job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Users can update own job applications" ON public.job_applications;

CREATE POLICY "Users can view own job applications"
  ON public.job_applications FOR SELECT
  TO authenticated
  USING (faculty_id = (SELECT profiles.faculty_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can create own job applications"
  ON public.job_applications FOR INSERT
  TO authenticated
  WITH CHECK (faculty_id = (SELECT profiles.faculty_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can update own job applications"
  ON public.job_applications FOR UPDATE
  TO authenticated
  USING (faculty_id = (SELECT profiles.faculty_id FROM profiles WHERE profiles.id = auth.uid()));
