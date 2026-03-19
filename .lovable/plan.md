

## Plan: Replace Stripe with Flutterwave for Card Payments

### Overview
Replace the Stripe checkout integration with Flutterwave, which supports Nigerian merchants natively. Flutterwave provides a hosted checkout page (Flutterwave Standard) similar to Stripe Checkout — we redirect users to Flutterwave's payment page and they return to a success URL.

### How Flutterwave Standard Works
Flutterwave's Standard payment flow:
1. Backend generates a payment link via `https://api.flutterwave.com/v3/payments`
2. User is redirected to Flutterwave's hosted checkout page
3. After payment, user is redirected back to a success URL with `transaction_id` and `tx_ref`
4. Success page verifies the transaction via Flutterwave's verify endpoint

### Files Changed (4 files)

**1. `supabase/functions/create-checkout/index.ts`** — Rewrite to use Flutterwave API
- Replace Stripe SDK with Flutterwave REST API calls
- POST to `https://api.flutterwave.com/v3/payments` with line items, amount, currency (NGN or USD), redirect URLs, and a unique `tx_ref`
- Use `FLUTTERWAVE_SECRET_KEY` secret instead of `STRIPE_SECRET_KEY`
- Return the Flutterwave payment link URL
- Keep the same request/response shape so frontend changes are minimal

**2. `src/components/Pricing/CheckoutDialog.tsx`** — Update label
- Change "Secure checkout via Stripe" to "Secure checkout via Flutterwave"
- Add support for more payment methods in description: "Visa, Mastercard, Bank Transfer, USSD, Mobile Money"

**3. `src/pages/PaymentSuccess.tsx`** — Update verification
- Read `transaction_id` and `tx_ref` from URL params (Flutterwave's redirect params) instead of Stripe's `session_id`
- Optionally verify payment status via an edge function call

**4. Secret setup** — Request `FLUTTERWAVE_SECRET_KEY`
- Use the secrets tool to ask for the Flutterwave secret key (from the Flutterwave dashboard shown in the screenshot)

### Payment Flow
```text
User selects plan → Checkout Dialog → "Pay with Card"
  → Edge function creates Flutterwave payment link
  → User redirected to Flutterwave hosted checkout
  → Pays via card/bank transfer/USSD/mobile money
  → Redirected to /payment-success?transaction_id=xxx&tx_ref=xxx
  → Success page displays confirmation
```

### Technical Notes
- Flutterwave API docs: POST `/v3/payments` with `tx_ref`, `amount`, `currency`, `redirect_url`, `customer` object
- NGN is natively supported; USD also supported
- No SDK needed — plain fetch calls to REST API
- The existing WhatsApp/Email flows remain untouched
- Discount codes will be applied by calculating the discounted total before sending to Flutterwave (Flutterwave doesn't have native coupon support like Stripe)

