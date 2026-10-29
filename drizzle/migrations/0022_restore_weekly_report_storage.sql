-- Restore the storage required by the current weekly-report code without changing scheduling or talent permissions.
CREATE TABLE IF NOT EXISTS public.admin_weekly_report_sends (
  week_of date PRIMARY KEY,
  report jsonb NOT NULL DEFAULT '{}'::jsonb,
  sent_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.admin_weekly_report_sends TO service_role;
REVOKE ALL ON public.admin_weekly_report_sends FROM anon, authenticated;
ALTER TABLE public.admin_weekly_report_sends ENABLE ROW LEVEL SECURITY;