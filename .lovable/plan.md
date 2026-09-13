# Talent marketplace — round 2 decisions

Your answers turn the talent pool into a public showcase, add a project workflow (match → assessment → WhatsApp group → paid work), and make applying one click for signed-in members.

## 1. Public talent directory (names shown, contacts hidden)

- New public page `/talent/pool` (linked from Careers and `/hire`): searchable, filterable list of talent — name, headline, city/country, skills, years of experience, work mode, availability, vetted badge, profile strength.
- Never public: phone, WhatsApp, email, CV file, admin notes. Clients see a "Request an introduction" button that opens our WhatsApp with the talent's name and skills prefilled, so all contact runs through us.
- Public profile page `/talent/pool/:id` with the same safe fields plus bio, tools, LinkedIn/GitHub/portfolio links.
- Only profiles the talent has marked open to work and that pass a minimum completeness bar appear publicly; a switch on the dashboard lets anyone hide themselves from the directory.

## 2. Badges and status on a profile

- **Client interested** — set by you in admin when a business asks about that person; visible on their own dashboard and on the public card.
- **Matched to a project** — shown automatically once a match is approved, with the role title.
- **Working / earning** — shown once you mark the talent as started on a role.
- Vetted badge stays admin-only.

## 3. Assessment and reach-out

- Approved matches on the dashboard and on each role page get a "Reach out to the project manager" button that opens our WhatsApp with the role and their name prefilled, plus the note: *if you have not heard back in two days, message us*.
- Admin gets, per role: number matched, number accepted, number in assessment, number hired — with a per-person contact button (WhatsApp) and a status control (matched → assessment → interview → hired / not selected).

## 4. Project WhatsApp group

- Each role gets an admin-only WhatsApp group link field.
- Once a match is approved and the group link exists, the talent sees a "Join the project group" button on their dashboard and on that role's page. Everyone else sees nothing — the link is only readable by matched talent and staff.

## 5. Payments (tracked, paid off-platform)

- Money still moves over WhatsApp. In admin you record, per engagement: weekly amount, currency, start date, status (active / paused / ended), and optional note.
- The talent sees their current engagement on the dashboard: role, weekly amount, start date, status, and total weeks so far. No payment claims are shown publicly.

## 6. One-click apply for signed-in members

- On every Tech Faculty and client role, a signed-in member with a profile sees "Apply with my Faculty profile" — one click creates the application, no form.
- Not signed in → sign-in prompt. Signed in without a profile → straight to the profile builder, returning to the role afterwards.
- External platform listings keep their existing two-step referral flow; one-click applies only to our own roles.

## Technical notes

- Database: add `whatsapp_group_url` to `talent_roles`; add `is_client_interested`, `client_interest_note`, `is_public` to `talent_profiles`; new `talent_engagements` table (talent, role, weekly amount, currency, start/end date, status, note) with staff-write / own-read RLS.
- Public directory reads through a security-definer function returning only safe columns, so contact details and CVs are never exposed to `anon`. Group links are read via a function gated on an approved match or staff role.
- Match status vocabulary extended with `assessment` and `interview`; `talent_applications` gains the same stages so admin counts come from one place.
- Admin work lands in `src/pages/AdminTalent.tsx` (role editor gains the group link, matches table gains stage + contact + engagement controls); talent-side changes in `TalentDashboard.tsx`, `TalentRoleDetail.tsx`, `Careers.tsx`; new `TalentPool.tsx` and `TalentPublicProfile.tsx`.
- SEO: `/talent/pool` and public profiles indexable with metadata and Person JSON-LD; dashboards stay noindex.
