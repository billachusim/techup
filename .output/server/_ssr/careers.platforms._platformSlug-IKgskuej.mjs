import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as useParams$1, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { Jt as Building2, Y as MapPin, an as ArrowLeft, bt as ExternalLink, ft as Globe, j as Search, u as UserPlus } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DQeVp_Q7.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as platformBySlug, r as platformFor } from "./jobPlatforms-BS18fzAf.mjs";
import { o as locationLabel, r as fetchJobs, s as salaryLabel, t as employmentLabel } from "./jobs-BXoqCGaZ.mjs";
import { t as ApplySteps } from "./ApplySteps-DokqhxqQ.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/careers.platforms._platformSlug-IKgskuej.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var ApplyDialog = ({ open, onOpenChange, platform, jobTitle, jobUrl }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
	open,
	onOpenChange,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "sm:max-w-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: jobTitle ? `Apply: ${jobTitle}` : `Get started with ${platform.name}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Two quick steps and you're in." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApplySteps, {
				platform,
				jobUrl,
				jobTitle: jobTitle ?? platform.name
			})
		})]
	})
});
var JobCard = ({ job }) => {
	const pay = salaryLabel(job);
	const platform = platformFor(job.source_platform);
	const [applyOpen, setApplyOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "bg-card border border-border rounded-lg p-5 space-y-3 shadow-xs hover:shadow-md transition-shadow flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] uppercase tracking-wide text-muted-foreground font-semibold",
					children: job.source_platform
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium whitespace-nowrap",
					children: employmentLabel(job.employment_type)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold leading-snug",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: `/careers/jobs/${job.slug}`,
						className: "hover:text-primary transition-colors",
						children: job.title
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 12 }),
						" ",
						job.company
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground line-clamp-3 flex-1",
				children: job.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1",
					children: [job.is_remote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { size: 12 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { size: 12 }), locationLabel(job)]
				}), pay && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-foreground",
					children: pay
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 pt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
					to: `/careers/jobs/${job.slug}`,
					className: "text-sm font-medium text-primary hover:underline",
					"aria-label": `View details for ${job.title} at ${job.company}`,
					children: "View role →"
				}), platform ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setApplyOpen(true),
					className: "text-sm font-medium text-muted-foreground hover:text-primary transition-colors",
					"aria-label": `Apply for ${job.title} at ${job.company}`,
					children: "Apply"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: job.source_url,
					target: "_blank",
					rel: "noopener noreferrer nofollow",
					className: "text-sm font-medium text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1",
					"aria-label": `Apply for ${job.title} on ${job.source_platform}`,
					children: ["Apply ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { size: 12 })]
				})]
			}),
			platform && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApplyDialog, {
				open: applyOpen,
				onOpenChange: setApplyOpen,
				platform,
				jobTitle: job.title,
				jobUrl: job.source_url
			})
		]
	});
};
var ExternalPlatformJobs = () => {
	const { platformSlug } = useParams$1();
	const platform = platformBySlug(platformSlug);
	const [search, setSearch] = (0, import_react.useState)("");
	const { data: jobs = [], isLoading } = useQuery({
		queryKey: ["external-platform-jobs", platformSlug],
		queryFn: () => fetchJobs(),
		enabled: Boolean(platform),
		staleTime: 18e5
	});
	const platformJobs = (0, import_react.useMemo)(() => {
		if (!platform) return [];
		const sources = new Set(platform.match.map((item) => item.toLowerCase()));
		const query = search.trim().toLowerCase();
		return jobs.filter((job) => {
			if (!sources.has(job.source_platform.toLowerCase())) return false;
			if (!query) return true;
			return `${job.title} ${job.company} ${job.description} ${job.tags.join(" ")} ${job.location ?? ""}`.toLowerCase().includes(query);
		});
	}, [
		jobs,
		platform,
		search
	]);
	if (!platform) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container mx-auto max-w-3xl px-4 pb-20 pt-32 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold",
					children: "Platform not found"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
					to: "/careers",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-6",
						children: "Return to Careers"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: platform.faqs.map((f) => ({
			"@type": "Question",
			name: f.q,
			acceptedAnswer: {
				"@type": "Answer",
				text: f.a
			}
		}))
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify(faqSchema)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "px-4 pb-20 pt-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container mx-auto max-w-6xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
							to: "/careers",
							className: "mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 14 }), " Back to Tech Faculty Careers"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mb-12 max-w-3xl space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-primary",
									children: "Independent work platform"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "text-3xl font-bold md:text-5xl",
									children: [platform.keyword, " for African Talent"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-base leading-relaxed text-muted-foreground md:text-lg",
									children: [
										platform.about,
										" These listings are hosted and managed by ",
										platform.name,
										", not Tech Faculty."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: platform.signupUrl,
									target: "_blank",
									rel: "noopener noreferrer nofollow",
									className: "inline-block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "lg",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, {
												className: "mr-2",
												size: 18
											}),
											" Create a ",
											platform.name,
											" account ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
												className: "ml-2",
												size: 16
											})
										]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							"aria-labelledby": "platform-jobs-heading",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-6 flex flex-wrap items-end justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									id: "platform-jobs-heading",
									className: "text-2xl font-bold",
									children: "Available listings"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: [
										"Apply on ",
										platform.name,
										". Availability can change without notice."
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative w-full sm:w-80",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
										className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
										size: 16
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: search,
										onChange: (event) => setSearch(event.target.value),
										placeholder: "Search these jobs",
										className: "pl-9"
									})]
								})]
							}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
								children: Array.from({ length: 3 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-56 animate-pulse rounded-lg border border-border bg-card" }, index))
							}) : platformJobs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
								children: platformJobs.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobCard, { job }, job.id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg border border-border bg-card p-10 text-center text-muted-foreground",
								children: search ? "No listings match your search." : `No ${platform.name} listings are open right now. New roles are added every week, and you can create your account now so you're ready.`
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							"aria-labelledby": "platform-faq-heading",
							className: "mt-16 max-w-3xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								id: "platform-faq-heading",
								className: "mb-6 text-2xl font-bold",
								children: [platform.name, " FAQ"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-5",
								children: platform.faqs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold",
									children: f.q
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: f.a
								})] }, f.q))
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = ExternalPlatformJobs;
//#endregion
export { SplitComponent as component };
