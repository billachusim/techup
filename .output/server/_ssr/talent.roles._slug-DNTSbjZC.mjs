import { a as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-DiboEcwk.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as useParams$1, i as useNavigate$1, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { i as useUser } from "./UserContext-uFGsrvio.mjs";
import { Kt as CalendarClock, Y as MapPin, a as Wallet, an as ArrowLeft, c as UsersRound, q as MessageCircle, s as Users } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { t as toast } from "./use-toast-DIJoD3Kd.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { t as Textarea } from "./textarea-DtV3K4Va.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as openingsLabel, D as roleBadges, E as projectManagerUrl, O as roleLocationLabel, _ as fetchRoleBySlug, c as SENIORITY_LABEL, f as fetchProjectGroupUrl, r as EMPLOYMENT_LABEL, v as formatBudget, x as hiringStepsText } from "./talent-CymeyHOO.mjs";
import { t as notifyMarketplaceEvent } from "./marketplace-emails.functions-zvG-qfKQ.mjs";
import { t as TalentNav } from "./TalentNav-CWPMXV1q.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/talent.roles._slug-DNTSbjZC.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var TalentRoleDetail = () => {
	const { slug = "" } = useParams$1();
	const navigate = useNavigate$1();
	const { isLoggedIn } = useUser();
	const [message, setMessage] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const { data: role, isLoading } = useQuery({
		queryKey: ["talent-role", slug],
		queryFn: () => fetchRoleBySlug(slug),
		enabled: Boolean(slug)
	});
	const { data: mine } = useQuery({
		queryKey: [
			"talent-role-mine",
			role?.id,
			isLoggedIn
		],
		enabled: Boolean(role?.id) && isLoggedIn,
		queryFn: async () => {
			const { data: auth } = await supabase.auth.getUser();
			if (!auth.user || !role) return null;
			const { data: profile } = await supabase.from("talent_profiles").select("id, full_name").eq("user_id", auth.user.id).maybeSingle();
			if (!profile) return {
				profile: null,
				matched: false,
				applied: false,
				groupUrl: null
			};
			const [{ data: match }, { data: application }, groupUrl] = await Promise.all([
				supabase.from("role_matches").select("id, status").eq("role_id", role.id).eq("talent_profile_id", profile.id).maybeSingle(),
				supabase.from("talent_applications").select("id").eq("role_id", role.id).eq("talent_profile_id", profile.id).maybeSingle(),
				fetchProjectGroupUrl(role.id)
			]);
			return {
				profile,
				matched: Boolean(match && [
					"approved",
					"accepted",
					"assessment",
					"interview",
					"hired"
				].includes(match.status)),
				applied: Boolean(application),
				groupUrl
			};
		}
	});
	const apply = async () => {
		if (!role) return;
		if (!isLoggedIn) {
			navigate(`/login?next=/talent/roles/${slug}`);
			return;
		}
		setSubmitting(true);
		try {
			const { data: auth } = await supabase.auth.getUser();
			if (!auth.user) throw new Error("Please sign in again.");
			const { data: profile } = await supabase.from("talent_profiles").select("id").eq("user_id", auth.user.id).maybeSingle();
			if (!profile) {
				toast({
					title: "Create your profile first",
					description: "We need your skills and CV before we can send your application."
				});
				navigate(`/talent/profile?next=/talent/roles/${slug}`);
				return;
			}
			const { data: inserted, error } = await supabase.from("talent_applications").insert({
				role_id: role.id,
				talent_profile_id: profile.id,
				message: message.trim() || null
			}).select("id").single();
			if (error) {
				if (error.code === "23505" || error.code === "23514" || error.message.includes("duplicate")) {
					toast({
						title: "Already applied",
						description: "You have applied to this role already."
					});
					return;
				}
				throw error;
			}
			if (inserted?.id) notifyMarketplaceEvent({ data: {
				event: "application_submitted",
				id: inserted.id
			} }).catch(() => {});
			toast({
				title: "Application sent",
				description: "You can track it on your talent dashboard."
			});
			setMessage("");
			navigate("/talent/dashboard");
		} catch (err) {
			toast({
				title: "Could not send your application",
				description: err instanceof Error ? err.message : "Please try again.",
				variant: "destructive"
			});
		} finally {
			setSubmitting(false);
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "container mx-auto max-w-3xl px-4 pt-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-lg border border-border bg-card" })
		})]
	});
	if (!role || role.status !== "published") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container mx-auto max-w-3xl px-4 pt-28 pb-20 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mb-3 text-2xl font-bold",
						children: "This role is no longer open"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-6 text-muted-foreground",
						children: "It may have been filled or closed."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/talent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "See open roles" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	`${role.slug}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "JobPosting",
					title: role.title,
					description: role.description,
					datePosted: role.created_at.slice(0, 10),
					employmentType: role.employment_type === "internship" ? "INTERN" : role.employment_type === "contract" ? "CONTRACTOR" : role.employment_type === "part_time" ? "PART_TIME" : "FULL_TIME",
					hiringOrganization: {
						"@type": "Organization",
						name: role.company,
						sameAs: "https://techfaculty.ng"
					},
					jobLocation: {
						"@type": "Place",
						address: {
							"@type": "PostalAddress",
							addressLocality: role.city ?? "Nnewi",
							addressRegion: role.city === "Lagos" ? "Lagos" : "Anambra",
							addressCountry: role.country === "Nigeria" ? "NG" : role.country
						}
					},
					...role.is_remote ? {
						jobLocationType: "TELECOMMUTE",
						applicantLocationRequirements: {
							"@type": "Country",
							name: role.country
						}
					} : {},
					...role.budget_min && role.budget_max ? { baseSalary: {
						"@type": "MonetaryAmount",
						currency: role.budget_currency,
						value: {
							"@type": "QuantitativeValue",
							minValue: Number(role.budget_min),
							maxValue: Number(role.budget_max),
							unitText: role.budget_unit
						}
					} } : {},
					...role.apply_deadline ? { validThrough: role.apply_deadline } : {},
					totalJobOpenings: role.openings,
					directApply: true,
					identifier: {
						"@type": "PropertyValue",
						name: role.company,
						value: role.slug
					},
					...role.category ? { occupationalCategory: role.category } : {}
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TalentNav, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "container mx-auto max-w-3xl px-4 py-10 md:py-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
							to: "/careers",
							className: "mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 14 }), " All open roles"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1.5",
									children: roleBadges(role).map((badge) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: badge === "Paid training" || badge === "New" ? "default" : "secondary",
										children: badge
									}, badge))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl font-bold sm:text-3xl md:text-4xl",
									children: role.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: role.company
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2 pt-2 text-sm text-muted-foreground sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { size: 14 }),
												" ",
												roleLocationLabel(role)
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { size: 14 }),
												" ",
												formatBudget(role)
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { size: 14 }),
												" ",
												openingsLabel(role.openings),
												" · ",
												SENIORITY_LABEL[role.seniority] ?? role.seniority
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { size: 14 }),
												" ",
												EMPLOYMENT_LABEL[role.employment_type] ?? role.employment_type
											]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-8 space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mb-2 text-xl font-semibold",
									children: "About this role"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "whitespace-pre-line leading-relaxed text-muted-foreground",
									children: role.description
								})] }),
								role.responsibilities.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mb-2 text-xl font-semibold",
									children: "What you will do"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "list-disc space-y-1.5 pl-5 text-muted-foreground",
									children: role.responsibilities.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
								})] }),
								role.required_skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mb-2 text-xl font-semibold",
									children: "Skills we look for"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: role.required_skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full border border-border px-3 py-1 text-sm text-muted-foreground",
										children: s
									}, s))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mb-2 text-xl font-semibold",
									children: "Hiring steps"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: hiringStepsText(role)
								})] }),
								role.nice_to_have.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mb-2 text-xl font-semibold",
									children: "Nice to have"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "list-disc space-y-1.5 pl-5 text-muted-foreground",
									children: role.nice_to_have.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
								})] })
							]
						}),
						mine?.matched && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-10 rounded-lg border border-primary/40 bg-primary/5 p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-semibold",
									children: "You have been matched to this role"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: [role.selection_process === "direct" ? "Next you will be added to the project Slack." : "Watch your email for the assessment or interview link.", " If you do not hear back within two days, message the project manager yourself."]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-wrap gap-3",
									children: [mine.groupUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: mine.groupUrl,
										target: "_blank",
										rel: "noopener noreferrer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersRound, {
											className: "mr-2",
											size: 16
										}), " Join the project group"] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: projectManagerUrl(role.title, mine.profile?.full_name),
										target: "_blank",
										rel: "noopener noreferrer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
												className: "mr-2",
												size: 16
											}), " Reach out to the project manager"]
										})
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-10 rounded-lg border border-border bg-card p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-semibold",
								children: role.applications_closed && !mine?.applied ? "Applications are closed" : "Apply with your talent profile"
							}), role.applications_closed && !mine?.applied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "This project has already selected its team. Keep your profile complete and you will be matched to the next one."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								to: "/careers",
								className: "mt-4 inline-block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									children: "See other open roles"
								})
							})] }) : mine?.applied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "You have already applied to this role. Track it on your dashboard."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								to: "/talent/dashboard",
								className: "mt-4 inline-block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									children: "Go to my dashboard"
								})
							})] }) : isLoggedIn && mine?.profile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "One click sends your profile, skills and CV to the hiring team. No forms."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "mt-4 w-full sm:w-auto",
									onClick: apply,
									disabled: submitting,
									children: submitting ? "Sending…" : "Apply with my Faculty profile"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
									className: "mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
										className: "cursor-pointer text-sm text-muted-foreground",
										children: "Add a short note (optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										className: "mt-3",
										rows: 4,
										value: message,
										onChange: (e) => setMessage(e.target.value.slice(0, 1e3)),
										placeholder: "Why you are a good fit"
									})]
								})
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: isLoggedIn ? "Build your talent profile once and applying becomes one click, here and on every other role." : "Sign in with your Faculty account and applying takes one click."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-4 w-full sm:w-auto",
								onClick: apply,
								disabled: submitting,
								children: isLoggedIn ? "Build my profile" : "Sign in and apply"
							})] })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = TalentRoleDetail;
//#endregion
export { SplitComponent as component };
