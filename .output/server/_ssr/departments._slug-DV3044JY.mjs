import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as useParams$1, n as Navigate$1, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { p as planMinimum, r as INSTALMENTS } from "./fees-B-53IxaZ.mjs";
import { a as getDepartmentBySlug, n as departmentUpdated, r as departments, t as departmentFaqs } from "./departments-DtVPzGk2.mjs";
import { Ft as CircleCheck, Mt as Clock, _ as TrendingUp, an as ArrowLeft, q as MessageCircle, qt as CalendarCheck, s as Users } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { n as COMMUNITY_WHATSAPP_URL } from "./whatsapp-BIGKDc9S.mjs";
import { t as DEPARTMENT_GUIDES } from "./internalLinks-CcRpzT8J.mjs";
import { t as LastUpdated } from "./LastUpdated-DLGRZy9q.mjs";
import { t as JoinWhatsAppButton } from "./JoinWhatsAppButton-gx5qEaAI.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/departments._slug-DV3044JY.js
var import_jsx_runtime = require_jsx_runtime();
var DepartmentDetail = () => {
	const { slug } = useParams$1();
	const dept = slug ? getDepartmentBySlug(slug) : void 0;
	if (!dept) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate$1, {
		to: "/departments",
		replace: true
	});
	const url = `https://techfaculty.ng/departments/${dept.slug}`;
	const weeks = dept.duration.match(/\d+/g);
	const courseWorkload = weeks ? `P${weeks[weeks.length - 1]}W` : void 0;
	const faqs = departmentFaqs(dept);
	const fee = dept.planId ? planMinimum(dept.planId) : void 0;
	const instalments = INSTALMENTS.enabled && fee !== void 0 && fee >= INSTALMENTS.minimumTotal;
	const updated = departmentUpdated(dept);
	const courseSchema = {
		"@context": "https://schema.org",
		"@type": "Course",
		name: `${dept.title} Programme — Tech Faculty NG`,
		description: dept.metaDescription,
		url,
		dateModified: updated,
		keywords: dept.keywords.join(", "),
		inLanguage: "en-NG",
		teaches: dept.courses,
		provider: {
			"@type": "EducationalOrganization",
			name: "Tech Faculty NG",
			url: "https://techfaculty.ng/",
			areaServed: "NG"
		},
		offers: {
			"@type": "Offer",
			category: "Paid",
			url
		},
		hasCourseInstance: [{
			"@type": "CourseInstance",
			courseMode: "Online",
			courseWorkload
		}, {
			"@type": "CourseInstance",
			courseMode: "Onsite",
			courseWorkload,
			location: {
				"@type": "Place",
				name: "Technology Incubation Centre, Nnewi",
				address: {
					"@type": "PostalAddress",
					addressLocality: "Nnewi",
					addressRegion: "Anambra State",
					addressCountry: "NG"
				}
			}
		}]
	};
	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		url,
		dateModified: updated,
		mainEntity: faqs.map((f) => ({
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
				item: "https://techfaculty.ng/"
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Departments",
				item: "https://techfaculty.ng/departments"
			},
			{
				"@type": "ListItem",
				position: 3,
				name: dept.title,
				item: url
			}
		]
	};
	const related = departments.filter((d) => d.slug !== dept.slug).slice(0, 3);
	const guides = DEPARTMENT_GUIDES[dept.slug] ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
					type: "application/ld+json",
					children: JSON.stringify(courseSchema)
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
										to: "/departments",
										className: "hover:text-primary",
										children: "Departments"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mx-2",
										children: "/"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: dept.title
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								to: "/departments",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									className: "-ml-2 mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
										size: 16,
										className: "mr-1"
									}), " All departments"]
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2 mb-4",
									children: [
										dept.trending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "secondary",
											className: "gap-1 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }), " Trending"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-xs",
											children: dept.difficulty
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
												" ",
												dept.duration
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }),
												" ",
												dept.enrollment,
												" enrolled"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "text-3xl md:text-5xl font-bold mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gradient",
										children: dept.title
									}), " Department"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base md:text-lg text-muted-foreground leading-relaxed mb-4",
									children: dept.intro
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-4 rounded-lg border border-primary/30 bg-primary/5 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-2 font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-4 w-4 text-primary" }), " Start any time"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: [
											"Registration is continuous. Enrol today and join the current ",
											dept.title,
											" cohort, or learn one-on-one.",
											instalments && ` You can pay in two instalments within ${INSTALMENTS.balanceDueDays} days.`
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LastUpdated, {
									date: updated,
									className: "mb-4"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JoinWhatsAppButton, {
									url: COMMUNITY_WHATSAPP_URL,
									groupName: "the Tech Faculty WhatsApp community",
									captureSource: `department:${dept.slug}`,
									captureContext: dept.title,
									size: "lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center justify-center gap-2",
										children: [
											"Join the ",
											dept.title,
											" community ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { size: 16 })
										]
									})
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
								children: "What you will learn"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: dept.courses.map((course) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 mt-0.5 text-primary flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: course })]
								}, course))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold mb-4",
								children: "Tools and technologies"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: dept.tools.map((tool) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "px-3 py-1 text-sm",
									children: tool
								}, tool))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold mb-4",
								children: "Who this department is for"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2 text-sm text-muted-foreground",
								children: dept.audience.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 mt-0.5 text-primary flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a })]
								}, a))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-bold mb-4",
									children: "Career outcomes and earning potential"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
									children: dept.outcomes.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "p-5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold mb-1",
											children: o.role
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: o.salary
										})]
									}) }, o.role))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-3",
									children: "Ranges reflect advertised Nigerian and remote-contract pay observed on our jobs board and partner platforms; individual offers vary."
								})
							]
						})
					}),
					guides.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-2xl font-bold mb-4",
								children: [dept.title, " guides from our blog"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
								children: guides.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: `/blog/${g.slug}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "h-full hover:border-primary/50 transition-colors",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
											className: "p-5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold",
												children: g.label
											})
										})
									})
								}, g.slug))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-bold mb-4",
									children: "How to join"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
									className: "space-y-2 text-sm text-muted-foreground list-decimal list-inside",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Join the Tech Faculty WhatsApp community and tell us which department you want." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Create your account to receive a Faculty ID." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Choose online, hybrid, or on-campus study at any of our centres nationwide." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Complete your projects and receive a verifiable Tech Faculty certificate." })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-3 mt-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JoinWhatsAppButton, {
											url: COMMUNITY_WHATSAPP_URL,
											groupName: "the Tech Faculty WhatsApp community",
											captureSource: `department-footer:${dept.slug}`,
											captureContext: dept.title,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center justify-center gap-2",
												children: ["Join Community ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { size: 14 })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: "/locations",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												children: "Find a campus near you"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: "/careers",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												children: "See live tech jobs"
											})
										})
									]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-2xl font-bold mb-4",
								children: [dept.title, " — frequently asked questions"]
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
						className: "px-4 pb-20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold mb-4",
								children: "Explore other departments"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
								children: related.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: `/departments/${d.slug}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "h-full hover:border-primary/50 transition-colors",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold mb-1",
												children: d.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted-foreground",
												children: d.tagline
											})]
										})
									})
								}, d.slug))
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = DepartmentDetail;
//#endregion
export { SplitComponent as component };
