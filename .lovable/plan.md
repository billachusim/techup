## Show like counts on blog cards + seed likes

**1. Fetch like counts for listings**
- In `src/pages/Blog.tsx` and `src/pages/BlogCategory.tsx`, query `blog_post_likes` grouped by `post_slug` once on mount (`select post_slug` then tally client-side, or a single `select` with `count`). Store as `Record<slug, number>`.
- Pass counts to each blog card.

**2. Show count on cards**
- Add a small heart icon + count next to the existing meta row (date / read time) on each blog card. Zero-count posts show `0` or hide — I'll show the count only when > 0 to keep cards clean.

**3. Keep BlogPost detail as-is**
- `BlogActions` already shows the count on the post page, so no change there.

**4. Seed 100 likes on latest posts**
- Insert 100 rows per slug into `blog_post_likes` with unique synthetic `visitor_id`s (e.g. `seed-{slug}-{n}`), `user_id = null`.
- Target: latest 5 posts by `date` from `src/data/blogPosts.ts` (I'll list slugs in the insert). If you'd rather seed **all** posts, say the word and I'll expand the insert.

### Technical notes
- Single Supabase query per listing page; no N+1.
- Uses existing RLS (anon SELECT allowed).
- Seed uses the insert tool (data-only, no schema change).
