ALTER TABLE public.talent_roles
  ADD COLUMN IF NOT EXISTS auto_match_threshold integer NOT NULL DEFAULT 75,
  ADD COLUMN IF NOT EXISTS auto_match_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS manager_user_id uuid;

CREATE TABLE public.marketplace_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  auto_match_paused boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);
GRANT SELECT, INSERT, UPDATE ON public.marketplace_settings TO authenticated;
GRANT ALL ON public.marketplace_settings TO service_role;
ALTER TABLE public.marketplace_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage marketplace settings" ON public.marketplace_settings FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.hr_api_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  method text NOT NULL,
  endpoint text NOT NULL,
  status integer NOT NULL,
  changes jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX hr_api_audit_created_idx ON public.hr_api_audit (created_at DESC);
GRANT SELECT ON public.hr_api_audit TO authenticated;
GRANT ALL ON public.hr_api_audit TO service_role;
ALTER TABLE public.hr_api_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read HR API audit" ON public.hr_api_audit FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE TABLE public.talent_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_profile_id uuid NOT NULL REFERENCES public.talent_profiles(id) ON DELETE CASCADE,
  role_id uuid REFERENCES public.talent_roles(id) ON DELETE SET NULL,
  body text NOT NULL,
  source text NOT NULL DEFAULT 'admin',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX talent_notes_talent_idx ON public.talent_notes (talent_profile_id, created_at DESC);
GRANT SELECT, INSERT ON public.talent_notes TO authenticated;
GRANT ALL ON public.talent_notes TO service_role;
ALTER TABLE public.talent_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read talent notes" ON public.talent_notes FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff add talent notes" ON public.talent_notes FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.hr_email_templates (
  key text PRIMARY KEY,
  subject text NOT NULL,
  body text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);
GRANT SELECT, INSERT, UPDATE ON public.hr_email_templates TO authenticated;
GRANT ALL ON public.hr_email_templates TO service_role;
ALTER TABLE public.hr_email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage HR email templates" ON public.hr_email_templates FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));