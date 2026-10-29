import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as useParams$1, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { C as Sparkles, O as ShieldCheck, Xt as BriefcaseBusiness, Y as MapPin, an as ArrowLeft, bt as ExternalLink, dt as GraduationCap } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { h as fetchPublicTalentById, u as WORK_MODE_LABEL } from "./talent-CymeyHOO.mjs";
import { t as TalentNav } from "./TalentNav-CWPMXV1q.mjs";
import { a as asEducation, i as asCertifications, o as asExperiences, s as dateRange } from "./cv-D_dWv71F.mjs";
import { t as RequestIntroDialog } from "./RequestIntroDialog-qH_ALmam.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/talent.pool._id-DMrfIqVr.js
var import_jsx_runtime = require_jsx_runtime();
var TalentPublicProfile = () => {
	const { id = "" } = useParams$1();
	const { data: person, isLoading, refetch } = useQuery({
		queryKey: ["public-talent", id],
		queryFn: () => fetchPublicTalentById(id),
		enabled: Boolean(id)
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "container mx-auto max-w-3xl px-4 pt-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-lg border border-border bg-card" })
		})]
	});
	if (!person) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container mx-auto max-w-3xl px-4 pb-20 pt-28 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mb-3 text-2xl font-bold",
						children: "This profile is not public"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-6 text-muted-foreground",
						children: "The person may have hidden it, or the link is out of date."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/talent/pool",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Browse the talent pool" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	const location = [person.city, person.country].filter(Boolean).join(", ");
	(person.headline ?? `${person.skills.slice(0, 4).join(", ")} talent based in ${location}`).slice(0, 158);
	const links = [
		{
			label: "LinkedIn",
			url: person.linkedin_url
		},
		{
			label: "GitHub",
			url: person.github_url
		},
		{
			label: "Portfolio",
			url: person.portfolio_url
		}
	].filter((item) => item.url);
	const experiences = asExperiences(person.experiences);
	const education = asEducation(person.education);
	const certifications = asCertifications(person.certifications);
	const languages = person.languages ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TalentNav, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "container mx-auto max-w-3xl px-4 py-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
							to: "/talent/pool",
							className: "mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 14 }), " All talent"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [
										person.is_vetted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											className: "gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 12 }), " Vetted by Tech Faculty"]
										}),
										person.faculty_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "secondary",
											className: "gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { size: 12 }), " Tech Faculty trained"]
										}),
										person.is_client_interested && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											children: "Client interested"
										}),
										person.is_matched && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "outline",
											className: "gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 12 }), " Matched to a project"]
										}),
										person.is_working && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "outline",
											className: "gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefcaseBusiness, { size: 12 }), " Currently working"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-3xl font-bold md:text-4xl",
									children: person.full_name
								}),
								person.headline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg text-muted-foreground",
									children: person.headline
								}),
								person.faculty_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-xs uppercase tracking-wide text-muted-foreground",
									children: ["Faculty ID ", person.faculty_id]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2 pt-2 text-sm text-muted-foreground sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { size: 14 }),
												" ",
												location
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [WORK_MODE_LABEL[person.work_mode] ?? person.work_mode, person.hours_per_week ? ` · ${person.hours_per_week} hrs/week` : ""] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: person.years_experience != null ? `${person.years_experience} years experience` : "Experience shared on request" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: person.availability === "open" ? "Open to work" : "Not available right now" })
									]
								})
							]
						}),
						person.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-2 text-xl font-semibold",
								children: "About"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "whitespace-pre-line leading-relaxed text-muted-foreground",
								children: person.bio
							})]
						}),
						person.skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-2 text-xl font-semibold",
								children: "Skills"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: person.skills.map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border border-border px-3 py-1 text-sm text-muted-foreground",
									children: skill
								}, skill))
							})]
						}),
						person.tools.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-2 text-xl font-semibold",
								children: "Tools"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: person.tools.join(", ")
							})]
						}),
						experiences.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-3 text-xl font-semibold",
								children: "Work experience"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4",
								children: experiences.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-card p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: item.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm text-muted-foreground",
											children: [[item.company, item.location].filter(Boolean).join(" · "), dateRange(item) && ` · ${dateRange(item)}`]
										}),
										item.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 whitespace-pre-line text-sm text-muted-foreground",
											children: item.description
										})
									]
								}, i))
							})]
						}),
						education.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-3 text-xl font-semibold",
								children: "Education"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3",
								children: education.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-card p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: [item.qualification, item.field].filter(Boolean).join(", ")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted-foreground",
										children: [item.institution, dateRange(item) && ` · ${dateRange(item)}`]
									})]
								}, i))
							})]
						}),
						certifications.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-3 text-xl font-semibold",
								children: "Certificates"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1.5 text-muted-foreground",
								children: certifications.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: item.name
								}), [item.issuer, item.year].filter(Boolean).length > 0 && ` — ${[item.issuer, item.year].filter(Boolean).join(", ")}`] }, i))
							})]
						}),
						languages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-2 text-xl font-semibold",
								children: "Languages"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: languages.join(", ")
							})]
						}),
						links.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-2 text-xl font-semibold",
								children: "Work links"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1.5",
								children: links.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: item.url,
									target: "_blank",
									rel: "noopener noreferrer nofollow",
									className: "inline-flex items-center gap-1.5 text-primary hover:underline",
									children: [
										item.label,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { size: 13 })
									]
								}) }, item.label))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-10 rounded-lg border border-border bg-card p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-lg font-semibold",
									children: [
										"Want to work with ",
										person.full_name.split(" ")[0],
										"?"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "Phone numbers, emails and CVs stay private. Message us and we handle the introduction, the assessment and the working agreement."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-wrap gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequestIntroDialog, {
										talentId: person.id,
										talentName: person.full_name,
										skills: person.skills,
										source: "talent_profile",
										onRequested: () => refetch(),
										trigger: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Request an introduction" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/hire",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											children: "Send a full brief"
										})
									})]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = TalentPublicProfile;
//#endregion
export { SplitComponent as component };
