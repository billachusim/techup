import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { a as LOWEST_PAID_PLAN, c as PLAN_PRICING, f as naira, m as toUsd, o as NGN_TO_USD_RATE, p as planMinimum } from "./fees-B-53IxaZ.mjs";
import { r as departments } from "./departments-DtVPzGk2.mjs";
import { Tt as CreditCard, ft as Globe, it as Laptop, nn as Award, q as MessageCircle } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/study-online-africa-DtEOIDD_.js
var import_jsx_runtime = require_jsx_runtime();
var HIGHEST_PLAN_MINIMUM = Math.max(...Object.values(PLAN_PRICING).map((p) => p.minimumAmount));
var priceRange = `${naira(LOWEST_PAID_PLAN)} to ${naira(HIGHEST_PLAN_MINIMUM)}`;
var usdRange = `$${toUsd(LOWEST_PAID_PLAN)} to $${toUsd(HIGHEST_PLAN_MINIMUM)}`;
var onlineDepartments = departments.map((d) => ({
	d,
	min: d.planId ? planMinimum(d.planId) : void 0
})).filter((x) => x.min !== void 0).sort((a, b) => a.min - b.min);
var WHATSAPP_URL = "https://wa.me/2348068597140?text=" + encodeURIComponent("Hello Tech Faculty NG, I live outside Nigeria and want to study online. Which course should I start with?");
var studyOnlineAfricaFaqs = [
	{
		q: "Can I study with Tech Faculty NG from outside Nigeria?",
		a: "Yes. Every department except Robotics & IoT, whose lab hardware is at our campuses, can be studied fully online, so you can enrol from Ghana, Kenya, South Africa or anywhere else with an internet connection. All our campuses are in Nigeria, and we have no branches in other countries, so students outside Nigeria study online."
	},
	{
		q: "How much does it cost, and can I pay in dollars?",
		a: `Online courses cost from ${priceRange} depending on the department and the modules you pick. Visitors outside Nigeria see prices in US dollars at checkout, converted at ₦${NGN_TO_USD_RATE.toLocaleString("en-NG")} to $1, which is about ${usdRange}. Card payments go through Flutterwave and are charged in US dollars.`
	},
	{
		q: "What if my card payment does not go through?",
		a: "Whether a foreign card is accepted depends on the card and the bank that issued it. If it is declined, choose WhatsApp or email enrolment at checkout instead, and we will reply with how to pay."
	},
	{
		q: "What certificate do I get?",
		a: "Graduates receive a Tech Faculty NG certificate with a unique ID that anyone, including an employer in another country, can check on our certificate verification page. Tech Faculty NG is licensed by the Federal Ministry of Science, Technology and Innovation (FMSTI) through the National Board for Technology Incubation (NBTI), a Nigerian licence."
	},
	{
		q: "How are online classes delivered?",
		a: "Online study is included in the course fee. You learn from recorded lectures at your own pace, in English, and submit projects online. Hybrid and on-site study cost extra and are only for students who can reach one of our campuses in Nigeria."
	}
];
var steps = [
	{
		title: "Pick a department",
		body: "Compare the departments below. Each page lists the modules, tools and duration."
	},
	{
		title: "Build your plan",
		body: "In the pricing section, choose the plan and modules you want and keep the learning mode on Online Only, which adds nothing to the fee."
	},
	{
		title: "Pay or message us",
		body: "Sign in, then pay by card in US dollars through Flutterwave, or choose WhatsApp or email enrolment and we reply with how to pay."
	},
	{
		title: "Start learning",
		body: "Once your payment is confirmed, your courses open in your student dashboard."
	}
];
var StudyOnlineAfrica = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "FAQPage",
					mainEntity: studyOnlineAfricaFaqs.map((f) => ({
						"@type": "Question",
						name: f.q,
						acceptedAnswer: {
							"@type": "Answer",
							text: f.a
						}
					}))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-20 px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-4xl md:text-5xl font-bold mb-6",
									children: "Study tech online from anywhere in Africa"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg text-muted-foreground max-w-2xl mx-auto mb-8",
									children: "Tech Faculty NG is a Nigerian tech school licensed by FMSTI through NBTI. Our campuses are all in Nigeria, and every department except Robotics & IoT also runs fully online, so you can learn web development, data, AI, cybersecurity, design and more from wherever you live."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row gap-3 justify-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/#pricing",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "lg",
											children: "See prices and enrol"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										variant: "outline",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: WHATSAPP_URL,
											target: "_blank",
											rel: "noopener noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
												className: "mr-2 w-5 h-5",
												"aria-hidden": "true"
											}), "Ask us on WhatsApp"]
										})
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-16",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl grid gap-4 md:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "rounded-lg border border-border p-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, {
											className: "w-7 h-7 text-primary mb-3",
											"aria-hidden": "true"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-xl font-semibold mb-2",
											children: "How online study works"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-muted-foreground leading-relaxed",
											children: "Online study is included in every course fee. You learn from recorded lectures at your own pace, in English, and submit your projects online. Hybrid and on-site classes are for students who can reach a campus in Nigeria."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "rounded-lg border border-border p-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, {
											className: "w-7 h-7 text-primary mb-3",
											"aria-hidden": "true"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-xl font-semibold mb-2",
											children: "A certificate anyone can check"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-muted-foreground leading-relaxed",
											children: [
												"Graduates receive a Tech Faculty NG certificate with a unique ID. An employer anywhere can look it up on our ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: "/verify",
													className: "text-primary hover:underline",
													children: "certificate verification page"
												}),
												". Our licence is Nigerian: Tech Faculty NG is licensed by the Federal Ministry of Science, Technology and Innovation through the National Board for Technology Incubation."
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "rounded-lg border border-border p-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, {
											className: "w-7 h-7 text-primary mb-3",
											"aria-hidden": "true"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-xl font-semibold mb-2",
											children: "Paying from outside Nigeria"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-muted-foreground leading-relaxed",
											children: [
												"Courses cost from ",
												priceRange,
												". Outside Nigeria, checkout shows prices in US dollars at ₦",
												NGN_TO_USD_RATE.toLocaleString("en-NG"),
												" to $1 (about ",
												usdRange,
												") and charges your card in dollars through Flutterwave. Whether a foreign card goes through depends on your bank. If it is declined, pick WhatsApp or email enrolment at checkout and we reply with how to pay."
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "rounded-lg border border-border p-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
											className: "w-7 h-7 text-primary mb-3",
											"aria-hidden": "true"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-xl font-semibold mb-2",
											children: "No branches outside Nigeria"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-muted-foreground leading-relaxed",
											children: [
												"All",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
													to: "/locations",
													className: "text-primary hover:underline",
													children: "our campuses"
												}),
												" are in Nigeria, and we have no partner centres in other countries. If you want somewhere to learn in person near you, our",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
													to: "/blog/top-tech-hubs-in-africa-where-to-learn-tech-2026",
													className: "text-primary hover:underline",
													children: "guide to Africa's top tech hubs"
												}),
												" ",
												"covers independent hubs in Kenya, Ghana, Rwanda, South Africa, Egypt and more."
											]
										})
									]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4 bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-3xl font-bold text-center mb-4",
									children: "What you can study online"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground text-center max-w-2xl mx-auto mb-8",
									children: "Starting prices for online study, in naira with the approximate dollar amount checkout charges outside Nigeria."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "grid gap-3 md:grid-cols-2",
									children: onlineDepartments.map(({ d, min }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "rounded-lg border border-border bg-card p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: `/departments/${d.slug}`,
											className: "font-semibold hover:text-primary",
											children: d.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm text-muted-foreground mt-1",
											children: [
												d.duration,
												" ·",
												" ",
												min === 0 ? "Free" : `from ${naira(min)} (about $${toUsd(min)})`
											]
										})]
									}, d.slug))
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-3xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-3xl font-bold text-center mb-8",
									children: "How to enrol"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
									className: "space-y-4",
									children: steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-none w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center",
											children: i + 1
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-semibold",
											children: s.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-muted-foreground",
											children: s.body
										})] })]
									}, s.title))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-center mt-10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/#pricing",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "lg",
											children: "Go to pricing"
										})
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4 bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-3xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-bold text-center mb-8",
								children: "Questions from students outside Nigeria"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-6",
								children: studyOnlineAfricaFaqs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold mb-1",
									children: f.q
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground leading-relaxed",
									children: f.a
								})] }, f.q))
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = StudyOnlineAfrica;
//#endregion
export { SplitComponent as component };
