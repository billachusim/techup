
CREATE TABLE public.blog_post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug text NOT NULL,
  visitor_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_slug, visitor_id)
);

CREATE INDEX idx_blog_post_likes_slug ON public.blog_post_likes(post_slug);

GRANT SELECT, INSERT ON public.blog_post_likes TO anon;
GRANT SELECT, INSERT, DELETE ON public.blog_post_likes TO authenticated;
GRANT ALL ON public.blog_post_likes TO service_role;

ALTER TABLE public.blog_post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
  ON public.blog_post_likes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert a like"
  ON public.blog_post_likes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete their own like"
  ON public.blog_post_likes FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
