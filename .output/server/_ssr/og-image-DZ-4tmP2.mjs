import { c as objectType, i as enumType, u as stringType } from "../_libs/zod.mjs";
import { n as SITE_URL } from "./seo-CiXrTLvh.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/og-image-DZ-4tmP2.js
var OG_CACHE_CONTROL = "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";
var ogInputSchema = objectType({
	title: stringType().trim().min(1).max(240).default("Tech Faculty NG"),
	category: stringType().trim().min(1).max(64).default("Tech skills"),
	subtitle: stringType().trim().max(320).default("Licensed technology training, career guides and opportunities across Nigeria."),
	format: enumType(["png", "svg"]).default("png")
});
/** One deterministic URL shared by article metadata and BlogPosting schema. */
function articleOgImage(post) {
	const query = new URLSearchParams({
		title: post.title.slice(0, 240),
		category: (post.tags[0] || "Career guide").slice(0, 64),
		subtitle: post.description.slice(0, 320),
		v: "1"
	});
	return `${SITE_URL}/api/public/og?${query}`;
}
function parseOgInput(url) {
	return ogInputSchema.safeParse(Object.fromEntries([
		"title",
		"category",
		"subtitle",
		"format"
	].flatMap((key) => {
		const value = url.searchParams.get(key);
		return value === null ? [] : [[key, value]];
	})));
}
//#endregion
export { articleOgImage as n, parseOgInput as r, OG_CACHE_CONTROL as t };
