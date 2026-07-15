# Expose Tech Faculty as a public MCP server

Note on access: You chose **Public — no login**. That means anyone on the internet who connects the server (ChatGPT, Claude, Cursor, etc.) can call these tools and read the returned data without signing in. I'll therefore only expose intentionally-public content — the blog, course catalog, departments, campuses, and public like counts. Nothing tied to a user (profiles, enrollments, progress, faculty IDs, certificates, orders) will be included.

## Install

Add `@lovable.dev/mcp-js` and `zod` (zod is already used in the app).

## Files to author

- `src/lib/mcp/index.ts` — `defineMcp({ name: "tech-faculty-mcp", title: "Tech Faculty", version: "0.1.0", instructions, tools: [...] })`. No `auth`. Import-safe (no env reads at top level).
- `src/lib/mcp/tools/list_departments.ts` — returns the departments/tracks from `src/data` (Web, Mobile, Cloud, Data, AI, Cybersecurity, Design, Marketing, Custom) with descriptions and starting prices.
- `src/lib/mcp/tools/list_blog_posts.ts` — inputs: `category?`, `limit?`, `offset?`. Returns slug, title, excerpt, date, category, read time, and public like count (from `blog_post_likes`, `anon` read).
- `src/lib/mcp/tools/get_blog_post.ts` — input: `slug`. Returns full post content (markdown), metadata, and like count.
- `src/lib/mcp/tools/search_blog.ts` — input: `query`, `limit?`. Simple case-insensitive match over title/excerpt/tags.
- `src/lib/mcp/tools/list_blog_categories.ts` — returns categories from `src/data/blogCategories.ts`.
- `src/lib/mcp/tools/list_campuses.ts` — returns physical campus locations from `src/data/campuses.ts`.
- `src/lib/mcp/tools/list_services.ts` — returns Business Partnerships, School Collaborations, Events, SIWES with descriptions and links.

Each tool: clear `title`, one-sentence `description`, `annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false }`. Supabase reads use `SUPABASE_URL` + `SUPABASE_PUBLISHABLE_KEY` only (no service role, ever).

## Build wiring

- `vite.config.ts` — add `mcpPlugin()` from `@lovable.dev/mcp-js/stacks/supabase/vite` to the plugins array. This generates `supabase/functions/mcp/index.ts` on build (do not hand-edit).

## Deploy & register

- Run manifest extraction to populate `.lovable/mcp/manifest.json` so the More → Agent integrations panel lists the server.
- Deploy the `mcp` edge function.
- Public endpoint: `https://flxwtwzjslufglpwfjdx.supabase.co/functions/v1/mcp` — connectable from ChatGPT/Claude/Cursor as a Streamable HTTP MCP server.

## Not included (would require the OAuth path)

Enrollments, course progress, profile lookup, certificate issue/verify by user, adding likes as a user, admin actions. If you later want any of these, we'd rebuild with Supabase OAuth so each caller signs in as a real Tech Faculty user.
