## New Partner Pages

Add two marketing pages showcasing partnerships, each with a clear CTA pointing to an external link.

### 1. `/tinypeople` — Tiny People AI (by Natura Inc)

Narrative: "Tech Faculty has partnered with Natura Inc to bring Tiny People AI — a powerful personal AI agent — to users across Nigeria and Africa."

Sections:
- **Hero**: Title "Meet Tiny People AI — Your Personal AI Agent, Now in Africa", subhead about the Tech Faculty × Natura Inc partnership, primary CTA button **"Start Using Tiny People"** → `https://tinypeople.ai/start` (opens in new tab), secondary "Learn more" → `https://tinypeople.ai`. Custom AI-generated hero image.
- **What is Tiny People**: Short intro — a powerful AI agent you talk to through your everyday messaging apps.
- **How to use it (3 channels)**: WhatsApp, Telegram, iMessage cards (icons + short blurbs). Mention upcoming earbud delivery option.
- **Why it matters here**: Partnership angle — bringing world-class AI to African users via the channels they already use.
- **Final CTA band**: Big "Start Using Tiny People" button to `tinypeople.ai/start`.
- "Powered by Natura Inc · Brought to you by Tech Faculty" footer line.

### 2. `/lovable` — Build with Lovable

Narrative: "Tech Faculty recommends Lovable — the AI platform we use to build production apps."

Sections:
- **Hero**: Title "Build Apps with AI — Powered by Lovable", subhead, primary CTA **"Start Building on Lovable"** → placeholder referral URL `https://lovable.dev/?via=YOUR_REFERRAL_CODE` (opens new tab, `rel="noopener"`). Custom AI-generated hero image.
- **What you can build**: Web apps, dashboards, SaaS, internal tools (icon grid).
- **Why Lovable**: 3–4 benefit cards (chat-to-code, full-stack with Cloud, instant publish, integrations).
- **How it works**: 3-step flow (Describe → Iterate → Publish).
- **Final CTA band**: "Start Building on Lovable" button.
- Small disclosure line: "We may earn a referral reward when you sign up through our link."

The referral URL will be defined as a single constant at the top of the file so you can swap it later in one place.

### Navigation & Discovery

- **Footer (`src/components/Footer.tsx`)**: Add a new "Partners" column (or append to existing column) with links to **Tiny People AI** and **Lovable**.
- **Products page (`src/pages/Products.tsx`)**: Add a new "Our Partners" section (2 cards) below the existing software portfolio, each linking to the respective new page.

### Routing

- `src/App.tsx`: Add `<Route path="/tinypeople" element={<TinyPeople />} />` and `<Route path="/lovable" element={<Lovable />} />` above the catch-all.
- `public/sitemap.xml`: Add both URLs.

### Visuals

Generate two custom hero images with `imagegen--generate_image` (fast tier, 16:9), saved to `src/assets/`:
- `tinypeople-hero.jpg` — friendly AI agent / chat bubbles / African context, brand-aligned.
- `lovable-hero.jpg` — abstract AI-builds-apps visual matching site palette.

### SEO

Each page wrapped with `react-helmet-async`:
- TinyPeople: title "Tiny People AI in Africa | Tech Faculty × Natura Inc", meta desc <160 chars, single H1, canonical.
- Lovable: title "Build Apps with Lovable | Tech Faculty", meta desc, canonical.

### Design

Reuse existing semantic tokens (`primary`, gradient `from-primary to-[hsl(180,100%,45%)]`), shadcn `Button`/`Card`, and Header/Footer layout — consistent with the rest of the site. No new colors introduced.

### Files to add / edit

- Add: `src/pages/TinyPeople.tsx`, `src/pages/Lovable.tsx`, `src/assets/tinypeople-hero.jpg`, `src/assets/lovable-hero.jpg`
- Edit: `src/App.tsx`, `src/components/Footer.tsx`, `src/pages/Products.tsx`, `public/sitemap.xml`
