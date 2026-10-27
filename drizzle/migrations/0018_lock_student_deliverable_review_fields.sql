CREATE OR REPLACE FUNCTION public.guard_student_deliverable_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.is_staff(auth.uid()) THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'submitted';
    NEW.score := NULL;
    NEW.reviewer_note := NULL;
    NEW.reviewed_at := NULL;
  ELSE
    NEW.status := OLD.status;
    NEW.score := OLD.score;
    NEW.reviewer_note := OLD.reviewer_note;
    NEW.reviewed_at := OLD.reviewed_at;
    NEW.user_id := OLD.user_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_student_deliverable_review ON public.student_deliverables;
CREATE TRIGGER guard_student_deliverable_review
BEFORE INSERT OR UPDATE ON public.student_deliverables
FOR EACH ROW EXECUTE FUNCTION public.guard_student_deliverable_review();