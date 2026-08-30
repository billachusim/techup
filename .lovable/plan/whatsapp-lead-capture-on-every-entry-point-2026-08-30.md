# WhatsApp lead capture on every entry point

Goal: stop losing anonymous traffic. Today "Join Community" sends visitors straight to the group invite — nothing lands in the leads table and you never get their number. This plan puts a light capture step in front of every WhatsApp action and adds a persistent chat entry point.

## 1. Gate the community join with a 20-second form

Any "Join Community" / "Join WhatsApp" button opens a small dialog first:

```text
Join the Tech Faculty community
  Name            [ Chisom Okeke        ]
  WhatsApp number [ 0803 000 0000       ]
  City / State    [ Onitsha, Anambra    ]  (dropdown of our campus cities + "Other")
  Interest        [ optional chips: SIWES, AI, Web Dev, Jobs, Store ]
                     [ Join the community on WhatsApp ]
  "Already a member? Open the group"  (small link, no form needed)
```

- Submit saves the lead, then immediately opens the group invite (mobile) or the existing QR/desktop dialog — the current desktop-safe behaviour is preserved.
- Returning visitors who already submitted skip the form (remembered on their device) and go straight to the group.
- Small "Already a member?" escape link so we never block a real member.

## 2. Two-way contact, not just a group join

After submitting, the dialog shows a short confirmation strip with:
- Save our number — a one-tap contact card download (.vcf) so we land in their phone book, plus the number in plain text with Copy.
- Say hi on WhatsApp — a wa.me link with a pre-filled message containing their name and city, so their number hits our WhatsApp inbox as a real chat (this is the only way we get their contact device-side).
- Join the group — the invite link.

Tapping "Say hi" is recorded so you can tell in the leads table who actually messaged versus who only joined the group.

## 3. Floating WhatsApp chat button (site-wide)

A small floating WhatsApp bubble bottom-right on every page. Tapping it opens a compact panel, not a raw link:

```text
Chat with Tech Faculty                     [x]
"Hi! Tell us who we're speaking with and
 we'll reply on WhatsApp in minutes."
  Name            [ ... ]
  WhatsApp number [ ... ]
  What do you need?  [ SIWES | Courses | Jobs | Store | Something else ]
                 [ Start the chat on WhatsApp ]
Mon-Sat, 9am-6pm WAT. Typically replies within an hour.
```

- Saves the lead, then opens WhatsApp with a pre-filled message built from their answers, so the very first message we receive already contains name, city and intent — the "automated first questions" you described, without needing a bot.
- Hidden on very small heights and dismissible for the session so it never covers content or the mobile nav.
- No auto-popup on load; it can gently pulse once after ~15 seconds of scrolling on the homepage.

Recommendation on a bot: skip a WhatsApp bot for now. It needs the WhatsApp Business Cloud API, a verified business, and a per-message cost, and the pre-filled-message approach gets you the same structured first message for free. Revisit once inbound volume outgrows manual replies.

## 4. Homepage conversion surfaces (to actually approach 50%)

- Hero: keep the WhatsApp CTA as the primary button, now gated by the form.
- Featured programs cards (SIWES, AI for Everything, Nnewi Tech Meetup): same gated flow, each passing its own interest so you know what pulled them in.
- One exit-intent / scroll-depth prompt on the homepage only (fires once per visitor, dismissible): "Get free SIWES + AI updates on WhatsApp" with the same 3-field form.
- Sticky mobile bar on the homepage: single full-width WhatsApp CTA that appears after the hero scrolls out.

## 5. Seeing the leads

Every capture writes to the existing leads table with name, WhatsApp number, city, interest and the exact page/button it came from, so you can tell homepage hero leads from floating-button leads from SIWES article leads.

## Technical notes

- Reuse the existing `leads` table. Its `interest` CHECK constraint currently allows only the six SIWES-funnel values, so a migration adds `community_join` and `whatsapp_chat`; `school` column is reused for city/state, `notes` for the interest chips and the "said hi on WhatsApp" marker.
- New `src/components/leads/WhatsAppLeadDialog.tsx` (shared form + confirmation strip) and `src/components/FloatingWhatsAppCTA.tsx` mounted once in `src/App.tsx`.
- `src/components/JoinWhatsAppButton.tsx` gains a `capture` mode: show the lead dialog first, then fall through to its existing mobile-redirect / desktop-QR logic unchanged. All existing call sites (Hero, FeaturedPrograms, DepartmentsSection, DepartmentDetail, LocationDetail) get capture on; Dashboard (already-signed-in users) stays as-is.
- Device memory via a `localStorage` key so repeat visitors aren't re-asked; validation matches the existing lead form rules (10+ digits).
- vCard generated client-side from the number in `src/data/successKit.ts` — no new assets or secrets.
- Mobile-tested in the preview before hand-off.
