# Automated hiring: auto-matching + HR API

Nothing changes in what talent or clients see. All new controls live in /admin/talent.

## Part 1 — Automatic matching

1. **Per-role settings** in the role editor: "Auto-match threshold" (default 75%) and "Auto-match on/off". A global "Pause auto-matching" switch sits at the top of the Matches tab.
2. **Triggers**
   - A role is published (or re-published) -> score it against every open talent profile.
   - A talent profile is created or updated -> score that talent against every open role.
3. **Rules**
   - Uses the same scoring as the "Find matches" button today (keyword pre-rank + AI score).
   - Score at or above the role threshold -> match is created as "Shared with talent", exactly like a manual approval, so the existing match email (Slack + WhatsApp links) and Slack #general invite go out.
   - Never matches the same talent to the same role twice (enforced in the database too).
   - Skips roles that are closed, have applications closed, or whose openings are all filled (hired count >= openings).
   - Skips everything while the global or role switch is paused.
4. **"Auto" label** on auto-created matches in the admin list (manual ones show "Manual").
5. **Nightly rescan** at 02:00 Lagos time of all open roles against all open profiles, with results shown in the existing Scheduled Jobs health panel. AI scoring only runs on the top shortlist per role to keep cost low.

## Part 2 — HR API for your automation agent

**Location:** `https://techfaculty.ng/api/public/hr-api/...` (lives in this project's Lovable Cloud backend). It is built as a server endpoint inside the app rather than a separate edge function, because that is how this project now runs all new backend code; it behaves the same for your agent.

**Security**
- Header `x-hr-api-key` checked (constant-time) against the secret `HR_API_KEY`. You enter the key yourself in a secure form; it never appears in chat. Anything else -> 401.
- No delete endpoints. Never returns passwords, tokens or payment details.
- Every call logged to a new HR API audit log (endpoint, time, status, changes) shown as an "HR API log" tab in admin.
- 60 requests/minute limit, counted from that audit log (simple approach; the platform has no built-in rate limiter).

**Read (JSON, `?page=&limit=` pagination)**
- `GET /roles?status=open` — id, slug, title, client name + brief, engagement type, budget, timeline (deadline), openings, openings filled, threshold, manager.
- `GET /matches?role_id=&status=&since=` — id, role id, talent id, score, status, created at, auto/manual.
- `GET /applications?role_id=&status=&since=` — same shape.
- `GET /talents/:id` — name, email, phone/WhatsApp, Faculty ID, skills, CV link (1-hour signed link), LinkedIn, availability, expected rate, Slack user id.

**Write**
- `POST /matches/:id/status` and `POST /applications/:id/status` `{ status, note }` — statuses: matched, shortlisted, interview_invited, assessment_invited, interviewed, selected, offer_sent, hired, onboarded, declined, unresponsive. Admin shows these with clear labels; existing stages keep working and existing stage emails still fire where they apply (e.g. hired). "Selected" adds the talent to the project Slack channel as today.
- `POST /emails/send` `{ talent_id, template, variables }` — sends from noreply@alerts.techfaculty.ng. New templates: interview_invite, assessment_invite, offer, decline, reminder. Subject and body text editable in a new "Email templates" admin tab, with `{{variable}}` placeholders.
- `POST /roles/:id/manager` `{ manager_user_id }` — must be a staff account.
- `POST /notes` `{ talent_id, role_id, text }` — saved to the talent's record and shown on the talent card in admin.

## After building
- I'll open the secure form for `HR_API_KEY`, then reply with the full base URL. The endpoint goes live once you publish.
- Tests for: threshold rule, no-duplicate rule, closed/full role skip, bad key -> 401, disallowed status rejected.

## Technical details
- Migration: `talent_roles` add `auto_match_threshold int default 75`, `auto_match_enabled bool default true`, `manager_user_id uuid`; `role_matches` add unique (role_id, talent_profile_id) (dedupe first), widen status list; `talent_applications` widen status list; new tables `marketplace_settings` (global pause), `hr_api_audit`, `talent_notes`, `email_template_overrides` — all with grants + staff-only RLS.
- Shared scoring moved into `src/lib/matching.server.ts`; `match-talent` edge function kept for the button or switched to call the same logic.
- Triggers: server function called after role publish / profile save (fire-and-forget), plus managed HTTP schedule `/api/public/jobs/auto-match` nightly with `authenticateCronRequest`.
- HR API: one splat server route `src/routes/api/public/hr-api.$.ts`, Zod-validated, supabaseAdmin after key check.
