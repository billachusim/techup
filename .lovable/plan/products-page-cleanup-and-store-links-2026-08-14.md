# Products page cleanup and store links

## What changes

Remove two products and finish the remaining four with real store links, updated titles, and the cover images you uploaded.

### Removed
- PalmShop.ng
- ExamsAI.ng

(The `palmshop-preview.jpg` asset and the Windows/macOS/web badge code become unused and get removed too.)

### Remaining four products

| Product | App Store | Google Play |
| --- | --- | --- |
| Dear Claire — Secret Diary Chat | id1635333304 (NG storefront) | existing `com.mobymagic.clairediary` link |
| AI Clopedia — Ask AI Anything | id6447000971 | `com.socialfaculty.AiClopedia` |
| Eavesdrop — Live Stories | id6759225893 | `com.socialfaculty.eavesdrop` |
| Alter Ego — Private Self Map | id6759404823 | `com.socialfaculty.alter_ego` |

Each card gets:
- Live App Store + Google Play badges (no more disabled `#` placeholders)
- The uploaded cover image as the card preview (feature-graphic style, shown above the text like PalmShop's preview did)
- Taglines aligned with the store listings: "Secret Diary Chat", "Ask AI Anything", "Live Stories", "Private Self Map"
- Descriptions lightly refreshed to match the store copy in your uploads (anonymous diary + advice; AI answers with an image for every question; live conversation rooms; local, zero-data-collection self mapping)

### Copy and SEO
- Hero paragraph and page meta/JSON-LD updated to drop PalmShop/ExamsAI mentions and list the four apps.
- The "Coming soon / links pending store approval" note is removed since every link is live.
- Partners section (Tiny People AI, Lovable) stays as-is.

## Technical notes
- Edit `src/pages/Products.tsx`: trim the `products` array to four entries, drop the `web`/`windows`/`mac` platform handling, keep `PlayStoreBadge`/`AppStoreBadge`.
- Upload the four covers via `lovable-assets create` from `/mnt/user-uploads/` and import the `.asset.json` pointers instead of committing binaries; delete `src/assets/palmshop-preview.jpg` (or its pointer).
- Cover images are wide feature graphics; the preview container switches from `aspect-video` to a `object-cover` band that suits the wider ratio.
- Update the `hasPart` SoftwareApplication JSON-LD entries with `operatingSystem: "iOS, Android"`.
