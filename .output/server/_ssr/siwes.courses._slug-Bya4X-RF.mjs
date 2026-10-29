import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as useParams$1, n as Navigate$1, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { a as LOWEST_PAID_PLAN } from "./fees-B-53IxaZ.mjs";
import { r as departments } from "./departments-DtVPzGk2.mjs";
import { Ft as CircleCheck, an as ArrowLeft, g as TriangleAlert, in as ArrowRight, q as MessageCircle, r as X } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { i as formatNaira, r as VIRTUAL_SIWES } from "./virtualSiwes-DYcaq-8X.mjs";
import { t as VirtualSiwesOffer } from "./VirtualSiwesOffer-CCEytK5u.mjs";
import { t as LastUpdated } from "./LastUpdated-DLGRZy9q.mjs";
import { a as siwesCourses, n as SIWES_GUIDES, r as getSiwesCourse, t as SIWES_COURSES_UPDATED } from "./siwesCourses-DZzSWWov.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/siwes.courses._slug-Bya4X-RF.js
var import_jsx_runtime = require_jsx_runtime();
var SITE = "https://techfaculty.ng";
var SiwesCourseDetail = () => {
	const { slug } = useParams$1();
	const course = slug ? getSiwesCourse(slug) : void 0;
	if (!course) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate$1, {
		to: "/siwes/courses",
		replace: true
	});
	const url = `${SITE}/siwes/courses/${course.slug}`;
	const deptTitle = (s) => departments.find((d) => d.slug === s)?.title ?? s;
	const whatsappHref = `https://wa.me/${VIRTUAL_SIWES.whatsappNumber}?text=${encodeURIComponent(`Hello Tech Faculty NG, I study ${course.name} and I want to do my SIWES/IT with you. Please send me the details.`)}`;
	const others = siwesCourses.filter((c) => c.slug !== course.slug);
	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		url,
		dateModified: SIWES_COURSES_UPDATED,
		mainEntity: course.faqs.map((f) => ({
			"@type": "Question",
			name: f.q,
			acceptedAnswer: {
				"@type": "Answer",
				text: f.a
			}
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
				item: `${SITE}/siwes/courses`
			},
			{
				"@type": "ListItem",
				position: 4,
				name: course.name,
				item: url
			}
		]
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify(faqSchema)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify(breadcrumbSchema)
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
										to: "/siwes",
										className: "hover:text-primary",
										children: "SIWES"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mx-2",
										children: "/"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/siwes/courses",
										className: "hover:text-primary",
										children: "By course"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mx-2",
										children: "/"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: course.name
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								to: "/siwes/courses",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									className: "-ml-2 mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
										size: 16,
										className: "mr-1"
									}), " All courses"]
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-3xl md:text-5xl font-bold mb-4",
									children: course.h1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base md:text-lg text-muted-foreground leading-relaxed mb-4",
									children: course.shortAnswer
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2 mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground self-center",
										children: "Also for:"
									}), course.alsoFor.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-xs",
										children: c
									}, c))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LastUpdated, {
									date: SIWES_COURSES_UPDATED,
									className: "mb-6"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: whatsappHref,
											target: "_blank",
											rel: "noopener noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
												size: 18,
												className: "mr-2"
											}), " Apply on WhatsApp"]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										variant: "outline",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "#virtual-siwes",
											children: ["Do it online instead ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
												size: 18,
												className: "ml-2"
											})]
										})
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-bold mb-4",
									children: "Why tech work counts as industrial training for your course"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground leading-relaxed",
									children: course.whyItFits
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 rounded-lg border border-amber-500/40 bg-amber-500/5 p-5 flex gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 text-amber-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold mb-1",
										children: "Check with your SIWES coordinator first"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground leading-relaxed",
										children: course.coordinatorCheck
									})] })]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-bold mb-2",
									children: "What you would actually do"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground mb-5",
									children: "Real work for real clients, reviewed by a mentor every week. Each project runs inside one of our departments."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: course.projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "h-full",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold mb-2",
													children: p.title
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted-foreground mb-3",
													children: p.detail
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
													to: `/departments/${p.department}`,
													className: "text-xs text-primary font-medium hover:underline",
													children: [deptTitle(p.department), " department"]
												})
											]
										})
									}, p.title))
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-bold mb-2",
									children: "What your logbook could say"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground mb-5",
									children: "Weak entries describe attendance. Strong entries describe work your supervisor can sign honestly. These are examples of the kind of entry this placement produces."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-4",
									children: course.logbook.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-3 md:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border border-border bg-muted/30 p-4 text-sm flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4 text-destructive shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold",
												children: "Weak: "
											}), l.weak] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold",
												children: "Strong: "
											}), l.strong] })]
										})]
									}, l.strong))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground mt-4",
									children: [
										"More on this in our guide to",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: "/blog/siwes-logbook-mistakes-nigeria-fix",
											className: "text-primary hover:underline",
											children: "SIWES logbook mistakes and how to fix them"
										}),
										"."
									]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold mb-4",
								children: "Skills and tools you leave with"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: course.skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "px-3 py-1 text-sm",
									children: s
								}, s))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold mb-4",
								children: "On site or online, and what each costs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 md:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "p-5 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold",
											children: "On site at a Tech Faculty centre"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm text-muted-foreground",
											children: [
												"No separate placement fee. On Learn & Pay you pay your department's regular course fee, from",
												" ",
												formatNaira(LOWEST_PAID_PLAN),
												", with up to ",
												50,
												"% off for SIWES students. On Tutor & Earn, if you are already skilled enough to teach, we pay you."
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
											to: "/locations",
											className: "text-sm text-primary font-medium hover:underline inline-flex items-center gap-1",
											children: ["Find a centre near you ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									className: "border-primary/40",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "p-5 space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold",
												children: "Online with Virtual SIWES"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm text-muted-foreground",
												children: [
													formatNaira(VIRTUAL_SIWES.placementPriceNGN),
													" for your full IT, plus",
													" ",
													formatNaira(VIRTUAL_SIWES.logbookPriceNGN),
													" for logbook signing, stamping and two-way courier delivery. Virtual SIWES is charged because it covers online supervision and the waybill."
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted-foreground",
												children: course.virtualFit
											})
										]
									})
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "virtual-siwes",
						className: "px-4 scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "container mx-auto max-w-4xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VirtualSiwesOffer, {
								source: course.slug,
								channel: "siwes-course"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold mb-4",
								children: "SIWES guides to read next"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
								children: course.guides.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: `/blog/${g}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "h-full hover:border-primary/50 transition-colors",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
											className: "p-5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold",
												children: SIWES_GUIDES[g] ?? g
											})
										})
									})
								}, g))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-2xl font-bold mb-4",
								children: [course.name, " SIWES questions"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4",
								children: course.faqs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
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
						className: "px-4 pb-20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-bold mb-4",
									children: "SIWES for other courses"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: others.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: `/siwes/courses/${c.slug}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
											className: "h-full hover:border-primary/50 transition-colors",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
												className: "p-5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold mb-1",
													children: c.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted-foreground",
													children: c.alsoFor.slice(0, 3).join(", ")
												})]
											})
										})
									}, c.slug))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
									to: "/siwes/courses",
									className: "inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline mt-4",
									children: ["See every course, including computer science ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
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
var SplitComponent = SiwesCourseDetail;
//#endregion
export { SplitComponent as component };
