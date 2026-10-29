import { t as recordAdminAction } from "./admin-audit-D1orYR3x.mjs";
import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as createServerRpc } from "./createServerRpc-CV21YXFM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { a as literalType, c as objectType, i as enumType, r as discriminatedUnionType, s as numberType, u as stringType } from "../_libs/zod.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/enrollment-payments.functions-DpMB5biQ.js
async function assertAdmin(supabase, userId) {
	const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
	if (!(data ?? []).some((r) => r.role === "admin")) throw new Error("Admins only");
}
/** Admin: paid enrolments still waiting on a payment, newest first. */
var listPendingEnrollments_createServerFn_handler = createServerRpc({
	id: "cc0bf4d916218a93a9c9f5a9143935ceb2a3784c608f017a2a8e4d619e04bfed",
	name: "listPendingEnrollments",
	filename: "src/lib/enrollment-payments.functions.ts"
}, (opts) => listPendingEnrollments.__executeServer(opts));
var listPendingEnrollments = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listPendingEnrollments_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const { data: rows, error } = await supabaseAdmin.from("enrollments").select("id, faculty_id, plan_name, learning_mode, coupon_code, tx_ref, amount_due, currency, created_at, payment_reminder_sent_at, pay_link_url, pay_link_created_at, pay_link_sent_at, pay_link_reminder_sent_at, pay_link_skipped_reason").eq("status", "pending").order("created_at", { ascending: false }).limit(200);
	if (error) throw new Error(error.message);
	const ids = [...new Set((rows ?? []).map((r) => r.faculty_id))];
	const { data: profiles } = ids.length ? await supabaseAdmin.from("profiles").select("faculty_id, name, email, phone").in("faculty_id", ids) : { data: [] };
	const byId = new Map((profiles ?? []).map((p) => [p.faculty_id, p]));
	return (rows ?? []).map((r) => ({
		...r,
		student_name: byId.get(r.faculty_id)?.name || "Student",
		student_email: byId.get(r.faculty_id)?.email || null,
		student_phone: byId.get(r.faculty_id)?.phone || null
	}));
});
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
var decidePendingEnrollment_createServerFn_handler = createServerRpc({
	id: "03fbb9dac09b7d6012f1a41f40194e50be1f052cfbc6e0aa99b8d652b26d4fee",
	name: "decidePendingEnrollment",
	filename: "src/lib/enrollment-payments.functions.ts"
}, (opts) => decidePendingEnrollment.__executeServer(opts));
var decidePendingEnrollment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => DecideInput.parse(d)).handler(decidePendingEnrollment_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const update = data.decision === "paid" ? {
		status: "active",
		paid_at: (/* @__PURE__ */ new Date()).toISOString(),
		payment_reference: `manual:${context.userId}`,
		amount_paid: data.amount,
		currency: data.currency,
		payment_method: data.method
	} : { status: "cancelled" };
	const { data: row, error } = await supabaseAdmin.from("enrollments").update(update).eq("id", data.id).eq("status", "pending").select("id, faculty_id, plan_name, amount_due, currency").maybeSingle();
	if (error) throw new Error(error.message);
	if (!row) throw new Error("This enrolment is no longer pending");
	const { data: profile } = await supabaseAdmin.from("profiles").select("name").eq("faculty_id", row.faculty_id).limit(1).maybeSingle();
	await recordAdminAction(supabaseAdmin, context.userId, {
		action: data.decision === "paid" ? "payment.marked_paid" : "enrollment.cancelled",
		target_table: "enrollments",
		target_id: row.id,
		faculty_id: row.faculty_id,
		subject: profile?.name ?? null,
		details: data.decision === "paid" ? {
			from: "pending",
			to: update.status,
			plan: row.plan_name,
			amount: data.amount,
			currency: data.currency,
			method: data.method
		} : {
			from: "pending",
			to: update.status,
			plan: row.plan_name,
			amount: row.amount_due,
			currency: row.currency
		}
	});
	return { ok: true };
});
var listOutstandingBalances_createServerFn_handler = createServerRpc({
	id: "d2d666383c7e3d52a3e6ea8994f27ab8dca6baa1d438bd58a675d4b630dcf809",
	name: "listOutstandingBalances",
	filename: "src/lib/enrollment-payments.functions.ts"
}, (opts) => listOutstandingBalances.__executeServer(opts));
var listOutstandingBalances = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listOutstandingBalances_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const { data: rows, error } = await supabaseAdmin.from("enrollments").select("id, faculty_id, plan_name, amount_due, instalment_total, balance_due, balance_due_by, currency, paid_at").in("status", ["active", "confirmed"]).gt("balance_due", 0).order("balance_due_by", { ascending: true }).limit(200);
	if (error) throw new Error(error.message);
	const ids = [...new Set((rows ?? []).map((r) => r.faculty_id))];
	const { data: profiles } = ids.length ? await supabaseAdmin.from("profiles").select("faculty_id, name, email, phone").in("faculty_id", ids) : { data: [] };
	const byId = new Map((profiles ?? []).map((p) => [p.faculty_id, p]));
	const { data: reminders } = rows?.length ? await supabaseAdmin.from("balance_reminders").select("enrollment_id, due_soon_sent_at, due_tomorrow_sent_at, overdue_sent_at").in("enrollment_id", rows.map((r) => r.id)) : { data: [] };
	const remindedById = new Map((reminders ?? []).map((r) => [r.enrollment_id, r]));
	return (rows ?? []).map((r) => {
		const sent = remindedById.get(r.id);
		return {
			...r,
			student_name: byId.get(r.faculty_id)?.name || "Student",
			student_email: byId.get(r.faculty_id)?.email || null,
			student_phone: byId.get(r.faculty_id)?.phone || null,
			last_reminder: sent?.overdue_sent_at ? "overdue" : sent?.due_tomorrow_sent_at ? "day before" : sent?.due_soon_sent_at ? "7 days before" : null
		};
	});
});
var markBalancePaid_createServerFn_handler = createServerRpc({
	id: "b53000212ad46f197af90231484b2d44775fc2f89376b7b5a5541ea3af0338a9",
	name: "markBalancePaid",
	filename: "src/lib/enrollment-payments.functions.ts"
}, (opts) => markBalancePaid.__executeServer(opts));
var markBalancePaid = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	method: enumType(PAYMENT_METHODS)
}).parse(d)).handler(markBalancePaid_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const { data: plan, error: readErr } = await supabaseAdmin.from("enrollments").select("id, faculty_id, plan_name, instalment_total, balance_due, currency").eq("id", data.id).gt("balance_due", 0).maybeSingle();
	if (readErr) throw new Error(readErr.message);
	if (!plan) throw new Error("This plan has no balance left to pay");
	const { error } = await supabaseAdmin.from("enrollments").update({
		balance_due: 0,
		balance_paid_at: (/* @__PURE__ */ new Date()).toISOString(),
		amount_paid: plan.instalment_total
	}).eq("id", plan.id);
	if (error) throw new Error(error.message);
	const { data: profile } = await supabaseAdmin.from("profiles").select("name").eq("faculty_id", plan.faculty_id).limit(1).maybeSingle();
	await recordAdminAction(supabaseAdmin, context.userId, {
		action: "payment.balance_marked_paid",
		target_table: "enrollments",
		target_id: plan.id,
		faculty_id: plan.faculty_id,
		subject: profile?.name ?? null,
		details: {
			plan: plan.plan_name,
			amount: plan.balance_due,
			currency: plan.currency,
			method: data.method
		}
	});
	return { ok: true };
});
//#endregion
export { decidePendingEnrollment_createServerFn_handler, listOutstandingBalances_createServerFn_handler, listPendingEnrollments_createServerFn_handler, markBalancePaid_createServerFn_handler };
