-- Admins can revoke a certificate. A revoked certificate no longer verifies on /verify.
ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS revoked_at timestamptz,
  ADD COLUMN IF NOT EXISTS revoked_reason text,
  ADD COLUMN IF NOT EXISTS revoked_by uuid,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;

GRANT UPDATE ON public.certificates TO service_role;

-- The return type changes (adds "revoked"), so the function is dropped and recreated.
DROP FUNCTION IF EXISTS public.verify_certificate(text);

-- Public verification only by exact certificate number, returning only display fields.
-- A revoked certificate returns revoked = true and no holder details.
CREATE FUNCTION public.verify_certificate(cert_number text)
RETURNS TABLE (
  certificate_number text,
  student_name text,
  course_name text,
  certificate_type text,
  issued_by text,
  date_issued text,
  issued_at timestamptz,
  revoked boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.certificate_number,
         CASE WHEN c.revoked_at IS NULL THEN c.student_name END,
         CASE WHEN c.revoked_at IS NULL THEN c.course_name END,
         CASE WHEN c.revoked_at IS NULL THEN c.certificate_type END,
         CASE WHEN c.revoked_at IS NULL THEN c.issued_by END,
         CASE WHEN c.revoked_at IS NULL THEN c.date_issued END,
         CASE WHEN c.revoked_at IS NULL THEN c.issued_at END,
         c.revoked_at IS NOT NULL
  FROM public.certificates c
  WHERE c.certificate_number = upper(trim(cert_number))
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.verify_certificate(text) FROM public;
GRANT EXECUTE ON FUNCTION public.verify_certificate(text) TO anon, authenticated;
