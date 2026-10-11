-- One Google review request email per graduate, keyed by lower-cased email.
CREATE TABLE public.graduate_review_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  certificate_number text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.graduate_review_requests TO service_role;
ALTER TABLE public.graduate_review_requests ENABLE ROW LEVEL SECURITY;
