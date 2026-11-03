CREATE TABLE public.slack_assistant_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL UNIQUE,
  channel_id text NOT NULL,
  thread_ts text NOT NULL,
  user_id text,
  question text,
  answer text,
  status text NOT NULL DEFAULT 'received',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX slack_assistant_log_thread ON public.slack_assistant_log (channel_id, thread_ts);
GRANT SELECT ON public.slack_assistant_log TO authenticated;
GRANT ALL ON public.slack_assistant_log TO service_role;
ALTER TABLE public.slack_assistant_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read slack assistant log" ON public.slack_assistant_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));