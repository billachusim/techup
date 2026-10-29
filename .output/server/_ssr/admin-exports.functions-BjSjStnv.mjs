import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as createServerRpc } from "./createServerRpc-CV21YXFM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { c as objectType, i as enumType, u as stringType } from "../_libs/zod.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/admin-exports.functions-BjSjStnv.js
var FREE_PLANS = ["Bootcamp Starter", "Free Bootcamp"];
var PAGE = 1e3;
var MAX_ROWS = 5e4;
async function assertAdmin(supabase, userId) {
	const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
	if (!(data ?? []).some((r) => r.role === "admin")) throw new Error("Admins only");
}
/** Supabase caps a select at 1,000 rows, so fetch page by page. */
async function fetchAll(page) {
	const rows = [];
	for (let from = 0; from < MAX_ROWS; from += PAGE) {
		const { data, error } = await page(from, from + PAGE - 1);
		if (error) throw new Error(error.message);
		rows.push(...data ?? []);
		if (!data || data.length < PAGE) break;
	}
	return rows;
}
var day = stringType().regex(/^\d{4}-\d{2}-\d{2}$/).optional();
var RangeInput = objectType({
	from: day,
	to: day
});
/** Dates are picked in Nigerian time (WAT); `to` includes the whole day. */
function range(from, to) {
	const end = to ? /* @__PURE__ */ new Date(`${to}T00:00:00+01:00`) : null;
	end?.setUTCDate(end.getUTCDate() + 1);
	return {
		since: from ? `${from}T00:00:00+01:00` : null,
		until: end ? end.toISOString() : null
	};
}
/** Admin: every student profile with their latest plan, for the Students CSV. */
var exportStudents_createServerFn_handler = createServerRpc({
	id: "c09772520b1584c92dc03917d0c1dfc08f517a152a9212cac7ed268faf8fc243",
	name: "exportStudents",
	filename: "src/lib/admin-exports.functions.ts"
}, (opts) => exportStudents.__executeServer(opts));
var exportStudents = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => RangeInput.parse(d)).handler(exportStudents_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const { since, until } = range(data.from, data.to);
	const profiles = await fetchAll((a, b) => {
		let q = supabaseAdmin.from("profiles").select("faculty_id, name, email, phone, department, learning_mode, cohort_month, cohort_year, slack_joined_at, created_at").not("faculty_id", "is", null);
		if (since) q = q.gte("created_at", since);
		if (until) q = q.lt("created_at", until);
		return q.order("created_at", { ascending: false }).range(a, b);
	});
	const enrollments = await fetchAll((a, b) => supabaseAdmin.from("enrollments").select("faculty_id, plan_name, status, created_at").order("created_at", { ascending: false }).range(a, b));
	const byStudent = /* @__PURE__ */ new Map();
	for (const e of enrollments) {
		const list = byStudent.get(e.faculty_id) ?? [];
		list.push(e);
		byStudent.set(e.faculty_id, list);
	}
	return profiles.map((p) => {
		const plans = byStudent.get(p.faculty_id ?? "") ?? [];
		const latest = plans.find((e) => e.status !== "cancelled") ?? plans[0];
		return {
			...p,
			latest_plan: latest?.plan_name ?? null,
			latest_plan_status: latest?.status ?? null,
			enrolments: plans.length
		};
	});
});
var PaymentsInput = RangeInput.extend({ status: enumType([
	"all",
	"paid",
	"pending",
	"cancelled"
]) });
/** Admin: paid-plan enrolments and their payment state, for the Payments CSV. */
var exportPayments_createServerFn_handler = createServerRpc({
	id: "84600e752d7e6a7733e1412e3cc40c9e3b5bb2cf1785805eb28b2f998d91fd53",
	name: "exportPayments",
	filename: "src/lib/admin-exports.functions.ts"
}, (opts) => exportPayments.__executeServer(opts));
var exportPayments = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => PaymentsInput.parse(d)).handler(exportPayments_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("../_libs/_5.mjs");
	const { since, until } = range(data.from, data.to);
	const rows = await fetchAll((a, b) => {
		let q = supabaseAdmin.from("enrollments").select("id, faculty_id, plan_name, learning_mode, status, amount_due, currency, coupon_code, tx_ref, payment_reference, paid_at, created_at").not("plan_name", "in", `(${FREE_PLANS.map((p) => `"${p}"`).join(",")})`);
		if (data.status === "paid") q = q.in("status", ["active", "confirmed"]);
		else if (data.status !== "all") q = q.eq("status", data.status);
		if (since) q = q.gte("created_at", since);
		if (until) q = q.lt("created_at", until);
		return q.order("created_at", { ascending: false }).range(a, b);
	});
	const ids = [...new Set(rows.map((r) => r.faculty_id))];
	const profiles = [];
	for (let i = 0; i < ids.length; i += 200) {
		const { data: chunk, error } = await supabaseAdmin.from("profiles").select("faculty_id, name, email, phone").in("faculty_id", ids.slice(i, i + 200));
		if (error) throw new Error(error.message);
		profiles.push(...chunk ?? []);
	}
	const byId = new Map(profiles.map((p) => [p.faculty_id, p]));
	return rows.map((r) => ({
		...r,
		student_name: byId.get(r.faculty_id)?.name ?? null,
		student_email: byId.get(r.faculty_id)?.email ?? null,
		student_phone: byId.get(r.faculty_id)?.phone ?? null,
		method: r.payment_reference?.startsWith("manual:") ? "Marked paid by admin" : r.tx_ref ? "Card (Flutterwave)" : "WhatsApp / email request"
	}));
});
//#endregion
export { exportPayments_createServerFn_handler, exportStudents_createServerFn_handler };
