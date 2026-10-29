import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { $ as LoaderCircle, St as Download } from "../_libs/lucide-react.mjs";
import { a as Footer, c as useIsStaff, o as Header } from "./Footer-BKqEypqK.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { a as literalType, c as objectType, i as enumType, r as discriminatedUnionType, s as numberType, u as stringType } from "../_libs/zod.mjs";
import { n as lagosToday, t as formatDay } from "./dates-Sj88MuGL.mjs";
import { t as AdminNav } from "./AdminNav-Co4-pzct.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-De3Puk9b.mjs";
import { t as useServerFn } from "./useServerFn-BWpHjTBs.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DQeVp_Q7.mjs";
import { t as Label } from "./label-qSgNmrl1.mjs";
import { t as Textarea } from "./textarea-DtV3K4Va.mjs";
import { t as createSsrRpc } from "./createSsrRpc-yyKrtVKy.mjs";
import { n as downloadCsv, r as toCsv, t as csvFilename } from "./csv-CwucF6vt.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as reviewStudentWork, n as listStudentWork } from "./student-review.functions-C42EUvGr.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/admin.students-BbTCoVAZ.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
/** Admin: paid enrolments still waiting on a payment, newest first. */
var listPendingEnrollments = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("cc0bf4d916218a93a9c9f5a9143935ceb2a3784c608f017a2a8e4d619e04bfed"));
var PAYMENT_METHODS = [
	"bank",
	"whatsapp",
	"cash",
	"card",
	"other"
];
var DecideInput = discriminatedUnionType("decision", [objectType({
	id: stringType().uuid(),
	decision: literalType("paid"),
	amount: numberType().positive().max(1e8),
	currency: enumType(["NGN", "USD"]),
	method: enumType(PAYMENT_METHODS)
}), objectType({
	id: stringType().uuid(),
	decision: literalType("cancel")
})]);
/** Admin: mark a WhatsApp/bank/cash payment as received (with what came in), or cancel the request. */
var decidePendingEnrollment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => DecideInput.parse(d)).handler(createSsrRpc("03fbb9dac09b7d6012f1a41f40194e50be1f052cfbc6e0aa99b8d652b26d4fee"));
/** Admin: instalment plans with a balance still to pay, soonest due first. */
var listOutstandingBalances = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d2d666383c7e3d52a3e6ea8994f27ab8dca6baa1d438bd58a675d4b630dcf809"));
/** Admin: the balance of an instalment plan came in by bank transfer, cash or WhatsApp. */
var markBalancePaid = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	method: enumType(PAYMENT_METHODS)
}).parse(d)).handler(createSsrRpc("b53000212ad46f197af90231484b2d44775fc2f89376b7b5a5541ea3af0338a9"));
var METHODS = [
	{
		value: "bank",
		label: "Bank transfer"
	},
	{
		value: "whatsapp",
		label: "WhatsApp"
	},
	{
		value: "cash",
		label: "Cash"
	},
	{
		value: "card",
		label: "Card (outside checkout)"
	},
	{
		value: "other",
		label: "Other"
	}
];
/**
* Admin list of paid plans waiting on payment. Card payments confirm on their
* own; WhatsApp, email and bank payments are marked received here.
*/
function PendingPayments() {
	const list = useServerFn(listPendingEnrollments);
	const decide = useServerFn(decidePendingEnrollment);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(null);
	const [marking, setMarking] = (0, import_react.useState)(null);
	const [amount, setAmount] = (0, import_react.useState)("");
	const [currency, setCurrency] = (0, import_react.useState)("NGN");
	const [method, setMethod] = (0, import_react.useState)("");
	const load = async () => {
		setBusy(true);
		try {
			setRows(await list());
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const openMarkPaid = (r) => {
		setMarking(r);
		setAmount(r.amount_due != null ? String(r.amount_due) : "");
		setCurrency(r.currency?.toUpperCase() === "USD" ? "USD" : "NGN");
		setMethod(r.tx_ref && !r.pay_link_url ? "card" : "");
	};
	const markPaid = async () => {
		if (!marking) return;
		const value = Number(amount.replace(/,/g, ""));
		if (!Number.isFinite(value) || value <= 0) {
			toast.error("Enter the amount received");
			return;
		}
		if (!method) {
			toast.error("Choose how it was paid");
			return;
		}
		setSaving(marking.id);
		try {
			await decide({ data: {
				id: marking.id,
				decision: "paid",
				amount: value,
				currency,
				method
			} });
			toast.success("Marked paid — the student's plan is now active");
			setMarking(null);
			await load();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setSaving(null);
		}
	};
	const cancel = async (id) => {
		if (!window.confirm("Cancel this enrolment request?")) return;
		setSaving(id);
		try {
			await decide({ data: {
				id,
				decision: "cancel"
			} });
			toast.success("Enrolment request cancelled");
			await load();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setSaving(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-bold",
				children: "Payments to confirm"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Paid plans only open once payment is confirmed. Card payments confirm automatically, even when the student closes the payment page, and unpaid card checkouts get one reminder email. WhatsApp and email requests are emailed a Flutterwave pay link after an hour and a reminder two days later, and are cancelled 14 days after the link if still unpaid. Mark bank and cash payments here once the money arrives; that also switches the pay link off."
			})] }),
			busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No payments waiting."
			}) : rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-4 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-semibold",
							children: [
								r.student_name,
								" · ",
								r.plan_name
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground break-all",
							children: [
								r.faculty_id,
								" · ",
								[r.student_email, r.student_phone].filter(Boolean).join(" · "),
								" · ",
								new Date(r.created_at).toLocaleDateString()
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								r.pay_link_url ? `WhatsApp / email request · pay link (${r.currency} ${r.amount_due}) ${r.pay_link_sent_at ? `emailed ${new Date(r.pay_link_sent_at).toLocaleDateString()}` : "not emailed (no email address)"}` : r.tx_ref ? `Card checkout started (${r.currency} ${r.amount_due}) — not confirmed by Flutterwave` : "WhatsApp / email request",
								r.coupon_code ? ` · code ${r.coupon_code}` : "",
								r.payment_reminder_sent_at ? ` · reminder emailed ${new Date(r.payment_reminder_sent_at).toLocaleDateString()}` : "",
								r.pay_link_reminder_sent_at ? ` · reminder emailed ${new Date(r.pay_link_reminder_sent_at).toLocaleDateString()}` : "",
								r.pay_link_created_at ? ` · cancels ${new Date(Date.parse(r.pay_link_created_at) + 12096e5).toLocaleDateString()} if unpaid` : "",
								r.pay_link_skipped_reason ? ` · no pay link: ${r.pay_link_skipped_reason}` : ""
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						r.pay_link_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => navigator.clipboard.writeText(r.pay_link_url).then(() => toast.success("Pay link copied")),
							children: "Copy pay link"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							disabled: saving === r.id,
							onClick: () => openMarkPaid(r),
							children: "Mark paid"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							disabled: saving === r.id,
							onClick: () => cancel(r.id),
							children: [saving === r.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Cancel"]
						})
					]
				})]
			}) }, r.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!marking,
				onOpenChange: (open) => {
					if (!open && !saving) setMarking(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Mark paid" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [marking ? `${marking.student_name} · ${marking.plan_name}. ` : "", "Record what came in so it counts as revenue on the dashboard."] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "paid-amount",
									children: "Amount received"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: currency,
										onValueChange: (v) => setCurrency(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "w-24",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "NGN",
											children: "NGN"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "USD",
											children: "USD"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "paid-amount",
										inputMode: "decimal",
										placeholder: "e.g. 100000",
										value: amount,
										onChange: (e) => setAmount(e.target.value)
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "paid-method",
									children: "Paid by"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: method,
									onValueChange: (v) => setMethod(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "paid-method",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose how it was paid" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: m.value,
										children: m.label
									}, m.value)) })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							disabled: !!saving,
							onClick: () => setMarking(null),
							children: "Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							disabled: !!saving,
							onClick: markPaid,
							children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Mark paid"]
						})] })
					]
				})
			})
		]
	});
}
var money = (currency, amount) => `${currency === "USD" ? "$" : "₦"}${Number(amount ?? 0).toLocaleString()}`;
/**
* Admin list of instalment plans with a balance left. Students are emailed a
* pay link 7 days before the due date, the day before, and once when overdue.
* Card balances clear on their own when the student pays from their dashboard
* or that link; mark bank, cash or WhatsApp payments here. Hidden while nobody owes anything.
*/
function OutstandingBalances() {
	const list = useServerFn(listOutstandingBalances);
	const markPaid = useServerFn(markBalancePaid);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [saving, setSaving] = (0, import_react.useState)(null);
	const load = async () => {
		try {
			setRows(await list());
		} catch (e) {
			toast.error(e.message);
		}
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const mark = async (r) => {
		if (!window.confirm(`Mark the ${money(r.currency, r.balance_due)} balance from ${r.student_name} as received by bank transfer?`)) return;
		setSaving(r.id);
		try {
			await markPaid({ data: {
				id: r.id,
				method: "bank"
			} });
			toast.success("Balance marked paid");
			await load();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setSaving(null);
		}
	};
	if (rows.length === 0) return null;
	const today = lagosToday();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xl font-bold",
			children: "Instalment balances"
		}), rows.map((r) => {
			const overdue = r.balance_due_by != null && r.balance_due_by < today;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-4 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-semibold",
							children: [
								r.student_name,
								" · ",
								r.plan_name
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground break-all",
							children: [
								r.faculty_id,
								r.student_email,
								r.student_phone
							].filter(Boolean).join(" · ")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Paid ",
								money(r.currency, r.amount_due),
								" of",
								" ",
								money(r.currency, r.instalment_total),
								" ·",
								" ",
								money(r.currency, r.balance_due),
								" left",
								r.balance_due_by ? ` · due ${formatDay(r.balance_due_by)}` : "",
								r.last_reminder ? ` · reminded ${r.last_reminder}` : ""
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [overdue && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "destructive",
						children: "Overdue"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						disabled: saving === r.id,
						onClick: () => mark(r),
						children: [saving === r.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Mark received"]
					})]
				})]
			}) }, r.id);
		})]
	});
}
/** Supabase caps a select at 1,000 rows, so fetch page by page. */
var day = stringType().regex(/^\d{4}-\d{2}-\d{2}$/).optional();
var RangeInput = objectType({
	from: day,
	to: day
});
/** Dates are picked in Nigerian time (WAT); `to` includes the whole day. */
/** Admin: every student profile with their latest plan, for the Students CSV. */
var exportStudents = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => RangeInput.parse(d)).handler(createSsrRpc("c09772520b1584c92dc03917d0c1dfc08f517a152a9212cac7ed268faf8fc243"));
var PaymentsInput = RangeInput.extend({ status: enumType([
	"all",
	"paid",
	"pending",
	"cancelled"
]) });
/** Admin: paid-plan enrolments and their payment state, for the Payments CSV. */
var exportPayments = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => PaymentsInput.parse(d)).handler(createSsrRpc("84600e752d7e6a7733e1412e3cc40c9e3b5bb2cf1785805eb28b2f998d91fd53"));
var PAYMENT_STATUS = [
	{
		v: "all",
		label: "All payments"
	},
	{
		v: "paid",
		label: "Paid"
	},
	{
		v: "pending",
		label: "Waiting on payment"
	},
	{
		v: "cancelled",
		label: "Cancelled"
	}
];
var date = (iso) => iso ? new Date(iso).toLocaleString("en-NG") : "";
/** Admin: download students and payments as CSV, limited by date and payment status. */
function AdminExports() {
	const students = useServerFn(exportStudents);
	const payments = useServerFn(exportPayments);
	const [from, setFrom] = (0, import_react.useState)("");
	const [to, setTo] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const range = {
		from: from || void 0,
		to: to || void 0
	};
	const suffix = [from, to].some(Boolean) ? `-${from || "start"}-to-${to || "today"}` : "";
	const run = async (kind) => {
		setBusy(kind);
		try {
			if (kind === "students") {
				const rows = await students({ data: range });
				const csv = toCsv(rows, [
					{
						header: "Joined",
						value: (r) => date(r.created_at)
					},
					{
						header: "Faculty ID",
						value: (r) => r.faculty_id
					},
					{
						header: "Name",
						value: (r) => r.name
					},
					{
						header: "Email",
						value: (r) => r.email
					},
					{
						header: "Phone",
						value: (r) => r.phone
					},
					{
						header: "Department",
						value: (r) => r.department
					},
					{
						header: "Learning mode",
						value: (r) => r.learning_mode
					},
					{
						header: "Cohort",
						value: (r) => r.cohort_year ? `${r.cohort_year}-${String(r.cohort_month ?? "").padStart(2, "0")}` : ""
					},
					{
						header: "Latest plan",
						value: (r) => r.latest_plan
					},
					{
						header: "Latest plan status",
						value: (r) => r.latest_plan_status
					},
					{
						header: "Enrolments",
						value: (r) => r.enrolments
					},
					{
						header: "Joined Slack",
						value: (r) => date(r.slack_joined_at)
					}
				]);
				downloadCsv(csvFilename(`students${suffix}`), csv);
				toast.success(`Downloaded ${rows.length} student${rows.length === 1 ? "" : "s"}`);
			} else {
				const rows = await payments({ data: {
					...range,
					status
				} });
				const csv = toCsv(rows, [
					{
						header: "Started",
						value: (r) => date(r.created_at)
					},
					{
						header: "Paid at",
						value: (r) => date(r.paid_at)
					},
					{
						header: "Status",
						value: (r) => r.status
					},
					{
						header: "Method",
						value: (r) => r.method
					},
					{
						header: "Faculty ID",
						value: (r) => r.faculty_id
					},
					{
						header: "Name",
						value: (r) => r.student_name
					},
					{
						header: "Email",
						value: (r) => r.student_email
					},
					{
						header: "Phone",
						value: (r) => r.student_phone
					},
					{
						header: "Plan",
						value: (r) => r.plan_name
					},
					{
						header: "Learning mode",
						value: (r) => r.learning_mode
					},
					{
						header: "Currency",
						value: (r) => r.currency
					},
					{
						header: "Amount due",
						value: (r) => r.amount_due
					},
					{
						header: "Coupon",
						value: (r) => r.coupon_code
					},
					{
						header: "Flutterwave tx_ref",
						value: (r) => r.tx_ref
					},
					{
						header: "Payment reference",
						value: (r) => r.payment_reference
					}
				]);
				downloadCsv(csvFilename(`payments${status === "all" ? "" : `-${status}`}${suffix}`), csv);
				toast.success(`Downloaded ${rows.length} payment${rows.length === 1 ? "" : "s"}`);
			}
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xl font-bold",
			children: "Download CSV"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Opens in Excel or Google Sheets. Dates filter students by sign-up and payments by when checkout started; leave them empty for everything."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-4 space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "export-from",
						children: "From"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "export-from",
						type: "date",
						value: from,
						max: to || void 0,
						onChange: (e) => setFrom(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "export-to",
						children: "To"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "export-to",
						type: "date",
						value: to,
						min: from || void 0,
						onChange: (e) => setTo(e.target.value)
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						disabled: busy !== null,
						onClick: () => run("students"),
						children: [busy === "students" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-4 w-4" }), "Students"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: status,
						onValueChange: (v) => setStatus(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-48",
							"aria-label": "Payment status to export",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PAYMENT_STATUS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s.v,
							children: s.label
						}, s.v)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						disabled: busy !== null,
						onClick: () => run("payments"),
						children: [busy === "payments" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-4 w-4" }), "Payments"]
					})
				]
			})]
		}) })]
	});
}
var FILTERS = [
	{
		v: "submitted",
		label: "Awaiting review"
	},
	{
		v: "needs_changes",
		label: "Needs changes"
	},
	{
		v: "reviewed",
		label: "Accepted"
	},
	{
		v: "ai",
		label: "Scored by AI"
	},
	{
		v: "all",
		label: "All"
	}
];
function AdminStudents() {
	const { loading, isStaff, isAdmin } = useIsStaff();
	const list = useServerFn(listStudentWork);
	const review = useServerFn(reviewStudentWork);
	const [filter, setFilter] = (0, import_react.useState)("submitted");
	const [rows, setRows] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [drafts, setDrafts] = (0, import_react.useState)({});
	const [saving, setSaving] = (0, import_react.useState)(null);
	const load = async () => {
		setBusy(true);
		try {
			const data = await list({ data: { status: filter } });
			setRows(data);
			setDrafts(Object.fromEntries(data.map((r) => [r.id, {
				score: (r.score ?? (r.ai_status === "needs_staff" ? r.ai_score : null))?.toString() ?? "",
				note: r.reviewer_note ?? (r.ai_status === "needs_staff" ? r.ai_feedback : null) ?? ""
			}])));
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (isStaff) load();
	}, [isStaff, filter]);
	const submit = async (id, status) => {
		const d = drafts[id] ?? {
			score: "",
			note: ""
		};
		const score = d.score.trim() === "" ? null : Math.max(0, Math.min(100, parseInt(d.score, 10)));
		if (score !== null && Number.isNaN(score)) toast.error("Score must be 0–100");
		else await save(id, status, score, d.note);
	};
	const save = async (id, status, score, note) => {
		setSaving(id);
		try {
			await review({ data: {
				id,
				status,
				score,
				note
			} });
			toast.success(status === "reviewed" ? "Accepted — student notified" : "Changes requested — student notified");
			await load();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setSaving(null);
		}
	};
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
						children: "Student work review"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "The AI tutor scores each submission as it arrives and emails the student. When it isn't sure, the work waits here with its draft. Change any score or feedback below: each change emails the student and, when accepted, posts in their class group on Slack."
					})] }),
					loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : !isStaff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "This page is for Tech Faculty staff. Sign in with a staff account."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingPayments, {}),
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutstandingBalances, {}),
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminExports, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-bold pt-2",
							children: "Submissions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: filter === f.v ? "default" : "outline",
								onClick: () => setFilter(f.v),
								children: f.label
							}, f.v))
						}),
						busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Nothing here yet."
						}) : rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-semibold",
												children: [r.class_number ? `Class ${r.class_number}: ` : "", r.title]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: [
													r.student_name,
													r.student_email ? ` · ${r.student_email}` : "",
													r.student_location ? ` · ${r.student_location}` : "",
													" · ",
													r.faculty_id,
													" · ",
													r.course_name ?? "Programme",
													" · ",
													new Date(r.created_at).toLocaleDateString()
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: ["Running score: ", r.average_score != null ? `${r.average_score}% over ${r.reviewed_count} reviewed` : "not scored yet"]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: r.status === "reviewed" ? "default" : r.status === "needs_changes" ? "destructive" : "secondary",
										children: FILTERS.find((f) => f.v === r.status)?.label ?? r.status
									})]
								}),
								r.proof_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: r.proof_url,
									target: "_blank",
									rel: "noreferrer",
									className: "text-sm underline break-all",
									children: r.proof_url
								}),
								r.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm border-l-2 pl-2 text-muted-foreground",
									children: r.summary
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiNote, { r }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid sm:grid-cols-[120px_1fr] gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										max: 100,
										placeholder: "Score %",
										value: drafts[r.id]?.score ?? "",
										onChange: (e) => setDrafts((p) => ({
											...p,
											[r.id]: {
												...p[r.id] ?? { note: "" },
												score: e.target.value
											}
										}))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 2,
										maxLength: 1e3,
										placeholder: "Feedback for the student",
										value: drafts[r.id]?.note ?? "",
										onChange: (e) => setDrafts((p) => ({
											...p,
											[r.id]: {
												...p[r.id] ?? { score: "" },
												note: e.target.value
											}
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										disabled: saving === r.id,
										onClick: () => submit(r.id, "reviewed"),
										children: [saving === r.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Accept"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										disabled: saving === r.id,
										onClick: () => submit(r.id, "needs_changes"),
										children: "Needs changes"
									})]
								})
							]
						}) }, r.id))
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function AiNote({ r }) {
	const sure = r.ai_confidence != null ? ` (${Math.round(r.ai_confidence * 100)}% sure)` : "";
	if (r.reviewed_by === "ai") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				className: "mr-2",
				children: "Scored by AI"
			}),
			"The student has this score and feedback",
			sure,
			". Change it below if you disagree."
		]
	});
	if (r.reviewed_by === "staff" && r.ai_score != null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-xs text-muted-foreground",
		children: [
			"AI suggested ",
			r.ai_score,
			"%, ",
			r.ai_verdict === "reviewed" ? "accept" : "needs changes",
			sure,
			"."
		]
	});
	if (r.status !== "submitted") return null;
	if (r.ai_status === "needs_staff") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "secondary",
			className: "mr-2",
			children: "AI unsure"
		}), r.ai_score != null ? `Its draft is filled in below${sure}; check the work and save.` : "The AI couldn't score this one; please review it."]
	});
	if (r.ai_status === "pending" || r.ai_status === "running" || r.ai_status === "failed") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs text-muted-foreground",
		children: "The AI tutor is scoring this. You can review it yourself now if you like."
	});
	return null;
}
var SplitComponent = AdminStudents;
//#endregion
export { SplitComponent as component };
