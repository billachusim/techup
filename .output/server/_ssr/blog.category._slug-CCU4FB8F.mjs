import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as useParams$1, n as Navigate$1, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { Mt as Clock, an as ArrowLeft, ct as Heart, in as ArrowRight } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { i as getCategoryBySlug, t as blogCategories } from "./blogCategories-DJ3ikanU.mjs";
import { t as useAllBlogPosts } from "./useBlogPostsData-CG3KP4TR.mjs";
import { t as useBlogLikeCounts } from "./useBlogLikeCounts-HWPN6VMo.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/blog.category._slug-CCU4FB8F.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var BlogCategory = () => {
	const { slug } = useParams$1();
	const category = slug ? getCategoryBySlug(slug) : void 0;
	const likeCounts = useBlogLikeCounts();
	const { posts: allPosts } = useAllBlogPosts();
	const posts = (0, import_react.useMemo)(() => {
		if (!category) return [];
		return allPosts.filter((p) => p.tags[0] === category.name);
	}, [category, allPosts]);
	if (!category) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate$1, {
		to: "/blog",
		replace: true
	});
	const url = `https://techfaculty.ng/blog/category/${category.slug}`;
	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: "https://techfaculty.ng/"
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Blog",
				item: "https://techfaculty.ng/blog"
			},
			{
				"@type": "ListItem",
				position: 3,
				name: category.name,
				item: url
			}
		]
	};
	const collectionSchema = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: `${category.name} — Tech Faculty NG Blog`,
		description: category.description,
		url,
		isPartOf: {
			"@type": "Blog",
			name: "Tech Faculty NG Blog",
			url: "https://techfaculty.ng/blog"
		},
		keywords: category.keywords.join(", "),
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: posts.length,
			itemListElement: posts.map((p, i) => ({
				"@type": "ListItem",
				position: i + 1,
				url: `https://techfaculty.ng/blog/${p.slug}`,
				name: p.title
			}))
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify(breadcrumbSchema)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify(collectionSchema)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								"aria-label": "Breadcrumb",
								className: "text-sm text-muted-foreground mb-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/",
										className: "hover:text-primary",
										children: "Home"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mx-2",
										children: "/"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/blog",
										className: "hover:text-primary",
										children: "Blog"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mx-2",
										children: "/"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: category.name
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								to: "/blog",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									className: "-ml-2 mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
										size: 16,
										className: "mr-1"
									}), " All categories"]
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-3xl md:text-5xl font-bold mb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gradient",
									children: category.name
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed",
								children: category.intro
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								to: "/blog",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "cursor-pointer px-4 py-1.5 text-sm",
									children: "All"
								})
							}), blogCategories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								to: `/blog/category/${c.slug}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: c.slug === category.slug ? "default" : "outline",
									className: "cursor-pointer px-4 py-1.5 text-sm",
									children: c.name
								})
							}, c.slug))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "container mx-auto max-w-4xl",
							children: posts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "No posts in this category yet — check back soon."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-6",
								children: posts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: `/blog/${post.slug}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "h-full hover:border-primary/50 transition-colors group",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-6 flex flex-col h-full",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 mb-3",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
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
												}),
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
										})
									})
								}, post.slug))
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = BlogCategory;
//#endregion
export { SplitComponent as component };
