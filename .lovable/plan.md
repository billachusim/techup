# Tech Faculty Talent — brainstorm round 1

A Mercor/Ethos-style talent marketplace for real business work, not AI annotation only. Public jobs board stays where it is; the people side gets its own home at `/talent`.

## The three sides

1. **Talent** — signs up, gets a Faculty ID, builds a profile (CV, LinkedIn, skills, availability, rate), sees roles and their own matches, applies in one click.
2. **Businesses** — submit a hiring brief on `/hire`; you approve it and it becomes a role. No client logins in this build.
3. **Admin** — a private area to add roles, review applicants, run AI matching, and publish or reject each suggested match.

## What talent sees

- `/talent` — public landing: what the pool is, who's hiring, how vetting works, "Join the talent pool" CTA.
- `/talent/dashboard` — signed-in home: profile completeness meter, my matches, my applications, availability toggle (open to work / not available).
- `/talent/profile` — the Mercor-style builder in short steps. Required: name, city, country, phone/WhatsApp, primary skills, CV upload. Optional and improvable any time: LinkedIn, GitHub/portfolio, skill levels and years, tools, hours per week, remote/on-site, expected rate (NGN or USD), short intro video link, bio. A visible "profile strength" score nudges people to finish.
- Vetted badge is admin-set only, never self-claimed.

## Matching (AI scores, you approve)

Each role stores required skills, city/remote, budget and seniority. When a role is published or a profile is updated, an AI pass scores the candidate pool against it and writes a ranked list with a short reason per candidate. Nothing reaches the talent until you approve it in the admin view; approved matches appear on the talent dashboard as "You've been matched" with an apply/accept action. You can also match anyone manually, which skips scoring entirely.

## Roles to seed at launch

- Tech Faculty in-house openings, including the growth team you described: **Marketing & Sales Representatives** and **Project Managers** who go out and sign local businesses. Location shown as Nnewi / remote-friendly.
- Existing partner roles for graduates (already on the careers page).
- Client project roles as businesses come in.

Seeding early talents: send me the Google Form export (CSV) and I'll import them as profiles with a claim link, or we invite them to `/talent` and they fill it themselves. Import is faster and lets matching work on day one.

## Admin access

The current certificate admin uses a hardcoded email and password in the code, which anyone can read. For this build I'd add a proper roles table so you can grant admin (and later a "recruiter" role) to any account by ID, with server-enforced permissions. The certificate admin then moves onto the same system.

## Careers page changes

Keep `/careers` as the SEO jobs board. Add a "Tech Faculty openings" block (your in-house roles), a "Hire our talent" strip for businesses, and a "Join the talent pool" banner into `/talent`. Partner roles stay.

## Technical notes

- New tables: `talent_profiles`, `talent_skills` (or a skills array), `roles` (internal/partner/client), `role_matches` (score, reason, status: suggested / approved / declined), `applications`, `business_briefs`, `user_roles` + `has_role()` security-definer function. RLS: talent reads and writes only its own profile and matches; admins read all; anon reads only published public roles.
- Private storage bucket for CVs, with signed URLs for admin download.
- Matching runs in an edge function via Lovable AI Gateway (Gemini flash tier), batched and cost-capped like the existing weekly crons — triggered on role publish, not per page view; results cached in `role_matches`.
- SEO: `/talent` and `/hire` get their own metadata and JSON-LD; dashboards are noindex.

## Open questions for round 2

1. Should talent profiles be publicly browsable (a searchable directory with names hidden), or private until matched?
2. Vetting: do you want an assessment or short screening call step before the vetted badge, or admin judgement only for now?
3. Payments: does the platform track project payouts to talent, or is money handled off-platform via WhatsApp for now?
4. Do you want a "1-click apply with my Faculty profile" on the scraped external jobs too, or only on Tech Faculty and client roles?
