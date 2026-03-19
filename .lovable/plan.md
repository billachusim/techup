

## Plan: Full UX Overhaul + Stripe Payment Integration

### Overview
This combines the 13-file UX overhaul (pan-African branding, terminology fixes, currency toggle, etc.) with full Stripe payment integration for all students. The existing WhatsApp/Email flow remains as a parallel option with enriched enrollment details in the message payload.

---

### Part A: UX Overhaul (13 files, as previously approved)

1. **`src/components/Hero.tsx`** — H1 → "Africa", soften earning claims
2. **`src/components/Header.tsx`** — "SIWES/IT" → "Internships", add "Sign Up Free" CTA, add CurrencyToggle
3. **`src/components/GetStarted.tsx`** — id → `get-started`, heading → "Join the Faculty"
4. **`src/components/Auth/SignupForm.tsx`** — phone placeholder → "Your phone number", remove auto-WhatsApp, add post-signup choice modal
5. **`src/components/Companies.tsx`** — reorder (Microsoft/Google first), styled initial logos, heading → "Where Our Graduates Work"
6. **`src/components/Testimonials.tsx`** — 2 ratings to 4-star, initial-based avatars
7. **`src/components/HowItWorks.tsx`** — soften claims, update scroll target
8. **`src/components/CredibilityBanner.tsx`** — remove Nnewi reference
9. **`src/components/Footer.tsx`** — "SIWES/IT" → "Internships", update scroll targets
10. **`src/pages/Index.tsx`** — update meta, scroll targets
11. **`src/components/Pricing.tsx`** — update scroll targets (+ payment changes below)
12. **`src/contexts/CurrencyContext.tsx`** — add manual toggle support
13. **`src/components/CurrencyToggle.tsx`** (NEW) — header currency switcher

---

### Part B: Stripe Payment Integration

**Step 1: Enable Stripe**
- Use the `stripe--enable_stripe` tool to activate the integration (will prompt for secret key — user can add later)

**Step 2: Create payment edge function** — `supabase/functions/create-checkout/index.ts`
- Accepts: plan name, courses, benefits, learning mode, total amount (NGN), faculty ID, currency code
- Creates a Stripe Checkout Session with line items
- For NGN users: charge in NGN (Stripe supports NGN)
- For USD users: convert and charge in USD
- Returns the Stripe checkout URL
- On success, Stripe redirects to a success page

**Step 3: Update `src/components/Pricing/CheckoutDialog.tsx`**
- Add a third payment option: **"Pay with Card"** (Stripe) alongside WhatsApp and Email
- Card option shows Visa/Mastercard icons
- When selected, calls the edge function → redirects to Stripe Checkout
- WhatsApp/Email options remain and now include enriched payload:
  - Welcome message, faculty ID, selected courses with prices, learning mode, benefits, total amount, payment instructions (bank transfer details for NGN, or "Pay online" link for international), discount code if applied

**Step 4: Update `src/components/Pricing.tsx`**
- Pass additional data to CheckoutDialog: plan details, courses, benefits, learning mode, faculty ID, discount info, currency code
- Update `handleCheckoutSubmit` to handle `'card'` method — calls edge function and redirects
- Enrich WhatsApp/Email message templates with welcome text, payment instructions, and all enrollment details

**Step 5: Create success page** — `src/pages/PaymentSuccess.tsx`
- Stripe redirects here after successful payment
- Shows confirmation with faculty ID, enrolled courses, and next steps
- Updates enrollment status to "active" in the database

**Step 6: Add route** — `src/App.tsx`
- Add `/payment-success` route
- Wrap with CurrencyProvider (already done)

---

### Payment Flow (Updated)

```text
User selects plan → Enter Faculty ID → Checkout Dialog
  ├── Pay with Card → Stripe Checkout → /payment-success → enrollment active
  ├── WhatsApp → enriched message with payment info → enrollment pending
  └── Email → enriched email with payment info → enrollment pending
```

### WhatsApp/Email Enriched Payload
```text
Welcome to Tech Faculty! 🎓

Dear [Name],

Your enrollment request has been received.

Faculty ID: TF-WEBDEV-ONL-0325-0001
Plan: Developer Pro
Total: $57 / ₦80,000

Selected Courses:
✓ HTML & CSS - $11
✓ JavaScript - $14
✓ React Development - $14

Learning Mode: Online Only - Included
Benefits: Job Placement Support - $18

Payment Instructions:
[For NGN] Bank Transfer: GTBank - 0123456789 - Tech Faculty NG
[For USD] Pay online: [Stripe payment link]

Discount: TECHUP50 (50% OFF applied)

Questions? Reply to this message or email thetechfaculty@gmail.com
```

### Files Changed (Total: 16)
1-13: All UX overhaul files listed in Part A
14. `supabase/functions/create-checkout/index.ts` (NEW) — Stripe checkout session
15. `src/pages/PaymentSuccess.tsx` (NEW) — post-payment confirmation
16. `src/App.tsx` — add route + CurrencyProvider (already wrapped)

### Technical Notes
- Stripe secret key will be requested via the enable tool — user said they'll add it later, so we'll integrate the code now
- Edge function uses `STRIPE_SECRET_KEY` from secrets
- Stripe Checkout handles PCI compliance — no card data touches our code
- Both NGN and USD are supported Stripe currencies

