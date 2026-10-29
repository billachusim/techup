//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/seo-CiXrTLvh.js
var SITE_URL = "https://techfaculty.ng";
/** Social preview images live in public/og (see scripts/generate-og-images.py). */
var ogImage = (file) => `${SITE_URL}/og/${file}`;
var DEFAULT_OG_IMAGE = ogImage("default.jpg");
var LOGO_URL = `${SITE_URL}/logo.png`;
var TITLE_SUFFIX = " | Tech Faculty NG";
/**
* Every page title ends in the same brand suffix. Long names (job titles,
* event names) are cut at a word boundary so the suffix still shows in
* search results.
*/
function brandTitle(title) {
	if (title.endsWith(" | Tech Faculty NG")) return title;
	const room = 42;
	let base = title.trim();
	if (base.length > room) {
		const head = base.slice(0, 43);
		const breakAt = Math.max(...[
			":",
			" —",
			" –",
			" (",
			" |",
			","
		].map((s) => head.lastIndexOf(s)));
		const spaceAt = head.lastIndexOf(" ");
		const cutAt = breakAt > room / 2 ? breakAt : spaceAt > room / 2 ? spaceAt : room;
		base = base.slice(0, cutAt).replace(/(\s+(a|an|the|and|or|of|for|in|at|to|with|&))+$/i, "").replace(/[\s,—–\-:|·(]+$/, "");
		const open = base.lastIndexOf("(");
		if (open > base.lastIndexOf(")")) base = base.slice(0, open).trimEnd();
	}
	return `${base}${TITLE_SUFFIX}`;
}
/**
* Server-rendered per-page metadata for TanStack route `head()`.
* Tags here are emitted in the initial HTML, so social crawlers
* (WhatsApp, Facebook, LinkedIn, X) see page-specific previews.
*/
function pageHead(opts) {
	const url = `${SITE_URL}${opts.path}`;
	const image = opts.image ?? DEFAULT_OG_IMAGE;
	const title = brandTitle(opts.title);
	return {
		meta: [
			{ title },
			{
				name: "description",
				content: opts.description
			},
			...opts.noindex ? [{
				name: "robots",
				content: opts.follow ? "noindex, follow" : "noindex, nofollow"
			}] : [],
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: opts.description
			},
			{
				property: "og:type",
				content: opts.type ?? "website"
			},
			{
				property: "og:url",
				content: url
			},
			{
				property: "og:image",
				content: image
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: title
			},
			{
				name: "twitter:description",
				content: opts.description
			},
			{
				name: "twitter:image",
				content: image
			},
			...opts.publishedTime ? [{
				property: "article:published_time",
				content: opts.publishedTime
			}] : [],
			...opts.modifiedTime ? [{
				property: "article:modified_time",
				content: opts.modifiedTime
			}] : []
		],
		links: [{
			rel: "canonical",
			href: url
		}]
	};
}
//#endregion
export { pageHead as i, SITE_URL as n, ogImage as r, LOGO_URL as t };
