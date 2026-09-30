CREATE TABLE public.student_class_briefings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  class_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, class_key)
);
GRANT ALL ON public.student_class_briefings TO service_role;
ALTER TABLE public.student_class_briefings ENABLE ROW LEVEL SECURITY;