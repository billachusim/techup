## What happened

The `/verify` page is a standalone static HTML file at `public/verify/index.html` (separate from the React app). It linked its stylesheet, logo, and script using **relative paths**:

```html
<link rel="stylesheet" href="verifycss.css">
<img src="TFNGCertVerify.jpg" ...>
<script src="verifyjs.js"></script>
```

Relative paths resolve against the current URL:

- Visited as `https://techfaculty.ng/verify/` (with trailing slash) → browser asks for `/verify/verifycss.css` ✅
- Visited as `https://techfaculty.ng/verify` (no trailing slash) → browser asks for `/verifycss.css` ❌

On the no-slash visit (which is what your screenshot shows), those asset URLs 404 at the root. Lovable's SPA fallback then serves the React app's `index.html` for the missing paths, so the browser receives HTML where it expected CSS/JS/an image. Result: the HTML renders raw with no styles, no script, and a broken logo — exactly the screenshot you sent.

The CSS file itself is fine (confirmed 200 `text/css` when fetched with the correct `/verify/` path).

## Fix

Change the three references in `public/verify/index.html` to absolute paths so they work regardless of trailing slash:

- `href="verifycss.css"` → `href="/verify/verifycss.css"`
- `href="TFNGCertVerify.jpg"` (favicon) → `href="/verify/TFNGCertVerify.jpg"`
- `src="TFNGCertVerify.jpg"` (logo `<img>`) → `src="/verify/TFNGCertVerify.jpg"`
- `src="verifyjs.js"` → `src="/verify/verifyjs.js"`

No other files change. After the edit, republish so the fix goes live on techfaculty.ng.
