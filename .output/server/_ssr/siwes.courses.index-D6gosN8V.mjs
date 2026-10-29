import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { n as campuses } from "./campuses-DtkbL75I.mjs";
import { r as departments } from "./departments-DtVPzGk2.mjs";
import { Qt as BookOpen, Y as MapPin, in as ArrowRight, q as MessageCircle } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { i as formatNaira, r as VIRTUAL_SIWES } from "./virtualSiwes-DYcaq-8X.mjs";
import { t as LastUpdated } from "./LastUpdated-DLGRZy9q.mjs";
import { a as siwesCourses, i as siwesCourseGuides, n as SIWES_GUIDES, t as SIWES_COURSES_UPDATED } from "./siwesCourses-DZzSWWov.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/siwes.courses.index-D6gosN8V.js
var import_jsx_runtime = require_jsx_runtime();
var SITE = "https://techfaculty.ng";
var PAGE_URL = `${SITE}/siwes/courses`;
var deptTitle = (s) => departments.find((d) => d.slug === s)?.title ?? s;
var faqs = [
	{
		q: "Can I do SIWES in a tech company if I don't study computer science?",
		a: "Often, yes. Schools accept a host that is real, registered, relevant to your course and willing to supervise you. Engineering, mass communication, statistics, business and OTM students can all do relevant work in a tech setting, from embedded systems to content, data and digital office work. Your department makes the final decision, so confirm with your SIWES coordinator first."
	},
	{
		q: "How much does SIWES at Tech Faculty NG cost for my course?",
		a: `The same for every course. On-site SIWES has no separate placement fee: on Learn & Pay you pay your department's regular course fee with up to 50% off for SIWES students, and Tutor & Earn pays you. Virtual SIWES costs ${formatNaira(VIRTUAL_SIWES.placementPriceNGN)} for the full placement, plus ${formatNaira(VIRTUAL_SIWES.logbookPriceNGN)} for the logbook service.`
	},
	{
		q: "My course is not listed. Can I still apply?",
		a: "Yes. Message us on WhatsApp with your course and what your department expects, and we tell you honestly whether the work we can supervise is relevant. If it is not, we say so, so you can find a better host in time."
	}
];
var SiwesCourses = () => {
	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		url: PAGE_URL,
		dateModified: SIWES_COURSES_UPDATED,
		mainEntity: faqs.map((f) => ({
			"@type": "Question",
			name: f.q,
			acceptedAnswer: {
				"@type": "Answer",
				text: f.a
			}
		}))
	};
	const listSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: "SIWES placements by course of study",
		url: PAGE_URL,
		itemListElement: siwesCourses.map((c, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: c.h1,
			url: `${SITE}/siwes/courses/${c.slug}`
		}))
	};
	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: `${SITE}/`
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "SIWES",
				item: `${SITE}/siwes`
			},
			{
				"@type": "ListItem",
				position: 3,
				name: "By course",
				item: PAGE_URL
			}
		]
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
					type: "application/ld+json",
					children: JSON.stringify(listSchema)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
					type: "application/ld+json",
					children: JSON.stringify(faqSchema)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
					type: "application/ld+json",
					children: JSON.stringify(breadcrumbSchema)
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pt-8 pb-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-5xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
									"aria-label": "Breadcrumb",
									className: "text-sm text-muted-foreground mb-6",
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
											to: "/siwes",
											className: "hover:text-primary",
											children: "SIWES"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mx-2",
											children: "/"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: "By course"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-3xl md:text-5xl font-bold mb-4",
									children: "SIWES placements by course of study"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mb-4",
									children: "A tech placement is not only for computer science students. Pick your course to see the real work you would do at Tech Faculty NG, what your logbook could say, what to confirm with your SIWES coordinator, and whether doing it online makes sense."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LastUpdated, { date: SIWES_COURSES_UPDATED })
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "container mx-auto max-w-5xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4",
								children: [siwesCourses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: `/siwes/courses/${c.slug}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "h-full hover:border-primary/50 transition-colors",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-6",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-lg font-semibold mb-1",
													children: c.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground mb-3",
													children: c.alsoFor.join(" · ")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-sm text-muted-foreground mb-3",
													children: [c.projects.slice(0, 2).map((p) => p.title).join(", "), " and more."]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-sm text-primary font-medium inline-flex items-center gap-1",
													children: ["See the placement ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
												})
											]
										})
									})
								}, c.slug)), siwesCourseGuides.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: `/blog/${g.slug}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "h-full hover:border-primary/50 transition-colors",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-6",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-lg font-semibold mb-1",
													children: g.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground mb-3",
													children: g.alsoFor
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-sm text-primary font-medium inline-flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { size: 14 }), " Read the full guide"]
												})
											]
										})
									})
								}, g.slug))]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-5xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold mb-4",
								children: "At a glance: your course and the work that fits it"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto rounded-lg border border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-muted/50 text-left",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3 font-semibold",
												children: "Course"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3 font-semibold",
												children: "Example project"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3 font-semibold",
												children: "Department"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: siwesCourses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-border align-top",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
													to: `/siwes/courses/${c.slug}`,
													className: "text-primary hover:underline",
													children: c.name
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-muted-foreground",
												children: c.projects[0].title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
													to: `/departments/${c.projects[0].department}`,
													className: "hover:text-primary",
													children: deptTitle(c.projects[0].department)
												})
											})
										]
									}, c.slug)) })]
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-5xl grid gap-4 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-6 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: "On site: no placement fee"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted-foreground",
										children: [
											"Learn & Pay students pay their department's regular course fee with up to ",
											50,
											"% off for SIWES. Tutor & Earn students get paid."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
										to: "/siwes",
										className: "text-sm text-primary font-medium hover:underline inline-flex items-center gap-1",
										children: ["How on-site SIWES works ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: "border-primary/40",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "p-6 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-semibold",
											children: ["Online: Virtual SIWES ", formatNaira(VIRTUAL_SIWES.placementPriceNGN)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm text-muted-foreground",
											children: [
												"Full placement from any Nigerian city, plus ",
												formatNaira(VIRTUAL_SIWES.logbookPriceNGN),
												" for logbook signing, stamping and two-way courier delivery."
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
											to: "/virtual-siwes",
											className: "text-sm text-primary font-medium hover:underline inline-flex items-center gap-1",
											children: ["How Virtual SIWES works ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
										})
									]
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-5xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-bold mb-2",
									children: "SIWES near you"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground mb-5",
									children: "Every centre takes SIWES students each session. Each city page lists the institutions we commonly host from."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2",
									children: campuses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
										to: `/locations/${c.slug}#siwes`,
										className: "flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:border-primary/50 hover:text-primary",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
												size: 14,
												className: "shrink-0"
											}),
											" SIWES in ",
											c.city
										]
									}, c.slug))
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-5xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold mb-4",
								children: "SIWES guides"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "grid gap-2 sm:grid-cols-2 text-sm",
								children: Object.entries(SIWES_GUIDES).map(([slug, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: `/blog/${slug}`,
									className: "text-primary hover:underline",
									children: label
								}) }, slug))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-5xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold mb-4",
								children: "Questions about SIWES by course"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4",
								children: faqs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "p-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold mb-2",
										children: f.q
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: f.a
									})]
								}) }, f.q))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-20 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-2xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-bold mb-3",
									children: "Not sure your course fits?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground mb-6",
									children: "Tell us your course and what your department expects. We reply with an honest answer."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: `https://wa.me/${VIRTUAL_SIWES.whatsappNumber}?text=${encodeURIComponent("Hello Tech Faculty NG, I want to do my SIWES/IT with you. My course is: ")}`,
										target: "_blank",
										rel: "noopener noreferrer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
											size: 18,
											className: "mr-2"
										}), " Ask on WhatsApp"]
									})
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = SiwesCourses;
//#endregion
export { SplitComponent as component };
