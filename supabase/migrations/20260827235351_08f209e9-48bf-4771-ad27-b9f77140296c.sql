CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  channel TEXT NOT NULL CHECK (channel IN ('email','whatsapp')),
  contact TEXT NOT NULL,
  school TEXT,
  interest TEXT NOT NULL CHECK (interest IN ('free_checklist','success_kit','partner_enquiry','siwes_placement')),
  source TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.leads TO anon;
GRANT INSERT ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (
  length(contact) BETWEEN 3 AND 200
  AND (name IS NULL OR length(name) <= 120)
  AND (school IS NULL OR length(school) <= 160)
  AND (notes IS NULL OR length(notes) <= 1000)
  AND (source IS NULL OR length(source) <= 200)
);

CREATE TABLE public.partner_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('internship','entry_level_job','scholarship','partner')),
  title TEXT NOT NULL,
  organisation TEXT NOT NULL,
  location TEXT,
  description TEXT NOT NULL,
  apply_url TEXT,
  deadline DATE,
  is_paid_placement BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  expires_at DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.partner_listings TO anon;
GRANT SELECT ON public.partner_listings TO authenticated;
GRANT ALL ON public.partner_listings TO service_role;

ALTER TABLE public.partner_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active listings are public" ON public.partner_listings FOR SELECT TO anon, authenticated USING (
  is_active = true AND (expires_at IS NULL OR expires_at >= CURRENT_DATE)
);

CREATE TRIGGER update_partner_listings_updated_at BEFORE UPDATE ON public.partner_listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();