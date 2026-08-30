# WhatsApp-gated free checklist download

Keep the WhatsApp lead flow, but let students unlock the PDF themselves in seconds — no admin sending files manually.

## New flow (free checklist only)

```text
Step 1  Fill form (name, school, email/WhatsApp)  ->  lead saved as today
Step 2  "Message us on WhatsApp to unlock"  ->  taps green button
        (opens WhatsApp with pre-filled message + save-our-number prompt)
Step 3  Returns to page -> download button now visible & active
```

The download button stays hidden until the WhatsApp button is tapped. Once tapped, the unlock is remembered on that device, so a student who closes the tab and comes back still has the download.

## Details

- Step 2 card explains: "Send us the pre-filled message (and save our number) — your download unlocks right after." Includes the number in plain text so they can save it, plus a "Copy number" action.
- Pre-filled WhatsApp message identifies the request, e.g. "Hello Tech Faculty, I'd like the free SIWES Placement Checklist. Name: <name>, School: <school>." — so you get a real, qualified WhatsApp lead every time.
- After tapping, a short "Unlocking..." beat, then the Download the checklist (PDF) button appears with a small note: "Didn't get WhatsApp to open? Tap here" fallback link so nobody is locked out (accessibility + desktop-without-WhatsApp safety).
- Desktop uses the same wa.me link (opens WhatsApp Web), so behaviour is consistent.
- Every other form (kit, virtual SIWES, logbook, placement, partner) keeps its current behaviour — unchanged.

## Tracking

- The click on the WhatsApp unlock button updates that lead's notes with a "WhatsApp unlock clicked" marker, so you can tell in the leads table who actually messaged versus who only filled the form.

## Technical notes

- All changes in `src/components/leads/LeadCaptureForm.tsx`: replace the current `status === "done"` branch for `interest === "free_checklist"` with a two-stage success state (`awaiting_whatsapp` -> `unlocked`), gated by local state plus a `localStorage` key (`tf_checklist_unlocked`).
- Unlock marker written back via a Supabase update on the inserted lead row (capture the inserted id with `.select("id").single()`), guarded so a failed update never blocks the download.
- Mobile tested in the preview; no schema or migration changes needed.
