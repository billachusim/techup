# Two new social media roles on /careers

## Roles to publish
Both roles: client "Confidential client" (shown as a client project managed by Tech Faculty), category "Social media", **Hybrid: two days a week at Tech Faculty HQ in Nnewi, other days remote**, auto-match on at 75%. Each description is used word for word (About the work, What you'll do, You'll do well if you, How to apply), plus one added line under About the work: "This is a hybrid role: two days a week at Tech Faculty HQ in Nnewi, the other days remote." Location shows as "Nnewi, Nigeria · Remote friendly" and the cards show a "Hybrid" badge instead of "Remote".

1. **Social Media Platform Intern** — `/careers` link: `https://techfaculty.ng/talent/roles/social-media-platform-intern`
   - Internship, 20 openings, entry level
   - Pay: "₦20,000 per week if all assigned tasks are complete, or ₦5,000 per completed day task (posting + engagement for that day)"
   - Skills: Social media, CapCut, Canva, Copywriting, TikTok, Instagram
2. **Social Media Manager** — `https://techfaculty.ng/talent/roles/social-media-manager-ai-brands`
   - Contract, 2 openings, mid level
   - Pay: "Monthly, to be agreed" (no range)
   - Skills: Social media management, Team leadership, AI image tools, AI video tools, Content strategy, Slack

## One small addition needed
Roles today can only show pay as a number range (for example "₦100,000 – ₦300,000 / month"). Neither role's pay fits that, so I'll add an optional **pay wording** field:
- When it's filled in, role cards and role pages show that wording instead of the range.
- It's in the admin role form, so you can use it for future roles too.
- Roles that already exist stay exactly the same.

For the intern role I'll also save ₦20,000/week as the number behind the scenes, so Google job listings still show a pay figure. The manager role has no number, so it won't show one there.

## After publishing
- Both roles appear on /careers and auto-matching runs straight away. Any talent scoring 75% or more is matched and emailed.
- Check both pages in the preview, then give you the two live links. They go live once you publish.

## Technical details
- Migration: `talent_roles.pay_text text` (nullable).
- `formatBudget` returns `pay_text` when set; the admin create form gets a "Pay wording (optional)" input.
- `roleBadges` shows "Hybrid" instead of "Remote" when a role has a city and is remote-friendly.
- Insert both rows via data tool: role_kind `client`, company "Confidential client", country Nigeria, city Nnewi, is_remote true (hybrid), employment_type `internship` / `contract`, seniority `entry` / `mid`, status `published`, auto_match_threshold 75, summary one line each mentioning "Hybrid, 2 days at HQ", responsibilities = the "What you'll do" bullets, nice_to_have includes "Nigerian Pidgin" for the intern; intern budget_min = budget_max = 20000 NGN WEEK.
- Then call `runAutoMatch` for both role ids.
