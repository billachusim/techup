# Agent rules
- Article social images use the public read-only `/api/public/og` endpoint; shared URL generation keeps route metadata and BlogPosting schema identical, and edge-safe resvg renders bundled fonts/logo using global `--og-*` tokens without runtime filesystem access. Static previews remain explicitly assigned to their existing routes.
- Matching rules live in `src/lib/matching.ts` (pure, tested) and run server-side via `src/lib/matching.server.ts`; match emails/Slack go through `src/lib/match-slack.server.ts` — one code path for manual, auto and HR API changes.
- The HR automation API is a TanStack server route (`/api/public/hr-api/*`), not an edge function; it checks `x-hr-api-key` and writes every call to `hr_api_audit`, which also backs its rate limit.
