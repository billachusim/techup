import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SITE = "https://techfaculty.ng";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
  return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

/**
 * Dynamic sitemap for database-driven pages (auto blog posts, jobs, events).
 * Static routes stay in /public/sitemap.xml; this file is declared as a second
 * sitemap in robots.txt so new rows are discoverable without manual edits.
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const today = new Date().toISOString().slice(0, 10);
  const entries: string[] = [];

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );

    const [posts, jobs, events] = await Promise.all([
      supabase.from("blog_posts").select("slug, published_at, updated_at").eq("is_published", true).order("published_at", { ascending: false }).limit(500),
      supabase.from("jobs").select("slug, last_seen_at").eq("is_expired", false).order("last_seen_at", { ascending: false }).limit(500),
      supabase.from("events").select("slug, updated_at").eq("is_expired", false).order("updated_at", { ascending: false }).limit(500),
    ]);

    for (const p of posts.data ?? []) {
      entries.push(urlEntry(`${SITE}/blog/${p.slug}`, String(p.updated_at ?? p.published_at).slice(0, 10), "monthly", "0.7"));
    }
    for (const j of jobs.data ?? []) {
      entries.push(urlEntry(`${SITE}/careers/${j.slug}`, String(j.last_seen_at).slice(0, 10), "weekly", "0.6"));
    }
    for (const e of events.data ?? []) {
      entries.push(urlEntry(`${SITE}/events/${e.slug}`, String(e.updated_at).slice(0, 10), "weekly", "0.6"));
    }
  } catch (error) {
    // Always return valid XML — a broken sitemap is worse than a short one.
    console.error("sitemap error", error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n") || urlEntry(`${SITE}/blog`, today, "daily", "0.8")}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});
