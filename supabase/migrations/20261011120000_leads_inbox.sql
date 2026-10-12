-- Leads inbox on /admin/leads: admins can read every enquiry and move it
-- through new -> contacted -> enrolled (or not_interested). Visitors can still only insert.

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS status_updated_at timestamptz;

ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('new', 'contacted', 'enrolled', 'not_interested'));

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);

-- Signed-in users get the privilege, RLS below limits it to admins.
-- UPDATE is column-scoped so the inbox can only change the status.
GRANT SELECT ON public.leads TO authenticated;
GRANT UPDATE (status, status_updated_at) ON public.leads TO authenticated;

DROP POLICY IF EXISTS "Admins can read leads" ON public.leads;
CREATE POLICY "Admins can read leads" ON public.leads
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update lead status" ON public.leads;
CREATE POLICY "Admins can update lead status" ON public.leads
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
