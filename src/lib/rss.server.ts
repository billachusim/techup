import { createClient } from "@supabase/supabase-js";

import blogPosts from "@/data/blogPosts";
import type { BlogPost } from "@/types/blog";

const SITE = "https://techfaculty.ng";
const FEED_TITLE = "Tech Faculty NG Blog";
const FEED_DESCRIPTION =
  "Tech training, AI, data, cybersecurity, SIWES and career guides from Tech Faculty NG — Nigeria's licensed technology training institute.";
const MAX_ITEMS = 50;

type DbPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[] | null;
  author: string | null;
  published_at: string;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS 2.0 requires RFC 822 dates. */
function rfc822(date: string): string {
  const parsed = new Date(date);
  const safe = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  return safe.toUTCString();
}

/** Published database posts; the feed still renders if this read fails. */
async function fetchDbPosts(): Promise<BlogPost[]> {
  const url = import.meta.env['VITE_SUPABASE_URL'] as string | undefined;
  const key = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] as
    | string
    | undefined;
  if (!url || !key) return [];

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("blog_posts")
      .select("slug, title, description, category, tags, author, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(MAX_ITEMS);
    if (error) throw error;

    return ((data ?? []) as DbPost[]).map((row) => ({
      slug: row.slug,
      title: row.title,
      description: row.description,
      content: "",
      date: row.published_at,
      author: "Bill Achusim",
      tags: row.tags?.length ? row.tags : [row.category],
      readTime: 8,
    }));
  } catch {
    return [];
  }
}

function item(post: BlogPost): string {
  const link = `${SITE}/blog/${post.slug}`;
  const categories = (post.tags ?? [])
    .slice(0, 5)
    .map((tag) => `    <category>${escapeXml(tag)}</category>`)
    .join("\n");

  return [
    "  <item>",
    `    <title>${escapeXml(post.title)}</title>`,
    `    <link>${escapeXml(link)}</link>`,
    `    <guid isPermaLink="true">${escapeXml(link)}</guid>`,
    `    <pubDate>${rfc822(post.date)}</pubDate>`,
    `    <dc:creator>${escapeXml("Bill Achusim")}</dc:creator>`,
    `    <description>${escapeXml(post.description)}</description>`,
    categories,
    "  </item>",
  ]
    .filter(Boolean)
    .join("\n");
}

/** RSS 2.0 feed of all Tech Faculty blog posts, newest first. */
export async function buildRssFeed(): Promise<string> {
  const dbPosts = await fetchDbPosts();
  const staticSlugs = new Set(blogPosts.map((p) => p.slug));
  const posts = [
    ...blogPosts,
    ...dbPosts.filter((p) => !staticSlugs.has(p.slug)),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, MAX_ITEMS);

  const lastBuild = posts[0] ? rfc822(posts[0].date) : new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
  <title>${escapeXml(FEED_TITLE)}</title>
  <link>${SITE}/blog</link>
  <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
  <description>${escapeXml(FEED_DESCRIPTION)}</description>
  <language>en-NG</language>
  <copyright>Tech Faculty NG</copyright>
  <lastBuildDate>${lastBuild}</lastBuildDate>
  <generator>Tech Faculty NG</generator>
${posts.map(item).join("\n")}
</channel>
</rss>`;
}

export function rssResponse(xml: string): Response {
  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
