## Problem

`/verify` on the live site is being served by the standalone static file `public/verify/index.html` (+ `verifycss.css` + `verifyjs.js`), not by the React page `src/pages/Verify.tsx`. Two consequences:

1. **Only `TFNG202601` verifies.** The static JS holds an in-memory `Map` with a single hardcoded certificate. The other 7 real certificates in the database (`TFNG202602`–`TFNG202608`) return "not found" no matter what.
2. **The page no longer matches the main site.** The static file loads its own `verifycss.css` and its own markup — completely separate from your Tailwind design system, Header, and Footer.

The React route `/verify/*` → `Verify.tsx` already exists and already:
- Renders inside the site's `Header` / `Footer` and uses the site's design tokens (so it matches techfaculty.ng).
- Calls the `verify_certificate(cert_number)` Postgres function, which I confirmed returns all 8 database records via the anon key.

Static files in `public/` are served before SPA routes fall through, so the React page is being shadowed.

## Fix

Delete the standalone static verify page so the React route takes over:

- Delete `public/verify/index.html`
- Delete `public/verify/verifycss.css`
- Delete `public/verify/verifyjs.js`
- Keep `public/verify/TFNGCertVerify.jpg` (the React page references it at `/verify/TFNGCertVerify.jpg` for the header logo)

No code changes to `Verify.tsx`, no database changes, no RLS/grant changes needed — the RPC already works for anon.

After deletion + republish:
- `/verify` (with or without trailing slash) will render the React page in the site's look-and-feel.
- All 8 existing certificates will verify, and any future certificate added to the `certificates` table will verify automatically (no code edit per cert).

## Verification steps after publish

1. Open `https://techfaculty.ng/verify` — should render inside the normal site header/footer.
2. Enter `TFNG202608` (Ifeanyi Kamsiyochukwu Victory, Cybersecurity) — should show the verified record.
3. Enter `TFNG202601` — should also still work.
4. Enter a random string like `TFNG999999` — should show the "not found" error.
