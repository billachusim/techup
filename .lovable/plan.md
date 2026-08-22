# Tech Store without Shopify — WhatsApp-order storefront

Replace the Shopify-powered store with a self-contained, minimalist catalogue of ~10 tech products priced in Naira. No cart, no checkout — every product's CTA opens WhatsApp with a pre-filled message so orders are finished in chat.

## What the page becomes

- **Hero**: "Tech Store — Affordable Tech Gear in Nigeria", short intro, trust strip: Nationwide delivery · Pay on delivery available · Pickup at Technology Incubation Centres nationwide.
- **Search + category filter** (Power, Laptops & Accessories, Phone Accessories, Learning Kits) — client-side, no backend.
- **Product grid**: swipeable image gallery per card (touch swipe on mobile, arrows on desktop, dot indicators), name, short description, price in ₦, badges like "Made in Nigeria", "Assembled at Tech Faculty", stock/pickup note.
- **Product detail sheet/dialog** opened from a card: full gallery, longer description, key specs bullets, delivery/payment note, WhatsApp CTA.
- **CTA button text**: primary "Order on WhatsApp", secondary line "Pay on delivery available · Nationwide delivery". Message is pre-filled, e.g.
  `Hello Tech Faculty, I want to order: Battery Bank (Replaceable Battery Power Bank) — ₦XX,XXX. Please confirm availability, delivery to my location and payment options.`
  Sent to the existing store number (`wa.me/2348068597140`).
- **Sections below**: How ordering works (3 steps: message → confirm details & payment/pay-on-delivery → delivery or pickup), Delivery & pickup info, FAQ (8–10 real buyer questions), final WhatsApp CTA.
- Faculty ID discount banner kept, reworded (discount applied on WhatsApp instead of a Shopify coupon).

## Products (10)

1. **Battery Bank — Replaceable Battery Power Bank** (flagship, assembled by our Hardware & Robotics department; 18650 / AA compatible, 1-year battery replacement guarantee, colour options) — uses your two uploaded product graphics as gallery images.
2. Laptop — refurbished business laptop (Core i5, 8GB/256GB SSD) for students
3. Laptop bag / backpack
4. Wireless mouse + keyboard combo
5. USB-C hub / multiport adapter
6. Laptop cooling pad & stand
7. Custom phone cases — made in Nigeria (personalised names/designs)
8. Fast charger + USB-C cable bundle
9. Wireless earbuds / headset for online classes
10. Arduino / robotics starter kit (for our Hardware & Robotics learners)

Prices in ₦ will be filled with realistic Nigerian market ranges; tell me any exact prices and I'll use yours instead. Non-uploaded products get generated product images (2–3 per product for the swipe gallery).

## SEO / AI search

- Title, meta description, canonical, og/twitter tags for `/tech-store` via Helmet.
- Single H1, semantic sections, keyword-aligned copy ("buy power bank in Nigeria", "affordable laptop for students Nigeria", "custom phone case Nigeria", "pay on delivery").
- JSON-LD: `ItemList` of `Product` entries with `offers` (price, `priceCurrency: NGN`, availability, `areaServed: Nigeria`), `Store`/`LocalBusiness` for the store itself, `FAQPage`-free FAQ (plain semantic markup), `BreadcrumbList`.
- Alt text on every image, lazy loading, `public/llms.txt` and `public/sitemap.xml` entry check for `/tech-store`.

## Technical notes

- New `src/data/products.ts` as the single source of truth (slug, name, tagline, description, specs, category, price, badges, images, whatsappMessage).
- Rewrite `src/pages/TechStore.tsx`: drop `fetchProducts`/`useCartStore`/`CartDrawer` usage; new `src/components/store/ProductCard.tsx`, `ProductGallery.tsx` (swipe via existing embla carousel), `ProductDialog.tsx`.
- Remove the Shopify code path from the store page. `src/lib/shopify.ts`, `src/stores/cartStore.ts` and `CartDrawer` stay in the repo but are no longer referenced by Tech Store (cart icon in Header removed if it only served this page).
- Uploaded battery-bank graphics registered via `lovable-assets` pointers; other product images generated into `src/assets/products/`.
- Currency: prices are plain NGN strings/numbers formatted with the existing `formatPrice` helper where useful; store stays NGN-only.
