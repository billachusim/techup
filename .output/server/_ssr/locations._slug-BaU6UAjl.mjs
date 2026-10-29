import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as useParams$1, n as Navigate$1, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { a as getCampusBySlug, i as directionsUrl, n as campuses, o as googleMapsUrl, s as googleReviewUrl, t as CAMPUS_PHONE } from "./campuses-DtkbL75I.mjs";
import { Ft as CircleCheck, Jt as Building2, L as Phone, W as Navigation, Y as MapPin, an as ArrowLeft, in as ArrowRight, q as MessageCircle, x as Star } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { n as COMMUNITY_WHATSAPP_URL } from "./whatsapp-BIGKDc9S.mjs";
import { i as getHubsForCampus, r as getCityGuidesForCampus } from "./internalLinks-CcRpzT8J.mjs";
import { a as campusProgrammes, i as campusMetaDescription, n as campusFaqs, r as campusKeywords } from "./campusContent-QovNQBss.mjs";
import { t as JoinWhatsAppButton } from "./JoinWhatsAppButton-gx5qEaAI.mjs";
import { t as CampusMap } from "./CampusMap-C25Pzt0-.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/locations._slug-BaU6UAjl.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var LocationDetail = () => {
	const { slug } = useParams$1();
	const campus = slug ? getCampusBySlug(slug) : void 0;
	const items = (0, import_react.useMemo)(() => campus ? [campus] : [], [campus]);
	if (!campus) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate$1, {
		to: "/locations",
		replace: true
	});
	const url = `https://techfaculty.ng/locations/${campus.slug}`;
	const faqs = campusFaqs(campus);
	const programmes = campusProgrammes(campus);
	const cityGuides = getCityGuidesForCampus(campus.slug);
	const hubs = getHubsForCampus(campus);
	const nearby = campuses.filter((c) => c.zone === campus.zone && c.slug !== campus.slug).slice(0, 4);
	const mapsUrl = googleMapsUrl(campus);
	const reviewUrl = googleReviewUrl(campus);
	const sameAs = [mapsUrl, ...campus.profiles ?? []].filter(Boolean);
	const orgSchema = {
		"@context": "https://schema.org",
		"@type": "EducationalOrganization",
		name: campus.name,
		alternateName: `Tech Faculty ${campus.city}`,
		telephone: CAMPUS_PHONE,
		description: campusMetaDescription(campus),
		url,
		parentOrganization: {
			"@type": "EducationalOrganization",
			name: "Tech Faculty NG",
			url: "https://techfaculty.ng/"
		},
		address: {
			"@type": "PostalAddress",
			streetAddress: campus.address,
			addressLocality: campus.city,
			addressRegion: campus.state,
			addressCountry: "NG"
		},
		geo: {
			"@type": "GeoCoordinates",
			latitude: campus.lat,
			longitude: campus.lng
		},
		areaServed: {
			"@type": "AdministrativeArea",
			name: `${campus.state} State, Nigeria`
		},
		keywords: campusKeywords(campus).join(", "),
		...mapsUrl ? { hasMap: mapsUrl } : {},
		...sameAs.length ? { sameAs } : {}
	};
	const faqSchema = {
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
				name: "Locations",
				item: "https://techfaculty.ng/locations"
			},
			{
				"@type": "ListItem",
				position: 3,
				name: `${campus.city} campus`,
				item: url
			}
		]
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
					type: "application/ld+json",
					children: JSON.stringify(orgSchema)
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
				className: "pt-24 pb-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4",
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/locations",
										className: "hover:text-primary",
										children: "Locations"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mx-2",
										children: "/"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: campus.city
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								to: "/locations",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									className: "-ml-2 mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
										size: 16,
										className: "mr-1"
									}), " All campuses"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 mb-4",
								children: [
									campus.isHeadquarters && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Headquarters" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										children: campus.zone
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										children: [campus.state, " State"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-3xl md:text-5xl font-bold tracking-tight mb-4",
								children: [
									"Tech Faculty ",
									campus.city,
									" — Tech Training at ",
									campus.shortVenue
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground text-base md:text-lg leading-relaxed max-w-3xl",
								children: campus.intro
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-3 mt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JoinWhatsAppButton, {
									url: COMMUNITY_WHATSAPP_URL,
									groupName: "the Tech Faculty WhatsApp community",
									captureSource: `location:${campus.slug}`,
									captureContext: `${campus.city} campus`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center justify-center gap-2",
										children: [
											"Join the ",
											campus.city,
											" community ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { size: 14 })
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "outline",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: directionsUrl(campus),
										target: "_blank",
										rel: "noopener noreferrer",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "w-4 h-4 mr-1" }),
											" Get directions to ",
											campus.city
										]
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 mt-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-2xl md:text-3xl font-bold mb-4",
							children: ["Where to find us in ", campus.city]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid lg:grid-cols-[1fr,1.2fr] gap-6 items-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-6 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-5 h-5 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold",
											children: campus.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: campus.address
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-5 h-5 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: `tel:${CAMPUS_PHONE.replace(/-/g, "")}`,
											className: "text-sm text-muted-foreground hover:text-primary",
											children: CAMPUS_PHONE.replace(/-/g, " ")
										})]
									}),
									mapsUrl && reviewUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "sm",
											variant: "outline",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: mapsUrl,
												target: "_blank",
												rel: "noopener noreferrer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-4 h-4 mr-1" }), " View on Google Maps"]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "sm",
											variant: "outline",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: reviewUrl,
												target: "_blank",
												rel: "noopener noreferrer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "w-4 h-4 mr-1" }), " Review us on Google"]
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-5 h-5 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: ["onitsha", "awka"].includes(campus.slug) ? "A standalone Tech Faculty centre, operated directly by us." : "Hosted inside the Technology Incubation Centre network of the National Board for Technology Incubation, an agency of the Federal Ministry of Science, Technology and Innovation."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-semibold mb-2",
										children: [
											"Sectors our ",
											campus.city,
											" graduates work in"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: campus.sectors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											className: "text-xs capitalize",
											children: s
										}, s))
									})] })
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampusMap, {
								items,
								activeId: campus.id,
								center: {
									lat: campus.lat,
									lng: campus.lng
								},
								zoom: 13,
								className: "w-full h-[380px] rounded-xl border border-border bg-muted overflow-hidden",
								ariaLabel: `Map of the Tech Faculty campus in ${campus.city}, ${campus.state} State`
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 mt-14",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-2xl md:text-3xl font-bold mb-2",
								children: ["Courses and programmes available in ", campus.city]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted-foreground mb-6 max-w-3xl",
								children: [
									"Every Tech Faculty department is open to ",
									campus.city,
									" students — in person at the centre, hybrid, or fully online. Graduates receive a certificate anyone can confirm on our public verification portal."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid md:grid-cols-2 gap-4",
								children: programmes.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									className: "h-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "p-6 flex flex-col h-full",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-bold mb-2",
												children: p.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted-foreground flex-1",
												children: p.body
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
												to: p.href,
												className: "text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1 mt-4",
												children: [
													"See the ",
													p.title,
													" curriculum ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })
												]
											})
										]
									})
								}, p.title))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/departments",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										children: ["Browse all ten departments ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
											size: 16,
											className: "ml-2"
										})]
									})
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						id: "siwes",
						className: "container mx-auto px-4 mt-14 scroll-mt-24",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-2xl md:text-3xl font-bold mb-4",
							children: ["SIWES and industrial training in ", campus.city]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid md:grid-cols-2 gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"We accept SIWES and industrial training students at ",
										campus.shortVenue,
										" every session, on two tracks:",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground",
											children: " Learn & Pay"
										}),
										", where you train while completing your attachment, and ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground",
											children: " Tutor & Earn"
										}),
										", where stronger students assist in delivery and earn while they train. There is no separate placement fee on site."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Placement includes supervised project work, weekly reviews, logbook guidance and documentation your institution accepts. Students leave with a portfolio, not photocopies." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
										to: "/siwes",
										className: "text-primary font-semibold hover:underline inline-flex items-center gap-1",
										children: ["Read the full SIWES programme details ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
										to: "/siwes/courses",
										className: "text-primary font-semibold hover:underline inline-flex items-center gap-1",
										children: ["See what you would do for your course ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-semibold mb-3",
										children: ["Institutions we commonly host from in and around ", campus.city]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-2 text-sm text-muted-foreground",
										children: campus.nearbyInstitutions.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-primary mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: i })]
										}, i))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground mt-4",
										children: [
											"Students from any accredited institution are welcome — this list reflects where most of our",
											" ",
											campus.city,
											" placements come from."
										]
									})
								]
							}) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 mt-14",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-2xl md:text-3xl font-bold mb-4",
							children: ["Holiday tech bootcamps for kids and teenagers in ", campus.city]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid md:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold mb-2",
									children: "Teen holiday tracks"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground",
									children: [
										"During every school holiday we run supervised, project-based tracks for JSS and SSS students in",
										" ",
										campus.city,
										": Digital Creation, Coding, Artificial Intelligence and Cybersecurity. Each student presents something they built at the end of the session, and parents receive a progress summary."
									]
								})]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold mb-2",
									children: "Free foundation bootcamp"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground",
									children: [
										"Our no-fee starter programme is open to everyone in ",
										campus.city,
										" — students, traders, teachers, civil servants and career switchers. It covers computer confidence, internet safety and practical AI tools, and it is the entry point to every paid department."
									]
								})]
							}) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 mt-14",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-2xl md:text-3xl font-bold mb-3",
							children: ["Tech hubs and local guides for ", campus.city]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-3xl space-y-3 text-muted-foreground",
							children: [
								cityGuides.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"For the wider local picture, read",
									" ",
									cityGuides.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [i > 0 && (i === cityGuides.length - 1 ? " and " : ", "), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
										to: `/blog/${g.slug}`,
										className: "text-primary hover:underline",
										children: [
											"our guide to the ",
											g.city,
											" tech scene"
										]
									})] }, g.slug)),
									", which covers the courses, hubs and first projects that suit the area."
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"See",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/blog/best-tech-hubs-and-training-institutes-in-nigeria-by-city-2026",
										className: "text-primary hover:underline",
										children: "the best tech hubs and training institutes in Nigeria by city"
									}),
									" ",
									"for how ",
									campus.city,
									" compares with other cities."
								] }),
								hubs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-2",
									children: hubs.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-start gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-primary mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
												to: `/hubs/${h.slug}`,
												className: "text-foreground font-medium hover:text-primary hover:underline",
												children: h.name
											}),
											" ",
											"— ",
											h.focus
										] })]
									}, h.slug))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"Compare every listing in",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/hubs",
										className: "text-primary hover:underline",
										children: "our directory of tech hubs in Nigeria and Africa"
									}),
									"."
								] })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 mt-14",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-2xl md:text-3xl font-bold mb-3",
								children: ["Events and community in ", campus.city]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted-foreground max-w-3xl mb-4",
								children: [
									"Learning does not stop at the classroom. Our ",
									campus.city,
									" learners join workshops, hackathons, career clinics and the Nnewi Tech Meetup series, and the WhatsApp community is where cohort announcements, job alerts and study groups happen daily."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/events",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											children: "See upcoming events"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/careers",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											children: "Browse live tech jobs"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/verify",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											children: "Verify a certificate"
										})
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 mt-14",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-2xl md:text-3xl font-bold mb-4",
							children: [
								"Tech Faculty ",
								campus.city,
								" — frequently asked questions"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4 max-w-3xl",
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
					}),
					nearby.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container mx-auto px-4 mt-14",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-2xl md:text-3xl font-bold mb-4",
							children: ["Other Tech Faculty campuses in the ", campus.zone]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4",
							children: nearby.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								to: `/locations/${c.slug}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									className: "h-full hover:border-primary/50 transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "p-5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-semibold mb-1",
											children: ["Tech Faculty ", c.city]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: c.tagline
										})]
									})
								})
							}, c.slug))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = LocationDetail;
//#endregion
export { SplitComponent as component };
