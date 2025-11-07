-- Fix faculty_ids table - remove public SELECT access
DROP POLICY IF EXISTS "Anyone can view faculty IDs" ON public.faculty_ids;
DROP POLICY IF EXISTS "Anyone can register for a faculty ID" ON public.faculty_ids;
DROP POLICY IF EXISTS "No public updates to faculty IDs" ON public.faculty_ids;

-- Only allow public INSERT for registration, no public SELECT
CREATE POLICY "Public can register faculty ID"
ON public.faculty_ids
FOR INSERT
TO public
WITH CHECK (true);

-- Authenticated users can view their own record
CREATE POLICY "Authenticated users view own faculty record"
ON public.faculty_ids
FOR SELECT
TO authenticated
USING (faculty_id = (SELECT faculty_id FROM public.profiles WHERE id = auth.uid()));

-- Fix course_enrollments RLS to use auth
DROP POLICY IF EXISTS "Users can view their own course enrollments" ON public.course_enrollments;
DROP POLICY IF EXISTS "Users can enroll themselves in courses" ON public.course_enrollments;

CREATE POLICY "Authenticated users view own course enrollments"
ON public.course_enrollments
FOR SELECT
TO authenticated
USING (faculty_id = (SELECT faculty_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Authenticated users create own course enrollments"
ON public.course_enrollments
FOR INSERT
TO authenticated
WITH CHECK (faculty_id = (SELECT faculty_id FROM public.profiles WHERE id = auth.uid()));

-- Fix course_progress RLS to use auth
DROP POLICY IF EXISTS "Users can view their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can create their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.course_progress;

CREATE POLICY "Authenticated users view own course progress"
ON public.course_progress
FOR SELECT
TO authenticated
USING (faculty_id = (SELECT faculty_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Authenticated users create own course progress"
ON public.course_progress
FOR INSERT
TO authenticated
WITH CHECK (faculty_id = (SELECT faculty_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Authenticated users update own course progress"
ON public.course_progress
FOR UPDATE
TO authenticated
USING (faculty_id = (SELECT faculty_id FROM public.profiles WHERE id = auth.uid()));

-- Fix enrollments RLS to use auth
DROP POLICY IF EXISTS "Users can view their own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Users can create their own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Anyone can view enrollments" ON public.enrollments;

CREATE POLICY "Authenticated users view own plan enrollments"
ON public.enrollments
FOR SELECT
TO authenticated
USING (faculty_id = (SELECT faculty_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Authenticated users create own plan enrollments"
ON public.enrollments
FOR INSERT
TO authenticated
WITH CHECK (faculty_id = (SELECT faculty_id FROM public.profiles WHERE id = auth.uid()));