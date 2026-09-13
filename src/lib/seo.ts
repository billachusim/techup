export const SITE_URL = "https://techfaculty.ng";

export const DEFAULT_OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/Nz94FlzZhAUL7Qyy7N9OzcfiFDW2/social-images/social-1762032884675-20251101_223347.jpg";

export interface PageHeadOptions {
  title: string;
  description: string;
  /** Path starting with "/" — used for canonical + og:url. */
  path: string;
  image?: string | undefined;
  /** "website" (default) or "article" etc. */
  type?: string;
  noindex?: boolean;
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
        ? [{ name: "robots", content: "noindex, nofollow" }]
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
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
