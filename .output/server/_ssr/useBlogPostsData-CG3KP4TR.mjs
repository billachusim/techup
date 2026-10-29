import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as blogPosts } from "./blogPosts-0fYtIgLY.mjs";
import { n as isRetiredBlogSlug } from "./blog-redirects-COUXMWf2.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/useBlogPostsData-CG3KP4TR.js
/** Generated posts repeat the title as an H1; the page renders its own H1. */
function stripLeadingH1(markdown) {
	return markdown.replace(/^\s*#\s+.*\n+/, "");
}
function toBlogPost(row) {
	const minutes = parseInt(row.read_time, 10);
	const tags = row.tags?.length ? row.tags : [row.category];
	return {
		slug: row.slug,
		title: row.title,
		description: row.description,
		content: stripLeadingH1(row.content),
		date: row.published_at,
		...row.updated_at ? { updated: row.updated_at } : {},
		author: row.author || "Tech Faculty NG",
		tags: tags[0] === row.category ? tags : [row.category, ...tags],
		readTime: Number.isFinite(minutes) ? minutes : 8
	};
}
async function fetchDbPosts() {
	const { data, error } = await (await getSupabase()).from("blog_posts").select("slug, title, description, content, category, tags, author, read_time, published_at, updated_at").eq("is_published", true).order("published_at", { ascending: false });
	if (error) throw error;
	return (data ?? []).filter((row) => !isRetiredBlogSlug(row.slug)).map(toBlogPost);
}
/**
* All blog posts: the curated static library plus weekly auto-generated posts,
* newest first. Static posts win on slug collisions.
*/
function useAllBlogPosts() {
	const query = useQuery({
		queryKey: ["blog-posts-db"],
		queryFn: fetchDbPosts,
		staleTime: 6e5
	});
	const staticSlugs = new Set(blogPosts.map((p) => p.slug));
	return {
		posts: [...blogPosts, ...(query.data ?? []).filter((p) => !staticSlugs.has(p.slug))].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
		isLoading: query.isLoading
	};
}
//#endregion
export { useAllBlogPosts as t };
