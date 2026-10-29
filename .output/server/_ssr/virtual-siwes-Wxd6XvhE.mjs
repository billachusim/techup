import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { Ft as CircleCheck, G as Monitor, Mt as Clock, O as ShieldCheck, S as Stamp, Y as MapPin, h as Truck, in as ArrowRight, q as MessageCircle } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { t as CredibilityBanner } from "./CredibilityBanner-f1_Ygk8h.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { a as logbookIncludes, c as virtualSteps, i as formatNaira, n as CITY_COUNT, o as placementIncludes, r as VIRTUAL_SIWES, s as virtualFaqs } from "./virtualSiwes-DYcaq-8X.mjs";
import { i as AccordionTrigger, n as AccordionContent, r as AccordionItem, t as Accordion } from "./accordion-Co1-8MUG.mjs";
import { t as PayOrReserve } from "./OrderPayForm-0LLaEVnC.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/virtual-siwes-Wxd6XvhE.js
var import_jsx_runtime = require_jsx_runtime();
var URL = "https://techfaculty.ng/virtual-siwes";
var VIRTUAL_IT_FIELDS = [
	{
		id: "department",
		label: "Course / department",
		placeholder: "e.g. Computer Science"
	},
	{
		id: "duration",
		label: "IT duration",
		placeholder: "e.g. 6 months",
		required: true
	},
	{
		id: "start",
		label: "Preferred start date",
		placeholder: "e.g. September 2026"
	},
	{
		id: "track",
		label: "Preferred track",
		placeholder: "Learn & Pay or Tutor & Earn",
		required: true
	}
];
var LOGBOOK_FIELDS = [
	{
		id: "pickup",
		label: "Pickup city and address",
		placeholder: "e.g. Owerri — 12 Wetheral Road",
		required: true
	},
	{
		id: "documents",
		label: "Logbook / forms to be signed",
		placeholder: "e.g. ITF logbook + SPE-1 + Form 8"
	},
	{
		id: "deadline",
		label: "Your school submission deadline",
		placeholder: "e.g. 30 October 2026",
		required: true
	}
];
var VirtualSIWES = () => {
	const placementWhatsApp = `Hello Tech Faculty, I want to do Virtual SIWES (online IT). Please send the payment details for the ${formatNaira(VIRTUAL_SIWES.placementPriceNGN)} placement fee.`;
	const logbookWhatsApp = `Hello Tech Faculty, I want to book the logbook review, signing and waybill service (${formatNaira(VIRTUAL_SIWES.logbookPriceNGN)}). Please send the payment and pickup details.`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
					type: "application/ld+json",
					children: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Service",
						name: "Virtual SIWES and IT Logbook Signing Service",
						serviceType: "Online industrial training placement (SIWES/IT)",
						description: "Fully online SIWES/IT placement for Nigerian students, with logbook review, signing and stamping handled by two-way courier delivery to our Nnewi headquarters.",
						url: URL,
						areaServed: {
							"@type": "Country",
							name: "Nigeria"
						},
						audience: {
							"@type": "EducationalAudience",
							educationalRole: "student"
						},
						provider: {
							"@type": "EducationalOrganization",
							name: "Tech Faculty NG",
							url: "https://techfaculty.ng",
							address: {
								"@type": "PostalAddress",
								streetAddress: "Technology Incubation Centre",
								addressLocality: "Nnewi",
								addressRegion: "Anambra",
								postalCode: "435101",
								addressCountry: "NG"
							}
						},
						offers: [{
							"@type": "Offer",
							name: "Virtual IT placement (full duration)",
							price: VIRTUAL_SIWES.placementPriceNGN,
							priceCurrency: "NGN",
							availability: "https://schema.org/InStock",
							url: URL
						}, {
							"@type": "Offer",
							name: "Logbook review, signing, stamping and two-way delivery",
							price: VIRTUAL_SIWES.logbookPriceNGN,
							priceCurrency: "NGN",
							availability: "https://schema.org/InStock",
							url: URL
						}]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
					type: "application/ld+json",
					children: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "FAQPage",
						mainEntity: virtualFaqs.map((f) => ({
							"@type": "Question",
							name: f.q,
							acceptedAnswer: {
								"@type": "Answer",
								text: f.a
							}
						}))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
					type: "application/ld+json",
					children: JSON.stringify({
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
								name: "SIWES & IT",
								item: "https://techfaculty.ng/siwes"
							},
							{
								"@type": "ListItem",
								position: 3,
								name: "Virtual SIWES",
								item: URL
							}
						]
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 md:py-24 px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl text-center space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-border bg-muted/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { size: 14 }), " Online IT placement · open nationwide"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "text-3xl md:text-5xl font-bold leading-tight",
									children: [
										"Virtual SIWES in Nigeria — do your IT online, and we sign, stamp and",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-gradient",
											children: "waybill your logbook back"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed",
									children: "You should not lose a session because there is no approved IT host in your town. Complete your industrial training online with a licensed technology institute, do real project work every week, then send your logbook and ITF forms to our headquarters by delivery. We review, fill, sign and stamp everything and waybill it straight back to you."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row gap-3 justify-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "#reserve-virtual-it",
											children: ["Pay for a virtual IT slot ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
												className: "ml-2",
												size: 18
											})]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										variant: "outline",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: "#logbook-service",
											children: "Book logbook signing"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground",
									children: [
										"Virtual IT placement ",
										formatNaira(VIRTUAL_SIWES.placementPriceNGN),
										" · Logbook service",
										" ",
										formatNaira(VIRTUAL_SIWES.logbookPriceNGN),
										" (both waybill legs included)"
									]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CredibilityBanner, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-5xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl md:text-3xl font-bold text-center mb-10",
								children: "Who virtual IT is built for"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-6 md:grid-cols-3",
								children: [
									{
										icon: MapPin,
										title: "You are far from any centre",
										body: "Your school is in a state where we have no campus yet, or relocating for six months is simply not affordable. You work with the same mentors online."
									},
									{
										icon: Clock,
										title: "You are already working or teaching",
										body: "Part-time, sandwich and working students keep their job and still complete supervised IT, with weekly sessions scheduled around them."
									},
									{
										icon: ShieldCheck,
										title: "Your placement fell through",
										body: "The company that promised you a slot went quiet weeks before resumption. We can issue an acceptance letter quickly so your session is not wasted."
									}
								].map((item) => {
									const Icon = item.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "border-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-6 space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "p-3 rounded-xl bg-primary/10 w-fit",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-primary" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-semibold",
													children: item.title
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted-foreground leading-relaxed",
													children: item.body
												})
											]
										})
									}, item.title);
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4 bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-5xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl md:text-3xl font-bold text-center mb-4",
									children: "What it costs and what you get"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-center text-muted-foreground max-w-2xl mx-auto mb-10 text-sm md:text-base",
									children: "Both fees are paid before we start — the placement fee before onboarding, the logbook fee before pickup. Pay online below by card, bank transfer or USSD, or reserve and we send bank details on WhatsApp or email."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-6 md:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "border-primary/30",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-6 space-y-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "p-3 rounded-xl bg-primary/10",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "h-5 w-5 text-primary" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
														className: "font-semibold text-lg",
														children: "Virtual IT placement"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-muted-foreground",
														children: "Learn & Pay or Tutor & Earn, fully online"
													})] })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-3xl font-bold",
													children: [formatNaira(VIRTUAL_SIWES.placementPriceNGN), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-sm font-normal text-muted-foreground",
														children: [" ", "/ full IT duration"]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
													className: "space-y-2",
													children: placementIncludes.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
														className: "flex items-start gap-2 text-sm",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
													}, item))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													className: "w-full",
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														href: "#reserve-virtual-it",
														children: "Pay for my slot"
													})
												})
											]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "border-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-6 space-y-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "p-3 rounded-xl bg-primary/10",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { className: "h-5 w-5 text-primary" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
														className: "font-semibold text-lg",
														children: "Logbook & documents service"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-muted-foreground",
														children: "Reviewed, signed, stamped and delivered back"
													})] })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-3xl font-bold",
													children: [formatNaira(VIRTUAL_SIWES.logbookPriceNGN), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-sm font-normal text-muted-foreground",
														children: [" ", "/ logbook, delivery both ways included"]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
													className: "space-y-2",
													children: logbookIncludes.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
														className: "flex items-start gap-2 text-sm",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
													}, item))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "outline",
													className: "w-full",
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														href: "#logbook-service",
														children: "Book the pickup"
													})
												})
											]
										})
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-3xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl md:text-3xl font-bold text-center mb-10",
								children: "How virtual IT and the waybill process work"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "space-y-6",
								children: virtualSteps.map((step, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-8 h-8 rounded-full bg-primary text-background font-bold text-sm flex items-center justify-center shrink-0",
										children: idx + 1
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold",
										children: step.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground mt-1 leading-relaxed",
										children: step.detail
									})] })]
								}, step.title))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4 bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl md:text-3xl font-bold mb-6",
								children: "Why your school can accept this placement"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-6 md:grid-cols-2 text-sm leading-relaxed",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"Tech Faculty NG is a licensed technology training institute operating under the Federal Ministry of Science, Technology & Innovation via the National Board for Technology Incubation. Our headquarters sits inside the",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: VIRTUAL_SIWES.hqAddress }),
										", and we run centres in ",
										CITY_COUNT,
										" Nigerian cities, so your coordinator can verify a real address, a real licence and real supervisors."
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We complete SPE-1, ITF Form 8 and place-of-attachment forms alongside the logbook, and your acceptance letter is written to match exactly what your department approved — remote, hybrid or on site." })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-start gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-primary mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Delivery both ways." }),
												" Courier pickup from your city and the return waybill are inside the ",
												formatNaira(VIRTUAL_SIWES.logbookPriceNGN),
												" fee — you never travel to Nnewi."
											] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-start gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-primary mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Turnaround." }),
												" ",
												VIRTUAL_SIWES.turnaround,
												", plus courier time. Tell us your submission deadline and we prioritise it."
											] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-start gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Verifiable records." }), " Attendance, supervision notes and your completion certificate are all documented and verifiable."] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											"Prefer to be in a room with people? Compare our",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
												to: "/siwes",
												className: "underline hover:text-primary",
												children: "on-site SIWES and IT placement tracks"
											}),
											" ",
											"or find your nearest",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
												to: "/locations",
												className: "underline hover:text-primary",
												children: "Tech Faculty campus"
											}),
											"."
										] })
									]
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-5xl grid gap-8 lg:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								id: "reserve-virtual-it",
								className: "scroll-mt-24 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-2xl font-bold",
										children: "Secure your virtual IT slot"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted-foreground",
										children: [
											"Cohorts are capped so every intern gets mentor time. Pay the",
											" ",
											formatNaira(VIRTUAL_SIWES.placementPriceNGN),
											" placement fee here and your slot is held straight away; your acceptance letter follows within 48 hours."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-lg border border-border bg-card p-5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayOrReserve, {
											product: "virtual_siwes",
											addOn: "logbook_service",
											source: "/virtual-siwes#pay",
											extraFields: VIRTUAL_IT_FIELDS,
											reserve: {
												interest: "virtual_siwes",
												source: "/virtual-siwes#reserve",
												submitLabel: "Reserve my virtual IT slot",
												compact: true,
												whatsappMessage: placementWhatsApp,
												extraFields: VIRTUAL_IT_FIELDS
											}
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								id: "logbook-service",
								className: "scroll-mt-24 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-2xl font-bold",
										children: "Book logbook review & signing"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted-foreground",
										children: [
											"For virtual interns and anyone who completed IT with us and needs their logbook reviewed, signed and stamped. ",
											formatNaira(VIRTUAL_SIWES.logbookPriceNGN),
											", pickup and return delivery included. Pay here and we arrange the pickup on WhatsApp."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-lg border border-border bg-card p-5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayOrReserve, {
											product: "logbook_service",
											source: "/virtual-siwes#logbook-pay",
											extraFields: LOGBOOK_FIELDS,
											reserve: {
												interest: "logbook_service",
												source: "/virtual-siwes#logbook",
												submitLabel: "Book my logbook pickup",
												compact: true,
												whatsappMessage: logbookWhatsApp,
												extraFields: LOGBOOK_FIELDS
											}
										})
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4 bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-3xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl md:text-3xl font-bold text-center mb-8",
								children: "Virtual SIWES questions students actually ask"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
								type: "single",
								collapsible: true,
								className: "w-full",
								children: virtualFaqs.map((faq, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
									value: `faq-${idx}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
										className: "text-left text-sm md:text-base",
										children: faq.q
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
										className: "text-sm text-muted-foreground leading-relaxed",
										children: faq.a
									})]
								}, faq.q))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-20 px-4 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-2xl space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl md:text-3xl font-bold",
									children: "Don't let a logbook decide your session"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: "Message a coordinator now and we'll tell you honestly whether virtual IT fits your school's rules before you pay a naira."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row gap-3 justify-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: `https://wa.me/${VIRTUAL_SIWES.whatsappNumber}?text=${encodeURIComponent(placementWhatsApp)}`,
											target: "_blank",
											rel: "noopener noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
												className: "mr-2",
												size: 18
											}), "Chat with a coordinator"]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										variant: "outline",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
											to: "/siwes-success-kit",
											children: ["Get the SIWES Success Kit ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
												className: "ml-2",
												size: 18
											})]
										})
									})]
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
var SplitComponent = VirtualSIWES;
//#endregion
export { SplitComponent as component };
