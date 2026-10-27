-- Follow-up emails for new leads: up to three emails, 1, 3 and 7 days after an
-- enquiry, sent by the site route /api/lead-followups (src/lib/lead-followups.server.ts).
-- One row per email address, so a person who fills in several forms gets one sequence.

CREATE TABLE IF NOT EXISTS public.lead_email_followups (
  email text PRIMARY KEY,                -- lower-cased
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  interest text NOT NULL,
  name text,
  lead_created_at timestamptz NOT NULL,
  steps_sent integer NOT NULL DEFAULT 0,
  next_due_at timestamptz,
  last_sent_at timestamptz,
  -- Set when the sequence ends: completed, lead_closed, enrolled, suppressed or unsubscribed.
  stopped_at timestamptz,
  stop_reason text,
  unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lead_email_followups_due_idx
  ON public.lead_email_followups (next_due_at) WHERE stopped_at IS NULL;
CREATE INDEX IF NOT EXISTS lead_email_followups_lead_idx
  ON public.lead_email_followups (lead_id);

ALTER TABLE public.lead_email_followups ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.lead_email_followups FROM anon, authenticated;
GRANT ALL ON public.lead_email_followups TO service_role;

-- The leads inbox shows where each lead's emails are up to. Admins read only.
GRANT SELECT ON public.lead_email_followups TO authenticated;
DROP POLICY IF EXISTS "Admins can read lead follow-ups" ON public.lead_email_followups;
CREATE POLICY "Admins can read lead follow-ups" ON public.lead_email_followups
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Every hour at :20. The site only sends between 08:00 and 20:00 Lagos time.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule('lead-email-followups') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'lead-email-followups');

SELECT cron.schedule(
  'lead-email-followups',
  '20 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://techfaculty.ng/api/lead-followups',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb
  ) as request_id;
  $$
);
