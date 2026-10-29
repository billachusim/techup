import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { Mt as Clock, ct as Heart, in as ArrowRight } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { r as getCategoryByName, t as blogCategories } from "./blogCategories-DJ3ikanU.mjs";
import { t as useAllBlogPosts } from "./useBlogPostsData-CG3KP4TR.mjs";
import { t as useBlogLikeCounts } from "./useBlogLikeCounts-HWPN6VMo.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/blog.index-BD9_te41.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var Blog = () => {
	const { posts: sortedPosts } = useAllBlogPosts();
	const categories = blogCategories;
	const likeCounts = useBlogLikeCounts();
	const [activeCategory, setActiveCategory] = (0, import_react.useState)(null);
	const filtered = activeCategory ? sortedPosts.filter((p) => p.tags[0] === activeCategory) : sortedPosts;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "Blog",
					name: "Tech Faculty NG Blog",
					description: "Tech career guides, course deep-dives, and industry insights from Tech Faculty NG.",
					url: "https://techfaculty.ng/blog",
					publisher: {
						"@type": "Organization",
						name: "Tech Faculty NG",
						url: "https://techfaculty.ng"
					},
					blogPost: sortedPosts.map((post) => ({
						"@type": "BlogPosting",
						headline: post.title,
						description: post.description,
						datePublished: post.date,
						author: {
							"@type": "Organization",
							name: "Tech Faculty NG"
						},
						url: `https://techfaculty.ng/blog/${post.slug}`,
						keywords: post.tags.join(", ")
					}))
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "ItemList",
					name: "Tech Faculty NG Blog Categories",
					itemListElement: blogCategories.map((c, i) => ({
						"@type": "ListItem",
						position: i + 1,
						name: c.name,
						url: `https://techfaculty.ng/blog/category/${c.slug}`
					}))
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-20 px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-4xl md:text-5xl font-bold mb-4",
								children: ["Blog & ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gradient",
									children: "Resources"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg text-muted-foreground max-w-2xl mx-auto",
								children: "Practical guides, career tips, and industry insights to help you launch and grow your tech career in Nigeria."
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "px-4 pb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl flex flex-wrap gap-2 justify-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "sr-only",
									children: "Browse by Category"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: activeCategory === null ? "default" : "outline",
									className: "cursor-pointer px-4 py-1.5 text-sm",
									onClick: () => setActiveCategory(null),
									children: "All"
								}),
								categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: `/blog/category/${cat.slug}`,
									"aria-label": `${cat.name} category`,
									onClick: (e) => {
										if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
										e.preventDefault();
										setActiveCategory(cat.name);
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: activeCategory === cat.name ? "default" : "outline",
										className: "cursor-pointer px-4 py-1.5 text-sm",
										children: cat.name
									})
								}, cat.slug))
							]
						}), activeCategory && getCategoryByName(activeCategory) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "container mx-auto max-w-4xl text-center mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
								to: `/blog/category/${getCategoryByName(activeCategory).slug}`,
								className: "text-sm text-primary hover:underline",
								children: [
									"View full ",
									activeCategory,
									" category page →"
								]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "sr-only",
								children: "Recent Articles"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-6",
								children: filtered.map((post) => {
									const cat = getCategoryByName(post.tags[0]);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "h-full hover:border-primary/50 transition-colors group",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-6 flex flex-col h-full",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 mb-3",
												children: [
													cat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
														to: `/blog/category/${cat.slug}`,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "secondary",
															className: "text-xs hover:bg-secondary/80",
															children: post.tags[0]
														})
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "secondary",
														className: "text-xs",
														children: post.tags[0]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-xs text-muted-foreground flex items-center gap-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { size: 12 }),
															" ",
															post.readTime,
															" min read"
														]
													}),
													likeCounts[post.slug] > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-xs text-muted-foreground flex items-center gap-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { size: 12 }),
															" ",
															likeCounts[post.slug]
														]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
												to: `/blog/${post.slug}`,
												className: "flex-1 flex flex-col",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
														className: "text-lg font-bold mb-2 group-hover:text-primary transition-colors",
														children: post.title
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-muted-foreground flex-1",
														children: post.description
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1 text-primary text-sm font-medium mt-4",
														children: ["Read article ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
													})
												]
											})]
										})
									}, post.slug);
								})
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = Blog;
//#endregion
export { SplitComponent as component };
