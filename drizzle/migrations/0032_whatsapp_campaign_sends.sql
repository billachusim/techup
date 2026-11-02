CREATE TABLE public.whatsapp_campaign_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign text NOT NULL,
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  segment text NOT NULL,
  template_name text NOT NULL,
  phone text NOT NULL,
  status text NOT NULL DEFAULT 'sending',
  message_id uuid,
  error text,
  sent_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (campaign, lead_id)
);
GRANT SELECT ON public.whatsapp_campaign_sends TO authenticated;
GRANT ALL ON public.whatsapp_campaign_sends TO service_role;
ALTER TABLE public.whatsapp_campaign_sends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read campaign sends" ON public.whatsapp_campaign_sends
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));