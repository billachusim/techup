import { t as supabaseAdmin } from "./client.server-KzwUIAkW.mjs";
import { t as sendTemplateEmail } from "./send-email-eDgP-isb.mjs";
import { n as lagosToday, t as formatDay } from "./dates-Sj88MuGL.mjs";
import { t as accessEnrollment } from "./enrollment-access-BaRzVf28.mjs";
import { r as successKitDownloadPath, t as PRODUCTS } from "./products-Dwo_SXcO.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/payment-followups.server-BlnULWEU.js
var DAY$2 = 864e5;
var PAY_LINK_REMIND_AFTER = 2 * DAY$2;
var CANCEL_AFTER_DAYS = 14;
var KINDS = {
	link: {
		column: "pay_link_sent_at",
		template: "pay-link",
		action: "payment.pay_link_emailed"
	},
	reminder: {
		column: "pay_link_reminder_sent_at",
		template: "pay-link",
		action: "payment.pay_link_reminded"
	},
	cancelled: {
		column: "cancel_email_sent_at",
		template: "pay-link-cancelled",
		action: "enrollment.auto_cancel_emailed"
	}
};
var stamp = (column, value) => ({ [column]: value });
var COLUMNS = "id, faculty_id, plan_name, amount_due, currency, pay_link_url, pay_link_created_at";
function formatAmount$1(amount, currency) {
	if (amount == null) return void 0;
	return currency === "USD" ? `$${amount.toLocaleString("en-US")}` : `₦${amount.toLocaleString("en-NG")}`;
}
function cancelDate(createdAt) {
	if (!createdAt) return void 0;
	return new Date(Date.parse(createdAt) + CANCEL_AFTER_DAYS * DAY$2).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		timeZone: "Africa/Lagos"
	});
}
async function sendAll(db, send, rows, kind) {
	if (!rows.length) return 0;
	const { data: profiles } = await db.from("profiles").select("faculty_id, name, email").in("faculty_id", [...new Set(rows.map((r) => r.faculty_id))]);
	const byId = new Map((profiles ?? []).map((p) => [p.faculty_id, p]));
	let sent = 0;
	for (const row of rows) {
		const profile = byId.get(row.faculty_id);
		if (!profile?.email) continue;
		const { data: claimed } = await db.from("enrollments").update(stamp(kind.column, (/* @__PURE__ */ new Date()).toISOString())).eq("id", row.id).is(kind.column, null).select("id").maybeSingle();
		if (!claimed) continue;
		try {
			await send(kind.template, profile.email, {
				templateData: {
					name: profile.name,
					plan: row.plan_name,
					amount: formatAmount$1(row.amount_due, row.currency),
					payUrl: row.pay_link_url,
					cancelOn: cancelDate(row.pay_link_created_at),
					reminder: kind === KINDS.reminder
				},
				idempotencyKey: `${kind.column}-${row.id}`
			});
			sent++;
		} catch (e) {
			console.error(`${kind.template} email failed`, row.id, e.message);
			await db.from("enrollments").update(stamp(kind.column, null)).eq("id", row.id);
			continue;
		}
		const { error } = await db.from("admin_audit_log").insert({
			action: kind.action,
			actor_email: "automation",
			target_table: "enrollments",
			target_id: row.id,
			faculty_id: row.faculty_id,
			subject: profile.name,
			details: {
				plan: row.plan_name,
				amount: row.amount_due,
				currency: row.currency
			}
		});
		if (error) console.error("Couldn't write admin audit log", error.message);
	}
	return sent;
}
async function runPayLinkFollowups(db, send, now = Date.now()) {
	const pending = () => db.from("enrollments").select(COLUMNS).eq("status", "pending").not("pay_link_url", "is", null).limit(100);
	const [links, reminders, cancelled] = await Promise.all([
		pending().is("pay_link_sent_at", null),
		pending().is("pay_link_reminder_sent_at", null).lte("pay_link_sent_at", (/* @__PURE__ */ new Date(now - PAY_LINK_REMIND_AFTER)).toISOString()),
		db.from("enrollments").select(COLUMNS).eq("status", "cancelled").not("auto_cancelled_at", "is", null).is("cancel_email_sent_at", null).limit(100)
	]);
	const failed = links.error ?? reminders.error ?? cancelled.error;
	if (failed) {
		console.error("pay link emails skipped", failed.message);
		return {
			payLinksSent: 0,
			payLinkRemindersSent: 0,
			cancelNoticesSent: 0
		};
	}
	return {
		payLinksSent: await sendAll(db, send, links.data ?? [], KINDS.link),
		payLinkRemindersSent: await sendAll(db, send, reminders.data ?? [], KINDS.reminder),
		cancelNoticesSent: await sendAll(db, send, cancelled.data ?? [], KINDS.cancelled)
	};
}
var STAGE_COLUMN = {
	due_soon: "due_soon_sent_at",
	due_tomorrow: "due_tomorrow_sent_at",
	overdue: "overdue_sent_at"
};
var DAY$1 = 864e5;
/** Whole days from `today` to `dueBy`, both YYYY-MM-DD (negative once it has passed). */
function daysUntil(dueBy, today) {
	return Math.round((Date.parse(`${dueBy}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / DAY$1);
}
/**
* The reminder due today, or null. Only the latest stage counts: a plan first
* seen two days before its due date skips "due soon" and gets "due tomorrow" on
* its day. Each stage is sent at most once.
*/
function dueReminder(dueBy, today, sent) {
	const days = daysUntil(dueBy, today);
	let stage = null;
	if (days < 0) stage = -days <= 14 ? "overdue" : null;
	else if (days <= 1) stage = "due_tomorrow";
	else if (days <= 7) stage = "due_soon";
	if (!stage || sent[STAGE_COLUMN[stage]]) return null;
	return stage;
}
/** Hour of the day in Lagos, 0-23. */
var lagosHour = (now = /* @__PURE__ */ new Date()) => Number(new Intl.DateTimeFormat("en-GB", {
	timeZone: "Africa/Lagos",
	hour: "2-digit",
	hourCycle: "h23"
}).format(now));
/** Reminders go out 08:00-20:00 Lagos time only. */
var inSendingHours = (now = /* @__PURE__ */ new Date()) => {
	const h = lagosHour(now);
	return h >= 8 && h < 20;
};
var payBalancePath = (token) => `/pay-balance?t=${encodeURIComponent(token)}`;
var SITE = "https://techfaculty.ng";
var HOUR = 36e5;
var DAY = 24 * HOUR;
var REMIND_AFTER = HOUR;
var REMIND_UNTIL = 7 * DAY;
var REMIND_GAP = 7 * DAY;
async function profilesByFacultyId(ids) {
	if (!ids.length) return /* @__PURE__ */ new Map();
	const { data } = await supabaseAdmin.from("profiles").select("faculty_id, name, email").in("faculty_id", ids);
	return new Map((data ?? []).map((p) => [p.faculty_id, p]));
}
function formatAmount(amount, currency) {
	if (amount == null) return void 0;
	return currency === "USD" ? `$${amount.toLocaleString("en-US")}` : `₦${amount.toLocaleString("en-NG")}`;
}
async function sendConfirmations() {
	const { data: rows, error } = await supabaseAdmin.from("enrollments").select("id, faculty_id, plan_name").eq("status", "active").not("recovered_at", "is", null).is("recovered_email_sent_at", null).limit(100);
	if (error) throw new Error(error.message);
	const profiles = await profilesByFacultyId([...new Set((rows ?? []).map((r) => r.faculty_id))]);
	let sent = 0;
	for (const row of rows ?? []) {
		const profile = profiles.get(row.faculty_id);
		const { data: claimed } = await supabaseAdmin.from("enrollments").update({ recovered_email_sent_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", row.id).is("recovered_email_sent_at", null).select("id").maybeSingle();
		if (!claimed || !profile?.email) continue;
		try {
			await sendTemplateEmail("payment-confirmed", profile.email, {
				templateData: {
					name: profile.name,
					plan: row.plan_name,
					facultyId: row.faculty_id
				},
				idempotencyKey: `payment-confirmed-${row.id}`
			});
			sent++;
		} catch (e) {
			console.error("payment-confirmed email failed", row.id, e.message);
			await supabaseAdmin.from("enrollments").update({ recovered_email_sent_at: null }).eq("id", row.id);
		}
	}
	return sent;
}
async function sendReminders() {
	const now = Date.now();
	const { data: due, error } = await supabaseAdmin.from("enrollments").select("id, faculty_id, plan_name, amount_due, currency").eq("status", "pending").not("tx_ref", "is", null).is("payment_reminder_sent_at", null).is("pay_link_created_at", null).lte("created_at", (/* @__PURE__ */ new Date(now - REMIND_AFTER)).toISOString()).gte("created_at", (/* @__PURE__ */ new Date(now - REMIND_UNTIL)).toISOString()).order("created_at", { ascending: false }).limit(100);
	if (error) throw new Error(error.message);
	const facultyIds = [...new Set((due ?? []).map((r) => r.faculty_id))];
	if (!facultyIds.length) return 0;
	const [{ data: history }, profiles] = await Promise.all([supabaseAdmin.from("enrollments").select("faculty_id, plan_name, status, payment_reminder_sent_at").in("faculty_id", facultyIds).order("created_at", { ascending: false }), profilesByFacultyId(facultyIds)]);
	let sent = 0;
	for (const facultyId of facultyIds) {
		const rows = (history ?? []).filter((r) => r.faculty_id === facultyId);
		if (accessEnrollment(rows)) continue;
		if (now - Math.max(0, ...rows.map((r) => r.payment_reminder_sent_at ? Date.parse(r.payment_reminder_sent_at) : 0)) < REMIND_GAP) continue;
		const profile = profiles.get(facultyId);
		if (!profile?.email) continue;
		const theirs = (due ?? []).filter((r) => r.faculty_id === facultyId);
		const latest = theirs[0];
		const { data: claimed } = await supabaseAdmin.from("enrollments").update({ payment_reminder_sent_at: (/* @__PURE__ */ new Date()).toISOString() }).in("id", theirs.map((r) => r.id)).is("payment_reminder_sent_at", null).select("id");
		if (!(claimed ?? []).some((r) => r.id === latest.id)) continue;
		try {
			await sendTemplateEmail("checkout-reminder", profile.email, {
				templateData: {
					name: profile.name,
					plan: latest.plan_name,
					amount: formatAmount(latest.amount_due, latest.currency)
				},
				idempotencyKey: `checkout-reminder-${latest.id}`
			});
			sent++;
		} catch (e) {
			console.error("checkout-reminder email failed", latest.id, e.message);
			await supabaseAdmin.from("enrollments").update({ payment_reminder_sent_at: null }).in("id", (claimed ?? []).map((r) => r.id));
		}
	}
	return sent;
}
var orderProducts = (order) => order.items.filter((id) => id in PRODUCTS).map((id) => PRODUCTS[id]);
/** Claims `column` on one order; true only for the call that claimed it. */
async function claimOrder(id, column) {
	const { data } = await supabaseAdmin.from("product_orders").update(column === "buyer_email_sent_at" ? { buyer_email_sent_at: (/* @__PURE__ */ new Date()).toISOString() } : { admin_email_sent_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id).is(column, null).select("id").maybeSingle();
	return Boolean(data);
}
async function sendOrderEmails() {
	const { data: rows, error } = await supabaseAdmin.from("product_orders").select("id, tx_ref, items, amount_due, currency, name, email, phone, school, notes, payment_reference, buyer_email_sent_at, admin_email_sent_at").eq("status", "paid").or("buyer_email_sent_at.is.null,admin_email_sent_at.is.null").limit(100);
	if (error) {
		console.error("order emails skipped", error.message);
		return {
			receiptsSent: 0,
			staffAlertsSent: 0
		};
	}
	let receiptsSent = 0;
	let staffAlertsSent = 0;
	for (const row of rows ?? []) {
		const order = row;
		const products = orderProducts(order);
		const amount = formatAmount(order.amount_due, order.currency);
		if (!order.buyer_email_sent_at && await claimOrder(order.id, "buyer_email_sent_at")) try {
			await sendTemplateEmail("order-confirmed", order.email, {
				templateData: {
					name: order.name,
					amount,
					reference: order.payment_reference,
					steps: products.map((p) => ({
						item: p.name,
						next: p.nextStep
					})),
					downloadUrl: products.some((p) => p.id === "success_kit") ? `${SITE}${successKitDownloadPath(order.tx_ref)}` : void 0
				},
				idempotencyKey: `order-confirmed-${order.id}`
			});
			receiptsSent++;
		} catch (e) {
			console.error("order-confirmed email failed", order.id, e.message);
			await supabaseAdmin.from("product_orders").update({ buyer_email_sent_at: null }).eq("id", order.id);
		}
		if (!order.admin_email_sent_at && await claimOrder(order.id, "admin_email_sent_at")) try {
			await sendTemplateEmail("order-paid-admin", "nachusim@gmail.com", {
				templateData: {
					name: order.name ?? void 0,
					email: order.email,
					phone: order.phone ?? void 0,
					school: order.school ?? void 0,
					items: products.map((p) => p.name).join(" + "),
					amount,
					notes: order.notes ?? void 0,
					reference: order.payment_reference ?? void 0
				},
				idempotencyKey: `order-paid-admin-${order.id}`
			});
			staffAlertsSent++;
		} catch (e) {
			console.error("order-paid-admin email failed", order.id, e.message);
			await supabaseAdmin.from("product_orders").update({ admin_email_sent_at: null }).eq("id", order.id);
		}
	}
	return {
		receiptsSent,
		staffAlertsSent
	};
}
var automationLog = (entry) => supabaseAdmin.from("admin_audit_log").insert({
	...entry,
	details: entry.details,
	actor_email: "automation",
	target_table: "enrollments"
}).then(({ error }) => {
	if (error) console.error("Couldn't write admin audit log", error.message);
});
async function sendBalanceReminders(now = /* @__PURE__ */ new Date()) {
	if (!inSendingHours(now)) return 0;
	const today = lagosToday(now);
	const { data: plans, error } = await supabaseAdmin.from("enrollments").select("id, faculty_id, plan_name, balance_due, balance_due_by, currency").in("status", ["active", "confirmed"]).gt("balance_due", 0).not("balance_due_by", "is", null).order("balance_due_by", { ascending: true }).limit(200);
	if (error) throw new Error(error.message);
	const due = (plans ?? []).filter((p) => dueReminder(p.balance_due_by, today, {}) !== null);
	if (!due.length) return 0;
	const { error: seedErr } = await supabaseAdmin.from("balance_reminders").upsert(due.map((p) => ({ enrollment_id: p.id })), {
		onConflict: "enrollment_id",
		ignoreDuplicates: true
	});
	if (seedErr) {
		console.error("balance reminders skipped", seedErr.message);
		return 0;
	}
	const ids = due.map((p) => p.id);
	const [{ data: reminders }, { data: inFlight }, profiles] = await Promise.all([
		supabaseAdmin.from("balance_reminders").select("*").in("enrollment_id", ids),
		supabaseAdmin.from("enrollment_payments").select("enrollment_id").in("enrollment_id", ids).eq("status", "pending").gte("created_at", (/* @__PURE__ */ new Date(now.getTime() - HOUR)).toISOString()),
		profilesByFacultyId([...new Set(due.map((p) => p.faculty_id))])
	]);
	const byPlan = new Map((reminders ?? []).map((r) => [r.enrollment_id, r]));
	const paying = new Set((inFlight ?? []).map((r) => r.enrollment_id));
	let sent = 0;
	for (const plan of due) {
		const reminder = byPlan.get(plan.id);
		const profile = profiles.get(plan.faculty_id);
		if (!reminder || !profile?.email || paying.has(plan.id)) continue;
		const stage = dueReminder(plan.balance_due_by, today, reminder);
		if (!stage) continue;
		const column = STAGE_COLUMN[stage];
		const { data: claimed } = await supabaseAdmin.from("balance_reminders").update({ [column]: now.toISOString() }).eq("enrollment_id", plan.id).is(column, null).select("enrollment_id").maybeSingle();
		if (!claimed) continue;
		const amount = formatAmount(Number(plan.balance_due), plan.currency);
		try {
			await sendTemplateEmail("balance-reminder", profile.email, {
				templateData: {
					name: profile.name,
					plan: plan.plan_name,
					amount,
					dueDate: formatDay(plan.balance_due_by),
					stage,
					payUrl: `${SITE}${payBalancePath(reminder.pay_token)}`
				},
				idempotencyKey: `balance-reminder-${stage}-${plan.id}`
			});
			sent++;
		} catch (e) {
			console.error("balance-reminder email failed", plan.id, e.message);
			await supabaseAdmin.from("balance_reminders").update({ [column]: null }).eq("enrollment_id", plan.id);
			continue;
		}
		await automationLog({
			action: "payment.balance_reminder_sent",
			target_id: plan.id,
			faculty_id: plan.faculty_id,
			subject: profile.name,
			details: {
				stage,
				plan: plan.plan_name,
				amount: plan.balance_due,
				currency: plan.currency,
				due_by: plan.balance_due_by
			}
		});
	}
	return sent;
}
async function sendBalanceReceipts(now = /* @__PURE__ */ new Date()) {
	const { data: payments, error } = await supabaseAdmin.from("enrollment_payments").select("id, enrollment_id, amount, currency, payment_reference").eq("status", "paid").is("receipt_sent_at", null).gte("paid_at", (/* @__PURE__ */ new Date(now.getTime() - 3 * DAY)).toISOString()).limit(100);
	if (error) {
		console.error("balance receipts skipped", error.message);
		return 0;
	}
	if (!payments?.length) return 0;
	const { data: plans } = await supabaseAdmin.from("enrollments").select("id, faculty_id, plan_name").in("id", [...new Set(payments.map((p) => p.enrollment_id))]);
	const planById = new Map((plans ?? []).map((p) => [p.id, p]));
	const profiles = await profilesByFacultyId([...new Set((plans ?? []).map((p) => p.faculty_id))]);
	let sent = 0;
	for (const payment of payments) {
		const plan = planById.get(payment.enrollment_id);
		if (!plan) continue;
		const { data: claimed } = await supabaseAdmin.from("enrollment_payments").update({ receipt_sent_at: now.toISOString() }).eq("id", payment.id).is("receipt_sent_at", null).select("id").maybeSingle();
		if (!claimed) continue;
		const profile = profiles.get(plan.faculty_id);
		await automationLog({
			action: "payment.balance_paid_online",
			target_id: plan.id,
			faculty_id: plan.faculty_id,
			subject: profile?.name ?? null,
			details: {
				plan: plan.plan_name,
				amount: payment.amount,
				currency: payment.currency,
				reference: payment.payment_reference
			}
		});
		if (!profile?.email) continue;
		try {
			await sendTemplateEmail("balance-paid", profile.email, {
				templateData: {
					name: profile.name,
					plan: plan.plan_name,
					amount: formatAmount(Number(payment.amount), payment.currency),
					reference: payment.payment_reference
				},
				idempotencyKey: `balance-paid-${payment.id}`
			});
			sent++;
		} catch (e) {
			console.error("balance-paid email failed", payment.id, e.message);
		}
	}
	return sent;
}
async function runPaymentFollowups() {
	const confirmationsSent = await sendConfirmations();
	const remindersSent = await sendReminders();
	const orders = await sendOrderEmails();
	const payLinks = await runPayLinkFollowups(supabaseAdmin, sendTemplateEmail);
	const balanceRemindersSent = await sendBalanceReminders();
	const balanceReceiptsSent = await sendBalanceReceipts();
	return {
		confirmationsSent,
		remindersSent,
		...orders,
		...payLinks,
		balanceRemindersSent,
		balanceReceiptsSent
	};
}
//#endregion
export { runPaymentFollowups };
