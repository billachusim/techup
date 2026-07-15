# Add authenticated MCP write tools

Upgrade the existing public `tech-faculty-mcp` server so signed-in Tech Faculty users can perform real actions from ChatGPT / Claude / Cursor. Public read tools stay as-is; write tools require the caller to sign in as a Tech Faculty user, and every action runs under that user's RLS.

## Auth path

Use Supabase OAuth 2.1 (managed) as the authorization server. `@lovable.dev/mcp-js` verifies bearer tokens; each write tool forwards the raw token to Supabase so RLS runs as the caller.

1. Activate managed OAuth server (`supabase--configure_oauth_server`, no params).
2. Add consent route at `/.lovable/oauth/consent` (new `src/pages/OAuthConsent.tsx`, wired into `src/App.tsx`). Uses existing `supabase.auth.oauth.{getAuthorizationDetails,approveAuthorization,denyAuthorization}` with a local typed wrapper if the beta namespace isn't in types. Preserves `next` across email login, signup (`emailRedirectTo`), and Google (`redirect_uri`) — the existing `LoginForm` / `SignupForm` need a small update to read `?next=` and forward it.
3. Update `src/lib/mcp/index.ts` to add `auth: auth.oauth.issuer({ issuer: \`https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/auth/v1\`, acceptedAudiences: "authenticated" })`.

## New authenticated tools (all under `src/lib/mcp/tools/`)

Each uses `ctx.isAuthenticated()` + `ctx.getUserId()` + `ctx.getToken()` and creates a per-request Supabase client with `Authorization: Bearer <token>` so RLS applies as the caller.

| Tool | Purpose | Table(s) |
|------|---------|----------|
| `like_blog_post` | Like a post as the signed-in user (idempotent — no-op if already liked). | `blog_post_likes` |
| `unlike_blog_post` | Remove the caller's like. | `blog_post_likes` |
| `get_my_profile` | Return the caller's profile (faculty_id, name, email, phone, department, learning_mode, cohort). | `profiles` |
| `update_my_profile` | Update caller's own `name` / `phone` (never `faculty_id` or `id`). | `profiles` |
| `list_my_enrollments` | Caller's plan enrollments with status + coupon. | `enrollments` |
| `list_my_courses` | Caller's course enrollments joined with course name and progress %. | `course_enrollments`, `courses`, `course_progress` |
| `list_my_certificates` | Caller's certificates with number, course name, date. | `certificates` |
| `list_my_upcoming_classes` | Upcoming `lectures` for courses the caller is enrolled in. | `lectures`, `course_enrollments` |

All write tools set `annotations.readOnlyHint: false`; likes/updates also set `idempotentHint: true` where true. Read-my-* tools set `readOnlyHint: true`.

Explicitly NOT included (out of scope / higher risk): creating enrollments/payments, issuing certificates, admin actions, deleting profile, faculty_id changes. Public tools (`list_blog_posts`, `get_blog_post`, `search_blog`, `list_departments`, `list_services`, `list_campuses`, `list_blog_categories`) stay unauthenticated.

## RLS check

Existing policies on `profiles`, `enrollments`, `course_enrollments`, `course_progress`, `certificates`, `blog_post_likes`, `lectures` already scope by `auth.uid()` / `faculty_id`. No migration needed unless a policy check reveals a gap — I'll `supabase--read_query` the policies once before wiring each tool and only migrate if a needed policy is missing (e.g. lectures visibility for enrolled users).

## Files

- edit `vite.config.ts` — no change (mcpPlugin already wired)
- edit `src/lib/mcp/index.ts` — add `auth` + register new tools
- add `src/lib/mcp/tools/like_blog_post.ts`, `unlike_blog_post.ts`, `get_my_profile.ts`, `update_my_profile.ts`, `list_my_enrollments.ts`, `list_my_courses.ts`, `list_my_certificates.ts`, `list_my_upcoming_classes.ts`
- add `src/lib/mcp/_shared/supabaseForUser.ts` — small helper
- add `src/pages/OAuthConsent.tsx` and route it in `src/App.tsx` at `/.lovable/oauth/consent`
- edit `src/components/Auth/LoginForm.tsx` + `SignupForm.tsx` — honor `?next=` for OAuth consent return
- run `app_mcp_server--extract_mcp_manifest` then `supabase--deploy_edge_functions` for `mcp`
- run `supabase--configure_oauth_server`

## Result

Public discovery + read tools remain callable by anyone. Any tool that touches a user account or per-user data requires OAuth sign-in; the endpoint stays `https://flxwtwzjslufglpwfjdx.supabase.co/functions/v1/mcp`, and clients like ChatGPT/Claude will walk the user through Tech Faculty login before the first authenticated call.