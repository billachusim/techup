import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { St as Download } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as SITE_URL, t as LOGO_URL } from "./seo-CiXrTLvh.mjs";
import { n as BLOG_AUTHOR, r as authorSchema, t as AUTHOR_URL } from "./author-DxxB3mAx.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/reports.nigeria-tech-salaries-CHzt10CI.js
var import_jsx_runtime = require_jsx_runtime();
var SALARY_REPORT_PATH = "/reports/nigeria-tech-salaries";
var SALARY_REPORT_CSV = "/data/nigeria-tech-salaries-2026.csv";
var REPORT = {
	title: "Nigerian Tech Salaries 2026: What 65 Tech Roles Pay",
	published: "2026-10-25",
	modified: "2026-10-25",
	retrieved: "25 October 2026"
};
var SOURCES = {
	paylabIt: {
		id: "paylab-it",
		name: "Salary data for Information Technology, Nigeria",
		publisher: "Paylab",
		url: "https://www.paylab.com/ng/salaryinfo/information-technology?lang=en",
		note: "Self-reported gross monthly pay including bonuses, from employees in Nigeria, with extreme and duplicate entries removed by Paylab. Ranges are the 10th to 90th percentile. Paylab does not publish a sample size for the category or a collection period."
	},
	paylabSwe: {
		id: "paylab-swe",
		name: "Software Engineer salary, Nigeria",
		publisher: "Paylab",
		url: "https://www.paylab.com/ng/salaryinfo/information-technology/software-engineer?lang=en",
		note: "Based on 28 verified respondents."
	},
	paylabDevops: {
		id: "paylab-devops",
		name: "DevOps Engineer salary, Nigeria",
		publisher: "Paylab",
		url: "https://www.paylab.com/ng/salaryinfo/information-technology/devops-engineer?lang=en",
		note: "Paylab says fewer than 20 verified respondents."
	},
	techcabal: {
		id: "techcabal-2025",
		name: "The highest-paying tech jobs in Nigeria (2025)",
		publisher: "TechCabal",
		url: "https://techcabal.com/?p=167925",
		note: "Ranges given by an HR professional and two company founders interviewed for the article. No survey or sample behind them. TechCabal converts at ₦1,500 to $1."
	},
	minimumWage: {
		id: "minimum-wage-2024",
		name: "Tinubu Signs N70,000 Minimum Wage Bill into Law",
		publisher: "ThisDay",
		url: "https://www.thisdaylive.com/2024/07/30/tinubu-signs-n70000-minimum-wage-bill-into-law-amid-unease-over-planned-protest/",
		note: "National Minimum Wage (Amendment) Act 2024, signed 29 July 2024: ₦70,000 a month."
	}
};
var MINIMUM_WAGE_NGN = 7e4;
/** Paylab's Information Technology category for Nigeria, gross monthly naira. */
var PAYLAB_IT_CATEGORY = {
	p10: 179068,
	p90: 964595,
	average: 523374
};
/** Every Paylab IT role for Nigeria that shows a range (10th-90th percentile, gross monthly naira). */
var PAYLAB_ROLES = [
	{
		role: ".NET Programmer",
		p10: 218445,
		p90: 744700
	},
	{
		role: "ABAP Programmer",
		p10: 240346,
		p90: 880563
	},
	{
		role: "ASP.NET Programmer",
		p10: 195868,
		p90: 694579
	},
	{
		role: "Agile Coach",
		p10: 289505,
		p90: 1113802
	},
	{
		role: "Android Developer",
		p10: 218654,
		p90: 867224
	},
	{
		role: "Backend developer",
		p10: 201895,
		p90: 914555
	},
	{
		role: "Business Intelligence Specialist",
		p10: 200423,
		p90: 727003
	},
	{
		role: "C Programmer",
		p10: 195868,
		p90: 803060
	},
	{
		role: "C# Programmer",
		p10: 201895,
		p90: 711153
	},
	{
		role: "C++ Programmer",
		p10: 226073,
		p90: 834248
	},
	{
		role: "Cloud Engineer",
		p10: 230174,
		p90: 850663
	},
	{
		role: "Data Protection Officer",
		p10: 175351,
		p90: 547683
	},
	{
		role: "Data communication technician",
		p10: 179561,
		p90: 448993
	},
	{
		role: "Data scientist",
		p10: 183625,
		p90: 771333
	},
	{
		role: "Database Administrator",
		p10: 201065,
		p90: 663632
	},
	{
		role: "Database Analyst",
		p10: 198791,
		p90: 598627
	},
	{
		role: "DevOps Engineer",
		p10: 213968,
		p90: 1077050
	},
	{
		role: "Frontend developer",
		p10: 203862,
		p90: 677405
	},
	{
		role: "Game designer",
		p10: 190126,
		p90: 587783
	},
	{
		role: "Game developer",
		p10: 189842,
		p90: 653899
	},
	{
		role: "IC Design Engineer",
		p10: 286269,
		p90: 1062209
	},
	{
		role: "ICT-specialist",
		p10: 180434,
		p90: 468604
	},
	{
		role: "IT Analyst",
		p10: 182952,
		p90: 670100
	},
	{
		role: "IT Architect",
		p10: 294628,
		p90: 1245095
	},
	{
		role: "IT Business Analyst",
		p10: 210611,
		p90: 829371
	},
	{
		role: "IT Consultant",
		p10: 201895,
		p90: 929622
	},
	{
		role: "IT Network Administrator",
		p10: 184601,
		p90: 579232
	},
	{
		role: "IT Product Manager",
		p10: 222953,
		p90: 1176522
	},
	{
		role: "IT Project Manager",
		p10: 248602,
		p90: 890448
	},
	{
		role: "IT Security Specialist",
		p10: 222651,
		p90: 1118613
	},
	{
		role: "IT System Administrator",
		p10: 187922,
		p90: 544793
	},
	{
		role: "IT Tester",
		p10: 176737,
		p90: 534227
	},
	{
		role: "IT auditor",
		p10: 202553,
		p90: 642234
	},
	{
		role: "IT tester - automated tests",
		p10: 209730,
		p90: 739973
	},
	{
		role: "IT/Technical Support Specialist",
		p10: 127919,
		p90: 403188
	},
	{
		role: "Java Programmer",
		p10: 213949,
		p90: 846754
	},
	{
		role: "Javascript Programmer",
		p10: 209429,
		p90: 753340
	},
	{
		role: "Lead developer",
		p10: 374915,
		p90: 1310768
	},
	{
		role: "Microcontroller programmer",
		p10: 205349,
		p90: 645811
	},
	{
		role: "Objective-C Programmer",
		p10: 238356,
		p90: 894915
	},
	{
		role: "Online Casino Technician",
		p10: 188971,
		p90: 541785
	},
	{
		role: "Oracle Programmer",
		p10: 210210,
		p90: 846194
	},
	{
		role: "PC Technician",
		p10: 173087,
		p90: 414198
	},
	{
		role: "PHP Programmer",
		p10: 165900,
		p90: 653333
	},
	{
		role: "Perl Programmer",
		p10: 213281,
		p90: 806830
	},
	{
		role: "Programmer",
		p10: 195784,
		p90: 770021
	},
	{
		role: "Python Programmer",
		p10: 205600,
		p90: 701273
	},
	{
		role: "R programmer",
		p10: 197904,
		p90: 639427
	},
	{
		role: "RPA engineer",
		p10: 239354,
		p90: 907347
	},
	{
		role: "SAP consultant",
		p10: 239564,
		p90: 883438
	},
	{
		role: "SAP specialist",
		p10: 199432,
		p90: 795048
	},
	{
		role: "SRE (Site Reliability Engineer)",
		p10: 267706,
		p90: 1007328
	},
	{
		role: "Scrum Master",
		p10: 233357,
		p90: 815997
	},
	{
		role: "Service Engineer",
		p10: 193092,
		p90: 495440
	},
	{
		role: "Service Technician",
		p10: 166889,
		p90: 390732
	},
	{
		role: "Software Engineer",
		p10: 523115,
		p90: 3097469
	},
	{
		role: "Software consultant",
		p10: 204908,
		p90: 726220
	},
	{
		role: "Solution architect",
		p10: 313389,
		p90: 1191784
	},
	{
		role: "Systems Administrator",
		p10: 200119,
		p90: 599571
	},
	{
		role: "Systems Engineer",
		p10: 202278,
		p90: 712993
	},
	{
		role: "Technical Writer",
		p10: 191290,
		p90: 485442
	},
	{
		role: "User Experience Expert",
		p10: 203238,
		p90: 677200
	},
	{
		role: "Web Designer",
		p10: 182610,
		p90: 471414
	},
	{
		role: "Webmaster",
		p10: 165352,
		p90: 376700
	},
	{
		role: "iOS Developer",
		p10: 257474,
		p90: 990342
	}
];
/** Roles shown in the chart: the ones our departments train for, plus the leadership roles they lead to. */
var CHART_ROLES = [
	"Software Engineer",
	"Lead developer",
	"IT Architect",
	"IT Product Manager",
	"IT Security Specialist",
	"DevOps Engineer",
	"Cloud Engineer",
	"iOS Developer",
	"Backend developer",
	"Android Developer",
	"Data scientist",
	"Frontend developer",
	"User Experience Expert",
	"IT Tester",
	"Web Designer",
	"IT/Technical Support Specialist"
];
/**
* Ranges employers and founders gave TechCabal for mid-level to senior hires at
* established startups and fintechs, gross monthly naira.
*/
var EMPLOYER_RANGES = [
	{
		role: "Cybersecurity analyst",
		level: "Mid",
		min: 45e4,
		max: 9e5,
		compareTo: "IT Security Specialist"
	},
	{
		role: "Cybersecurity analyst",
		level: "Senior",
		min: 15e5,
		max: 2e6,
		compareTo: "IT Security Specialist"
	},
	{
		role: "Software developer (back end)",
		level: "Mid to senior",
		min: 12e5,
		max: 25e5,
		compareTo: "Backend developer"
	},
	{
		role: "DevOps engineer",
		level: "Mid to senior",
		min: 13e5,
		max: 24e5,
		compareTo: "DevOps Engineer"
	},
	{
		role: "Technical product manager",
		level: "Mid to senior",
		min: 15e5,
		max: 28e5,
		compareTo: "IT Product Manager"
	},
	{
		role: "Data engineer",
		level: "Mid to senior",
		min: 18e5,
		max: 25e5
	},
	{
		role: "AI/ML engineer",
		level: "Not stated",
		min: 6e5,
		max: 12e5
	},
	{
		role: "Chief Technology Officer",
		level: "Executive",
		min: 3e6,
		max: 5e6
	}
];
var formatNaira = (n) => `₦${Math.round(n).toLocaleString("en-NG")}`;
/** "₦1.2M", "₦965k": for chart labels where space is short. */
var shortNaira = (n) => n >= 1e6 ? `₦${(n / 1e6).toFixed(n >= 1e7 ? 0 : 2).replace(/\.?0+$/, "")}M` : `₦${Math.round(n / 1e3)}k`;
var roleByName = (name) => PAYLAB_ROLES.find((r) => r.role === name);
function median(values) {
	if (!values.length) return null;
	const s = [...values].sort((a, b) => a - b);
	const mid = Math.floor(s.length / 2);
	return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}
/** Midpoint of an advertised range, or the single figure when only one end is given. */
var midpoint = (r) => {
	const lo = r.salary_min ?? r.salary_max;
	const hi = r.salary_max ?? r.salary_min;
	return lo && hi ? (lo + hi) / 2 : null;
};
/**
* Median advertised pay across the open roles on our jobs board, in the unit the ads
* use most: naira per month (yearly figures divided by 12) and US dollars per hour.
* Other currencies and units are left out rather than converted at a guessed rate.
*/
function advertisedPay(rows) {
	const ngnMonthly = [];
	const usdHourly = [];
	for (const r of rows) {
		const mid = midpoint(r);
		if (!mid || mid <= 0) continue;
		const cur = (r.salary_currency ?? "").toUpperCase();
		const unit = (r.salary_unit ?? "").toUpperCase();
		if (cur === "NGN" && (unit === "MONTH" || unit === "")) ngnMonthly.push(mid);
		else if (cur === "NGN" && unit === "YEAR") ngnMonthly.push(mid / 12);
		else if (cur === "USD" && unit === "HOUR") usdHourly.push(mid);
	}
	return {
		ngnMonthly: {
			count: ngnMonthly.length,
			median: ngnMonthly.length >= 5 ? median(ngnMonthly) : null
		},
		usdHourly: {
			count: usdHourly.length,
			median: usdHourly.length >= 5 ? median(usdHourly) : null
		}
	};
}
var pageUrl = `${SITE_URL}${SALARY_REPORT_PATH}`;
var csvUrl = `${SITE_URL}${SALARY_REPORT_CSV}`;
var sources = Object.values(SOURCES);
var sourceNumber = (id) => sources.findIndex((s) => s.id === id) + 1;
/** Superscript link to a numbered entry in the Sources list. */
var Cite = ({ id }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sup", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
	href: `#source-${id}`,
	className: "text-primary hover:underline",
	children: [
		"[",
		sourceNumber(id),
		"]"
	]
}) });
var chartRows = CHART_ROLES.map(roleByName).filter((r) => Boolean(r));
var chartMax = 32e5;
var pct = (n) => `${n / chartMax * 100}%`;
var topRoles = [...PAYLAB_ROLES].sort((a, b) => b.p90 - a.p90).slice(0, 5);
var lowRoles = [...PAYLAB_ROLES].sort((a, b) => a.p90 - b.p90).slice(0, 3);
var wageMultiple = (PAYLAB_IT_CATEGORY.average / MINIMUM_WAGE_NGN).toFixed(1);
var p10Multiple = (PAYLAB_IT_CATEGORY.p10 / MINIMUM_WAGE_NGN).toFixed(1);
var backend = roleByName("Backend developer");
var backendEmployer = EMPLOYER_RANGES.find((e) => e.compareTo === "Backend developer");
var citation = `Tech Faculty NG (${REPORT.published.slice(0, 4)}). ${REPORT.title}. ${pageUrl}`;
var schema = {
	"@context": "https://schema.org",
	"@graph": [{
		"@type": "Article",
		"@id": `${pageUrl}#article`,
		headline: REPORT.title,
		description: "Gross monthly pay ranges for 65 tech roles in Nigeria, compared with the national minimum wage and with ranges employers give for senior hires.",
		url: pageUrl,
		datePublished: REPORT.published,
		dateModified: REPORT.modified,
		author: {
			"@id": authorSchema["@id"],
			"@type": "Person",
			name: BLOG_AUTHOR.name,
			url: AUTHOR_URL
		},
		publisher: {
			"@type": "Organization",
			name: "Tech Faculty NG",
			url: SITE_URL,
			logo: {
				"@type": "ImageObject",
				url: LOGO_URL
			}
		},
		mainEntityOfPage: pageUrl,
		inLanguage: "en-NG",
		about: { "@id": `${pageUrl}#dataset` },
		citation: sources.map((s) => ({
			"@type": "CreativeWork",
			name: s.name,
			publisher: s.publisher,
			url: s.url
		}))
	}, {
		"@type": "Dataset",
		"@id": `${pageUrl}#dataset`,
		name: "Nigerian tech salary ranges by role, 2026",
		description: "10th and 90th percentile gross monthly salaries in naira for 65 information technology roles in Nigeria, compiled by Tech Faculty NG from Paylab's published salary data, with the source URL and retrieval date on every row.",
		url: pageUrl,
		creator: {
			"@type": "Organization",
			name: "Tech Faculty NG",
			url: SITE_URL
		},
		license: "https://creativecommons.org/licenses/by/4.0/",
		isAccessibleForFree: true,
		keywords: [
			"Nigeria",
			"tech salaries",
			"software engineer salary Nigeria",
			"IT pay",
			"naira"
		],
		spatialCoverage: {
			"@type": "Country",
			name: "Nigeria"
		},
		temporalCoverage: "2026",
		dateModified: REPORT.modified,
		isBasedOn: [SOURCES.paylabIt.url],
		variableMeasured: ["Gross monthly salary, 10th percentile (NGN)", "Gross monthly salary, 90th percentile (NGN)"],
		distribution: {
			"@type": "DataDownload",
			encodingFormat: "text/csv",
			contentUrl: csvUrl
		}
	}]
};
var SectionTitle = ({ id, children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
	id,
	className: "text-2xl md:text-3xl font-bold mb-4 scroll-mt-24",
	children
});
async function fetchAdvertisedSalaries() {
	const { data, error } = await (await getSupabase()).from("jobs").select("salary_min,salary_max,salary_currency,salary_unit").eq("is_expired", false).not("salary_currency", "is", null).limit(1e3);
	if (error) throw error;
	return data ?? [];
}
var AdvertisedPay = () => {
	const { data } = useQuery({
		queryKey: ["advertised-salaries"],
		queryFn: fetchAdvertisedSalaries,
		staleTime: 6e5
	});
	if (!data) return null;
	const pay = advertisedPay(data);
	if (pay.ngnMonthly.median === null && pay.usdHourly.median === null) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				id: "advertised",
				children: "What open roles on our jobs board advertise"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [pay.ngnMonthly.median !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-3xl font-bold",
						children: formatNaira(pay.ngnMonthly.median)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: [
							"Median advertised monthly pay across ",
							pay.ngnMonthly.count,
							" open roles paid in naira"
						]
					})]
				}), pay.usdHourly.median !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-3xl font-bold",
						children: [
							"$",
							pay.usdHourly.median.toFixed(0),
							"/hour"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: [
							"Median advertised rate across ",
							pay.usdHourly.count,
							" open remote roles paid in US dollars by the hour"
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground mt-3",
				children: [
					"Counted live from the open listings on our",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/careers",
						className: "text-primary hover:underline",
						children: "careers page"
					}),
					" ",
					"that state a salary. The midpoint of each advertised range is used, and yearly naira figures are divided by 12. Most ads do not state pay, so this is a small, changing sample, not a survey."
				]
			})
		]
	});
};
var SalaryReport = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "min-h-screen bg-background",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			type: "application/ld+json",
			children: JSON.stringify(schema)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "pt-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
				className: "py-16 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container mx-auto max-w-4xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mb-2",
							children: "Tech Faculty NG research"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-4xl md:text-5xl font-bold mb-4",
							children: REPORT.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground mb-8",
							children: [
								"By",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/team/bill-achusim",
									className: "text-primary hover:underline",
									children: BLOG_AUTHOR.name
								}),
								" ",
								"· Published",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
									dateTime: REPORT.published,
									children: REPORT.retrieved
								}),
								" · Figures retrieved ",
								REPORT.retrieved
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg leading-relaxed mb-8",
							children: "Most salary figures shared about Nigerian tech jobs have no source. This report puts the published numbers in one place, with a link for every figure, so students, employers and journalists can check them. All pay is gross per month, in naira, for roles based in Nigeria."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							"aria-labelledby": "key-findings",
							className: "mb-12",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
									id: "key-findings",
									children: "Key findings"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-3 mb-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border border-border p-5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-3xl font-bold",
												children: formatNaira(PAYLAB_IT_CATEGORY.average)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm text-muted-foreground mt-1",
												children: ["Average monthly pay in Nigerian IT jobs", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cite, { id: "paylab-it" })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border border-border p-5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-3xl font-bold",
												children: [wageMultiple, "×"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm text-muted-foreground mt-1",
												children: [
													"The national minimum wage of ",
													formatNaira(MINIMUM_WAGE_NGN),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cite, { id: "minimum-wage-2024" })
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border border-border p-5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-3xl font-bold",
												children: [
													shortNaira(PAYLAB_IT_CATEGORY.p10),
													"–",
													shortNaira(PAYLAB_IT_CATEGORY.p90)
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm text-muted-foreground mt-1",
												children: ["What the middle 80% of IT workers earn a month", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cite, { id: "paylab-it" })]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "list-disc pl-6 space-y-3 leading-relaxed",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											"Tech pays well above the wage floor. Only 10% of Nigerian IT workers earn less than ",
											formatNaira(PAYLAB_IT_CATEGORY.p10),
											" a month, about ",
											p10Multiple,
											" times the minimum wage, and 10% earn more than ",
											formatNaira(PAYLAB_IT_CATEGORY.p90),
											".",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cite, { id: "paylab-it" })
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											"Software Engineer is the best-paid title in the data, with the top tenth earning more than",
											" ",
											formatNaira(roleByName("Software Engineer").p90),
											" a month. It rests on only 28 respondents, so treat it as a signal, not a precise figure.",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cite, { id: "paylab-swe" })
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											"After it come",
											" ",
											topRoles.slice(1).map((r) => r.role).join(", "),
											": the top tenth in each earns more than ₦1.1M a month. Leadership and architecture pay more than any single coding language.",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cite, { id: "paylab-it" })
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											"Support and web roles pay least. In",
											" ",
											lowRoles.map((r) => r.role).join(", "),
											", only 10% earn more than ",
											shortNaira(lowRoles[0].p90),
											"–",
											shortNaira(lowRoles[lowRoles.length - 1].p90),
											" a month.",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cite, { id: "paylab-it" })
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											"Established startups pay well above the wider market. Founders and HR leads told TechCabal that mid to senior back-end developers get ",
											shortNaira(backendEmployer.min),
											"–",
											shortNaira(backendEmployer.max),
											" a month",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cite, { id: "techcabal-2025" }),
											", while 90% of back-end developers in the survey data earn less than ",
											shortNaira(backend.p90),
											".",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cite, { id: "paylab-it" })
										] })
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							"aria-labelledby": "by-role",
							className: "mb-12",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
									id: "by-role",
									children: "Monthly pay by role"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
									className: "text-sm text-muted-foreground mb-4",
									children: [
										"Figure 1. Gross monthly pay in Nigeria, 10th to 90th percentile, for 16 common tech roles. The dashed line is the",
										" ",
										formatNaira(MINIMUM_WAGE_NGN),
										" minimum wage. Source: Paylab",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cite, { id: "paylab-it" }),
										", retrieved ",
										REPORT.retrieved,
										"."
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									role: "img",
									"aria-label": "Range chart of monthly pay by role; the same figures are in the table below.",
									children: [chartRows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-[9rem_1fr] sm:grid-cols-[13rem_1fr] items-center gap-3 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-right leading-tight",
											title: r.role,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block truncate",
												children: r.role
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "block text-xs text-muted-foreground sm:hidden",
												children: [
													shortNaira(r.p10),
													"–",
													shortNaira(r.p90)
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative h-6 rounded bg-muted",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "absolute inset-y-0 border-l border-dashed border-foreground/60",
													style: { left: pct(MINIMUM_WAGE_NGN) }
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "absolute inset-y-1 rounded bg-primary",
													style: {
														left: pct(r.p10),
														width: pct(r.p90 - r.p10)
													}
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "absolute inset-y-0 hidden sm:flex items-center px-2 text-xs text-muted-foreground whitespace-nowrap",
													style: r.p90 > chartMax * .6 ? { right: `calc(100% - ${pct(r.p10)})` } : { left: pct(r.p90) },
													children: [
														shortNaira(r.p10),
														"–",
														shortNaira(r.p90)
													]
												})
											]
										})]
									}, r.role)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-[9rem_1fr] sm:grid-cols-[13rem_1fr] gap-3 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "relative h-4",
											children: [
												0,
												1e6,
												2e6,
												3e6
											].map((tick) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute -translate-x-1/2",
												style: { left: pct(tick) },
												children: tick ? shortNaira(tick) : "₦0"
											}, tick))
										})]
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
									className: "mt-6 rounded-lg border border-border p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
										className: "cursor-pointer font-semibold",
										children: [
											"All ",
											PAYLAB_ROLES.length,
											" roles as a table"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "overflow-x-auto mt-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
											className: "w-full text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "text-left border-b border-border",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "py-2 pr-4",
														children: "Role"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "py-2 pr-4 text-right",
														children: "10% earn less than"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "py-2 text-right",
														children: "10% earn more than"
													})
												]
											}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [...PAYLAB_ROLES].sort((a, b) => b.p90 - a.p90).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "border-b border-border/60",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-1.5 pr-4",
														children: r.role
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-1.5 pr-4 text-right tabular-nums",
														children: formatNaira(r.p10)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-1.5 text-right tabular-nums",
														children: formatNaira(r.p90)
													})
												]
											}, r.role)) })]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: SALARY_REPORT_CSV,
										download: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
												className: "w-4 h-4 mr-2",
												"aria-hidden": "true"
											}), "Download the data (CSV)"]
										})
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							"aria-labelledby": "employers",
							className: "mb-12",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
									id: "employers",
									children: "What employers say they pay senior hires"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "leading-relaxed mb-4",
									children: [
										"In 2025 TechCabal asked an HR professional and two founders, including Lendsqr founder Deji Olowe, what mid-level and senior tech hires earn.",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cite, { id: "techcabal-2025" }),
										" These ranges describe well-funded startups and fintechs, not the whole market, and rest on interviews rather than a survey. Where the survey data has a matching role, its 90th percentile is shown alongside."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-x-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "text-left border-b border-border",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2 pr-4",
													children: "Role"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2 pr-4",
													children: "Level"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2 pr-4 text-right",
													children: "Employers' range"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-2 text-right",
													children: "Survey: top 10% earn more than"
												})
											]
										}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: EMPLOYER_RANGES.map((e) => {
											const match = e.compareTo ? roleByName(e.compareTo) : void 0;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "border-b border-border/60",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-1.5 pr-4",
														children: e.role
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-1.5 pr-4",
														children: e.level
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "py-1.5 pr-4 text-right tabular-nums",
														children: [
															shortNaira(e.min),
															"–",
															shortNaira(e.max),
															e.role === "Chief Technology Officer" ? "+" : ""
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-1.5 text-right tabular-nums",
														children: match ? shortNaira(match.p90) : "No match"
													})
												]
											}, `${e.role}-${e.level}`);
										}) })]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdvertisedPay, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							"aria-labelledby": "method",
							className: "mt-12 mb-12",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
								id: "method",
								children: "Method and limits"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "list-disc pl-6 space-y-3 leading-relaxed text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Role ranges are copied as published by Paylab, which collects pay from employees who fill in its salary survey and removes extreme and duplicate entries. Figures are gross monthly pay including bonuses. We did not adjust them." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Paylab does not publish a sample size for most roles. Where it does, samples are small: 28 respondents for Software Engineer and fewer than 20 for DevOps Engineer. Ranges for small samples move a lot when refreshed." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Paylab publishes no median per role, so we report the 10th and 90th percentiles it does publish. Its titles are generic: \"Software Engineer\" and \"Backend developer\" overlap, and respondents choose their own title." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The employer ranges come from three people interviewed by one publication. They are useful for the top of the market and say little about pay outside Lagos and Abuja." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "We do not convert to US dollars, because the naira rate moves too much for a fixed conversion to stay true." })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							"aria-labelledby": "cite",
							className: "mb-12 rounded-lg border border-border bg-muted/30 p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
									id: "cite",
									children: "Use and cite this report"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "leading-relaxed mb-3",
									children: "You are free to quote the figures and reuse the chart and data, with credit to Tech Faculty NG and a link to this page (CC BY 4.0). Please also credit the original source of any figure you use."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-mono bg-background rounded p-3 break-words",
									children: citation
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground mt-3",
									children: [
										"Journalists: for comment or the underlying files, email",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: "mailto:thetechfaculty@gmail.com",
											className: "text-primary hover:underline",
											children: "thetechfaculty@gmail.com"
										}),
										"."
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							"aria-labelledby": "sources",
							className: "mb-12",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
								id: "sources",
								children: "Sources"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "list-decimal pl-6 space-y-3 text-sm",
								children: sources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									id: `source-${s.id}`,
									className: "scroll-mt-24",
									children: [
										s.publisher,
										", \"",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: s.url,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "text-primary hover:underline",
											children: s.name
										}),
										"\". Retrieved ",
										REPORT.retrieved,
										".",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: s.note
										})
									]
								}, s.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-lg border border-border p-6 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl font-bold mb-2",
									children: "Training for one of these roles?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground mb-4",
									children: "Tech Faculty NG teaches software engineering, data, cybersecurity, product and design, online or at campuses across Nigeria."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/departments",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "See our courses" })
								})
							]
						})
					]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
	]
});
var SplitComponent = SalaryReport;
//#endregion
export { SplitComponent as component };
