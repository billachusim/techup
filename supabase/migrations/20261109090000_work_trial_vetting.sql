-- Work trial before selection (Bill, 2026-11-09).
-- A role can ask matched talent to submit 1-2 pieces of work over 1-2 weeks
-- before staff confirm or reject their selection. Trial work goes through the
-- talent_deliverables table (first built 2026-09-21 as a weekly work log for
-- selected talent; from now on it is used only for trial work).

-- 1. Role settings: 0 works = no trial.
ALTER TABLE public.talent_roles
  ADD COLUMN IF NOT EXISTS work_trial_works integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS work_trial_days integer NOT NULL DEFAULT 14,
  ADD COLUMN IF NOT EXISTS trial_brief text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'talent_roles_work_trial_works_range') THEN
    ALTER TABLE public.talent_roles ADD CONSTRAINT talent_roles_work_trial_works_range CHECK (work_trial_works BETWEEN 0 AND 3);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'talent_roles_work_trial_days_range') THEN
    ALTER TABLE public.talent_roles ADD CONSTRAINT talent_roles_work_trial_days_range CHECK (work_trial_days BETWEEN 3 AND 28);
  END IF;
END $$;

-- 2. Match trial dates.
ALTER TABLE public.role_matches
  ADD COLUMN IF NOT EXISTS trial_started_at timestamptz,
  ADD COLUMN IF NOT EXISTS trial_due_at timestamptz;

-- Any old CHECK on role_matches.status that does not know 'trial' would block the new stage.
DO $$
DECLARE c record;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.role_matches'::regclass AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%status%'
      AND pg_get_constraintdef(oid) NOT ILIKE '%trial%'
  LOOP
    EXECUTE format('ALTER TABLE public.role_matches DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

-- 3. When talent say "I am interested" on a trial role, they start the trial
--    instead of being selected. Staff and the HR API (service role) can still
--    set 'accepted' directly, which is how a trial is confirmed.
CREATE OR REPLACE FUNCTION public.role_match_work_trial()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _works integer;
  _days integer;
BEGIN
  SELECT r.work_trial_works, r.work_trial_days INTO _works, _days
  FROM public.talent_roles r WHERE r.id = NEW.role_id;

  IF NEW.status = 'accepted'
     AND OLD.status IS DISTINCT FROM 'accepted'
     AND OLD.status IS DISTINCT FROM 'trial'
     AND COALESCE(_works, 0) > 0
     AND auth.uid() IS NOT NULL
     AND NOT public.is_staff(auth.uid()) THEN
    NEW.status := 'trial';
  END IF;

  IF NEW.status = 'trial' AND NEW.trial_started_at IS NULL THEN
    NEW.trial_started_at := now();
    NEW.trial_due_at := now() + make_interval(days => COALESCE(_days, 14));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS role_match_work_trial ON public.role_matches;
CREATE TRIGGER role_match_work_trial
BEFORE UPDATE ON public.role_matches
FOR EACH ROW EXECUTE FUNCTION public.role_match_work_trial();

-- 4. Talent keep seeing their match at every later stage (it used to vanish
--    from their dashboard after "accepted"), and may move it into 'trial'.
DROP POLICY IF EXISTS "Talent can view own approved matches" ON public.role_matches;
CREATE POLICY "Talent can view own approved matches" ON public.role_matches
  FOR SELECT TO authenticated USING (
    status <> 'suggested'
    AND EXISTS (SELECT 1 FROM public.talent_profiles p WHERE p.id = talent_profile_id AND p.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Talent can respond to own matches" ON public.role_matches;
CREATE POLICY "Talent can respond to own matches" ON public.role_matches
  FOR UPDATE TO authenticated USING (
    status IN ('approved','accepted','declined')
    AND EXISTS (SELECT 1 FROM public.talent_profiles p WHERE p.id = talent_profile_id AND p.user_id = auth.uid())
  ) WITH CHECK (
    status IN ('approved','accepted','declined','trial')
    AND EXISTS (SELECT 1 FROM public.talent_profiles p WHERE p.id = talent_profile_id AND p.user_id = auth.uid())
  );

-- 5. Trial talent get the project workspace (brief, files). Work submissions
--    are for the trial only: once selected, staff work runs on Slack (Bill).
CREATE OR REPLACE FUNCTION public.get_project_workspace(_role_id uuid)
 RETURNS TABLE(role_id uuid, whatsapp_group_url text, slack_channel_url text, task_board_url text, drive_url text, project_brief text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT r.id, r.whatsapp_group_url, r.slack_channel_url, r.task_board_url, r.drive_url, r.project_brief
  FROM public.talent_roles r
  WHERE r.id = _role_id
    AND (
      public.is_staff(auth.uid())
      OR EXISTS (
        SELECT 1
        FROM public.role_matches m
        JOIN public.talent_profiles p ON p.id = m.talent_profile_id
        WHERE m.role_id = r.id
          AND p.user_id = auth.uid()
          AND m.status IN ('approved','accepted','trial','assessment','interview','hired','onboarded')
      )
    )
  LIMIT 1;
$function$;

DROP POLICY IF EXISTS "Talent log own deliverables" ON public.talent_deliverables;
CREATE POLICY "Talent log own deliverables"
ON public.talent_deliverables FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.talent_profiles p WHERE p.id = talent_profile_id AND p.user_id = auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.role_matches m
    JOIN public.talent_profiles p2 ON p2.id = m.talent_profile_id
    WHERE m.role_id = talent_deliverables.role_id
      AND p2.user_id = auth.uid()
      AND m.status = 'trial'
  )
);
