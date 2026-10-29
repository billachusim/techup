import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as useParams$1, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { a as getCampusBySlug, n as campuses } from "./campuses-DtkbL75I.mjs";
import { a as LOWEST_PAID_PLAN, f as naira, n as HYBRID_FEE, s as PHYSICAL_FEE } from "./fees-B-53IxaZ.mjs";
import { Ft as CircleCheck, Jt as Building2, Y as MapPin, bt as ExternalLink, in as ArrowRight, q as MessageCircle, xt as Earth } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-De3Puk9b.mjs";
import { r as VIRTUAL_SIWES } from "./virtualSiwes-DYcaq-8X.mjs";
import { c as hubWhatsAppUrl, l as hubsInCity, n as COURSE_AREA_DEPARTMENT, o as getHub, r as HUBS_DISCLAIMER } from "./techHubs-JbJ8WLyC.mjs";
import { n as getCityGuideForCity } from "./internalLinks-CcRpzT8J.mjs";
import { t as NotFound } from "./NotFound-Do2-AqLX.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/hubs._slug-DvO_ShtR.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var HubDetail = () => {
	const { slug } = useParams$1();
	const hub = slug ? getHub(slug) : void 0;
	const [courseArea, setCourseArea] = (0, import_react.useState)("Not sure yet");
	if (!hub) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFound, {});
	const canonical = `https://techfaculty.ng/hubs/${hub.slug}`;
	`${hub.name}${hub.city}`;
	`${hub.name}${hub.city}${hub.country}`;
	const related = hubsInCity(hub.city, hub.slug);
	const cityGuide = getCityGuideForCity(hub.city);
	const campus = hub.campusSlug && getCampusBySlug(hub.campusSlug) || campuses.find((c) => c.city === hub.city) || (cityGuide?.nearestCampusSlug ? getCampusBySlug(cityGuide.nearestCampusSlug) : void 0);
	const faqs = [
		{
			q: `What can I study in ${hub.city}?`,
			a: `In ${hub.city} the course areas most commonly available are ${hub.courseAreas.join(", ")}. Tech Faculty NG teaches all of these as structured tracks with a verifiable certificate. Online study is included in the fee, hybrid adds ${naira(HYBRID_FEE)} and weekly on-site classes add ${naira(PHYSICAL_FEE)}.`
		},
		{
			q: `Is Tech Faculty the same as ${hub.name}?`,
			a: hub.isTechFaculty ? `Yes. ${hub.name} is one of our own campuses, so you enrol with Tech Faculty NG directly, study on site with our mentors and receive a Tech Faculty certificate that employers can verify online. You can also take the same departments online or hybrid if you cannot attend every class in person.` : `No. ${hub.name} is an independent hub we list so students can compare every option in ${hub.city}, and we do not claim any affiliation with it. Tech Faculty NG is a separate licensed training institute that advises you on a track, teaches it and issues a verifiable certificate.`
		},
		{
			q: `How do I start if I am in ${hub.city}?`,
			a: `Message us on WhatsApp with the course you want. We confirm the next cohort, the study mode, the fee and the duration, then send enrolment details the same day. Paid departments start from ${naira(LOWEST_PAID_PLAN)} online and run 10 to 20 weeks, and Basic Internet & AI Studies is free.`
		},
		{
			q: `Can I do my SIWES or industrial training from ${hub.city}?`,
			a: `Yes. We place SIWES students nationwide. If you cannot attend in person, Virtual SIWES costs ${naira(VIRTUAL_SIWES.placementPriceNGN)} for your full placement, with a mentor, weekly live sessions and a placement letter. Our ${naira(VIRTUAL_SIWES.logbookPriceNGN)} logbook service covers courier pickup, signing, stamping and the company sections of your ITF forms.`
		}
	];
	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": hub.isTechFaculty ? "EducationalOrganization" : "Organization",
			name: hub.name,
			description: hub.focus,
			...hub.website ? { url: hub.website } : {},
			address: {
				"@type": "PostalAddress",
				addressLocality: hub.city,
				addressRegion: hub.region,
				addressCountry: hub.country
			}
		},
		{
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
					name: "Tech Hubs",
					item: "https://techfaculty.ng/hubs"
				},
				{
					"@type": "ListItem",
					position: 3,
					name: hub.name,
					item: canonical
				}
			]
		},
		{
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: faqs.map((f) => ({
				"@type": "Question",
				name: f.q,
				acceptedAnswer: {
					"@type": "Answer",
					text: f.a
				}
			}))
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify(jsonLd)
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-24 pb-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
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
									to: "/hubs",
									className: "hover:text-primary",
									children: "Tech Hubs"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mx-2",
									children: "/"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: hub.city
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-3xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2 mb-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: hub.isTechFaculty ? "default" : "secondary",
											children: hub.type
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-sm text-muted-foreground flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-3.5 h-3.5" }),
												" ",
												hub.city,
												", ",
												hub.region
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-sm text-muted-foreground flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "w-3.5 h-3.5" }),
												" ",
												hub.country
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-3xl md:text-4xl font-bold tracking-tight mb-4",
									children: hub.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground text-base md:text-lg leading-relaxed",
									children: hub.intro
								})
							]
						})]
					}),
					(cityGuide || campus) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "container mx-auto px-4 mt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-3xl space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-xl font-bold text-foreground",
									children: ["Learning tech in ", hub.city]
								}),
								cityGuide && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"Local demand in ",
										hub.city,
										" comes mostly from:"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: cityGuide.sectors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											className: "text-xs",
											children: s
										}, s))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"Our",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
											to: `/blog/${cityGuide.slug}`,
											className: "text-primary hover:underline",
											children: [
												"guide to the ",
												hub.city,
												" tech scene"
											]
										}),
										" ",
										"covers the courses and first projects that fit those sectors."
									] })
								] }),
								campus && !hub.isTechFaculty && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									campus.city === hub.city ? "Tech Faculty also has its own campus here: " : `There is no Tech Faculty campus in ${hub.city}; the nearest is `,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
										to: `/locations/${campus.slug}`,
										className: "text-primary hover:underline",
										children: ["the Tech Faculty campus in ", campus.city]
									}),
									"."
								] })
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "container mx-auto px-4 mt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-primary/40 bg-gradient-to-br from-primary/5 to-transparent",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-6 md:p-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-xl md:text-2xl font-bold mb-2",
										children: ["Tell us what you want to study in ", hub.city]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground mb-5",
										children: "Pick a course area and message us. Your WhatsApp message arrives already filled in with the course, the city and this hub, so we can answer with the exact cohort, fee and duration."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col sm:flex-row gap-3 sm:items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "sm:w-72",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: courseArea,
												onValueChange: setCourseArea,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													"aria-label": "Choose a course area",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose a course area" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Not sure yet",
													children: "Not sure yet"
												}), hub.courseAreas.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: c,
													children: c
												}, c))] })]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "lg",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: hubWhatsAppUrl(hub, courseArea),
												target: "_blank",
												rel: "noopener noreferrer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "w-4 h-4" }), " Apply on WhatsApp"]
											})
										})]
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 mt-10 grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-bold text-lg mb-3",
									children: "Course areas"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-2",
									children: hub.courseAreas.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-start gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-primary mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: `/departments/${COURSE_AREA_DEPARTMENT[c]}`,
											className: "hover:text-primary hover:underline",
											children: c
										})]
									}, c))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground mt-4",
									children: [
										"Tech Faculty teaches each of these as a certified track — see",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: "/departments",
											className: "text-primary hover:underline",
											children: "our departments"
										}),
										" ",
										"for modules, duration and outcomes."
									]
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-bold text-lg mb-3",
									children: "How you can study"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2 mb-4",
									children: hub.formats.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										children: f
									}, f))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "space-y-2 text-sm text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Free foundation bootcamp online, open to any city." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Hybrid and in-person cohorts at our campuses nationwide." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "SIWES and industrial training placement, including a virtual option." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Verifiable certificates and routing into remote roles." })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2 mt-4",
									children: [
										hub.isTechFaculty && hub.campusSlug && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "sm",
											variant: "outline",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
												to: `/locations/${hub.campusSlug}`,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-3.5 h-3.5" }),
													" ",
													hub.city,
													" campus details"
												]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "sm",
											variant: "outline",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
												to: "/virtual-siwes",
												children: "Virtual SIWES"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "sm",
											variant: "outline",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
												to: "/careers",
												children: "Remote jobs"
											})
										})
									]
								})
							]
						}) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "container mx-auto px-4 mt-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-6 md:p-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-xl md:text-2xl font-bold mb-3",
									children: ["How Tech Faculty helps students in ", hub.city]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 md:grid-cols-2 text-sm text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground font-semibold",
												children: "Advisory."
											}),
											" We help you compare hubs, courses and modes in ",
											hub.city,
											" for free, then recommend the shortest route to a job-ready skill."
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground font-semibold",
												children: "Structured teaching."
											}),
											" ",
											"Licensed by the Federal Ministry of Science, Technology and Innovation via the National Board for Technology Incubation, with ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
												to: "/outcomes",
												className: "text-primary hover:underline",
												children: "over 6,000 students trained"
											}),
											" and 4+ years of training experience."
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground font-semibold",
												children: "Certification."
											}),
											" Every completed track ends in a certificate you can verify publicly at",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
												to: "/verify",
												className: "text-primary hover:underline",
												children: "techfaculty.ng/verify"
											}),
											"."
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold",
											children: "Placement."
										}), " SIWES placement, logbook signing and a weekly-updated board of remote AI and tech roles for graduates."] })
									]
								}),
								hub.website && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm mt-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: hub.website,
										target: "_blank",
										rel: "nofollow noopener noreferrer",
										className: "text-primary hover:underline inline-flex items-center gap-1",
										children: [
											"Visit the ",
											hub.name,
											" website ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5" })
										]
									})
								})
							]
						}) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 mt-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl md:text-2xl font-bold mb-4",
							children: "Frequently asked questions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: faqs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold mb-2",
									children: f.q
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground leading-relaxed",
									children: f.a
								})]
							}) }, f.q))
						})]
					}),
					related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 mt-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-xl md:text-2xl font-bold mb-4",
							children: ["Other options in ", hub.city]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3 md:grid-cols-3",
							children: related.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold mb-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: `/hubs/${r.slug}`,
										className: "hover:text-primary transition-colors",
										children: r.name
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: r.focus
								})]
							}) }, r.slug))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 mt-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
									to: "/hubs",
									children: ["All tech hubs ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/locations",
									children: "Our campuses"
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-6 max-w-3xl",
							children: HUBS_DISCLAIMER
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = HubDetail;
//#endregion
export { SplitComponent as component };
