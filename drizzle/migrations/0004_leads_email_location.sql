ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS email text, ADD COLUMN IF NOT EXISTS location text;
UPDATE public.leads SET email = lower(btrim(contact)) WHERE email IS NULL AND position('@' IN contact) > 0;
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT TO anon, authenticated
WITH CHECK (
  length(contact) BETWEEN 3 AND 200
  AND (name IS NULL OR length(name) <= 120)
  AND (school IS NULL OR length(school) <= 160)
  AND (notes IS NULL OR length(notes) <= 1000)
  AND (source IS NULL OR length(source) <= 200)
  AND (email IS NULL OR length(email) <= 254)
  AND (location IS NULL OR length(location) <= 160)
);