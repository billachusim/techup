ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS status_updated_at timestamptz;
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('new', 'contacted', 'enrolled', 'not_interested'));
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);
GRANT SELECT ON public.leads TO authenticated;
GRANT UPDATE (status, status_updated_at) ON public.leads TO authenticated;
DROP POLICY IF EXISTS "Admins can read leads" ON public.leads;
CREATE POLICY "Admins can read leads" ON public.leads
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update lead status" ON public.leads;
CREATE POLICY "Admins can update lead status" ON public.leads
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.graduate_review_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  certificate_number text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.graduate_review_requests TO service_role;
ALTER TABLE public.graduate_review_requests ENABLE ROW LEVEL SECURITY;