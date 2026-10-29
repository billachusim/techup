import { a as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-DiboEcwk.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { $ as LoaderCircle, C as Sparkles, Ht as Check, I as Plus, St as Download, a as Wallet, q as MessageCircle, r as X } from "../_libs/lucide-react.mjs";
import { a as Footer, c as useIsStaff, o as Header } from "./Footer-BKqEypqK.mjs";
import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { c as objectType, u as stringType } from "../_libs/zod.mjs";
import { t as toast } from "./use-toast-DIJoD3Kd.mjs";
import { t as AdminNav } from "./AdminNav-Co4-pzct.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-De3Puk9b.mjs";
import { t as Label } from "./label-qSgNmrl1.mjs";
import { t as Textarea } from "./textarea-DtV3K4Va.mjs";
import { t as createSsrRpc } from "./createSsrRpc-yyKrtVKy.mjs";
import { t as HR_EMAIL_DEFAULTS } from "./hr-api-rules-b4N1_q2Y.mjs";
import { a as MATCH_STATUS_LABEL, d as contactUrl, i as ENGAGEMENT_STATUS_LABEL, k as slugify, n as DELIVERABLE_STATUS_LABEL, o as ROLE_KIND_LABEL, s as SELECTION_PROCESS_LABEL, t as APPLICATION_STATUS_LABEL, w as parseList, y as formatMoney } from "./talent-CymeyHOO.mjs";
import { t as notifyMarketplaceEvent } from "./marketplace-emails.functions-zvG-qfKQ.mjs";
import { t as triggerAutoMatch } from "./automatch.functions-BghdXy8V.mjs";
import { t as Switch } from "./switch-4pagn7-e.mjs";
import { t as TalentNav } from "./TalentNav-CWPMXV1q.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-v01m15hu.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/admin.talent-B1i8aOOe.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
/** Global auto-match pause switch. */
function AutoMatchPauseSwitch() {
	const [paused, setPaused] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.from("marketplace_settings").select("auto_match_paused").maybeSingle().then(({ data }) => setPaused(!!data?.auto_match_paused));
	}, []);
	const toggle = async (next) => {
		const { data: auth } = await supabase.auth.getUser();
		const { error } = await supabase.from("marketplace_settings").upsert({
			id: true,
			auto_match_paused: next,
			updated_at: (/* @__PURE__ */ new Date()).toISOString(),
			updated_by: auth.user?.id ?? null
		});
		if (error) {
			toast({
				title: "Could not update",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		setPaused(next);
		toast({ title: next ? "Auto-matching paused" : "Auto-matching is on" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-medium",
			children: "Automatic matching"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "Matches talent at or above each role's threshold when a role is published, a profile is saved, and every Monday and Thursday at 02:00. AI suggestions that clear the threshold are approved too, each published role gets its own #proj- Slack channel, and profiles at 70%+ strength are approved automatically."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: paused ? "Paused" : "On" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
				checked: paused === false,
				disabled: paused === null,
				onCheckedChange: (on) => toggle(!on),
				"aria-label": "Auto-matching on"
			})]
		})]
	});
}
/** Editable HR emails, recent screening notes and the HR API call log. */
function HrAutomationPanel() {
	const [drafts, setDrafts] = (0, import_react.useState)({});
	const [audit, setAudit] = (0, import_react.useState)([]);
	const [notes, setNotes] = (0, import_react.useState)([]);
	const [saving, setSaving] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(async () => {
		const [tpl, log, nt] = await Promise.all([
			supabase.from("hr_email_templates").select("key, subject, body"),
			supabase.from("hr_api_audit").select("*").order("created_at", { ascending: false }).limit(100),
			supabase.from("talent_notes").select("id, body, source, created_at, talent_profiles(full_name), talent_roles(title)").order("created_at", { ascending: false }).limit(50)
		]);
		const next = {};
		for (const k of Object.keys(HR_EMAIL_DEFAULTS)) {
			const o = (tpl.data ?? []).find((t) => t.key === k);
			next[k] = {
				subject: o?.subject ?? HR_EMAIL_DEFAULTS[k].subject,
				body: o?.body ?? HR_EMAIL_DEFAULTS[k].body
			};
		}
		setDrafts(next);
		setAudit(log.data ?? []);
		setNotes(nt.data ?? []);
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const save = async (key) => {
		setSaving(key);
		const { data: auth } = await supabase.auth.getUser();
		const d = drafts[key];
		const { error } = await supabase.from("hr_email_templates").upsert({
			key,
			subject: d.subject,
			body: d.body,
			updated_at: (/* @__PURE__ */ new Date()).toISOString(),
			updated_by: auth.user?.id ?? null
		});
		setSaving(null);
		if (error) {
			toast({
				title: "Could not save",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		toast({ title: `${HR_EMAIL_DEFAULTS[key].label} email saved` });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "HR emails"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Sent by the automation agent from noreply@alerts.techfaculty.ng. Use the placeholders shown under each email."
					}),
					Object.keys(HR_EMAIL_DEFAULTS).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 rounded-lg border border-border bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: HR_EMAIL_DEFAULTS[k].label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Subject"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: drafts[k]?.subject ?? "",
								onChange: (e) => setDrafts((s) => ({
									...s,
									[k]: {
										...s[k],
										subject: e.target.value
									}
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Message"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 7,
								value: drafts[k]?.body ?? "",
								onChange: (e) => setDrafts((s) => ({
									...s,
									[k]: {
										...s[k],
										body: e.target.value
									}
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: HR_EMAIL_DEFAULTS[k].variables.map((v) => `{{${v}}}`).join(" ")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: () => save(k),
									disabled: saving === k,
									children: saving === k ? "Saving…" : "Save"
								})]
							})
						]
					}, k))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mb-3 text-lg font-semibold",
				children: [
					"Screening notes (",
					notes.length,
					")"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "divide-y divide-border overflow-hidden rounded-lg border border-border bg-card",
				children: [notes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-4 text-sm text-muted-foreground",
					children: "No notes yet."
				}), notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-medium",
							children: [n.talent_profiles?.full_name ?? "Talent", n.talent_roles?.title ? ` · ${n.talent_roles.title}` : ""]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "whitespace-pre-line text-muted-foreground",
							children: n.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								new Date(n.created_at).toLocaleString("en-GB"),
								" · ",
								n.source === "hr_api" ? "Automation agent" : "Admin"
							]
						})
					]
				}, n.id))]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: "HR API log"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => void load(),
					children: "Refresh"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "divide-y divide-border overflow-hidden rounded-lg border border-border bg-card",
				children: [audit.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-4 text-sm text-muted-foreground",
					children: "No calls yet."
				}), audit.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-2 p-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs",
						children: [
							a.method,
							" ",
							a.endpoint
						]
					}), a.changes != null && Object.keys(a.changes).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 break-all font-mono text-xs text-muted-foreground",
						children: JSON.stringify(a.changes)
					}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: a.status < 400 ? "outline" : "destructive",
							children: a.status
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: new Date(a.created_at).toLocaleString("en-GB")
						})]
					})]
				}, a.id))]
			})] })
		]
	});
}
/** Channels the admin can pick from when wiring a project workspace. */
var listSlackChannels = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("6bf1c1f15bceea3c0f9d952effe091f739ac13e52ec8b986719c1511c626dfe3"));
var SyncInput = objectType({ matchId: stringType().uuid() });
/**
* Slack side of the hiring flow.
* Matched (approved) -> general talent channel.
* Selected for the project (accepted / hired) -> that project's own channel too.
*/
var syncSlackForMatch = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => SyncInput.parse(d)).handler(createSsrRpc("7eef0bb7eae2ca63ca7901311ff37b30d8b2eca0e05787e60531102969a5b987"));
var emptyProjectDraft = {
	slack: "",
	channel: "",
	task: "",
	drive: "",
	brief: ""
};
var emptyRole = {
	title: "",
	role_kind: "internal",
	company: "Tech Faculty",
	city: "",
	country: "Nigeria",
	is_remote: "true",
	employment_type: "full_time",
	summary: "",
	description: "",
	responsibilities: "",
	required_skills: "",
	nice_to_have: "",
	seniority: "mid",
	budget_min: "",
	budget_max: "",
	pay_text: "",
	budget_currency: "NGN",
	budget_unit: "MONTH",
	openings: "1",
	selection_process: "direct",
	assessment_url: "",
	interview_url: "",
	interview_channel: "whatsapp"
};
var AdminTalent = () => {
	const { loading: roleLoading, isStaff } = useIsStaff();
	const [signedIn, setSignedIn] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [talents, setTalents] = (0, import_react.useState)([]);
	const [matches, setMatches] = (0, import_react.useState)([]);
	const [applications, setApplications] = (0, import_react.useState)([]);
	const [briefs, setBriefs] = (0, import_react.useState)([]);
	const [engagements, setEngagements] = (0, import_react.useState)([]);
	const [interests, setInterests] = (0, import_react.useState)([]);
	const [newRole, setNewRole] = (0, import_react.useState)(emptyRole);
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [matchingRoleId, setMatchingRoleId] = (0, import_react.useState)(null);
	const [manualRole, setManualRole] = (0, import_react.useState)("");
	const [manualTalent, setManualTalent] = (0, import_react.useState)("");
	const [groupDrafts, setGroupDrafts] = (0, import_react.useState)({});
	const [projectDrafts, setProjectDrafts] = (0, import_react.useState)({});
	const [deliverables, setDeliverables] = (0, import_react.useState)([]);
	const [noteDrafts, setNoteDrafts] = (0, import_react.useState)({});
	const [newEngagement, setNewEngagement] = (0, import_react.useState)({
		talent: "",
		role: "",
		amount: "",
		currency: "NGN",
		note: ""
	});
	const [slackChannels, setSlackChannels] = (0, import_react.useState)([]);
	const [slackBusyMatch, setSlackBusyMatch] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
	}, []);
	(0, import_react.useEffect)(() => {
		if (!isStaff) return;
		listSlackChannels().then((res) => setSlackChannels(res.channels ?? [])).catch(() => setSlackChannels([]));
	}, [isStaff]);
	const load = (0, import_react.useCallback)(async () => {
		const [r, t, m, a, b, e, i, d] = await Promise.all([
			supabase.from("talent_roles").select("*").order("created_at", { ascending: false }),
			supabase.from("talent_profiles").select("*").order("profile_strength", { ascending: false }),
			supabase.from("role_matches").select("id, score, reason, status, source, role_id, talent_profile_id, talent_roles(title, company), talent_profiles(full_name, city, skills, phone)").order("score", { ascending: false }),
			supabase.from("talent_applications").select("id, status, message, created_at, talent_roles(title), talent_profiles(full_name, phone, email)").order("created_at", { ascending: false }),
			supabase.from("business_briefs").select("*").order("created_at", { ascending: false }),
			supabase.from("talent_engagements").select("id, talent_profile_id, role_id, weekly_amount, currency, started_on, status, note, talent_roles(title), talent_profiles(full_name)").order("started_on", { ascending: false }),
			supabase.from("talent_interest_requests").select("*, talent_profiles(full_name)").order("created_at", { ascending: false }),
			supabase.from("talent_deliverables").select("*, talent_roles(title), talent_profiles(full_name)").order("week_of", { ascending: false })
		]);
		setRoles(r.data ?? []);
		setTalents(t.data ?? []);
		setMatches(m.data ?? []);
		setApplications(a.data ?? []);
		setBriefs(b.data ?? []);
		setEngagements(e.data ?? []);
		setInterests(i.data ?? []);
		setDeliverables(d.data ?? []);
		setGroupDrafts(Object.fromEntries((r.data ?? []).map((role) => [role.id, role.whatsapp_group_url ?? ""])));
		setProjectDrafts(Object.fromEntries((r.data ?? []).map((role) => [role.id, {
			slack: role.slack_channel_url ?? "",
			channel: role.slack_channel_id ?? "",
			task: role.task_board_url ?? "",
			drive: role.drive_url ?? "",
			brief: role.project_brief ?? ""
		}])));
		setNoteDrafts(Object.fromEntries((d.data ?? []).map((row) => [row.id, row.reviewer_note ?? ""])));
		setLoading(false);
	}, []);
	(0, import_react.useEffect)(() => {
		if (isStaff) load();
		else if (!roleLoading) setLoading(false);
	}, [
		isStaff,
		roleLoading,
		load
	]);
	const createRole = async () => {
		if (!newRole.title.trim() || !newRole.summary.trim() || !newRole.description.trim()) {
			toast({
				title: "Title, summary and description are required",
				variant: "destructive"
			});
			return;
		}
		setCreating(true);
		try {
			const { data: auth } = await supabase.auth.getUser();
			const { error } = await supabase.from("talent_roles").insert({
				slug: `${slugify(newRole.title)}-${Date.now().toString().slice(-4)}`,
				title: newRole.title.trim(),
				role_kind: newRole.role_kind,
				company: newRole.company.trim() || "Tech Faculty",
				city: newRole.city.trim() || null,
				country: newRole.country.trim() || "Nigeria",
				is_remote: newRole.is_remote === "true",
				employment_type: newRole.employment_type,
				summary: newRole.summary.trim(),
				description: newRole.description.trim(),
				responsibilities: parseList(newRole.responsibilities),
				required_skills: parseList(newRole.required_skills),
				nice_to_have: parseList(newRole.nice_to_have),
				seniority: newRole.seniority,
				budget_min: newRole.budget_min ? Number(newRole.budget_min) : null,
				budget_max: newRole.budget_max ? Number(newRole.budget_max) : null,
				budget_currency: newRole.budget_currency,
				budget_unit: newRole.budget_unit,
				pay_text: newRole.pay_text.trim() || null,
				openings: Number(newRole.openings) || 1,
				selection_process: newRole.selection_process,
				assessment_url: newRole.assessment_url.trim() || null,
				interview_url: newRole.interview_url.trim() || null,
				interview_channel: newRole.interview_channel,
				status: "draft",
				created_by: auth.user?.id ?? null
			});
			if (error) throw error;
			toast({
				title: "Role created as a draft",
				description: "Publish it when you are ready."
			});
			setNewRole(emptyRole);
			load();
		} catch (err) {
			toast({
				title: "Could not create the role",
				description: err instanceof Error ? err.message : "",
				variant: "destructive"
			});
		} finally {
			setCreating(false);
		}
	};
	const updateHiring = async (id, patch) => {
		const { error } = await supabase.from("talent_roles").update(patch).eq("id", id);
		if (error) {
			toast({
				title: "Could not save hiring steps",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		toast({ title: "Hiring steps saved" });
		load();
	};
	const emailSlackLink = async (matchId) => {
		try {
			const res = await notifyMarketplaceEvent({ data: {
				event: "slack_link",
				id: matchId
			} });
			toast(res.ok ? { title: "Slack link emailed" } : {
				title: "Could not email the Slack link",
				description: res.reason,
				variant: "destructive"
			});
		} catch (err) {
			toast({
				title: "Could not email the Slack link",
				description: err instanceof Error ? err.message : void 0,
				variant: "destructive"
			});
		}
	};
	const setRoleStatus = async (id, status) => {
		const { error } = await supabase.from("talent_roles").update({ status }).eq("id", id);
		if (error) {
			toast({
				title: "Update failed",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		load();
		if (status === "published") triggerAutoMatch({ data: { roleId: id } }).then((r) => {
			if (r.created) toast({
				title: `${r.created} talent auto-matched`,
				description: "They've been emailed and invited to Slack."
			});
			load();
		}).catch(() => {});
	};
	const updateAutoMatch = async (id, patch) => {
		const { error } = await supabase.from("talent_roles").update(patch).eq("id", id);
		if (error) {
			toast({
				title: "Update failed",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		load();
	};
	const runMatching = async (roleId) => {
		setMatchingRoleId(roleId);
		try {
			const { data, error } = await supabase.functions.invoke("match-talent", { body: { role_id: roleId } });
			if (error) throw error;
			const created = data?.created ?? 0;
			const promoted = (created ? await triggerAutoMatch({ data: { roleId } }).catch(() => null) : null)?.promoted ?? 0;
			toast({
				title: created ? `${created} suggested matches ready` : "No new matches",
				description: created ? promoted ? `${promoted} cleared the role's threshold and were approved automatically. Review the rest in the Matches tab.` : "Review them in the Matches tab and approve the good ones." : "Everyone suitable has already been matched to this role."
			});
			load();
		} catch (err) {
			toast({
				title: "Matching failed",
				description: err instanceof Error ? err.message : "Please try again.",
				variant: "destructive"
			});
		} finally {
			setMatchingRoleId(null);
		}
	};
	const syncSlack = async (matchId, quiet = false) => {
		setSlackBusyMatch(matchId);
		try {
			const res = await syncSlackForMatch({ data: { matchId } });
			const description = (res.notes ?? []).join(" ");
			if (!quiet || !res.ok) toast({
				title: res.ok ? "Slack updated" : "Slack needs attention",
				description: description || void 0,
				variant: res.ok ? void 0 : "destructive"
			});
		} catch (err) {
			if (!quiet) toast({
				title: "Slack update failed",
				description: err instanceof Error ? err.message : void 0,
				variant: "destructive"
			});
		} finally {
			setSlackBusyMatch(null);
		}
	};
	const setMatchStatus = async (id, status) => {
		const { error } = await supabase.from("role_matches").update({ status }).eq("id", id);
		if (error) {
			toast({
				title: "Update failed",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		notifyMarketplaceEvent({ data: {
			event: "match_updated",
			id
		} }).catch(() => {});
		if ([
			"approved",
			"accepted",
			"hired"
		].includes(status)) syncSlack(id, true);
		load();
	};
	const addManualMatch = async () => {
		if (!manualRole || !manualTalent) {
			toast({
				title: "Pick a role and a talent",
				variant: "destructive"
			});
			return;
		}
		const { data: auth } = await supabase.auth.getUser();
		const { error } = await supabase.from("role_matches").insert({
			role_id: manualRole,
			talent_profile_id: manualTalent,
			score: 100,
			reason: "Matched by the Tech Faculty team.",
			status: "approved",
			source: "manual",
			created_by: auth.user?.id ?? null
		});
		if (error) {
			toast({
				title: "Could not add the match",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		toast({ title: "Match added and shared with the talent" });
		setManualRole("");
		setManualTalent("");
		load();
	};
	const toggleVetted = async (talent) => {
		const { error } = await supabase.from("talent_profiles").update({
			is_vetted: !talent.is_vetted,
			vetted_at: talent.is_vetted ? null : (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", talent.id);
		if (error) {
			toast({
				title: "Update failed",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		load();
	};
	const toggleProfileFlag = async (talent, field) => {
		const update = field === "is_client_interested" ? { is_client_interested: !talent.is_client_interested } : { is_public: !talent.is_public };
		const { error } = await supabase.from("talent_profiles").update(update).eq("id", talent.id);
		if (error) {
			toast({
				title: "Update failed",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		load();
	};
	const approveTalent = async (talent) => {
		const { data, error } = await supabase.rpc("approve_talent", { _talent_id: talent.id });
		if (error) {
			toast({
				title: "Could not approve",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		notifyMarketplaceEvent({ data: {
			event: "talent_approved",
			id: talent.id
		} }).catch(() => {});
		toast({
			title: "Approved as talent",
			description: data ? `Linked to Faculty ID ${data}` : "No Faculty ID: they haven't studied with us."
		});
		load();
	};
	const issueFacultyId = async (talent) => {
		const { data, error } = await supabase.rpc("issue_talent_faculty_id", { _talent_id: talent.id });
		if (error) {
			toast({
				title: "Could not issue a Faculty ID",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		toast({
			title: "Faculty ID issued",
			description: String(data ?? "")
		});
		load();
	};
	const saveGroupUrl = async (roleId) => {
		const value = (groupDrafts[roleId] ?? "").trim();
		const { error } = await supabase.from("talent_roles").update({ whatsapp_group_url: value || null }).eq("id", roleId);
		if (error) {
			toast({
				title: "Could not save the group link",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		toast({
			title: value ? "Group link saved" : "Group link removed",
			description: "Only matched talent and staff can see it."
		});
		load();
	};
	const saveProjectLinks = async (roleId) => {
		const draft = projectDrafts[roleId] ?? emptyProjectDraft;
		const { error } = await supabase.from("talent_roles").update({
			slack_channel_url: draft.slack.trim() || null,
			slack_channel_id: draft.channel || null,
			task_board_url: draft.task.trim() || null,
			drive_url: draft.drive.trim() || null,
			project_brief: draft.brief.trim() || null
		}).eq("id", roleId);
		if (error) {
			toast({
				title: "Could not save the project links",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		toast({
			title: "Project workspace saved",
			description: "Only selected talent and staff can see these links."
		});
		load();
	};
	const toggleApplications = async (role) => {
		const { error } = await supabase.from("talent_roles").update({ applications_closed: !role.applications_closed }).eq("id", role.id);
		if (error) {
			toast({
				title: "Update failed",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		load();
	};
	const reviewDeliverable = async (id, status) => {
		const { error } = await supabase.from("talent_deliverables").update({
			status,
			reviewer_note: (noteDrafts[id] ?? "").trim() || null
		}).eq("id", id);
		if (error) {
			toast({
				title: "Update failed",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		notifyMarketplaceEvent({ data: {
			event: "deliverable_reviewed",
			id
		} }).catch(() => {});
		toast({ title: "Review saved" });
		load();
	};
	const addEngagement = async () => {
		if (!newEngagement.talent) {
			toast({
				title: "Pick the talent",
				variant: "destructive"
			});
			return;
		}
		const { data: auth } = await supabase.auth.getUser();
		const { error } = await supabase.from("talent_engagements").insert({
			talent_profile_id: newEngagement.talent,
			role_id: newEngagement.role || null,
			weekly_amount: newEngagement.amount ? Number(newEngagement.amount) : null,
			currency: newEngagement.currency,
			note: newEngagement.note.trim() || null,
			created_by: auth.user?.id ?? null
		});
		if (error) {
			toast({
				title: "Could not save the engagement",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		toast({
			title: "Engagement recorded",
			description: "The talent now sees their weekly pay on their dashboard."
		});
		setNewEngagement({
			talent: "",
			role: "",
			amount: "",
			currency: "NGN",
			note: ""
		});
		load();
	};
	const setInterestStatus = async (id, status) => {
		const update = {
			status,
			...status === "introduced" ? { approved_at: (/* @__PURE__ */ new Date()).toISOString() } : {}
		};
		const { error } = await supabase.from("talent_interest_requests").update(update).eq("id", id);
		if (error) {
			toast({
				title: "Update failed",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		if (status === "introduced") {
			notifyMarketplaceEvent({ data: {
				event: "intro_approved",
				id
			} }).catch(() => {});
			toast({
				title: "Introduction approved",
				description: "We emailed the client a confirmation."
			});
		}
		load();
	};
	const setEngagementStatus = async (id, status) => {
		const { error } = await supabase.from("talent_engagements").update({ status }).eq("id", id);
		if (error) {
			toast({
				title: "Update failed",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		load();
	};
	const openCv = async (path) => {
		if (!path) return;
		const { data, error } = await supabase.storage.from("talent-cvs").createSignedUrl(path, 300);
		if (error || !data) {
			toast({
				title: "Could not open the CV",
				description: error?.message,
				variant: "destructive"
			});
			return;
		}
		window.open(data.signedUrl, "_blank", "noopener,noreferrer");
	};
	const setBriefStatus = async (id, status) => {
		const { error } = await supabase.from("business_briefs").update({ status }).eq("id", id);
		if (error) {
			toast({
				title: "Update failed",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		load();
	};
	const setApplicationStatus = async (id, status) => {
		const { error } = await supabase.from("talent_applications").update({ status }).eq("id", id);
		if (error) {
			toast({
				title: "Update failed",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		load();
	};
	if (roleLoading || signedIn === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "container mx-auto max-w-4xl px-4 pt-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto animate-spin text-muted-foreground" })
		})]
	});
	if (!isStaff) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container mx-auto max-w-lg px-4 pb-20 pt-28 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold",
						children: "Staff access only"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted-foreground",
						children: signedIn ? "This account does not have talent admin access. Ask the owner to grant it." : "Sign in with a staff account to manage roles, talent and matches."
					}),
					!signedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/login?next=/admin/talent",
						className: "mt-6 inline-block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Sign in" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	const suggested = matches.filter((m) => m.status === "suggested");
	const decided = matches.filter((m) => m.status !== "suggested");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TalentNav, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container mx-auto max-w-6xl px-4 py-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminNav, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl font-bold",
							children: "Talent admin"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-muted-foreground",
							children: "Add roles, review talent, approve matches and read business briefs."
						}),
						loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto mt-12 animate-spin text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
							defaultValue: "roles",
							className: "mt-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
									className: "flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
											value: "roles",
											children: [
												"Roles (",
												roles.length,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
											value: "talent",
											children: [
												"Talent (",
												talents.length,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
											value: "matches",
											children: [
												"Matches (",
												suggested.length,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
											value: "applications",
											children: [
												"Applications (",
												applications.length,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
											value: "briefs",
											children: [
												"Briefs (",
												briefs.filter((b) => b.status === "new").length,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
											value: "interest",
											children: [
												"Interest (",
												interests.filter((i) => i.status === "new").length,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
											value: "pay",
											children: [
												"Work & pay (",
												engagements.filter((e) => e.status === "active").length,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
											value: "logs",
											children: [
												"Work logs (",
												deliverables.filter((d) => d.status === "submitted").length,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "hr",
											children: "HR automation"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "roles",
									className: "space-y-8 pt-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
										className: "rounded-lg border border-border bg-card p-6",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
												className: "mb-4 flex items-center gap-2 text-lg font-semibold",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 18 }), " Add a role"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid gap-4 sm:grid-cols-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: newRole.title,
														onChange: (e) => setNewRole({
															...newRole,
															title: e.target.value
														})
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Company" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: newRole.company,
														onChange: (e) => setNewRole({
															...newRole,
															company: e.target.value
														})
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Kind" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: newRole.role_kind,
														onValueChange: (v) => setNewRole({
															...newRole,
															role_kind: v
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "internal",
																children: "Tech Faculty role"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "partner",
																children: "Partner role"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "client",
																children: "Client project"
															})
														] })]
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: newRole.employment_type,
														onValueChange: (v) => setNewRole({
															...newRole,
															employment_type: v
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "full_time",
																children: "Full-time"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "part_time",
																children: "Part-time"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "contract",
																children: "Contract"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "internship",
																children: "Internship"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "freelance",
																children: "Freelance"
															})
														] })]
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "City" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: newRole.city,
														onChange: (e) => setNewRole({
															...newRole,
															city: e.target.value
														})
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Remote?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: newRole.is_remote,
														onValueChange: (v) => setNewRole({
															...newRole,
															is_remote: v
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "true",
															children: "Remote friendly"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "false",
															children: "On-site"
														})] })]
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Seniority" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: newRole.seniority,
														onValueChange: (v) => setNewRole({
															...newRole,
															seniority: v
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "entry",
																children: "Entry level"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "mid",
																children: "Mid level"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "senior",
																children: "Senior"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "lead",
																children: "Lead"
															})
														] })]
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Openings" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "number",
														min: "1",
														value: newRole.openings,
														onChange: (e) => setNewRole({
															...newRole,
															openings: e.target.value
														})
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pay from" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "number",
														value: newRole.budget_min,
														onChange: (e) => setNewRole({
															...newRole,
															budget_min: e.target.value
														})
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pay to" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "number",
														value: newRole.budget_max,
														onChange: (e) => setNewRole({
															...newRole,
															budget_max: e.target.value
														})
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "sm:col-span-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pay wording (optional, shown instead of the range)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															value: newRole.pay_text,
															placeholder: "e.g. Monthly, to be agreed",
															onChange: (e) => setNewRole({
																...newRole,
																pay_text: e.target.value
															})
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "sm:col-span-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Hiring steps" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
															value: newRole.selection_process,
															onValueChange: (v) => setNewRole({
																...newRole,
																selection_process: v
															}),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "direct",
																	children: "No assessment or interview"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "assessment",
																	children: "Assessment"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "interview",
																	children: "Interview"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "assessment_interview",
																	children: "Assessment and interview"
																})
															] })]
														})]
													}),
													newRole.selection_process.includes("assessment") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "sm:col-span-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Assessment link (emailed at the assessment stage)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															value: newRole.assessment_url,
															placeholder: "https://forms.gle/…",
															onChange: (e) => setNewRole({
																...newRole,
																assessment_url: e.target.value
															})
														})]
													}),
													newRole.selection_process.includes("interview") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Interview booking link" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: newRole.interview_url,
														placeholder: "https://calendar.app.google/…",
														onChange: (e) => setNewRole({
															...newRole,
															interview_url: e.target.value
														})
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Interview on" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: newRole.interview_channel,
														onValueChange: (v) => setNewRole({
															...newRole,
															interview_channel: v
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "whatsapp",
															children: "WhatsApp call"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "google_meet",
															children: "Google Meet"
														})] })]
													})] })] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Currency" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: newRole.budget_currency,
														onValueChange: (v) => setNewRole({
															...newRole,
															budget_currency: v
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "NGN",
															children: "Naira"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "USD",
															children: "US Dollar"
														})] })]
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pay period" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: newRole.budget_unit,
														onValueChange: (v) => setNewRole({
															...newRole,
															budget_unit: v
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "MONTH",
																children: "Per month"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "WEEK",
																children: "Per week"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "HOUR",
																children: "Per hour"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "PROJECT",
																children: "Per project"
															})
														] })]
													})] })
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-4 space-y-4",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "One-line summary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: newRole.summary,
														onChange: (e) => setNewRole({
															...newRole,
															summary: e.target.value
														})
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
														rows: 4,
														value: newRole.description,
														onChange: (e) => setNewRole({
															...newRole,
															description: e.target.value
														})
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Responsibilities (one per line)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
														rows: 3,
														value: newRole.responsibilities,
														onChange: (e) => setNewRole({
															...newRole,
															responsibilities: e.target.value
														})
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Required skills (comma separated)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: newRole.required_skills,
														onChange: (e) => setNewRole({
															...newRole,
															required_skills: e.target.value
														})
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nice to have (comma separated)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: newRole.nice_to_have,
														onChange: (e) => setNewRole({
															...newRole,
															nice_to_have: e.target.value
														})
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														onClick: createRole,
														disabled: creating,
														children: creating ? "Saving…" : "Create draft role"
													})
												]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
										className: "space-y-3",
										children: roles.map((role) => {
											const roleMatches = matches.filter((m) => m.role_id === role.id);
											const count = (statuses) => roleMatches.filter((m) => statuses.includes(m.status)).length;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-3 rounded-lg border border-border bg-card p-4",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-wrap items-center justify-between gap-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "font-medium",
																children: role.title
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "text-xs text-muted-foreground",
																children: [
																	ROLE_KIND_LABEL[role.role_kind],
																	" · ",
																	role.company,
																	" · ",
																	role.city ?? "Anywhere",
																	" ·",
																	" ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																		variant: "outline",
																		className: "ml-1",
																		children: role.status
																	})
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "mt-1 text-xs text-muted-foreground",
																children: [
																	count([
																		"approved",
																		"accepted",
																		"assessment",
																		"interview",
																		"hired"
																	]),
																	" matched ·",
																	" ",
																	count(["accepted"]),
																	" accepted · ",
																	count(["assessment"]),
																	" in assessment ·",
																	" ",
																	count(["interview"]),
																	" in interview · ",
																	count(["hired"]),
																	" hired"
																]
															})
														] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex flex-wrap gap-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
																size: "sm",
																variant: "outline",
																onClick: () => runMatching(role.id),
																disabled: matchingRoleId === role.id,
																children: [matchingRoleId === role.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
																	size: 14,
																	className: "mr-1.5 animate-spin"
																}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
																	size: 14,
																	className: "mr-1.5"
																}), "Run AI matching"]
															}), role.status !== "published" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																size: "sm",
																onClick: () => setRoleStatus(role.id, "published"),
																children: "Publish"
															}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																size: "sm",
																variant: "ghost",
																onClick: () => setRoleStatus(role.id, "closed"),
																children: "Close"
															})]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-wrap items-center gap-4 rounded-md bg-muted/40 p-2 text-xs",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
															className: "flex items-center gap-2",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
																	checked: role.auto_match_enabled,
																	onCheckedChange: (v) => updateAutoMatch(role.id, { auto_match_enabled: v }),
																	"aria-label": "Auto-match this role"
																}),
																"Auto-match ",
																role.auto_match_enabled ? "on" : "paused"
															]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
															className: "flex items-center gap-2",
															children: [
																"Threshold",
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																	type: "number",
																	min: 0,
																	max: 100,
																	className: "h-8 w-20",
																	defaultValue: role.auto_match_threshold,
																	onBlur: (e) => {
																		const v = Math.max(0, Math.min(100, Math.round(Number(e.target.value) || 0)));
																		if (v !== role.auto_match_threshold) updateAutoMatch(role.id, { auto_match_threshold: v });
																	}
																}),
																"%"
															]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "grid gap-3 rounded-md bg-muted/40 p-2 sm:grid-cols-4",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
																className: "text-xs",
																children: "Hiring steps"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
																value: role.selection_process,
																onValueChange: (v) => updateHiring(role.id, { selection_process: v }),
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
																	className: "mt-1 h-8",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																		value: "direct",
																		children: "No assessment or interview"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																		value: "assessment",
																		children: "Assessment"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																		value: "interview",
																		children: "Interview"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																		value: "assessment_interview",
																		children: "Assessment and interview"
																	})
																] })]
															})] }),
															role.selection_process.includes("assessment") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
																className: "text-xs",
																children: "Assessment link"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "mt-1 h-8",
																defaultValue: role.assessment_url ?? "",
																placeholder: "https://…",
																onBlur: (e) => {
																	const v = e.target.value.trim() || null;
																	if (v !== role.assessment_url) updateHiring(role.id, { assessment_url: v });
																}
															}, `a-${role.assessment_url}`)] }),
															role.selection_process.includes("interview") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
																className: "text-xs",
																children: "Interview booking link"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "mt-1 h-8",
																defaultValue: role.interview_url ?? "",
																placeholder: "https://calendar.app.google/…",
																onBlur: (e) => {
																	const v = e.target.value.trim() || null;
																	if (v !== role.interview_url) updateHiring(role.id, { interview_url: v });
																}
															}, `i-${role.interview_url}`)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
																className: "text-xs",
																children: "Interview on"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
																value: role.interview_channel,
																onValueChange: (v) => updateHiring(role.id, { interview_channel: v }),
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
																	className: "mt-1 h-8",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "whatsapp",
																	children: "WhatsApp call"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "google_meet",
																	children: "Google Meet"
																})] })]
															})] })] })
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-wrap items-end gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "min-w-[16rem] flex-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
																className: "text-xs",
																children: "Project WhatsApp group link (matched talent only)"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "mt-1",
																placeholder: "https://chat.whatsapp.com/…",
																value: groupDrafts[role.id] ?? "",
																onChange: (e) => setGroupDrafts({
																	...groupDrafts,
																	[role.id]: e.target.value
																})
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "sm",
															variant: "outline",
															onClick: () => saveGroupUrl(role.id),
															children: "Save link"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "grid gap-3 border-t border-border pt-3 sm:grid-cols-3",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
																className: "text-xs",
																children: "Slack channel (auto-invites selected talent)"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
																value: projectDrafts[role.id]?.channel || "none",
																onValueChange: (v) => setProjectDrafts({
																	...projectDrafts,
																	[role.id]: {
																		...projectDrafts[role.id] ?? emptyProjectDraft,
																		channel: v === "none" ? "" : v
																	}
																}),
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
																	className: "mt-1",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Pick a Slack channel" })
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "none",
																	children: "No Slack channel"
																}), slackChannels.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
																	value: c.id,
																	children: [c.is_private ? "🔒 " : "# ", c.name]
																}, c.id))] })]
															})] }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
																className: "text-xs",
																children: "Slack channel link"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "mt-1",
																placeholder: "https://slack.com/…",
																value: projectDrafts[role.id]?.slack ?? "",
																onChange: (e) => setProjectDrafts({
																	...projectDrafts,
																	[role.id]: {
																		...projectDrafts[role.id] ?? emptyProjectDraft,
																		slack: e.target.value
																	}
																})
															})] }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
																className: "text-xs",
																children: "Task board link"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "mt-1",
																placeholder: "https://…",
																value: projectDrafts[role.id]?.task ?? "",
																onChange: (e) => setProjectDrafts({
																	...projectDrafts,
																	[role.id]: {
																		...projectDrafts[role.id] ?? emptyProjectDraft,
																		task: e.target.value
																	}
																})
															})] }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
																className: "text-xs",
																children: "Shared files link"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "mt-1",
																placeholder: "https://drive.google.com/…",
																value: projectDrafts[role.id]?.drive ?? "",
																onChange: (e) => setProjectDrafts({
																	...projectDrafts,
																	[role.id]: {
																		...projectDrafts[role.id] ?? emptyProjectDraft,
																		drive: e.target.value
																	}
																})
															})] }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "sm:col-span-3",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
																	className: "text-xs",
																	children: "Project brief selected talent will see"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
																	className: "mt-1",
																	rows: 2,
																	value: projectDrafts[role.id]?.brief ?? "",
																	onChange: (e) => setProjectDrafts({
																		...projectDrafts,
																		[role.id]: {
																			...projectDrafts[role.id] ?? emptyProjectDraft,
																			brief: e.target.value
																		}
																	})
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex flex-wrap items-center gap-2 sm:col-span-3",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																		size: "sm",
																		variant: "outline",
																		onClick: () => saveProjectLinks(role.id),
																		children: "Save project workspace"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																		size: "sm",
																		variant: "ghost",
																		onClick: () => toggleApplications(role),
																		children: role.applications_closed ? "Reopen applications" : "Close applications"
																	}),
																	role.applications_closed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																		variant: "outline",
																		children: "Applications closed"
																	})
																]
															})
														]
													})
												]
											}, role.id);
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "talent",
									className: "space-y-3 pt-6",
									children: [talents.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground",
										children: "No talent profiles yet. Share techfaculty.ng/talent in the WhatsApp group."
									}), talents.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-lg border border-border bg-card p-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-start justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "font-medium",
													children: [
														t.full_name,
														" ",
														t.is_vetted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															className: "ml-1",
															children: "Vetted"
														}),
														t.is_client_interested && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "secondary",
															className: "ml-1",
															children: "Client interested"
														}),
														!t.is_public && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "outline",
															className: "ml-1",
															children: "Hidden"
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-muted-foreground",
													children: [
														t.faculty_id ? `${t.faculty_id} · ` : "",
														[t.city, t.country].filter(Boolean).join(", "),
														" · ",
														t.phone,
														" · strength ",
														t.profile_strength,
														"% ·",
														" ",
														t.availability === "open" ? "open to work" : "unavailable"
													]
												}),
												t.skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-xs text-muted-foreground",
													children: t.skills.join(", ")
												})
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap gap-2",
												children: [
													t.cv_path && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														size: "sm",
														variant: "outline",
														onClick: () => openCv(t.cv_path),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
															size: 14,
															className: "mr-1.5"
														}), " CV"]
													}),
													(t.whatsapp || t.phone) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														href: contactUrl(t.whatsapp || t.phone, t.full_name),
														target: "_blank",
														rel: "noopener noreferrer",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															size: "sm",
															variant: "outline",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
																size: 14,
																className: "mr-1.5"
															}), " Message"]
														})
													}),
													!t.is_vetted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														onClick: () => approveTalent(t),
														children: "Approve"
													}),
													!t.faculty_id && t.is_vetted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "outline",
														onClick: () => issueFacultyId(t),
														children: "Issue Faculty ID only"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: t.is_vetted ? "ghost" : "default",
														onClick: () => toggleVetted(t),
														children: t.is_vetted ? "Remove vetted" : "Mark vetted"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "outline",
														onClick: () => toggleProfileFlag(t, "is_client_interested"),
														children: t.is_client_interested ? "Clear client interest" : "Mark client interested"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "ghost",
														onClick: () => toggleProfileFlag(t, "is_public"),
														children: t.is_public ? "Hide from directory" : "Show in directory"
													})
												]
											})]
										})
									}, t.id))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "matches",
									className: "space-y-6 pt-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AutoMatchPauseSwitch, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
											className: "rounded-lg border border-border bg-card p-5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
												className: "mb-3 text-lg font-semibold",
												children: "Match someone manually"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid gap-3 sm:grid-cols-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: manualRole,
														onValueChange: setManualRole,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Role" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: r.id,
															children: r.title
														}, r.id)) })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: manualTalent,
														onValueChange: setManualTalent,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Talent" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: talents.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: t.id,
															children: t.full_name
														}, t.id)) })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														onClick: addManualMatch,
														children: "Add match"
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
											className: "mb-3 text-lg font-semibold",
											children: [
												"Awaiting your review (",
												suggested.length,
												")"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-3",
											children: [suggested.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground",
												children: "Nothing waiting. Use “Run AI matching” on a role to generate suggestions."
											}), suggested.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "rounded-lg border border-border bg-card p-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-start justify-between gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "font-medium",
															children: [
																m.talent_profiles?.full_name,
																" → ",
																m.talent_roles?.title
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "text-xs text-muted-foreground",
															children: [
																m.score,
																"% · ",
																m.talent_profiles?.city,
																" · ",
																m.talent_profiles?.skills?.slice(0, 5).join(", ")
															]
														}),
														m.reason && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "mt-2 text-sm text-muted-foreground",
															children: m.reason
														})
													] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															size: "sm",
															onClick: () => setMatchStatus(m.id, "approved"),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
																size: 14,
																className: "mr-1.5"
															}), " Approve"]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															size: "sm",
															variant: "ghost",
															onClick: () => setMatchStatus(m.id, "declined"),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
																size: 14,
																className: "mr-1.5"
															}), " Decline"]
														})]
													})]
												})
											}, m.id))]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
											className: "mb-3 text-lg font-semibold",
											children: [
												"Decided (",
												decided.length,
												")"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "divide-y divide-border overflow-hidden rounded-lg border border-border bg-card",
											children: decided.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center justify-between gap-2 p-3 text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													m.talent_profiles?.full_name,
													" → ",
													m.talent_roles?.title,
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-xs text-muted-foreground",
														children: [
															"· ",
															m.score,
															"%"
														]
													})
												] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-center gap-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: m.source === "auto" ? "default" : "secondary",
															children: m.source === "auto" ? "Auto" : "Manual"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "outline",
															children: MATCH_STATUS_LABEL[m.status] ?? m.status
														}),
														m.talent_profiles?.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
															href: contactUrl(m.talent_profiles.phone, m.talent_profiles.full_name),
															target: "_blank",
															rel: "noopener noreferrer",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
																size: "sm",
																variant: "outline",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
																	size: 14,
																	className: "mr-1.5"
																}), " Message"]
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
															value: m.status,
															onValueChange: (v) => setMatchStatus(m.id, v),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
																className: "h-8 w-[11rem]",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "approved",
																	children: "Shared with talent"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "accepted",
																	children: "Talent accepted"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "assessment",
																	children: "In assessment"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "interview",
																	children: "In interview"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "shortlisted",
																	children: "Shortlisted"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "interviewed",
																	children: "Interviewed"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "offer_sent",
																	children: "Offer sent"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "hired",
																	children: "Hired"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "onboarded",
																	children: "Onboarded"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "unresponsive",
																	children: "Unresponsive"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "declined",
																	children: "Declined"
																})
															] })]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															size: "sm",
															variant: "ghost",
															disabled: slackBusyMatch === m.id,
															onClick: () => syncSlack(m.id),
															children: [slackBusyMatch === m.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
																size: 14,
																className: "mr-1.5 animate-spin"
															}) : null, "Slack access"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "sm",
															variant: "ghost",
															onClick: () => emailSlackLink(m.id),
															children: "Email Slack link"
														})
													]
												})]
											}, m.id))
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "applications",
									className: "space-y-3 pt-6",
									children: [applications.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground",
										children: "No applications yet."
									}), applications.map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-lg border border-border bg-card p-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-start justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "font-medium",
													children: [
														app.talent_profiles?.full_name,
														" → ",
														app.talent_roles?.title
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-muted-foreground",
													children: [
														app.talent_profiles?.phone,
														" · ",
														new Date(app.created_at).toLocaleDateString("en-GB")
													]
												}),
												app.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-sm text-muted-foreground",
													children: app.message
												})
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: app.status,
												onValueChange: (v) => setApplicationStatus(app.id, v),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "w-40",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Object.entries(APPLICATION_STATUS_LABEL).map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value,
													children: label
												}, value)) })]
											})]
										})
									}, app.id))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "briefs",
									className: "space-y-3 pt-6",
									children: [briefs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground",
										children: "No business briefs yet. Share techfaculty.ng/hire with prospects."
									}), briefs.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-lg border border-border bg-card p-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-start justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-medium",
													children: b.project_title
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-muted-foreground",
													children: [
														b.company,
														" · ",
														b.contact_name,
														" · ",
														b.phone,
														" · ",
														[b.city, b.country].filter(Boolean).join(", ")
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-sm text-muted-foreground",
													children: b.description
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-2 text-xs text-muted-foreground",
													children: [
														b.skills_needed.join(", "),
														b.budget_text ? ` · budget ${b.budget_text}` : "",
														b.timeline ? ` · ${b.timeline}` : "",
														" · ",
														SELECTION_PROCESS_LABEL[b.selection_process] ?? b.selection_process
													]
												})
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: b.status,
												onValueChange: (v) => setBriefStatus(b.id, v),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "w-40",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "new",
														children: "New"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "reviewing",
														children: "Reviewing"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "approved",
														children: "Approved"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "rejected",
														children: "Not a fit"
													})
												] })]
											})]
										})
									}, b.id))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "interest",
									className: "space-y-3 pt-6",
									children: [interests.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground",
										children: "No introduction requests yet. They arrive automatically from the public talent directory."
									}), interests.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-lg border border-border bg-card p-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-start justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "font-medium",
													children: [
														i.requester_name,
														i.requester_org ? ` · ${i.requester_org}` : "",
														" → ",
														i.talent_profiles?.full_name
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-muted-foreground",
													children: [
														i.requester_contact,
														" · ",
														new Date(i.created_at).toLocaleString("en-GB"),
														" · from ",
														i.source
													]
												}),
												i.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-sm text-muted-foreground",
													children: i.message
												})
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: contactUrl(i.requester_contact, i.requester_name),
													target: "_blank",
													rel: "noopener noreferrer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														size: "sm",
														variant: "outline",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
															size: 14,
															className: "mr-1.5"
														}), " Message"]
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: i.status,
													onValueChange: (v) => setInterestStatus(i.id, v),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
														className: "w-40",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "new",
															children: "New"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "contacted",
															children: "Contacted"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "introduced",
															children: "Introduced"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "closed",
															children: "Closed"
														})
													] })]
												})]
											})]
										})
									}, i.id))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "pay",
									className: "space-y-6 pt-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
										className: "rounded-lg border border-border bg-card p-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
												className: "mb-3 flex items-center gap-2 text-lg font-semibold",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { size: 18 }), " Record someone as working"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid gap-3 sm:grid-cols-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: newEngagement.talent,
														onValueChange: (v) => setNewEngagement({
															...newEngagement,
															talent: v
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Talent" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: talents.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: t.id,
															children: t.full_name
														}, t.id)) })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: newEngagement.role,
														onValueChange: (v) => setNewEngagement({
															...newEngagement,
															role: v
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Project (optional)" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: r.id,
															children: r.title
														}, r.id)) })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Weekly pay" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "number",
														value: newEngagement.amount,
														onChange: (e) => setNewEngagement({
															...newEngagement,
															amount: e.target.value
														})
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Currency" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: newEngagement.currency,
														onValueChange: (v) => setNewEngagement({
															...newEngagement,
															currency: v
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "NGN",
															children: "NGN"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "USD",
															children: "USD"
														})] })]
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "sm:col-span-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Note the talent will see (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															value: newEngagement.note,
															onChange: (e) => setNewEngagement({
																...newEngagement,
																note: e.target.value
															})
														})]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												className: "mt-4",
												onClick: addEngagement,
												children: "Save"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
										className: "space-y-3",
										children: [engagements.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground",
											children: "Nobody is recorded as working yet."
										}), engagements.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-medium",
												children: [
													e.talent_profiles?.full_name,
													" · ",
													e.talent_roles?.title ?? "Project"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: [
													"Started ",
													new Date(e.started_on).toLocaleDateString("en-GB"),
													" ·",
													" ",
													e.weekly_amount != null ? `${formatMoney(Number(e.weekly_amount), e.currency)} / week` : "pay being agreed",
													e.note ? ` · ${e.note}` : ""
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: e.status,
												onValueChange: (v) => setEngagementStatus(e.id, v),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "w-36",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Object.entries(ENGAGEMENT_STATUS_LABEL).map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value,
													children: label
												}, value)) })]
											})]
										}, e.id))]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "logs",
									className: "space-y-3 pt-6",
									children: [deliverables.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground",
										children: "No work has been logged yet. Selected talent log their weekly work from their dashboard."
									}), deliverables.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3 rounded-lg border border-border bg-card p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-start justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-medium",
														children: d.title
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-xs text-muted-foreground",
														children: [
															d.talent_profiles?.full_name,
															" · ",
															d.talent_roles?.title ?? "Project",
															" · week of",
															" ",
															new Date(d.week_of).toLocaleDateString("en-GB")
														]
													}),
													d.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-1 text-xs text-muted-foreground",
														children: d.summary
													}),
													d.link_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														href: d.link_url,
														target: "_blank",
														rel: "noopener noreferrer",
														className: "text-xs text-primary hover:underline",
														children: "Open the work"
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												children: DELIVERABLE_STATUS_LABEL[d.status] ?? d.status
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-end gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-[16rem] flex-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														className: "text-xs",
														children: "Feedback for the talent"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														className: "mt-1",
														value: noteDrafts[d.id] ?? "",
														onChange: (ev) => setNoteDrafts({
															...noteDrafts,
															[d.id]: ev.target.value
														})
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													onClick: () => reviewDeliverable(d.id, "reviewed"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
														size: 14,
														className: "mr-1.5"
													}), " Reviewed"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													variant: "outline",
													onClick: () => reviewDeliverable(d.id, "needs_changes"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
														size: 14,
														className: "mr-1.5"
													}), " Needs changes"]
												})
											]
										})]
									}, d.id))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "hr",
									className: "pt-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HrAutomationPanel, {})
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
var SplitComponent = AdminTalent;
//#endregion
export { SplitComponent as component };
