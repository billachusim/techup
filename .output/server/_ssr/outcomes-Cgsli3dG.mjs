import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { O as ShieldCheck, Xt as BriefcaseBusiness, _ as TrendingUp, dt as GraduationCap, nn as Award, s as Users, x as Star } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { m as fetchPublicTalent } from "./talent-CymeyHOO.mjs";
import { a as googleReviews, i as GraduateStories, n as GOOGLE_REVIEWS_URL, r as GOOGLE_WRITE_REVIEW_URL, t as GOOGLE_RATING } from "./GraduateStories-Dcn_GfqR.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/outcomes-Cgsli3dG.js
var import_jsx_runtime = require_jsx_runtime();
var OUTCOMES = {
	asOf: "October 2026",
	studentsTrained: {
		value: "6,000+",
		number: 6e3,
		label: "Students trained since 2022",
		method: "Everyone who enrolled in a paid or sponsored Tech Faculty NG programme and attended classes, across all campuses, school and university collaborations, SIWES placements and online cohorts, from our first cohort in 2022 to the date above. A person who took two programmes is counted once."
	},
	employmentRate: {
		value: "75%",
		label: "Employed within 6 months",
		method: "Graduates who finished a full-length programme and earned a certificate, who were in paid tech work (a job, an internship, a Talent Pool engagement or steady freelance work) within six months of finishing. Graduates we could not reach are counted as not employed. Graduates who went back to full-time study are left out of the count."
	},
	courses: {
		value: "12",
		label: "Industry-recognised courses",
		method: "Distinct programmes currently listed on our departments pages."
	}
};
var headline = [
	{
		icon: GraduationCap,
		...OUTCOMES.studentsTrained
	},
	{
		icon: TrendingUp,
		...OUTCOMES.employmentRate
	},
	{
		icon: Award,
		...OUTCOMES.courses
	}
];
var TalentPoolEvidence = () => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["public-talent-pool"],
		queryFn: fetchPublicTalent,
		staleTime: 3e5
	});
	const counts = data && [
		{
			icon: Users,
			value: data.length,
			label: "Graduates and students with a public Talent Pool profile"
		},
		{
			icon: ShieldCheck,
			value: data.filter((p) => p.is_vetted).length,
			label: "Vetted by our instructors"
		},
		{
			icon: BriefcaseBusiness,
			value: data.filter((p) => p.is_matched).length,
			label: "Matched to a client role"
		},
		{
			icon: TrendingUp,
			value: data.filter((p) => p.is_working).length,
			label: "Working on a client engagement now"
		}
	].filter((c) => c.value > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card p-6",
		children: [counts && counts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap justify-center gap-6",
			children: counts.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center w-36 md:w-44",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, {
						className: "w-6 h-6 text-primary mx-auto mb-2",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-3xl font-bold",
						children: c.value.toLocaleString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: c.label
					})
				]
			}, c.label))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground text-center",
			children: isLoading && !isError ? "Loading live Talent Pool counts…" : data ? "Graduates are just starting to publish Talent Pool profiles. Browse the ones that are up." : "Live counts are unavailable right now. You can browse the profiles directly."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs text-muted-foreground text-center mt-6",
			children: [
				"Counted live from the",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
					to: "/talent/pool",
					className: "underline hover:text-primary",
					children: "public Talent Pool"
				}),
				". Only people who chose to publish a profile appear there, so these numbers are a floor, not the full picture."
			]
		})]
	});
};
var Outcomes = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-20 px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-4xl md:text-5xl font-bold mb-6",
								children: "Student outcomes at Tech Faculty NG"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-lg text-muted-foreground max-w-2xl mx-auto",
								children: [
									"The numbers we quote across this site, what each one counts, and the evidence you can check yourself. Figures as of ",
									OUTCOMES.asOf,
									"."
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-16",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "container mx-auto max-w-4xl space-y-6",
							children: headline.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "rounded-lg border border-border p-6 md:flex md:gap-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "md:w-48 shrink-0 mb-4 md:mb-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
											className: "w-7 h-7 text-primary mb-2",
											"aria-hidden": "true"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-4xl font-bold",
											children: item.value
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-base font-semibold mt-1",
											children: item.label
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2",
									children: "How we count it"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground leading-relaxed",
									children: item.method
								})] })]
							}, item.label))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4 bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-3xl font-bold text-center mb-4",
									children: "Where graduates work"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground text-center max-w-2xl mx-auto mb-8",
									children: "Graduates work at companies in Nigeria and abroad, and many take paid client projects through our Talent Pool, where we match them to roles and track the engagement from start to finish."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TalentPoolEvidence, {})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduateStories, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-4xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-3xl font-bold text-center mb-4",
									children: "What students say on Google"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted-foreground text-center mb-8",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
											className: "inline w-4 h-4 text-primary fill-primary -mt-1",
											"aria-hidden": "true"
										}),
										" ",
										GOOGLE_RATING.rating,
										" from ",
										GOOGLE_RATING.count,
										" reviews on our",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: GOOGLE_REVIEWS_URL,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "underline hover:text-primary",
											children: "Google Business Profile"
										}),
										" ",
										"(",
										GOOGLE_RATING.checked,
										")."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-4 md:grid-cols-3",
									children: googleReviews.slice(0, 3).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
										className: "rounded-lg border border-border p-5 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-muted-foreground leading-relaxed",
											children: [
												"“",
												r.text,
												"”"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
											className: "mt-3 font-semibold",
											children: [r.name, r.context && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block font-normal text-muted-foreground",
												children: r.context
											})]
										})]
									}, r.name))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-center mt-6",
									children: [
										"Studied with us?",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: GOOGLE_WRITE_REVIEW_URL,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "text-primary hover:underline",
											children: "Leave a Google review"
										}),
										"."
									]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "py-16 px-4 bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-3xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-3xl font-bold text-center mb-8",
									children: "Other ways to check us"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "space-y-4 text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: "Certificates."
											}),
											" Every certificate we issue carries an ID anyone can look up on our ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "/verify",
												className: "text-primary hover:underline",
												children: "certificate verification page"
											}),
											"."
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "Licence."
										}), " Tech Faculty NG is licensed by the Federal Ministry of Science, Technology and Innovation through the National Board for Technology Incubation (NBTI)."] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: "People."
											}),
											" Our founder,",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
												to: "/team/bill-achusim",
												className: "text-primary hover:underline",
												children: "Bill Achusim"
											}),
											", and many of our graduates are on",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "https://www.linkedin.com/company/techfaculty",
												target: "_blank",
												rel: "noopener noreferrer",
												className: "text-primary hover:underline",
												children: "LinkedIn"
											}),
											"."
										] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-center mt-10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/departments",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "lg",
											children: "See our courses"
										})
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
var SplitComponent = Outcomes;
//#endregion
export { SplitComponent as component };
