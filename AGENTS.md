# Agent rules
- Matching rules live in `src/lib/matching.ts` (pure, tested) and run server-side via `src/lib/matching.server.ts`; match emails/Slack go through `src/lib/match-slack.server.ts` — one code path for manual, auto and HR API changes.
- The HR automation API is a TanStack server route (`/api/public/hr-api/*`), not an edge function; it checks `x-hr-api-key` and writes every call to `hr_api_audit`, which also backs its rate limit.
