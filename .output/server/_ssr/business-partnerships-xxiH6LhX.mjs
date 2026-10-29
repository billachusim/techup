import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { Ft as CircleCheck, G as Monitor, Jt as Building2, Zt as Brain, dt as GraduationCap, ht as FileText, i as Wrench, in as ArrowRight, q as MessageCircle, s as Users } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { t as CredibilityBanner } from "./CredibilityBanner-f1_Ygk8h.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { t as LeadCaptureForm } from "./LeadCaptureForm-CYmnefhx.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/business-partnerships-xxiH6LhX.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var BUSINESS_PACKAGES = [
	{
		id: "ai-for-teams",
		title: "AI for Teams",
		audience: "Managers and staff who want to use AI tools in daily work",
		summary: "A hands-on workshop on using AI assistants and automation safely to save time on writing, research, reporting and customer replies.",
		covers: [
			"Using AI assistants for everyday office work",
			"Writing good prompts and checking the answers",
			"Automating repetitive tasks",
			"Data privacy and safe use at work"
		],
		duration: null,
		priceFrom: null,
		priceNote: null
	},
	{
		id: "digital-skills",
		title: "Staff Digital Skills",
		audience: "Teams that need a stronger foundation in everyday tech",
		summary: "Practical digital literacy for staff: office tools, email and cloud files, online collaboration and working securely.",
		covers: [
			"Office tools, spreadsheets and documents",
			"Email, cloud storage and file sharing",
			"Online meetings and collaboration",
			"Basic cyber hygiene"
		],
		duration: null,
		priceFrom: null,
		priceNote: null
	},
	{
		id: "data-analytics",
		title: "Data & Reporting",
		audience: "Finance, sales and operations staff who work with numbers",
		summary: "Turn business records into clear reports and dashboards your managers can act on.",
		covers: [
			"Cleaning and organising data in spreadsheets",
			"Formulas, pivot tables and charts",
			"Building simple dashboards",
			"Presenting findings to decision makers"
		],
		duration: null,
		priceFrom: null,
		priceNote: null
	},
	{
		id: "cybersecurity-awareness",
		title: "Cybersecurity Awareness",
		audience: "Every staff member who uses a phone or computer at work",
		summary: "Help your team spot scams, protect customer data and keep company accounts safe.",
		covers: [
			"Phishing, fraud and social engineering",
			"Passwords and two-step login",
			"Safe use of phones, Wi-Fi and USB drives",
			"What to do when something goes wrong"
		],
		duration: null,
		priceFrom: null,
		priceNote: null
	},
	{
		id: "custom",
		title: "Custom Programme",
		audience: "Organisations with a specific skills gap",
		summary: "Tell us what your team needs and we design a programme around it, drawing on any of our departments, from software development to design.",
		covers: [
			"Skills assessment of your team",
			"Curriculum built around your goals",
			"On-site, virtual or hybrid delivery",
			"Certificates of completion"
		],
		duration: null,
		priceFrom: null,
		priceNote: null
	}
];
var TEAM_SIZES = [
	"1–5",
	"6–15",
	"16–30",
	"31–60",
	"More than 60"
];
var DELIVERY_MODES = [
	"On-site at our campus",
	"On-site at our office",
	"Virtual",
	"Hybrid",
	"Not sure yet"
];
var formatNaira = (amount) => `₦${amount.toLocaleString("en-NG")}`;
var offerings = [
	{
		icon: Brain,
		title: "AI & Technology Workshops",
		description: "2–5 day intensive workshops to help your team understand and adopt AI tools, automation, and emerging tech for business growth."
	},
	{
		icon: Users,
		title: "Corporate Staff Training",
		description: "Customized training programs for employees — from basic digital literacy to advanced data analytics and cybersecurity."
	},
	{
		icon: Monitor,
		title: "Business Digitization",
		description: "End-to-end support in digitizing your business operations, from online presence to internal process automation."
	},
	{
		icon: Wrench,
		title: "IT Support & Infrastructure",
		description: "Ongoing IT support, network setup, device management, and tech maintenance for your business."
	},
	{
		icon: GraduationCap,
		title: "Talent Pipeline",
		description: "Access our pool of trained, certified graduates ready to join your workforce — pre-screened and industry-ready."
	},
	{
		icon: Building2,
		title: "Custom Software Solutions",
		description: "Web apps, mobile apps, and automation tools built to your specifications by our development team."
	}
];
var benefits = [
	"Government-licensed training provider (FMSTI/NBTI)",
	"Customized programs tailored to your industry",
	"Flexible delivery — on-site, virtual, or hybrid",
	"Certificates of completion for all participants",
	"Post-training support and consultation",
	"Bulk pricing for organizations"
];
var QUOTE_FIELDS = [
	{
		id: "package",
		label: "Package",
		placeholder: "Choose a package",
		options: [...BUSINESS_PACKAGES.map((p) => p.title), "Something else"],
		required: true
	},
	{
		id: "team_size",
		label: "Number of staff to train",
		placeholder: "Choose a range",
		options: TEAM_SIZES,
		required: true
	},
	{
		id: "delivery",
		label: "Preferred delivery",
		placeholder: "Choose one",
		options: DELIVERY_MODES
	},
	{
		id: "timing",
		label: "When would you like to start?",
		placeholder: "e.g. January 2027"
	},
	{
		id: "goals",
		label: "What should your team be able to do afterwards?",
		placeholder: "e.g. use AI to draft customer replies"
	}
];
var BusinessPartnerships = () => {
	const [selected, setSelected] = (0, import_react.useState)();
	const requestQuote = (title) => {
		setSelected({ package: title });
		document.getElementById("quote")?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "Service",
					"name": "Business Partnerships & Corporate Training",
					"provider": {
						"@type": "Organization",
						"name": "Tech Faculty NG"
					},
					"description": "Corporate training programs, AI integration workshops, business digitization services, and talent pipeline solutions for Nigerian businesses.",
					"areaServed": {
						"@type": "Country",
						"name": "Nigeria"
					},
					"serviceType": [
						"Corporate Training",
						"AI Workshops",
						"Business Digitization",
						"Talent Pipeline"
					],
					"hasOfferCatalog": {
						"@type": "OfferCatalog",
						"name": "Staff Training Packages",
						"itemListElement": BUSINESS_PACKAGES.map((p) => ({
							"@type": "Offer",
							"itemOffered": {
								"@type": "Course",
								"name": p.title,
								"description": p.summary
							},
							...p.priceFrom !== null && {
								"price": p.priceFrom,
								"priceCurrency": "NGN"
							}
						}))
					},
					"url": "https://techfaculty.ng/business-partnerships"
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "py-24 px-4 relative overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 opacity-30",
							style: {
								backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
								backgroundSize: "40px 40px"
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl text-center relative z-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "text-4xl md:text-5xl lg:text-6xl font-bold mb-6",
									children: [
										"Empower Your ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-gradient",
											children: "Business"
										}),
										" with Technology"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg text-muted-foreground max-w-2xl mx-auto mb-8",
									children: "Partner with Tech Faculty NG to upskill your workforce, digitize operations, and stay ahead with AI and emerging technologies."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row gap-4 justify-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										className: "bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "#quote",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
												className: "mr-2",
												size: 20
											}), "Request a Quote"]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										variant: "outline",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "https://wa.me/2348068597140?text=Hello%2C%20I'm%20interested%20in%20a%20business%20partnership%20with%20Tech%20Faculty%20NG",
											target: "_blank",
											rel: "noopener noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
												className: "mr-2",
												size: 20
											}), "Discuss a Partnership"]
										})
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-16",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "container mx-auto max-w-4xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CredibilityBanner, { compact: true })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "packages",
						className: "py-16 px-4 scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-6xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-3xl md:text-4xl font-bold text-center mb-4",
									children: "Staff Training Packages"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground text-center max-w-2xl mx-auto mb-12",
									children: "Ready-made programmes for your team, delivered at our campus, at your office or online. Every package can be adjusted to your industry, and every participant gets a certificate of completion."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
									children: BUSINESS_PACKAGES.map((pkg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "border-2 flex flex-col",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-6 flex flex-col flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "text-lg font-bold",
													children: pkg.title
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground mt-1 mb-3",
													children: pkg.audience
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted-foreground mb-4",
													children: pkg.summary
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
													className: "space-y-1.5 mb-5",
													children: pkg.covers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
														className: "flex items-start gap-2 text-sm",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c })]
													}, c))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-auto space-y-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-sm",
														children: [pkg.priceFrom !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
															"From ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-semibold",
																children: formatNaira(pkg.priceFrom)
															}),
															pkg.priceNote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-muted-foreground",
																children: [" ", pkg.priceNote]
															})
														] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "font-medium",
															children: "Tailored quote within two working days"
														}), pkg.duration && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-muted-foreground",
															children: pkg.duration
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "outline",
														className: "w-full",
														onClick: () => requestQuote(pkg.title),
														children: "Request a quote"
													})]
												})
											]
										})
									}, pkg.id))
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-6xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl md:text-4xl font-bold text-center mb-12",
								children: "More Ways We Work With Businesses"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
								children: offerings.map((item, idx) => {
									const Icon = item.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "border-2 hover:shadow-lg transition-all duration-300",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-6",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "p-3 rounded-lg bg-primary/10 w-fit mb-4",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6 text-primary" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "text-lg font-bold mb-2",
													children: item.title
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted-foreground",
													children: item.description
												})
											]
										})
									}, idx);
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4 bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-bold text-center mb-8",
								children: "Why Partner With Us"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: benefits.map((benefit, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-primary mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm md:text-base",
										children: benefit
									})]
								}, idx))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "quote",
						className: "py-16 px-4 scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-3xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-3xl font-bold text-center mb-4",
									children: "Request a Quote"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground text-center mb-8",
									children: "Tell us about your team and we'll send a proposal with dates and pricing within two working days."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									className: "border-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
										className: "p-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadCaptureForm, {
											interest: "partner_enquiry",
											source: "/business-partnerships#quote",
											submitLabel: "Request my quote",
											whatsappMessage: "Hello Tech Faculty, I just requested a staff training quote on your website.",
											schoolLabel: "Company or organisation",
											schoolPlaceholder: "e.g. Okeke & Sons Ltd",
											extraFields: QUOTE_FIELDS,
											initialExtras: selected
										})
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-24 px-4 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-2xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-3xl font-bold mb-4",
									children: "Ready to Transform Your Business?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground mb-8",
									children: "Let's discuss how Tech Faculty NG can help your organization thrive in the digital age."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row gap-4 justify-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										className: "bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "https://wa.me/2348068597140?text=Hello%2C%20I'm%20interested%20in%20a%20business%20partnership",
											target: "_blank",
											rel: "noopener noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
												className: "mr-2",
												size: 18
											}), "WhatsApp Us"]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										variant: "outline",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "mailto:thetechfaculty@gmail.com",
											children: ["Email Us ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
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
var SplitComponent = BusinessPartnerships;
//#endregion
export { SplitComponent as component };
