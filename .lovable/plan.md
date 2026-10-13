# Optional City / State at sign-up

## About Google sign-in
Google does not share a person's city or state, only name, email and photo. To get a location from Google sign-ups, we have to ask once inside the app.

## What changes
1. **Email sign-up form**: add one optional "City / State" box under Full name (example: "Nnewi, Anambra"). No new required fields.
2. **Google sign-ups and older accounts**: on the student dashboard, show a small one-line card, "Where are you based?", with a City / State box and Save. It has a "Skip" option and disappears once filled or skipped, so it adds no extra step to sign-in.
3. **Admin**: show the student's location next to their name and email on the Students page, and include it in search.

## Technical details
- Migration: add `location text` (max 160 chars) to `public.profiles`. Update the signup trigger so it copies `raw_user_meta_data->>'location'` into the profile, trimmed, with blanks saved as empty.
- SignupForm passes `location` in `options.data` with the existing `full_name`.
- Dashboard prompt updates the user's own profile row (existing own-row update policy). "Skip" is remembered in the browser.
- `student-review.functions.ts` and AdminStudents return and show `location`.
- Test the signup trigger with and without a location so sign-up cannot break.
