import { a as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-DiboEcwk.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { $ as LoaderCircle } from "../_libs/lucide-react.mjs";
import { a as Footer, c as useIsStaff, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { t as AdminNav } from "./AdminNav-Co4-pzct.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/admin.referrals-BG6lV6L7.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var STATUS = {
	pending: {
		label: "Checkout started",
		variant: "outline"
	},
	earned: {
		label: "Reward due",
		variant: "default"
	},
	paid_out: {
		label: "Reward paid",
		variant: "secondary"
	},
	cancelled: {
		label: "Cancelled",
		variant: "destructive"
	}
};
var money = (currency, amount) => `${currency === "USD" ? "$" : "₦"}${Number(amount).toLocaleString()}`;
/** Admin: who referred whom, and the graduate rewards waiting to be paid. */
function AdminReferrals() {
	const { loading, isAdmin } = useIsStaff();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(null);
	const load = async () => {
		setBusy(true);
		const { data, error } = await supabase.rpc("admin_list_referrals");
		if (error) toast.error(error.message);
		else setRows(data ?? []);
		setBusy(false);
	};
	(0, import_react.useEffect)(() => {
		if (isAdmin) load();
	}, [isAdmin]);
	const markPaid = async (r) => {
		if (!window.confirm(`Mark ${money(r.currency, r.reward_amount)} as paid to ${r.referrer_name || "this graduate"}?`)) return;
		setSaving(r.id);
		const { error } = await supabase.rpc("admin_mark_referral_paid", { _id: r.id });
		if (error) toast.error(error.message);
		else {
			toast.success("Reward marked paid");
			await load();
		}
		setSaving(null);
	};
	const due = rows.filter((r) => r.status === "earned");
	const dueTotals = Object.entries(due.reduce((acc, r) => ({
		...acc,
		[r.currency]: (acc[r.currency] ?? 0) + Number(r.reward_amount)
	}), {}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 container mx-auto px-4 pt-28 pb-16 max-w-4xl space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminNav, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold",
						children: "Referrals"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							"New students who used a graduate's code save ",
							10,
							"%. When their payment is confirmed, the graduate earns ",
							10,
							"% of what they paid. Pay it, then mark it paid here."
						]
					})] }),
					loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : !isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "This page is for Tech Faculty admins."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
							to: "/login?next=/admin/referrals",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Sign in" })
						})]
					}) : busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No referrals yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [dueTotals.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: dueTotals.map(([c, n]) => money(c, n)).join(" + ")
							}),
							" in rewards to pay across ",
							due.length,
							" referral",
							due.length === 1 ? "" : "s",
							"."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: rows.map((r) => {
							const status = STATUS[r.status] ?? {
								label: r.status,
								variant: "outline"
							};
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-4 flex flex-wrap items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-semibold",
											children: [
												r.referrer_name || "Graduate",
												" referred ",
												r.referred_name || "a student",
												r.plan_name ? ` · ${r.plan_name}` : ""
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground break-all",
											children: [
												"Code ",
												r.code,
												" · referrer ",
												[
													r.referrer_faculty_id,
													r.referrer_email,
													r.referrer_phone
												].filter(Boolean).join(" · ")
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												"New student ",
												r.referred_faculty_id || "",
												" saved ",
												money(r.currency, r.discount_amount),
												" · reward",
												" ",
												money(r.currency, r.reward_amount),
												" · ",
												new Date(r.created_at).toLocaleDateString(),
												r.paid_out_at ? ` · paid ${new Date(r.paid_out_at).toLocaleDateString()}` : ""
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: status.variant,
										children: status.label
									}), r.status === "earned" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										disabled: saving === r.id,
										onClick: () => markPaid(r),
										children: [saving === r.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Mark reward paid"]
									})]
								})]
							}) }, r.id);
						})
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
var SplitComponent = AdminReferrals;
//#endregion
export { SplitComponent as component };
