export const SITE_URL = "https://techfaculty.ng";

/** Social preview images live in public/og (see scripts/generate-og-images.py). */
export const ogImage = (file: string) => `${SITE_URL}/og/${file}`;

export const DEFAULT_OG_IMAGE = ogImage("default.jpg");

export const LOGO_URL = `${SITE_URL}/logo.png`;

export interface PageHeadOptions {
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
  return {
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      ...(opts.noindex
        ? [
            {
              name: "robots",
              content: opts.follow ? "noindex, follow" : "noindex, nofollow",
            },
          ]
        : []),
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
      { property: "og:type", content: opts.type ?? "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: opts.title },
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
