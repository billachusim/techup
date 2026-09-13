# Faculty IDs for students and vetted talents

Faculty ID becomes a badge of belonging, not a signup requirement. Anyone can create an account with just name, email and password. An ID is issued in three ways: automatically when someone enrols in a programme, when you approve someone as a talent, or manually by you (from the admin page or by asking me).

## How it will work

**Signing in** — unchanged: name, email, password, or Google. No Faculty ID asked for, no ID issued.

**Students** — enrolling in a programme issues an ID automatically, in the existing format (department, learning mode, cohort, sequence). It shows on the student dashboard as it does today.

**Talents** — submitting a talent profile does not issue an ID. On the admin talent page, an "Approve as talent" action marks the person vetted and issues a Faculty ID at the same time. The ID then appears on their talent profile page and on the public directory card as a small verified line.

**Admin issuance** — on the admin talent page, each person gets an "Issue Faculty ID" control, so you can assign one without going through approval. I can also assign IDs on request in chat.

**Where the ID shows**
- Students: dashboard (as now)
- Talents: `/talent/profile` and their public profile
- Careers page: shown when the signed-in person has one, otherwise a short line explaining how to get one

## Seeding the talents from your clean list

Your clean list has 29 responses covering 27 people — Ogbonnaya Favour Chioma and Udeaja Chioma Lydia each submitted twice. I will:

1. Keep the most recent response for those two, so 27 profiles are created.
2. Create a vetted, public profile for each: name, email, phone/WhatsApp, location, track, tools, expertise level, weekly hours, preferred project role, goal, and their LinkedIn / portfolio / GitHub links (each link filed under the right heading).
3. Issue each one a Faculty ID from their track, online mode, and the month of their response.
4. Give you a table of who was imported with which ID so you can spot anything wrong.

Small fixes I will apply while importing: trim the stray full stop on `oge.ibe55@gmail.com.`, tidy the two phone numbers that lost or gained digits (`0090 7979 8502`, `9049385722`), keep only the first of the two numbers where someone gave two, and correct the "VidVideo Editing" typo. Two entries look off and I will flag rather than guess: "Contact writing" (likely Content writing) and one person whose track is Video editing but whose only listed tool is Python.

They will appear in the public directory immediately with the vetted badge, so businesses can find them today.

## Notes on accounts

These seeded profiles will not have login accounts yet. When one of them signs up later with the same email, their existing profile and Faculty ID attach to the new account automatically, so nothing is duplicated and nothing is lost.

## Technical notes

- `profiles.faculty_id` stays nullable; `handle_new_user` continues to attach an existing ID by email match and never generates one.
- Add a security-definer function `issue_faculty_id(_user_id uuid, _department text, _mode text)` that calls the existing `generate_faculty_id`, writes to `profiles` and upserts into `faculty_ids`. Execute granted to staff only (`is_staff`), so approval and admin issuance both route through it.
- Talent approval in `AdminTalent.tsx` sets `is_vetted`, `vetted_at`, `is_public` and calls the ID function; enrolment paths call the same function.
- Seeding runs as data inserts into `talent_profiles` and `faculty_ids` (no login accounts), with `source` set to `ntm_form` so the batch is identifiable.
- Public directory RPCs (`list_public_talent`, `get_public_talent`) gain `faculty_id` as a display-only field.
