# WhatsApp inbox rebuild + better quick replies

## What changes for you

**1. Inbox that feels like WhatsApp Web**
- Desktop: chat list on the left, open conversation on the right, filling the screen height. The reply box stays fixed at the bottom; messages scroll on their own.
- Phone: the chat list shows on its own screen. Tap a chat to open it full-screen, with a back arrow to return.
- Chat list: name, last message (one line), time, and a "Needs reply" or "Open" label. Filters at the top: **Needs reply**, **Open (24h)**, **All**, plus a search box for name or number.
- Messages look like WhatsApp bubbles: yours on the right, theirs on the left, with the time and ticks (sent/delivered/read) small underneath. Messages are grouped by day ("Today", "Yesterday", date).
- Links inside messages can be clicked. Long links wrap neatly instead of breaking the layout.
- Enter sends, Shift+Enter adds a new line.

**2. Templates shown the way people actually received them**
- Right now a template shows as raw code, e.g. `[Template] tf_revamp_free_bootcamp: Oluwafemi | https://...`. That is only how we saved it — recipients got the proper, readable message.
- The inbox will rebuild the real text from the approved template (name and link filled in) and show it as a normal bubble, with a small "Template" label. Long tracking links are displayed shortly, e.g. "techfaculty.ng/departments/web-development", but still open the full link.

**3. New quick replies (replacing the current four buttons)**
Shown as a tidy "Quick replies" menu above the reply box. Each one fills the reply box so you can edit before sending. None mention payment unless the reply is about payment.
- **Introduce us** — "Hi {name}, this is Ms. Claire, Tech Faculty NG's automated admissions assistant. Tech Faculty NG trains people in tech online and at campuses across Nigeria..." plus our official number for speaking with the team.
- **Official number** — explains this line is the admissions assistant, and our official line for the team is +234 806 859 7140 (with a tap-to-chat link).
- **Free bootcamp** — short invite with the one-tap free bootcamp link.
- **Course & price** — course page link; you pick the course and price is filled in from our current online prices.
- **SIWES / internship** — Virtual SIWES link and short summary.
- **Speak to Mr. Bill** — general handoff to the founder ("for anything you'd like to discuss directly"), not payment-specific.
- **Payment help** — only this one talks about payments and hands to Mr. Bill.
- **Join community** and **Join Slack** — kept as they are.
- The person's first name is filled in automatically when we have it.

Wording keeps the rule: Ms. Claire is this automated admissions line; handoffs go only to Mr. Bill on the official number.

**4. No automation on people who have replied**
Replies stay with you and other admins. The existing behaviour (automatic follow-ups stop once someone replies; STOP always opts out) is kept, and the chat header will show "Handled by staff" so it's clear.

## Not changing
Sending, delivery tracking, campaign, templates tab logic, the official number, and Ms. Claire's number privacy.

## Technical details
- `src/lib/whatsapp-handoff.ts`: replace `HandoffKind` set with the new presets; `handoffMessage(kind, { name, course })` builds text; keep founder link. Add tests asserting payment wording appears only in the payment preset and that the founder number is 2348068597140.
- New `src/lib/whatsapp-render.ts` (pure, tested): parse stored `[Template] name: a | b` bodies, substitute `{{n}}` into the matching approved template BODY text; fall back to plain text if the template isn't found. Linkify + shorten display of URLs.
- Split `src/pages/AdminWhatsApp.tsx` inbox into `components/admin/whatsapp/ChatList.tsx`, `ChatView.tsx`, `MessageBubble.tsx`, `QuickReplies.tsx`; use `h-[calc(100dvh-…)]` flex layout, mobile single-pane via `active` state, semantic tokens only.
- Verify with Playwright at 1280 and 390 widths signed in as admin.
