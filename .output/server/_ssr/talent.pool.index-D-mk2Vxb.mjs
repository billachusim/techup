import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { C as Sparkles, O as ShieldCheck, Xt as BriefcaseBusiness, Y as MapPin, j as Search, q as MessageCircle } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-De3Puk9b.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { m as fetchPublicTalent, u as WORK_MODE_LABEL } from "./talent-CymeyHOO.mjs";
import { t as TalentNav } from "./TalentNav-CWPMXV1q.mjs";
import { t as RequestIntroDialog } from "./RequestIntroDialog-qH_ALmam.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/talent.pool.index-D-mk2Vxb.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var TalentCard = ({ person, onRequested }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
	className: "flex flex-col justify-between rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-semibold leading-snug",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: `/talent/pool/${person.id}`,
						className: "hover:text-primary",
						children: person.full_name
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-1.5",
					children: [person.is_vetted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						className: "gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 12 }), " Vetted"]
					}), person.is_client_interested && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: "Client interested"
					})]
				})]
			}),
			person.headline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: person.headline
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { size: 12 }),
						" ",
						[person.city, person.country].filter(Boolean).join(", "),
						" ·",
						" ",
						WORK_MODE_LABEL[person.work_mode] ?? person.work_mode
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [person.years_experience != null ? `${person.years_experience} yr experience` : "Experience on request", person.hours_per_week ? ` · ${person.hours_per_week} hrs/week` : ""] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: person.skills.slice(0, 5).map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground",
					children: skill
				}, skill))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-1.5 text-xs",
				children: [person.is_matched && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 12 }), " Matched to a project"]
				}), person.is_working && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefcaseBusiness, { size: 12 }), " Currently working"]
				})]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5 flex flex-wrap items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
			to: `/talent/pool/${person.id}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				children: "View profile"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequestIntroDialog, {
			talentId: person.id,
			talentName: person.full_name,
			skills: person.skills,
			onRequested,
			trigger: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "icon",
				className: "h-9 w-9 bg-green-600 text-white hover:bg-green-700",
				"aria-label": `Request an introduction to ${person.full_name} on WhatsApp`,
				title: "Request an introduction",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { size: 16 })
			})
		})]
	})]
});
var TalentPool = () => {
	const [search, setSearch] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("all");
	const { data: people = [], isLoading, refetch } = useQuery({
		queryKey: ["public-talent-pool"],
		queryFn: fetchPublicTalent,
		staleTime: 3e5
	});
	const filtered = (0, import_react.useMemo)(() => {
		const query = search.trim().toLowerCase();
		return people.filter((person) => {
			if (mode !== "all" && person.work_mode !== mode) return false;
			if (status === "vetted" && !person.is_vetted) return false;
			if (status === "open" && person.availability !== "open") return false;
			if (!query) return true;
			return `${person.full_name} ${person.headline ?? ""} ${person.city ?? ""} ${person.country} ${person.skills.join(" ")} ${person.tools.join(" ")}`.toLowerCase().includes(query);
		});
	}, [
		people,
		search,
		mode,
		status
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "CollectionPage",
					name: "Tech Faculty talent pool",
					description: "Searchable directory of skilled African tech talent available for projects and roles.",
					url: "https://techfaculty.ng/talent/pool"
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TalentNav, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 py-14",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-5xl text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-3 text-sm font-semibold text-primary",
									children: "Tech Faculty Talent Pool"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-3xl font-bold md:text-5xl",
									children: "Skilled people, ready to work"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg",
									children: "Browse our talent by skill, city and availability. Contact details stay private — tell us who you want and we make the introduction and handle the paperwork."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/hire",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "lg",
											children: "Send a hiring brief"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/talent/profile",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "lg",
											variant: "outline",
											children: "Add my profile"
										})
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "px-4 pb-20",
						"aria-labelledby": "pool-heading",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container mx-auto max-w-6xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-7 flex flex-wrap items-end justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										id: "pool-heading",
										className: "text-2xl font-bold",
										children: "Available talent"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-sm text-muted-foreground",
										children: [
											filtered.length,
											" ",
											filtered.length === 1 ? "person" : "people"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-8 grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_12rem]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
												className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
												size: 16
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: search,
												onChange: (event) => setSearch(event.target.value),
												placeholder: "Search skill, name, tool or city",
												className: "pl-9",
												"aria-label": "Search talent"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: mode,
											onValueChange: setMode,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												"aria-label": "Filter by work mode",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Work mode" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "all",
													children: "Any work mode"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "remote",
													children: "Remote"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "hybrid",
													children: "Hybrid"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "onsite",
													children: "On-site"
												})
											] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: status,
											onValueChange: setStatus,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												"aria-label": "Filter by status",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "all",
													children: "Everyone"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "vetted",
													children: "Vetted only"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "open",
													children: "Open to work"
												})
											] })]
										})
									]
								}),
								isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
									children: Array.from({ length: 6 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-lg border border-border bg-card" }, index))
								}) : filtered.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
									children: filtered.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TalentCard, {
										person,
										onRequested: () => refetch()
									}, person.id))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-card p-10 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground",
										children: people.length ? "Nobody matches those filters yet." : "Our first profiles are being reviewed. Send us a brief and we will shortlist for you."
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/hire",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											className: "mt-5",
											variant: "outline",
											children: "Tell us what you need"
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
var SplitComponent = TalentPool;
//#endregion
export { SplitComponent as component };
