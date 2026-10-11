DROP POLICY IF EXISTS "Anyone can insert a like" ON public.blog_post_likes;
CREATE POLICY "Anyone can insert a valid like" ON public.blog_post_likes FOR INSERT TO anon, authenticated
WITH CHECK (
  (user_id IS NULL OR user_id = auth.uid())
  AND length(post_slug) BETWEEN 1 AND 200
  AND length(visitor_id) BETWEEN 8 AND 100
);

DROP POLICY IF EXISTS "Anyone can submit a brief" ON public.business_briefs;
CREATE POLICY "Anyone can submit a valid brief" ON public.business_briefs FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'new'
  AND length(btrim(company)) BETWEEN 1 AND 160
  AND length(btrim(contact_name)) BETWEEN 1 AND 120
  AND length(btrim(phone)) BETWEEN 5 AND 40
  AND length(btrim(project_title)) BETWEEN 1 AND 160
  AND length(btrim(description)) BETWEEN 1 AND 4000
  AND (email IS NULL OR length(email) <= 254)
  AND coalesce(array_length(skills_needed, 1), 0) <= 30
);