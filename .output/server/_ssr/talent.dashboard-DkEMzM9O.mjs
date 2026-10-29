import { a as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-DiboEcwk.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { i as useNavigate$1, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { $ as LoaderCircle, B as Pencil, C as Sparkles, I as Plus, O as ShieldCheck, T as Slack, Yt as Briefcase, a as Wallet, an as ArrowLeft, c as UsersRound, et as ListChecks, mt as FolderOpen, q as MessageCircle, v as Trash2, yt as Eye } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { t as toast } from "./use-toast-DIJoD3Kd.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-De3Puk9b.mjs";
import { t as Label } from "./label-qSgNmrl1.mjs";
import { t as Textarea } from "./textarea-DtV3K4Va.mjs";
import { A as startOfWeek, E as projectManagerUrl, N as weeksSince, a as MATCH_STATUS_LABEL, b as hasWorkspaceLinks, f as fetchProjectGroupUrl, i as ENGAGEMENT_STATUS_LABEL, n as DELIVERABLE_STATUS_LABEL, p as fetchProjectWorkspace, t as APPLICATION_STATUS_LABEL, v as formatBudget, y as formatMoney } from "./talent-CymeyHOO.mjs";
import { t as notifyMarketplaceEvent } from "./marketplace-emails.functions-zvG-qfKQ.mjs";
import { t as Switch } from "./switch-4pagn7-e.mjs";
import { t as TalentNav } from "./TalentNav-CWPMXV1q.mjs";
import { t as Progress } from "./progress-DcTj7PSD.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/talent.dashboard-DkEMzM9O.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var emptyLog = {
	title: "",
	link_url: "",
	summary: ""
};
/**
* What a selected member sees once they are on a project: the private team
* links, and a simple weekly log of work with a link to the proof.
*/
var ProjectWorkspace = ({ roleId, roleTitle, company, profileId }) => {
	const [workspace, setWorkspace] = (0, import_react.useState)(null);
	const [logs, setLogs] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [draft, setDraft] = (0, import_react.useState)(emptyLog);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		const [w, d] = await Promise.all([fetchProjectWorkspace(roleId), supabase.from("talent_deliverables").select("*").eq("role_id", roleId).eq("talent_profile_id", profileId).order("week_of", { ascending: false })]);
		setWorkspace(w);
		setLogs(d.data ?? []);
		setLoading(false);
	}, [roleId, profileId]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const addLog = async () => {
		if (!draft.title.trim()) {
			toast({
				title: "Say what you worked on",
				variant: "destructive"
			});
			return;
		}
		setSaving(true);
		const { error } = await supabase.from("talent_deliverables").insert({
			role_id: roleId,
			talent_profile_id: profileId,
			title: draft.title.trim().slice(0, 160),
			link_url: draft.link_url.trim() || null,
			summary: draft.summary.trim().slice(0, 600) || null,
			week_of: startOfWeek()
		});
		setSaving(false);
		if (error) {
			toast({
				title: "Could not save that",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		setDraft(emptyLog);
		toast({
			title: "Work logged",
			description: "Your project lead can now review it."
		});
		load();
	};
	const removeLog = async (id) => {
		const { error } = await supabase.from("talent_deliverables").delete().eq("id", id);
		if (error) {
			toast({
				title: "Could not remove that",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		load();
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg border border-border bg-card p-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
			className: "animate-spin text-muted-foreground",
			size: 16
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 rounded-lg border border-primary/30 bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-primary",
					children: "Project workspace"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-1 font-semibold",
					children: roleTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: company
				})
			] }),
			workspace?.project_brief && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "whitespace-pre-line text-sm text-muted-foreground",
				children: workspace.project_brief
			}),
			hasWorkspaceLinks(workspace) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					workspace?.whatsapp_group_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: workspace.whatsapp_group_url,
						target: "_blank",
						rel: "noopener noreferrer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
								className: "mr-1.5",
								size: 14
							}), " Project group"]
						})
					}),
					workspace?.slack_channel_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: workspace.slack_channel_url,
						target: "_blank",
						rel: "noopener noreferrer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slack, {
								className: "mr-1.5",
								size: 14
							}), " Slack channel"]
						})
					}),
					workspace?.task_board_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: workspace.task_board_url,
						target: "_blank",
						rel: "noopener noreferrer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, {
								className: "mr-1.5",
								size: 14
							}), " My tasks"]
						})
					}),
					workspace?.drive_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: workspace.drive_url,
						target: "_blank",
						rel: "noopener noreferrer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, {
								className: "mr-1.5",
								size: 14
							}), " Shared files"]
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Your project lead is still setting up the team space. You will see the links here as soon as they are added."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 border-t border-border pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "This week's work"
					}),
					logs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-border overflow-hidden rounded-md border border-border",
						children: logs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-3 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-medium",
										children: log.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											"Week of ",
											new Date(log.week_of).toLocaleDateString("en-GB"),
											log.link_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: log.link_url,
												target: "_blank",
												rel: "noopener noreferrer",
												className: "text-primary hover:underline",
												children: "Open link"
											})] })
										]
									}),
									log.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: log.summary
									}),
									log.reviewer_note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-foreground",
										children: ["Feedback: ", log.reviewer_note]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									children: DELIVERABLE_STATUS_LABEL[log.status] ?? log.status
								}), log.status === "submitted" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									"aria-label": "Remove this entry",
									onClick: () => removeLog(log.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 })
								})]
							})]
						}, log.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "What did you work on?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "mt-1",
									value: draft.title,
									maxLength: 160,
									placeholder: "Built the product page layout",
									onChange: (e) => setDraft({
										...draft,
										title: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Link to the work (optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "mt-1",
									value: draft.link_url,
									placeholder: "https://…",
									onChange: (e) => setDraft({
										...draft,
										link_url: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Short note (optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									className: "mt-1",
									rows: 2,
									maxLength: 600,
									value: draft.summary,
									onChange: (e) => setDraft({
										...draft,
										summary: e.target.value
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: addLog,
						disabled: saving,
						children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							size: 14,
							className: "mr-1.5 animate-spin"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							size: 14,
							className: "mr-1.5"
						}), "Log this work"]
					})
				]
			})
		]
	});
};
var MATCHED_STATUSES = [
	"approved",
	"accepted",
	"assessment",
	"interview",
	"hired"
];
var TalentDashboard = () => {
	const navigate = useNavigate$1();
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [matches, setMatches] = (0, import_react.useState)([]);
	const [applications, setApplications] = (0, import_react.useState)([]);
	const [engagements, setEngagements] = (0, import_react.useState)([]);
	const [groupUrls, setGroupUrls] = (0, import_react.useState)({});
	const load = (0, import_react.useCallback)(async () => {
		const { data: auth } = await supabase.auth.getUser();
		if (!auth.user) {
			navigate("/login?next=/talent/dashboard", { replace: true });
			return;
		}
		let p = (await supabase.from("talent_profiles").select("*").eq("user_id", auth.user.id).maybeSingle()).data;
		if (!p) {
			const { data: claimedId } = await supabase.rpc("claim_my_talent_profile");
			if (claimedId) p = (await supabase.from("talent_profiles").select("*").eq("id", claimedId).maybeSingle()).data;
		}
		if (p && !p.faculty_id) {
			const { data: issued } = await supabase.rpc("claim_talent_faculty_id");
			if (issued) p = {
				...p,
				faculty_id: issued
			};
		}
		setProfile(p ?? null);
		if (p) {
			const [{ data: m }, { data: a }, { data: e }] = await Promise.all([
				supabase.from("role_matches").select("id, score, reason, status, role_id, talent_roles(slug, title, company, summary, budget_min, budget_max, budget_currency, budget_unit)").eq("talent_profile_id", p.id).order("score", { ascending: false }),
				supabase.from("talent_applications").select("id, status, created_at, talent_roles(slug, title, company)").eq("talent_profile_id", p.id).order("created_at", { ascending: false }),
				supabase.from("talent_engagements").select("*, talent_roles(title)").eq("talent_profile_id", p.id).order("started_on", { ascending: false })
			]);
			const matchRows = m ?? [];
			setMatches(matchRows);
			setApplications(a ?? []);
			setEngagements(e ?? []);
			const matchedRoleIds = Array.from(new Set(matchRows.filter((row) => MATCHED_STATUSES.includes(row.status)).map((row) => row.role_id)));
			const urls = await Promise.all(matchedRoleIds.map((id) => fetchProjectGroupUrl(id)));
			const urlMap = {};
			matchedRoleIds.forEach((id, index) => {
				const url = urls[index];
				if (url) urlMap[id] = url;
			});
			setGroupUrls(urlMap);
		}
		setLoading(false);
	}, [navigate]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const activeProjects = matches.filter((m) => [
		"accepted",
		"assessment",
		"interview",
		"hired"
	].includes(m.status));
	const respond = async (matchId, status) => {
		const { error } = await supabase.from("role_matches").update({ status }).eq("id", matchId);
		if (error) {
			toast({
				title: "Could not save that",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		if (status === "accepted") notifyMarketplaceEvent({ data: {
			event: "match_updated",
			id: matchId
		} }).catch(() => {});
		toast({
			title: status === "accepted" ? "Interest sent" : "Match declined",
			description: status === "accepted" ? "Our team will follow up with next steps." : "We will keep matching you to other roles."
		});
		load();
	};
	const setAvailability = async (availability) => {
		if (!profile) return;
		const { error } = await supabase.from("talent_profiles").update({ availability }).eq("id", profile.id);
		if (error) {
			toast({
				title: "Could not update availability",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		setProfile({
			...profile,
			availability
		});
		toast({ title: availability === "open" ? "Marked as open to work" : "Marked as unavailable" });
	};
	const setDirectoryVisible = async (isPublic) => {
		if (!profile) return;
		const { error } = await supabase.from("talent_profiles").update({ is_public: isPublic }).eq("id", profile.id);
		if (error) {
			toast({
				title: "Could not update that",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		setProfile({
			...profile,
			is_public: isPublic
		});
		toast({ title: isPublic ? "Your profile is listed publicly" : "Your profile is hidden from the directory" });
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "container mx-auto max-w-4xl px-4 pt-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto animate-spin text-muted-foreground" })
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TalentNav, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container mx-auto max-w-4xl space-y-8 px-4 py-10 md:py-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
							to: "/careers",
							className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 14 }), " Back to open roles"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl font-bold sm:text-3xl",
									children: profile ? `Welcome, ${profile.full_name.split(" ")[0]}` : "Your talent dashboard"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-muted-foreground",
									children: "Your matches, applications and availability in one place."
								}),
								profile?.faculty_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm",
									children: ["Faculty ID: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-medium",
										children: profile.faculty_id
									})]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								to: "/talent/profile",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
										className: "mr-2",
										size: 15
									}), " Edit profile"]
								})
							})]
						}),
						!profile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-card p-8 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-semibold",
									children: "You have not built your profile yet"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mx-auto mt-2 max-w-md text-sm text-muted-foreground",
									children: "Add your skills, CV and availability and you will start being matched to open roles."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/talent/profile",
									className: "mt-5 inline-block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Build my profile" })
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-border bg-card p-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-medium",
												children: "Profile strength"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 text-2xl font-bold",
												children: [profile.profile_strength, "%"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
												className: "mt-3",
												value: profile.profile_strength
											}),
											profile.profile_strength < 80 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
												to: "/talent/profile",
												className: "mt-3 inline-block text-xs text-primary hover:underline",
												children: "Complete your profile to rank higher"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-border bg-card p-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-medium",
												children: "Availability"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: profile.availability,
												onValueChange: setAvailability,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "mt-2",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "open",
													children: "Open to work"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "unavailable",
													children: "Not available"
												})] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-3 text-xs text-muted-foreground",
												children: "Only open profiles enter new matching runs."
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-border bg-card p-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-medium",
												children: "Vetting"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-2 flex items-center gap-2 text-sm text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
													size: 16,
													className: profile.is_vetted ? "text-primary" : ""
												}), profile.is_vetted ? "Vetted talent" : "Not vetted yet"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-3 text-xs text-muted-foreground",
												children: profile.is_vetted ? "You are prioritised for client projects." : "Our team reviews profiles as roles come in."
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									profile.is_client_interested && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "A client is interested in you" }),
									matches.some((m) => MATCHED_STATUSES.includes(m.status)) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										children: "Matched to a project"
									}),
									engagements.some((e) => e.status === "active") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										children: "Working and earning"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg border border-border bg-card p-5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-2 text-sm font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 16 }), " Show me in the public talent directory"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: [
											"Businesses see your name, skills and city — never your phone, email or CV.",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
												to: `/talent/pool/${profile.id}`,
												className: "text-primary hover:underline",
												children: "Preview my public profile"
											})
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: profile.is_public,
										onCheckedChange: setDirectoryVisible,
										"aria-label": "Show me in the public talent directory"
									})]
								})
							}),
							engagements.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "mb-4 flex items-center gap-2 text-xl font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, {
										size: 18,
										className: "text-primary"
									}), " Your work and pay"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-3",
									children: engagements.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: item.talent_roles?.title ?? "Project"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												"Started ",
												new Date(item.started_on).toLocaleDateString("en-GB"),
												" · week ",
												weeksSince(item.started_on),
												item.note ? ` · ${item.note}` : ""
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold",
												children: item.weekly_amount != null ? `${formatMoney(Number(item.weekly_amount), item.currency)} / week` : "Pay being agreed"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "mt-1",
												children: ENGAGEMENT_STATUS_LABEL[item.status] ?? item.status
											})]
										})]
									}, item.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs text-muted-foreground",
									children: "Payments are sent outside the platform. If a payment is late, message us on WhatsApp."
								})
							] }),
							activeProjects.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "mb-4 flex items-center gap-2 text-xl font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersRound, {
									size: 18,
									className: "text-primary"
								}), " Your projects"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4",
								children: activeProjects.map((match) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectWorkspace, {
									roleId: match.role_id,
									roleTitle: match.talent_roles?.title ?? "Project",
									company: match.talent_roles?.company ?? "Tech Faculty",
									profileId: profile.id
								}, match.id))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "mb-4 flex items-center gap-2 text-xl font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
									size: 18,
									className: "text-primary"
								}), " Your matches"]
							}), matches.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4",
								children: matches.map((match) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-card p-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-start justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-semibold",
												children: match.talent_roles?.title ?? "Role"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted-foreground",
												children: match.talent_roles?.company
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: match.status === "declined" ? "outline" : "default",
												children: match.status === "approved" ? `${match.score}% match` : MATCH_STATUS_LABEL[match.status] ?? match.status
											})]
										}),
										match.reason && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-sm text-muted-foreground",
											children: match.reason
										}),
										match.talent_roles && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs text-muted-foreground",
											children: formatBudget(match.talent_roles)
										}),
										MATCHED_STATUSES.includes(match.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-xs text-muted-foreground",
											children: "Next step is a short assessment or interview on WhatsApp. If you do not hear back within two days, reach out to the project manager yourself."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 flex flex-wrap gap-2",
											children: [
												match.talent_roles && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
													to: `/talent/roles/${match.talent_roles.slug}`,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "outline",
														children: "View role"
													})
												}),
												match.status === "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													onClick: () => respond(match.id, "accepted"),
													children: "I am interested"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "ghost",
													onClick: () => respond(match.id, "declined"),
													children: "Not for me"
												})] }),
												MATCHED_STATUSES.includes(match.status) && groupUrls[match.role_id] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: groupUrls[match.role_id],
													target: "_blank",
													rel: "noopener noreferrer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														size: "sm",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersRound, {
															className: "mr-1.5",
															size: 14
														}), " Join the project group"]
													})
												}),
												MATCHED_STATUSES.includes(match.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: projectManagerUrl(match.talent_roles?.title ?? "a Tech Faculty role", profile.full_name),
													target: "_blank",
													rel: "noopener noreferrer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														size: "sm",
														variant: "outline",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
															className: "mr-1.5",
															size: 14
														}), " Reach out to the project manager"]
													})
												})
											]
										})
									]
								}, match.id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground",
								children: "No matches yet. Every new role is scored against your profile, so keep it complete and current."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "mb-4 flex items-center gap-2 text-xl font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, {
									size: 18,
									className: "text-primary"
								}), " Your applications"]
							}), applications.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divide-y divide-border overflow-hidden rounded-lg border border-border bg-card",
								children: applications.map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-3 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: app.talent_roles?.title ?? "Role"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											app.talent_roles?.company,
											" · ",
											new Date(app.created_at).toLocaleDateString("en-GB")
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										children: APPLICATION_STATUS_LABEL[app.status] ?? app.status
									})]
								}, app.id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground",
								children: [
									"You have not applied to anything yet.",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/talent",
										className: "text-primary hover:underline",
										children: "Browse open roles"
									}),
									"."
								]
							})] })
						] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = TalentDashboard;
//#endregion
export { SplitComponent as component };
