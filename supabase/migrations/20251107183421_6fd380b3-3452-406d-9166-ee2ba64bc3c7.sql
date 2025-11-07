-- Add classes_completed field to course_progress table
ALTER TABLE course_progress 
ADD COLUMN classes_completed INTEGER DEFAULT 0 CHECK (classes_completed >= 0 AND classes_completed <= 4);

-- Update existing progress records to calculate classes_completed from progress_percentage
UPDATE course_progress 
SET classes_completed = FLOOR(progress_percentage / 25.0)
WHERE classes_completed = 0;