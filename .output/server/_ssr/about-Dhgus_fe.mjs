import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { n as campuses } from "./campuses-DtkbL75I.mjs";
import { r as departments } from "./departments-DtVPzGk2.mjs";
import { Y as MapPin, b as Target, ct as Heart, ft as Globe, q as MessageCircle } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { t as CredibilityBanner } from "./CredibilityBanner-f1_Ygk8h.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/about-Dhgus_fe.js
var import_jsx_runtime = require_jsx_runtime();
var stats = [
	{
		value: "6,000+",
		label: "Students Trained"
	},
	{
		value: String(departments.length),
		label: "Departments"
	},
	{
		value: String(campuses.length),
		label: "Campuses in Nigeria"
	},
	{
		value: "4+",
		label: "Years Running"
	}
];
var values = [
	{
		icon: Target,
		title: "Practical Skills First",
		description: "We focus on hands-on, project-based learning that prepares students for real jobs — not just theory."
	},
	{
		icon: Heart,
		title: "Community Driven",
		description: "We're building a tech ecosystem in Nnewi and South-East Nigeria, one student, one business at a time."
	},
	{
		icon: Globe,
		title: "Licensed and Verifiable",
		description: "Licensed by FMSTI through NBTI, with certificates employers can verify online."
	}
];
var About = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "AboutPage",
					"name": "About Tech Faculty NG",
					"description": "Tech Faculty NG is licensed by the Federal Ministry of Science, Technology and Innovation via the National Board for Technology Incubation (NBTI). Based in Nnewi, Anambra State, we train, certify, and employ the next generation of tech professionals.",
					"mainEntity": {
						"@type": "EducationalOrganization",
						"name": "Tech Faculty NG",
						"url": "https://techfaculty.ng",
						"foundingDate": "2022",
						"founder": {
							"@type": "Person",
							"@id": "https://techfaculty.ng/team/bill-achusim#person",
							"name": "Bill Achusim",
							"url": "https://techfaculty.ng/team/bill-achusim"
						},
						"numberOfEmployees": {
							"@type": "QuantitativeValue",
							"value": 25
						},
						"alumni": {
							"@type": "QuantitativeValue",
							"name": "Graduates",
							"value": 6e3
						},
						"areaServed": {
							"@type": "Country",
							"name": "Nigeria"
						},
						"address": {
							"@type": "PostalAddress",
							"addressLocality": "Nnewi",
							"addressRegion": "Anambra State",
							"addressCountry": "NG"
						},
						"accreditation": "Licensed by the Federal Ministry of Science, Technology and Innovation (FMSTI) via the National Board for Technology Incubation (NBTI)",
						"sameAs": [
							"https://twitter.com/TechFacultyNG",
							"https://www.linkedin.com/company/techfaculty",
							"https://www.wikidata.org/wiki/Q141702083"
						]
					},
					"url": "https://techfaculty.ng/about"
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-4xl md:text-5xl lg:text-6xl font-bold mb-6",
								children: ["About ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gradient",
									children: "Tech Faculty NG"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-lg text-muted-foreground max-w-2xl mx-auto",
								children: [
									"Licensed by the Federal Ministry of Science, Technology & Innovation via NBTI. Over 6,000 students trained since 2022. 75% of graduates employed within six months (",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/outcomes",
										className: "underline hover:text-primary",
										children: "how we count"
									}),
									"). We build Africa's remote and physical tech workforce."
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-16",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "container mx-auto max-w-4xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 md:grid-cols-4 gap-6",
								children: stats.map((stat, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-3xl md:text-4xl font-bold text-gradient",
										children: stat.value
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground mt-1",
										children: stat.label
									})]
								}, idx))
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4 bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-3xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-bold text-center mb-8",
								children: "Our Story"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4 text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"Tech Faculty NG was founded in 2022 by ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: "/team/bill-achusim",
											className: "underline hover:text-primary",
											children: "Bill Achusim"
										}),
										" at the Digital Village in Nnewi, Anambra State. South-East Nigeria is rich in entrepreneurial energy, but many young people lack access to quality tech education. We set out to change that."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"In over four years, we've trained more than 6,000 students across ",
										departments.length,
										" departments — from Web Development and Data Science to AI, Cybersecurity, and Digital Marketing. 75% of our graduates secure tech roles within six months of completing their program. ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: "/outcomes",
											className: "underline hover:text-primary",
											children: "See how we count our outcomes"
										}),
										"."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"According to the ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/",
											target: "_blank",
											rel: "noopener noreferrer",
											className: "underline hover:text-primary",
											children: "World Economic Forum Future of Jobs Report (2025)"
										}),
										", AI and big data are the fastest-growing skills worldwide. We're positioning our students at the forefront of this growth."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Today, over 100 partner companies are ready to hire our graduates who perform at the required level. We also collaborate with universities to bring bootcamps to campuses, and provide SIWES/IT placements for students seeking real-world experience." })
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-bold text-center mb-12",
								children: "What Drives Us"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 md:grid-cols-3 gap-6",
								children: values.map((value, idx) => {
									const Icon = value.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "border-2 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-6",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "p-3 rounded-lg bg-primary/10 w-fit mx-auto mb-4",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6 text-primary" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "text-lg font-bold mb-2",
													children: value.title
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted-foreground",
													children: value.description
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
								children: "Our Partnership"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CredibilityBanner, {})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-3xl text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-center gap-2 mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-2xl font-bold",
										children: "Visit Us"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground mb-6",
									children: "Technology Incubation Center, NBTI South-East Zonal Office, Nnewi, Anambra State, Nigeria"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									className: "bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "https://wa.me/2348068597140",
										target: "_blank",
										rel: "noopener noreferrer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
											className: "mr-2",
											size: 18
										}), "Get in Touch"]
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
var SplitComponent = About;
//#endregion
export { SplitComponent as component };
