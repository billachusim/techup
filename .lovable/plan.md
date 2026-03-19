

## Plan: Geo-based Currency Switching (NGN → USD for non-Nigeria traffic)

### Approach
Use a free IP geolocation API to detect the user's country on page load. If outside Nigeria, convert all pricing to USD at a slightly premium rate and display the `$` symbol instead of `₦`.

### Technical Details

**1. Create a currency context (`src/contexts/CurrencyContext.tsx`)**
- On mount, call a free geo API (e.g., `https://ipapi.co/json/` or `https://ip-api.com/json`) to get the country code
- If country !== "NG", set currency to USD with a conversion rate of ~₦1,600 = $1 but marked up slightly (e.g., use ₦1,400 = $1 so USD prices are ~14% higher than pure conversion)
- Export `useCurrency()` hook returning `{ symbol, convertPrice, isNigeria, currencyCode }`
- `convertPrice(ngnAmount)` returns the display amount in the active currency
- `formatPrice(ngnAmount)` returns the full formatted string like `$57` or `₦80,000`

**2. Update all pricing display components to use the hook**
Files to update:
- `src/components/Pricing.tsx` — all `₦` references and `toLocaleString()` calls (~12 occurrences), plus WhatsApp message template
- `src/components/Pricing/CourseSelector.tsx` — 1 occurrence
- `src/components/Pricing/BenefitSelector.tsx` — 1 occurrence  
- `src/components/Pricing/LearningModeSelector.tsx` — 1 occurrence
- `src/components/Pricing/CheckoutDialog.tsx` — 1 occurrence

**3. Wrap the app with `CurrencyProvider` in `App.tsx`**

### Conversion Logic
- NGN prices remain as-is for Nigerian users
- For international users: `usdPrice = Math.round(ngnPrice / 1400)` (₦1,400 per $1, giving a slight premium over market rate of ~₦1,600)
- Example: ₦80,000 → $57 (vs $50 at market rate)
- Free plan stays free everywhere

### Files Changed
1. **New**: `src/contexts/CurrencyContext.tsx` — geo detection + currency logic
2. **Edit**: `src/App.tsx` — wrap with `CurrencyProvider`
3. **Edit**: `src/components/Pricing.tsx` — use `formatPrice()` everywhere
4. **Edit**: `src/components/Pricing/CourseSelector.tsx`
5. **Edit**: `src/components/Pricing/BenefitSelector.tsx`
6. **Edit**: `src/components/Pricing/LearningModeSelector.tsx`
7. **Edit**: `src/components/Pricing/CheckoutDialog.tsx`

