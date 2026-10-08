ALTER TABLE public.enrollments DROP CONSTRAINT IF EXISTS valid_enrollment_status;
ALTER TABLE public.enrollments
  ADD CONSTRAINT valid_enrollment_status CHECK (status IN ('pending', 'active', 'confirmed', 'cancelled'));

ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS tx_ref text UNIQUE,
  ADD COLUMN IF NOT EXISTS amount_due numeric,
  ADD COLUMN IF NOT EXISTS currency text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_reference text;

DROP POLICY IF EXISTS "Anyone can create enrollment" ON public.enrollments;
DROP POLICY IF EXISTS "Authenticated users create own plan enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Students request own enrollments" ON public.enrollments;

CREATE POLICY "Students request own enrollments"
ON public.enrollments
FOR INSERT
TO authenticated
WITH CHECK (
  faculty_id = (SELECT faculty_id FROM public.profiles WHERE id = auth.uid())
  AND tx_ref IS NULL
  AND amount_due IS NULL
  AND paid_at IS NULL
  AND payment_reference IS NULL
  AND (
    status = 'pending'
    OR (status = 'active' AND plan_name IN ('Bootcamp Starter', 'Free Bootcamp'))
  )
);

DROP POLICY IF EXISTS "Anyone can enroll in courses" ON public.course_enrollments;
DROP POLICY IF EXISTS "Users can create enrollments by faculty_id" ON public.course_enrollments;

UPDATE public.enrollments SET status = 'confirmed' WHERE status = 'pending';