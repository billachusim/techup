## Add Like & Share buttons to blog articles

Place a small action bar directly under the post title (and repeat at the bottom of the article) on `src/pages/BlogPost.tsx`. Works for both signed-in and signed-out visitors.

### Like button
- Available to everyone (no sign-in required).
- New table `public.blog_post_likes` stores one like per visitor per post:
  - `post_slug text`, `visitor_id text` (anonymous UUID kept in `localStorage`) OR `user_id uuid` when signed in, `created_at timestamptz`.
  - Unique constraint on `(post_slug, visitor_id)` to prevent duplicate likes from the same device.
  - RLS: anyone (anon + authenticated) can `INSERT` and `SELECT` counts; delete restricted to owner (`user_id = auth.uid()` or matching `visitor_id`).
  - Proper `GRANT`s to `anon`, `authenticated`, `service_role`.
- UI: heart icon + live count. Tapping toggles like/unlike, optimistic update, disabled during request. Liked state persisted per device via `localStorage` key `liked:{slug}`.

### Share button
- Uses the Web Share API when available (`navigator.share`) — this opens the native sheet (WhatsApp, iMessage, etc.) on mobile.
- Fallback for desktop/unsupported browsers: dropdown menu with:
  - "Share on WhatsApp" → `https://wa.me/?text=<title>%20<url>` (works on desktop WhatsApp + mobile deep link).
  - "Copy link" → `navigator.clipboard.writeText(url)` with toast confirmation.
- Share payload uses `post.title`, `post.description`, and the canonical URL `https://techfaculty.ng/blog/{slug}`.

### Files
- New migration: create `blog_post_likes` table with grants + RLS policies.
- New component `src/components/BlogActions.tsx` — encapsulates like + share UI, fetches count via Supabase client.
- Edit `src/pages/BlogPost.tsx` — render `<BlogActions post={post} />` under the title and again after the content.

### Notes
- No auth wall; anonymous visitor ID generated client-side (UUID v4) and persisted.
- Lucide icons: `Heart`, `Share2`, `MessageCircle` (WhatsApp representation), `Link` (copy).
- Toasts via existing `sonner` setup.
