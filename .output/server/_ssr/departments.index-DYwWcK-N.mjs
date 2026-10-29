import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { r as departments } from "./departments-DtVPzGk2.mjs";
import { Mt as Clock, in as ArrowRight, s as Users } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/departments.index-DYwWcK-N.js
var import_jsx_runtime = require_jsx_runtime();
var url = "https://techfaculty.ng/departments";
var DepartmentsIndex = () => {
	const itemListSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: "Tech Faculty NG Departments",
		numberOfItems: departments.length,
		itemListElement: departments.map((d, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: `${d.title} Department`,
			url: `${url}/${d.slug}`
		}))
	};
	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [{
			"@type": "ListItem",
			position: 1,
			name: "Home",
			item: "https://techfaculty.ng/"
		}, {
			"@type": "ListItem",
			position: 2,
			name: "Departments",
			item: url
		}]
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify(itemListSchema)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify(breadcrumbSchema)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "px-4 pt-8 pb-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container mx-auto max-w-4xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: "Departments"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-3xl md:text-5xl font-bold mb-4",
								children: ["Our ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gradient",
									children: "Departments"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base md:text-lg text-muted-foreground leading-relaxed",
								children: "Ten departments, one philosophy: AI for everything. Every programme runs online, hybrid, or on campus inside a Technology Incubation Centre, and every graduate leaves with projects, a verifiable certificate, and access to our jobs board. Pick a department to see the full curriculum, tools, salaries, and how to join."
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "px-4 pb-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "container mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5",
						children: departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
							to: `/departments/${d.slug}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: "h-full hover:border-primary/50 transition-colors group",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "p-6 flex flex-col h-full",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2 mb-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "text-xs",
													children: d.difficulty
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs text-muted-foreground flex items-center gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { size: 12 }),
														" ",
														d.duration
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs text-muted-foreground flex items-center gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { size: 12 }),
														" ",
														d.enrollment
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-lg font-bold mb-2 group-hover:text-primary transition-colors",
											children: d.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground flex-1",
											children: d.tagline
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1 text-primary text-sm font-medium mt-4",
											children: ["Enter department ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
										})
									]
								})
							})
						}, d.slug))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = DepartmentsIndex;
//#endregion
export { SplitComponent as component };
