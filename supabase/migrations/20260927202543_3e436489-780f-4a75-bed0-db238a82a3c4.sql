ALTER TABLE public.talent_roles ADD COLUMN IF NOT EXISTS slack_channel_id text;
ALTER TABLE public.talent_profiles ADD COLUMN IF NOT EXISTS slack_user_id text;
ALTER TABLE public.talent_profiles ADD COLUMN IF NOT EXISTS slack_general_joined_at timestamp with time zone;
ALTER TABLE public.role_matches ADD COLUMN IF NOT EXISTS slack_invited_at timestamp with time zone;
ALTER TABLE public.talent_interest_requests ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone;

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
          AND m.status IN ('approved','accepted','assessment','interview','hired')
      )
    )
  LIMIT 1;
$function$;