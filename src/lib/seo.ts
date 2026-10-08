export const SITE_URL = "https://techfaculty.ng";

/** Social preview images live in public/og (see scripts/generate-og-images.py). */
export const ogImage = (file: string) => `${SITE_URL}/og/${file}`;

export const DEFAULT_OG_IMAGE = ogImage("default.jpg");

export const LOGO_URL = `${SITE_URL}/logo.png`;

export const TITLE_SUFFIX = " | Tech Faculty NG";
const MAX_TITLE_LENGTH = 60;

/**
 * Every page title ends in the same brand suffix. Long names (job titles,
 * event names) are cut at a word boundary so the suffix still shows in
 * search results.
 */
export function brandTitle(title: string) {
  if (title.endsWith(TITLE_SUFFIX)) return title;
  const room = MAX_TITLE_LENGTH - TITLE_SUFFIX.length;
  let base = title.trim();
  if (base.length > room) {
    const head = base.slice(0, room + 1);
    // Prefer a natural break ("Title: subtitle", "Role (stack)"), then a word.
    const breakAt = Math.max(...[":", " —", " –", " (", " |", ","].map((s) => head.lastIndexOf(s)));
    const spaceAt = head.lastIndexOf(" ");
    const cutAt = breakAt > room / 2 ? breakAt : spaceAt > room / 2 ? spaceAt : room;
    base = base
      .slice(0, cutAt)
      .replace(/(\s+(a|an|the|and|or|of|for|in|at|to|with|&))+$/i, "")
      .replace(/[\s,—–\-:|·(]+$/, "");
    const open = base.lastIndexOf("(");
    if (open > base.lastIndexOf(")")) base = base.slice(0, open).trimEnd();
  }
  return `${base}${TITLE_SUFFIX}`;
}

export interface PageHeadOptions {
  /** Page name; " | Tech Faculty NG" is appended by brandTitle(). */
  title: string;
  description: string;
  /** Path starting with "/" — used for canonical + og:url. */
  path: string;
  image?: string | undefined;
  /** "website" (default) or "article" etc. */
  type?: string;
  noindex?: boolean;
  /** With noindex: still let crawlers follow the page's links. */
  follow?: boolean;
  /** ISO dates for articles (article:published_time / modified_time). */
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Server-rendered per-page metadata for TanStack route `head()`.
 * Tags here are emitted in the initial HTML, so social crawlers
 * (WhatsApp, Facebook, LinkedIn, X) see page-specific previews.
 */
export function pageHead(opts: PageHeadOptions) {
  const url = `${SITE_URL}${opts.path}`;
  const image = opts.image ?? DEFAULT_OG_IMAGE;
  const title = brandTitle(opts.title);
  return {
    meta: [
      { title },
      { name: "description", content: opts.description },
      ...(opts.noindex
        ? [
            {
              name: "robots",
              content: opts.follow ? "noindex, follow" : "noindex, nofollow",
            },
          ]
        : []),
      { property: "og:title", content: title },
      { property: "og:description", content: opts.description },
      { property: "og:type", content: opts.type ?? "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: opts.description },
      { name: "twitter:image", content: image },
      ...(opts.publishedTime
        ? [{ property: "article:published_time", content: opts.publishedTime }]
        : []),
      ...(opts.modifiedTime
        ? [{ property: "article:modified_time", content: opts.modifiedTime }]
        : []),
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
