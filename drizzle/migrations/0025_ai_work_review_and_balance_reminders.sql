-- lovable-cron-fallback-reviewed: owner explicitly requested a 5-minute safety-net sweep for AI reviews missed by the instant on-submit review; each run handles at most 10 items
ALTER TABLE public.student_deliverables
  ADD COLUMN IF NOT EXISTS ai_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS ai_score integer,
  ADD COLUMN IF NOT EXISTS ai_verdict text,
  ADD COLUMN IF NOT EXISTS ai_feedback text,
  ADD COLUMN IF NOT EXISTS ai_confidence numeric,
  ADD COLUMN IF NOT EXISTS ai_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by text;

UPDATE public.student_deliverables
SET ai_status = 'skipped', reviewed_by = 'staff'
WHERE status <> 'submitted' AND ai_status = 'pending';

CREATE INDEX IF NOT EXISTS student_deliverables_ai_status_idx
  ON public.student_deliverables (ai_status, created_at);

CREATE OR REPLACE FUNCTION public.guard_student_deliverable_review()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
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

INSERT INTO public.cron_secrets (job, secret)
VALUES ('ai-work-review', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''))
ON CONFLICT (job) DO NOTHING;

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule('ai-work-review') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'ai-work-review');
SELECT cron.schedule('ai-work-review','*/5 * * * *',
  $$ SELECT net.http_post(url := 'https://techfaculty.ng/api/ai-work-review', headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-secret', (SELECT secret FROM public.cron_secrets WHERE job = 'ai-work-review')), body := '{"trigger": "cron"}'::jsonb, timeout_milliseconds := 120000) as request_id; $$);

CREATE TABLE IF NOT EXISTS public.balance_reminders (
  enrollment_id uuid PRIMARY KEY REFERENCES public.enrollments(id) ON DELETE CASCADE,
  pay_token uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  due_soon_sent_at timestamptz,
  due_tomorrow_sent_at timestamptz,
  overdue_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON public.balance_reminders FROM anon;
GRANT SELECT ON public.balance_reminders TO authenticated;
GRANT ALL ON public.balance_reminders TO service_role;
ALTER TABLE public.balance_reminders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins read balance reminders" ON public.balance_reminders;
CREATE POLICY "Admins read balance reminders" ON public.balance_reminders
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.enrollment_payments
  ADD COLUMN IF NOT EXISTS receipt_sent_at timestamptz;