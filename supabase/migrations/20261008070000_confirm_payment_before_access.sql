-- Paid enrolments only grant access once a payment is confirmed server-side.

-- "active" is what the app writes for confirmed and free enrolments.
ALTER TABLE public.enrollments DROP CONSTRAINT IF EXISTS valid_enrollment_status;
ALTER TABLE public.enrollments
  ADD CONSTRAINT valid_enrollment_status CHECK (status IN ('pending', 'active', 'confirmed', 'cancelled'));

-- What create-checkout charged, and what Flutterwave confirmed.
ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS tx_ref text UNIQUE,
  ADD COLUMN IF NOT EXISTS amount_due numeric,
  ADD COLUMN IF NOT EXISTS currency text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_reference text;

-- The original "anyone" insert policy was never dropped, so even signed-out
-- visitors could add an active enrolment for any Faculty ID.
DROP POLICY IF EXISTS "Anyone can create enrollment" ON public.enrollments;
DROP POLICY IF EXISTS "Authenticated users create own plan enrollments" ON public.enrollments;

-- Students may request a paid plan (pending) or join a free one (active).
-- Activating a paid plan is left to the payment functions and admins.
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

-- Course access is granted by the user-courses function from a paid-up
-- enrolment, not by students adding courses to themselves.
DROP POLICY IF EXISTS "Anyone can enroll in courses" ON public.course_enrollments;
DROP POLICY IF EXISTS "Users can create enrollments by faculty_id" ON public.course_enrollments;

-- Enrolments made before this change already had course access whatever
-- their status, and manual (WhatsApp / email) payments were never marked.
-- Keep those students' access; admins can cancel any that never paid.
UPDATE public.enrollments SET status = 'confirmed' WHERE status = 'pending';
