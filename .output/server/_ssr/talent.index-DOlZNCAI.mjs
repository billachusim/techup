import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { i as useUser } from "./UserContext-uFGsrvio.mjs";
import { C as Sparkles, Jt as Building2, O as ShieldCheck, Yt as Briefcase, d as UserCheck, in as ArrowRight } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as fetchPublishedRoles } from "./talent-CymeyHOO.mjs";
import { t as TalentNav } from "./TalentNav-CWPMXV1q.mjs";
import { t as RoleCard } from "./RoleCard-BZWs0FcC.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/talent.index-DOlZNCAI.js
var import_jsx_runtime = require_jsx_runtime();
var steps = [
	{
		icon: UserCheck,
		title: "Create your profile",
		body: "Sign up, then add your skills, CV, LinkedIn, availability and expected rate. It takes about five minutes and you can keep improving it."
	},
	{
		icon: Sparkles,
		title: "Get matched",
		body: "Our matching engine scores your profile against every open role. A human reviews each suggestion before it reaches you, so the matches you see are real."
	},
	{
		icon: Briefcase,
		title: "Do paid work",
		body: "Take on Tech Faculty roles and client projects — mostly remote, for businesses across Nigeria and Africa."
	}
];
var Talent = () => {
	const { isLoggedIn } = useUser();
	const { data: roles = [], isLoading } = useQuery({
		queryKey: ["talent-roles-published"],
		queryFn: () => fetchPublishedRoles(),
		staleTime: 6e5
	});
	const joinHref = isLoggedIn ? "/talent/profile" : "/login?next=/talent/profile";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "WebPage",
					name: "Tech Faculty Talent Pool",
					url: "https://techfaculty.ng/talent",
					description: "A vetted pool of Nigerian and African tech talent matched to paid remote and on-site work for local and international businesses.",
					provider: {
						"@type": "Organization",
						name: "Tech Faculty NG",
						url: "https://techfaculty.ng"
					}
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TalentNav, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 py-16",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-5xl space-y-6 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "text-3xl font-bold md:text-5xl",
									children: ["Get paid for your skills. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gradient",
										children: "One profile, real projects."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg",
									children: "Tech Faculty Talent connects trained Nigerian and African talent with businesses that need real work done — websites, data, design, marketing, support and AI work. Build your profile once, and we match you to openings as they come in."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-center gap-3 sm:flex-row",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: joinHref,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "lg",
											children: "Join the talent pool"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/hire",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "lg",
											variant: "outline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
												className: "mr-2",
												size: 18
											}), " I want to hire talent"]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center justify-center gap-2 text-sm text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 14 }), " Free to join. Your CV and contact details are never public."]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "border-y border-border bg-card/40 px-4 py-14",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-5xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-8 text-center text-2xl font-bold",
								children: "How it works"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-6 md:grid-cols-3",
								children: steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-card p-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-3 flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(step.icon, {
												size: 20,
												className: "text-primary"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs font-medium text-muted-foreground",
												children: ["Step ", i + 1]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "mb-2 font-semibold",
											children: step.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm leading-relaxed text-muted-foreground",
											children: step.body
										})
									]
								}, step.title))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 py-16",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-6xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-8 flex flex-wrap items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-bold",
									children: "Open roles"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "Current Tech Faculty openings and approved client projects."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
									to: "/careers",
									className: "inline-flex items-center gap-1.5 text-sm text-primary hover:underline",
									children: ["Browse all openings ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
								})]
							}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
								children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-lg border border-border bg-card" }, i))
							}) : roles.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
								children: roles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleCard, { role }, role.id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg border border-border bg-card p-10 text-center text-muted-foreground",
								children: "New roles are added every week. Create your profile now so you are matched the moment one opens."
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "border-t border-border px-4 py-16",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-3xl space-y-4 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-bold",
									children: "Already trained with us?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: "Sign in with the account tied to your Faculty ID and your profile starts half-filled."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: joinHref,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										children: "Build my talent profile"
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
var SplitComponent = Talent;
//#endregion
export { SplitComponent as component };
