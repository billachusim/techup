import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as useParams$1, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { Jt as Building2, Y as MapPin, an as ArrowLeft, bt as ExternalLink, ft as Globe } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as platformFor } from "./jobPlatforms-BS18fzAf.mjs";
import { i as jobPostingSchema, n as fetchJobBySlug, o as locationLabel, s as salaryLabel, t as employmentLabel } from "./jobs-BXoqCGaZ.mjs";
import { t as ApplySteps } from "./ApplySteps-DokqhxqQ.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/careers.jobs._slug-DGGc5Sbx.js
var import_jsx_runtime = require_jsx_runtime();
var JobDetail = () => {
	const { slug = "" } = useParams$1();
	const { data: job, isLoading } = useQuery({
		queryKey: ["job", slug],
		queryFn: () => fetchJobBySlug(slug),
		enabled: !!slug
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-32 px-4 container mx-auto max-w-3xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-2/3 bg-card border border-border rounded animate-pulse mb-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 bg-card border border-border rounded animate-pulse" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	if (!job) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-32 px-4 container mx-auto max-w-3xl text-center space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl md:text-3xl font-bold",
						children: "This role is no longer listed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "It may have been filled or removed from the source platform."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/careers",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Browse open roles" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	const pay = salaryLabel(job);
	const platform = platformFor(job.source_platform);
	const title = `${job.title} at ${job.company}`;
	job.description.slice(0, 155);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify(jobPostingSchema(job))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
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
							name: "Careers",
							item: "https://techfaculty.ng/careers"
						},
						{
							"@type": "ListItem",
							position: 3,
							name: title,
							item: `https://techfaculty.ng/careers/jobs/${job.slug}`
						}
					]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "pt-24 pb-20 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "container mx-auto max-w-3xl space-y-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
							to: platform ? `/careers/platforms/${platform.slug}` : "/careers",
							className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 14 }),
								" Back to ",
								platform ? `${platform.name} jobs` : "Careers"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs uppercase tracking-wide text-muted-foreground font-semibold",
									children: ["Sourced from ", job.source_platform]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-3xl md:text-4xl font-bold leading-tight",
									children: job.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { size: 14 }),
												" ",
												job.company
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [
												job.is_remote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { size: 14 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { size: 14 }),
												" ",
												locationLabel(job)
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium",
											children: employmentLabel(job.employment_type)
										}),
										pay && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: pay
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-semibold",
								children: "About this role"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted-foreground leading-relaxed whitespace-pre-line",
								children: job.description
							})]
						}),
						job.tags?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-semibold",
								children: "Skills mentioned"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: job.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs border border-border rounded-full px-3 py-1 text-muted-foreground",
									children: t
								}, t))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "border border-border rounded-lg p-6 bg-card space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-semibold",
									children: "Apply for this role"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground",
									children: [
										"Applications are handled on ",
										job.source_platform,
										". Follow the steps below to apply."
									]
								}),
								platform ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApplySteps, {
									platform,
									jobUrl: job.source_url,
									jobTitle: job.title
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: job.source_url,
									target: "_blank",
									rel: "noopener noreferrer nofollow",
									className: "block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "w-full sm:w-auto",
										children: [
											"Apply on ",
											job.source_platform,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
												size: 14,
												className: "ml-2"
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "border-t border-border pt-3 text-xs text-muted-foreground",
									children: "This is an independent third-party listing. Tech Faculty does not manage its hiring process."
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
/** Lead with what searchers want (remote, apply), then the role summary. */
var SplitComponent = JobDetail;
//#endregion
export { SplitComponent as component };
