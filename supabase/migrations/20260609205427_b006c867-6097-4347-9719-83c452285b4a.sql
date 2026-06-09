
-- Allow manual certificates (no linked course/user) and add display fields
ALTER TABLE public.certificates
  ALTER COLUMN course_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS student_name text,
  ADD COLUMN IF NOT EXISTS certificate_type text NOT NULL DEFAULT 'Certificate of Achievement',
  ADD COLUMN IF NOT EXISTS issued_by text NOT NULL DEFAULT 'Tech Faculty NG',
  ADD COLUMN IF NOT EXISTS date_issued text;

-- Allow public (anon) read so the /verify page can look up certificates without auth
GRANT SELECT ON public.certificates TO anon;

DROP POLICY IF EXISTS "Public can verify certificates" ON public.certificates;
CREATE POLICY "Public can verify certificates"
  ON public.certificates FOR SELECT
  TO anon, authenticated
  USING (true);

-- Seed Lilian's existing hardcoded record into the DB
INSERT INTO public.certificates (faculty_id, course_name, certificate_number, student_name, certificate_type, issued_by, date_issued, issued_at)
VALUES ('TF-LEGACY-0001', 'Fullstack Web Development', 'TFNG202601', 'Mbanefo Ifunanya Lilian', 'Certificate of Achievement', 'Tech Faculty NG', 'April 01, 2026', now())
ON CONFLICT DO NOTHING;
