import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as blogPosts } from "./blogPosts-0fYtIgLY.mjs";
import { n as isRetiredBlogSlug } from "./blog-redirects-COUXMWf2.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/rss.server-DuoGfLtW.js
var SITE = "https://techfaculty.ng";
var FEED_TITLE = "Tech Faculty NG Blog";
var FEED_DESCRIPTION = "Tech training, AI, data, cybersecurity, SIWES and career guides from Tech Faculty NG — Nigeria's licensed technology training institute.";
var MAX_ITEMS = 50;
function escapeXml(value) {
	return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
/** RSS 2.0 requires RFC 822 dates. */
function rfc822(date) {
	const parsed = new Date(date);
	return (Number.isNaN(parsed.getTime()) ? /* @__PURE__ */ new Date() : parsed).toUTCString();
}
/** Published database posts; the feed still renders if this read fails. */
async function fetchDbPosts() {
	const url = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY": "AIzaSyAy1C2D3dViZzL0xzCoFL--un0f014P9oI",
		"VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID": "d30c3922867c12efb21ca99a0ce186a9",
		"VITE_SUPABASE_PROJECT_ID": "flxwtwzjslufglpwfjdx",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseHd0d3pqc2x1ZmdscHdmamR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMzE0NDgsImV4cCI6MjA3NzkwNzQ0OH0.vMnPWcrGQzptcCvnsclM3PHzxzdGu5MbyAS5EAlff1I",
		"VITE_SUPABASE_URL": "https://flxwtwzjslufglpwfjdx.supabase.co"
	}["VITE_SUPABASE_URL"];
	const key = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY": "AIzaSyAy1C2D3dViZzL0xzCoFL--un0f014P9oI",
		"VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID": "d30c3922867c12efb21ca99a0ce186a9",
		"VITE_SUPABASE_PROJECT_ID": "flxwtwzjslufglpwfjdx",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseHd0d3pqc2x1ZmdscHdmamR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMzE0NDgsImV4cCI6MjA3NzkwNzQ0OH0.vMnPWcrGQzptcCvnsclM3PHzxzdGu5MbyAS5EAlff1I",
		"VITE_SUPABASE_URL": "https://flxwtwzjslufglpwfjdx.supabase.co"
	}["VITE_SUPABASE_PUBLISHABLE_KEY"];
	if (!url || !key) return [];
	try {
		const { data, error } = await createClient(url, key, { auth: {
			persistSession: false,
			autoRefreshToken: false
		} }).from("blog_posts").select("slug, title, description, category, tags, author, published_at").eq("is_published", true).order("published_at", { ascending: false }).limit(MAX_ITEMS);
		if (error) throw error;
		return (data ?? []).filter((row) => !isRetiredBlogSlug(row.slug)).map((row) => ({
			slug: row.slug,
			title: row.title,
			description: row.description,
			content: "",
			date: row.published_at,
			author: "Bill Achusim",
			tags: row.tags?.length ? row.tags : [row.category],
			readTime: 8
		}));
	} catch {
		return [];
	}
}
function item(post) {
	const link = `${SITE}/blog/${post.slug}`;
	const categories = (post.tags ?? []).slice(0, 5).map((tag) => `    <category>${escapeXml(tag)}</category>`).join("\n");
	return [
		"  <item>",
		`    <title>${escapeXml(post.title)}</title>`,
		`    <link>${escapeXml(link)}</link>`,
		`    <guid isPermaLink="true">${escapeXml(link)}</guid>`,
		`    <pubDate>${rfc822(post.date)}</pubDate>`,
		`    <dc:creator>${escapeXml("Bill Achusim")}</dc:creator>`,
		`    <description>${escapeXml(post.description)}</description>`,
		categories,
		"  </item>"
	].filter(Boolean).join("\n");
}
/** RSS 2.0 feed of all Tech Faculty blog posts, newest first. */
async function buildRssFeed() {
	const dbPosts = await fetchDbPosts();
	const staticSlugs = new Set(blogPosts.map((p) => p.slug));
	const posts = [...blogPosts, ...dbPosts.filter((p) => !staticSlugs.has(p.slug))].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, MAX_ITEMS);
	const lastBuild = posts[0] ? rfc822(posts[0].date) : (/* @__PURE__ */ new Date()).toUTCString();
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
function rssResponse(xml) {
	return new Response(xml, {
		status: 200,
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "public, max-age=1800, s-maxage=1800",
			"Access-Control-Allow-Origin": "*"
		}
	});
}
//#endregion
export { buildRssFeed, rssResponse };
