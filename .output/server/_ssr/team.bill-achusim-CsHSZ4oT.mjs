import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { S as getRouteApi } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { at as Instagram, p as Twitter, tt as Linkedin } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as BLOG_AUTHOR, r as authorSchema, t as AUTHOR_URL } from "./author-DxxB3mAx.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/team.bill-achusim-CsHSZ4oT.js
var import_jsx_runtime = require_jsx_runtime();
var route = getRouteApi("/team/bill-achusim");
var Founder = () => {
	const { articles } = route.useLoaderData();
	const schema = {
		"@context": "https://schema.org",
		"@type": "ProfilePage",
		url: AUTHOR_URL,
		mainEntity: {
			...authorSchema,
			description: "Founder and lead technical developer of Tech Faculty NG, a licensed tech school in Nnewi, Anambra State, Nigeria.",
			knowsAbout: [
				"Software engineering",
				"Software architecture",
				"Tech education",
				"AI automation"
			],
			homeLocation: {
				"@type": "Place",
				name: "Nnewi, Anambra State, Nigeria"
			}
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify(schema)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "py-20 px-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container mx-auto max-w-3xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/about",
									className: "hover:text-primary",
									children: "About Tech Faculty NG"
								}), " / Team"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-4xl md:text-5xl font-bold mb-2",
								children: BLOG_AUTHOR.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg text-muted-foreground mb-6",
								children: BLOG_AUTHOR.role
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4 text-muted-foreground mb-10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: BLOG_AUTHOR.linkedin,
										target: "_blank",
										rel: "me noopener",
										"aria-label": "Bill Achusim on LinkedIn",
										className: "hover:text-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, { size: 20 })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: BLOG_AUTHOR.x,
										target: "_blank",
										rel: "me noopener",
										"aria-label": "Bill Achusim on X",
										className: "hover:text-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, { size: 20 })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: BLOG_AUTHOR.instagram,
										target: "_blank",
										rel: "me noopener",
										"aria-label": "Bill Achusim on Instagram",
										className: "hover:text-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { size: 20 })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4 text-muted-foreground leading-relaxed",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [BLOG_AUTHOR.fullName, " is a software architect and programmer who founded Tech Faculty NG in 2022 at the Digital Village in Nnewi, Anambra State. He holds a master's degree in Systems Engineering from the University of Lagos and is still the school's lead technical developer: he builds the platforms our students learn on and the Talent Pool that matches graduates to paid work."] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "He started Tech Faculty NG so that young people in South-East Nigeria could learn job-ready tech skills without moving to Lagos, and get paid work at the end of it. That idea, train, certify and employ, still runs the school, which is licensed by the Federal Ministry of Science, Technology and Innovation through NBTI." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "He is also the founder of the Nnewi Tech Meetup, and writes on this site about tech careers, AI automation and hiring in Nigeria." })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-8 text-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/outcomes",
									className: "text-primary hover:underline",
									children: "See our student outcomes and how we count them"
								})
							})
						]
					})
				}), articles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "py-16 px-4 bg-muted/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container mx-auto max-w-3xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold mb-6",
								children: "Recent articles by Bill"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-3",
								children: articles.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-col sm:flex-row sm:items-baseline sm:gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
										dateTime: a.date,
										className: "text-sm text-muted-foreground shrink-0 w-28",
										children: new Date(a.date).toLocaleDateString("en-GB", {
											day: "numeric",
											month: "short",
											year: "numeric"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: `/blog/${a.slug}`,
										className: "font-medium hover:text-primary",
										children: a.title
									})]
								}, a.slug))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/blog",
									className: "text-primary hover:underline",
									children: "All articles"
								})
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = Founder;
//#endregion
export { SplitComponent as component };
