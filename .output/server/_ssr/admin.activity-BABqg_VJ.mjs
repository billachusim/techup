import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { $ as LoaderCircle, P as RefreshCw, j as Search, st as History } from "../_libs/lucide-react.mjs";
import { a as Footer, c as useIsStaff, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { n as useToast } from "./use-toast-DIJoD3Kd.mjs";
import { t as AdminNav } from "./AdminNav-Co4-pzct.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-De3Puk9b.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/admin.activity-BABqg_VJ.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var ACTION_LABEL = {
	"payment.marked_paid": "Marked payment paid",
	"payment.balance_marked_paid": "Marked instalment balance paid",
	"enrollment.cancelled": "Cancelled enrolment",
	"enrollment.status_changed": "Changed enrolment status",
	"certificate.issued": "Issued certificate",
	"certificate.auto_issued": "Issued certificate automatically",
	"certificate.edited": "Edited certificate",
	"certificate.revoked": "Revoked certificate",
	"certificate.reinstated": "Reinstated certificate",
	"certificate.deleted": "Deleted certificate",
	"lead.status_changed": "Changed lead status",
	"lead.auto_converted": "Marked lead enrolled (they enrolled)",
	"lead.auto_archived": "Archived silent lead",
	"referral.reward_paid": "Paid referral reward",
	"referral.status_changed": "Changed referral status",
	"slack.channel_created": "Created project Slack channel",
	"talent.auto_approved": "Approved talent automatically",
	"payment.balance_reminder_sent": "Emailed instalment balance reminder",
	"payment.balance_paid_online": "Instalment balance paid online",
	"work.ai_reviewed": "AI scored student work",
	"work.ai_review_overridden": "Changed AI score on student work",
	"whatsapp.auto_answered": "Answered a WhatsApp question automatically",
	"whatsapp.auto_answer_on": "Turned WhatsApp auto-answers on",
	"whatsapp.auto_answer_off": "Turned WhatsApp auto-answers off",
	"payment.pay_link_created": "Made a pay link for a WhatsApp/bank request",
	"payment.pay_link_emailed": "Emailed a pay link",
	"payment.pay_link_reminded": "Emailed a pay link reminder",
	"enrollment.auto_cancelled": "Cancelled unpaid request after 14 days",
	"enrollment.auto_cancel_emailed": "Told student their request was cancelled"
};
var LIMIT = 500;
var actionLabel = (action) => ACTION_LABEL[action] ?? action.replace(/[._]/g, " ");
var formatDate = (iso) => new Date(iso).toLocaleString("en-NG", {
	day: "numeric",
	month: "short",
	year: "numeric",
	hour: "numeric",
	minute: "2-digit"
});
var pretty = (v) => v.replace(/_/g, " ");
/** One line saying what changed, built from the details the trigger or server code saved. */
function describe(entry) {
	const d = entry.details && typeof entry.details === "object" && !Array.isArray(entry.details) ? entry.details : {};
	const parts = [];
	if (typeof d.from === "string" && typeof d.to === "string") parts.push(`${pretty(d.from)} → ${pretty(d.to)}`);
	else if (typeof d.to === "string") parts.push(pretty(d.to));
	if (typeof d.plan === "string") parts.push(d.plan);
	if (typeof d.course === "string") parts.push(d.course);
	if (typeof d.title === "string") parts.push(d.title);
	if (typeof d.score === "number") parts.push(`${d.score}%`);
	if (typeof d.certificate_number === "string") parts.push(d.certificate_number);
	if (typeof d.channel === "string") parts.push(d.channel);
	if (typeof d.amount === "number" || typeof d.amount === "string") parts.push(`${typeof d.currency === "string" ? `${d.currency} ` : ""}${Number(d.amount).toLocaleString("en-NG")}`);
	if (typeof d.code === "string") parts.push(`code ${d.code}`);
	if (typeof d.method === "string") parts.push(`by ${pretty(d.method)}`);
	if (typeof d.reason === "string") parts.push(`reason: ${d.reason}`);
	return parts.join(" · ");
}
/** Admin: who did what to which student or record, newest first. */
function AdminActivity() {
	const { toast } = useToast();
	const { loading: roleLoading, isAdmin } = useIsStaff();
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [entries, setEntries] = (0, import_react.useState)([]);
	const [action, setAction] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const load = (0, import_react.useCallback)(async () => {
		setLoading(true);
		const { data, error } = await (await getSupabase()).from("admin_audit_log").select("id, created_at, actor_email, action, target_table, target_id, faculty_id, subject, details").order("created_at", { ascending: false }).limit(LIMIT);
		setLoading(false);
		if (error) {
			toast({
				title: "Couldn't load the activity log",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		setEntries(data ?? []);
	}, [toast]);
	(0, import_react.useEffect)(() => {
		if (isAdmin) load();
	}, [isAdmin, load]);
	const actions = (0, import_react.useMemo)(() => [...new Set(entries.map((e) => e.action))].sort(), [entries]);
	const visible = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return entries.filter((e) => (action === "all" || e.action === action) && (!q || [
			e.actor_email,
			e.subject,
			e.faculty_id,
			e.target_id,
			describe(e)
		].some((v) => v?.toLowerCase().includes(q))));
	}, [
		entries,
		action,
		query
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 container mx-auto px-4 pt-28 pb-16 max-w-5xl space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminNav, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold",
							children: "Activity log"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Every admin action on payments, enrolments, certificates, leads and referral rewards."
						})] }), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => void load(),
							disabled: loading,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("h-4 w-4 mr-1.5", loading && "animate-spin") }), " Refresh"]
						})]
					}),
					roleLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : !isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "This page is for Tech Faculty admins. Sign in with an admin account."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
							to: "/login?next=/admin/activity",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Sign in" })
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: query,
									onChange: (e) => setQuery(e.target.value),
									placeholder: "Search admin, student, Faculty ID or details",
									className: "pl-9",
									"aria-label": "Search activity"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: action,
								onValueChange: setAction,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "sm:w-60",
									"aria-label": "Filter by action",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All actions"
								}), actions.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: a,
									children: actionLabel(a)
								}, a))] })]
							})]
						}),
						loading && !entries.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : !visible.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "flex flex-col items-center gap-2 py-12 text-center text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-8 w-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: entries.length ? "No activity matches these filters." : "No admin activity recorded yet."
							})]
						}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "p-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y",
								children: visible.map((e) => {
									const summary = describe(e);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "secondary",
														children: actionLabel(e.action)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium",
														children: e.subject || e.faculty_id || "Record"
													}),
													e.faculty_id && e.subject && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-muted-foreground",
														children: e.faculty_id
													})
												]
											}), summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted-foreground break-words",
												children: summary
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "shrink-0 text-sm text-muted-foreground sm:text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "break-all",
												children: e.actor_email ?? "Unknown admin"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs",
												children: formatDate(e.created_at)
											})]
										})]
									}, e.id);
								})
							})
						}) }),
						entries.length >= LIMIT && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Showing the latest ",
								LIMIT.toLocaleString("en-NG"),
								" actions."
							]
						})
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
var SplitComponent = AdminActivity;
//#endregion
export { SplitComponent as component };
