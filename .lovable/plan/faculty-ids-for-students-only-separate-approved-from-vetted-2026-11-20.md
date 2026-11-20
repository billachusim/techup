# Faculty IDs for students only; separate "approved" from "vetted"

## What you want
- **Faculty ID** is only for Tech Faculty students and alumni, or one you give by hand. Talent never get one for being approved, vetted, matched or completing their profile.
- **Approved** means the talent is approved and listed. Nothing more.
- **Vetted** means the talent passed an assessment or work trial for the skill they claim.
- **The student advantage:** a student or alumnus who creates a talent profile is vetted straight away, because they have a Faculty ID.

## What we decided before, and why it still happened
- **13 Sep 2026, here on Lovable:** you chose "Talent Faculty ID: on your approval", so approving a talent gave them an ID.
- **29 Oct 2026, through Claude (PR #67):** this was changed so that IDs belong only to students and alumni, and approving never creates an ID.
- **Why it still happens:** the October change was written but never switched on in the live database. The website was updated as if it had been, but the database still runs the September rules:
  - Pressing **Approve** creates a new Faculty ID and marks the talent vetted.
  - Reaching a **100% profile** creates a new Faculty ID and marks the talent vetted.
  - The automatic approval of strong profiles (70%+) has been failing quietly, because the old rule only lets staff approve.
- **Result:** 77 talent hold a Faculty ID they got from the talent pages, 47 of them since 29 October. 3 of those later used it to register for a course.

## What changes
1. **Approve:** the talent is approved and listed. No Faculty ID and no Vetted badge, unless they are a real student or alumnus.
2. **Vetted:** staff press "Mark vetted" after an assessment or work trial is passed. Students and alumni (with a Faculty ID from registering for a course) are vetted automatically when they create or approve a talent profile.
3. **Complete profile:** this no longer creates a Faculty ID. A student's existing ID is simply linked to their talent profile.
4. **Automatic approval** of 70%+ profiles works again: approve only, no ID, no badge.
5. **Wording:** the "approved" email and the admin messages stop mentioning a Faculty ID for non-students. The talent dashboard explains how to get vetted: pass an assessment or a work trial.
6. **Manual issue:** "Issue Faculty ID" stays in Admin > Talent for the times you choose to give one by hand.

## Existing people (waiting for your answers)
- The 77 talent-page Faculty IDs: remove them or leave them. The 3 people who enrolled with theirs keep them either way.
- The 82 Vetted badges, most of which came only from pressing Approve: keep them, or remove them from people who are not students and have not passed an assessment or trial.

## Technical details
- New migration replacing `approve_talent` and `claim_talent_faculty_id`. Approval sets a new `talent_profiles.approved_at` plus `is_public`, links `profiles.faculty_id`, and sets `is_vetted` only when that ID is a real course ID (`faculty_ids.hear_about_us <> 'talent_marketplace'`). Service role may approve. `issue_talent_faculty_id` stays staff-only.
- `approved_at` is backfilled for profiles already approved. The Approve button and the auto-approve filter use `approved_at`, not `is_vetted`.
- Admin Talent toast, `talent-approved` and `profile-submitted` email copy, and TalentDashboard vetting copy are updated.
- Pure rule `isStudentFacultyId` plus a test. The functions are checked in the database after the migration.
- Clean-up of existing records runs only after you answer.
