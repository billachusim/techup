-- Update RLS policy to allow users to view course enrollments by faculty_id
DROP POLICY IF EXISTS "Authenticated users view own course enrollments" ON course_enrollments;

CREATE POLICY "Users can view enrollments by faculty_id" 
ON course_enrollments 
FOR SELECT 
TO authenticated
USING (
  faculty_id IN (
    SELECT faculty_id 
    FROM profiles 
    WHERE id = auth.uid()
  )
);

-- Also update the insert policy to be more explicit
DROP POLICY IF EXISTS "Authenticated users create own course enrollments" ON course_enrollments;

CREATE POLICY "Users can create enrollments by faculty_id" 
ON course_enrollments 
FOR INSERT 
TO authenticated
WITH CHECK (
  faculty_id IN (
    SELECT faculty_id 
    FROM profiles 
    WHERE id = auth.uid()
  )
);