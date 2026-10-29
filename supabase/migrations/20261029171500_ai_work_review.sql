-- AI review of student work. Every new submission is scored by AI within a
-- minute or two: a score, written feedback, and accepted or needs changes.
-- The student is emailed as if a tutor had reviewed it, and staff can change
-- the result on /admin/students at any time. When the AI isn't sure (or can't
-- run), the submission stays "Awaiting review" with the AI's draft for staff.

-- 1. AI fields on each submission.
ALTER TABLE public.student_deliverables
  -- pending: waiting for AI; running: being scored; done: AI's review applied;
  -- needs_staff: AI unsure, draft left for staff; failed: AI call failed (retried);
  -- skipped: reviewed by staff before the AI ran.
  ADD COLUMN IF NOT EXISTS ai_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS ai_score integer,
  ADD COLUMN IF NOT EXISTS ai_verdict text,
  ADD COLUMN IF NOT EXISTS ai_feedback text,
  ADD COLUMN IF NOT EXISTS ai_confidence numeric,
  ADD COLUMN IF NOT EXISTS ai_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_reviewed_at timestamptz,
  -- Who set the current status/score: 'ai' or 'staff'. NULL while unreviewed.
  ADD COLUMN IF NOT EXISTS reviewed_by text;

-- Work already reviewed by staff isn't re-scored; work still waiting is.
UPDATE public.student_deliverables
SET ai_status = 'skipped', reviewed_by = 'staff'
WHERE status <> 'submitted' AND ai_status = 'pending';

CREATE INDEX IF NOT EXISTS student_deliverables_ai_status_idx
  ON public.student_deliverables (ai_status, created_at);

-- 2. Students can add and edit their own work, but not its review. Before
--    this, a student could set their own status and score through the API.
--    Staff (with their session) and server code (service key, no auth.uid())
--    are not limited.
CREATE OR REPLACE FUNCTION public.guard_student_deliverable_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL OR public.is_staff(uid) THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'submitted';
    NEW.score := NULL;
    NEW.reviewer_note := NULL;
    NEW.reviewed_at := NULL;
    NEW.reviewed_by := NULL;
    NEW.ai_status := 'pending';
    NEW.ai_score := NULL;
    NEW.ai_verdict := NULL;
    NEW.ai_feedback := NULL;
    NEW.ai_confidence := NULL;
    NEW.ai_attempts := 0;
    NEW.ai_reviewed_at := NULL;
  ELSE
    NEW.status := OLD.status;
    NEW.score := OLD.score;
    NEW.reviewer_note := OLD.reviewer_note;
    NEW.reviewed_at := OLD.reviewed_at;
    NEW.reviewed_by := OLD.reviewed_by;
    NEW.ai_score := OLD.ai_score;
    NEW.ai_verdict := OLD.ai_verdict;
    NEW.ai_feedback := OLD.ai_feedback;
    NEW.ai_confidence := OLD.ai_confidence;
    NEW.ai_attempts := OLD.ai_attempts;
    NEW.ai_reviewed_at := OLD.ai_reviewed_at;
    -- An edited submission goes back to the AI for a fresh look.
    NEW.ai_status := CASE
      WHEN OLD.ai_status IN ('needs_staff', 'failed')
        AND (NEW.title, NEW.proof_url, NEW.summary) IS DISTINCT FROM (OLD.title, OLD.proof_url, OLD.summary)
      THEN 'pending'
      ELSE OLD.ai_status
    END;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_student_deliverable_review ON public.student_deliverables;
CREATE TRIGGER guard_student_deliverable_review
  BEFORE INSERT OR UPDATE ON public.student_deliverables
  FOR EACH ROW EXECUTE FUNCTION public.guard_student_deliverable_review();

-- 3. Safety net: every 5 minutes, score anything the instant review missed
--    (student closed the page, AI timed out). Each run handles at most 10.
INSERT INTO public.cron_secrets (job, secret)
VALUES ('ai-work-review', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''))
ON CONFLICT (job) DO NOTHING;

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule('ai-work-review') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'ai-work-review');

SELECT cron.schedule(
  'ai-work-review',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://techfaculty.ng/api/ai-work-review',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (SELECT secret FROM public.cron_secrets WHERE job = 'ai-work-review')
    ),
    body := '{"trigger": "cron"}'::jsonb,
    timeout_milliseconds := 120000
  ) as request_id;
  $$
);
