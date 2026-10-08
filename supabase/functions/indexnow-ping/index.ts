import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { pingIndexNow, SITE_ORIGIN } from "../_shared/indexnow.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITEMAPS = [
  `${SITE_ORIGIN}/sitemap.xml`,
  `${Deno.env.get("SUPABASE_URL")}/functions/v1/sitemap`,
];

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sitemapUrls(): Promise<string[]> {
  const urls: string[] = [];
  for (const sitemap of SITEMAPS) {
    try {
      const res = await fetch(sitemap);
      if (!res.ok) continue;
      const xml = await res.text();
      for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) urls.push(m[1]);
    } catch (error) {
      console.error(`could not read ${sitemap}`, error);
    }
  }
  return urls;
}

/**
 * Admin-only: tell IndexNow search engines about pages. With { urls } it sends
 * those; with no body it resubmits every URL in the site's sitemaps, which is
 * what to do after publishing or editing a post by hand.
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? "";
    const { data: auth } = token ? await supabase.auth.getUser(token) : { data: { user: null } };
    if (!auth.user) return json({ error: "Please sign in with an admin account" }, 401);
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", auth.user.id)
      .eq("role", "admin");
    if (!roles || roles.length === 0) return json({ error: "Admins only" }, 403);

    const body = await req.json().catch(() => ({}));
    const urls: string[] = Array.isArray(body?.urls) && body.urls.length > 0
      ? body.urls.map(String)
      : await sitemapUrls();

    const result = await pingIndexNow(urls);
    return json(result, result.ok ? 200 : 502);
  } catch (error) {
    console.error("indexnow-ping error", error);
    return json({ error: String(error) }, 500);
  }
});
