// Follow-up emails for card checkouts, sent when the recover-checkouts edge
// function calls /api/payment-followups after re-checking Flutterwave:
// - "payment confirmed" for payments that re-check confirmed (the student
//   left before the payment page could tell them), and
// - one "finish your enrolment" reminder for checkouts still unpaid.
// - the pay link emails for WhatsApp / bank requests (pay-link-followups.server.ts).
// - a receipt to the buyer and a "new paid order" email to staff for each
//   online order (Virtual SIWES, logbook service, Success Kit) once it is paid.
// - instalment balance reminders with a pay link (7 days before the due date,
//   the day before, and once when overdue), and a receipt once a balance is
//   paid online. Both are logged on /admin/activity as "automation".
// Everything is driven by enrolment and order rows and each email is claimed
// on its row before sending, so extra calls never send an email twice.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";
import { runPayLinkFollowups } from "@/lib/pay-link-followups.server";
import { accessEnrollment } from "../../supabase/functions/_shared/enrollment-access.ts";
import { PRODUCTS, successKitDownloadPath, type ProductId } from "../../supabase/functions/_shared/products.ts";
import { STAGE_COLUMN, dueReminder, inSendingHours, payBalancePath } from "@/lib/balance-reminders";
import { formatDay, lagosToday } from "@/lib/dates";
import type { Database, Json } from "@/integrations/supabase/types";

type ReminderUpdate = Database["public"]["Tables"]["balance_reminders"]["Update"];

const SITE = "https://techfaculty.ng";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
// Give the student an hour to finish on their own, and stop after a week.
const REMIND_AFTER = HOUR;
const REMIND_UNTIL = 7 * DAY;
// At most one reminder per student in this window, however many checkouts they start.
const REMIND_GAP = 7 * DAY;

type Profile = { faculty_id: string | null; name: string | null; email: string | null };

async function profilesByFacultyId(ids: string[]) {
  if (!ids.length) return new Map<string, Profile>();
  const { data } = await supabaseAdmin.from("profiles").select("faculty_id, name, email").in("faculty_id", ids);
  return new Map((data ?? []).map((p) => [p.faculty_id as string, p as Profile]));
}

function formatAmount(amount: number | null, currency: string | null) {
  if (amount == null) return undefined;
  return currency === "USD" ? `$${amount.toLocaleString("en-US")}` : `₦${amount.toLocaleString("en-NG")}`;
}

async function sendConfirmations() {
  const { data: rows, error } = await supabaseAdmin
    .from("enrollments")
    .select("id, faculty_id, plan_name")
    .eq("status", "active")
    .not("recovered_at", "is", null)
    .is("recovered_email_sent_at", null)
    .limit(100);
  if (error) throw new Error(error.message);
  const profiles = await profilesByFacultyId([...new Set((rows ?? []).map((r) => r.faculty_id))]);

  let sent = 0;
  for (const row of rows ?? []) {
    const profile = profiles.get(row.faculty_id);
    const { data: claimed } = await supabaseAdmin
      .from("enrollments")
      .update({ recovered_email_sent_at: new Date().toISOString() })
      .eq("id", row.id)
      .is("recovered_email_sent_at", null)
      .select("id")
      .maybeSingle();
    if (!claimed || !profile?.email) continue;
    try {
      await sendTemplateEmail("payment-confirmed", profile.email, {
        templateData: { name: profile.name, plan: row.plan_name, facultyId: row.faculty_id },
        idempotencyKey: `payment-confirmed-${row.id}`,
      });
      sent++;
    } catch (e) {
      console.error("payment-confirmed email failed", row.id, (e as Error).message);
      await supabaseAdmin.from("enrollments").update({ recovered_email_sent_at: null }).eq("id", row.id);
    }
  }
  return sent;
}

async function sendReminders() {
  const now = Date.now();
  const { data: due, error } = await supabaseAdmin
    .from("enrollments")
    .select("id, faculty_id, plan_name, amount_due, currency")
    .eq("status", "pending")
    .not("tx_ref", "is", null)
    .is("payment_reminder_sent_at", null)
    // WhatsApp / bank requests with a pay link get their own reminder.
    .is("pay_link_created_at", null)
    .lte("created_at", new Date(now - REMIND_AFTER).toISOString())
    .gte("created_at", new Date(now - REMIND_UNTIL).toISOString())
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);

  const facultyIds = [...new Set((due ?? []).map((r) => r.faculty_id))];
  if (!facultyIds.length) return 0;
  const [{ data: history }, profiles] = await Promise.all([
    supabaseAdmin
      .from("enrollments")
      .select("faculty_id, plan_name, status, payment_reminder_sent_at")
      .in("faculty_id", facultyIds)
      .order("created_at", { ascending: false }),
    profilesByFacultyId(facultyIds),
  ]);

  let sent = 0;
  for (const facultyId of facultyIds) {
    const rows = (history ?? []).filter((r) => r.faculty_id === facultyId);
    // Already has a paid-up plan (paid another way, or a later checkout went through).
    if (accessEnrollment(rows)) continue;
    const lastReminder = Math.max(0, ...rows.map((r) => (r.payment_reminder_sent_at ? Date.parse(r.payment_reminder_sent_at) : 0)));
    if (now - lastReminder < REMIND_GAP) continue;
    const profile = profiles.get(facultyId);
    if (!profile?.email) continue;

    // Newest unpaid checkout first; claim all of this student's due rows at once.
    const theirs = (due ?? []).filter((r) => r.faculty_id === facultyId);
    const latest = theirs[0];
    const { data: claimed } = await supabaseAdmin
      .from("enrollments")
      .update({ payment_reminder_sent_at: new Date().toISOString() })
      .in("id", theirs.map((r) => r.id))
      .is("payment_reminder_sent_at", null)
      .select("id");
    if (!(claimed ?? []).some((r) => r.id === latest.id)) continue;
    try {
      await sendTemplateEmail("checkout-reminder", profile.email, {
        templateData: { name: profile.name, plan: latest.plan_name, amount: formatAmount(latest.amount_due, latest.currency) },
        idempotencyKey: `checkout-reminder-${latest.id}`,
      });
      sent++;
    } catch (e) {
      console.error("checkout-reminder email failed", latest.id, (e as Error).message);
      await supabaseAdmin
        .from("enrollments")
        .update({ payment_reminder_sent_at: null })
        .in("id", (claimed ?? []).map((r) => r.id));
    }
  }
  return sent;
}

type PaidOrder = {
  id: string;
  items: string[];
  amount_due: number;
  currency: string;
  name: string | null;
  email: string;
  phone: string | null;
  school: string | null;
  notes: string | null;
  payment_reference: string | null;
  tx_ref: string;
};

const orderProducts = (order: PaidOrder) =>
  order.items.filter((id): id is ProductId => id in PRODUCTS).map((id) => PRODUCTS[id]);

/** Claims `column` on one order; true only for the call that claimed it. */
async function claimOrder(id: string, column: "buyer_email_sent_at" | "admin_email_sent_at") {
  const { data } = await supabaseAdmin
    .from("product_orders")
    .update(column === "buyer_email_sent_at" ? { buyer_email_sent_at: new Date().toISOString() } : { admin_email_sent_at: new Date().toISOString() })
    .eq("id", id)
    .is(column, null)
    .select("id")
    .maybeSingle();
  return Boolean(data);
}

async function sendOrderEmails() {
  const { data: rows, error } = await supabaseAdmin
    .from("product_orders")
    .select("id, tx_ref, items, amount_due, currency, name, email, phone, school, notes, payment_reference, buyer_email_sent_at, admin_email_sent_at")
    .eq("status", "paid")
    .or("buyer_email_sent_at.is.null,admin_email_sent_at.is.null")
    .limit(100);
  // The table only exists once the online-orders migration has been run.
  if (error) {
    console.error("order emails skipped", error.message);
    return { receiptsSent: 0, staffAlertsSent: 0 };
  }

  let receiptsSent = 0;
  let staffAlertsSent = 0;
  for (const row of rows ?? []) {
    const order = row as PaidOrder & { buyer_email_sent_at: string | null; admin_email_sent_at: string | null };
    const products = orderProducts(order);
    const amount = formatAmount(order.amount_due, order.currency);

    if (!order.buyer_email_sent_at && (await claimOrder(order.id, "buyer_email_sent_at"))) {
      try {
        await sendTemplateEmail("order-confirmed", order.email, {
          templateData: {
            name: order.name,
            amount,
            reference: order.payment_reference,
            steps: products.map((p) => ({ item: p.name, next: p.nextStep })),
            downloadUrl: products.some((p) => p.id === "success_kit") ? `${SITE}${successKitDownloadPath(order.tx_ref)}` : undefined,
          },
          idempotencyKey: `order-confirmed-${order.id}`,
        });
        receiptsSent++;
      } catch (e) {
        console.error("order-confirmed email failed", order.id, (e as Error).message);
        await supabaseAdmin.from("product_orders").update({ buyer_email_sent_at: null }).eq("id", order.id);
      }
    }

    if (!order.admin_email_sent_at && (await claimOrder(order.id, "admin_email_sent_at"))) {
      try {
        await sendTemplateEmail("order-paid-admin", "nachusim@gmail.com", {
          templateData: {
            name: order.name ?? undefined,
            email: order.email,
            phone: order.phone ?? undefined,
            school: order.school ?? undefined,
            items: products.map((p) => p.name).join(" + "),
            amount,
            notes: order.notes ?? undefined,
            reference: order.payment_reference ?? undefined,
          },
          idempotencyKey: `order-paid-admin-${order.id}`,
        });
        staffAlertsSent++;
      } catch (e) {
        console.error("order-paid-admin email failed", order.id, (e as Error).message);
        await supabaseAdmin.from("product_orders").update({ admin_email_sent_at: null }).eq("id", order.id);
      }
    }
  }
  return { receiptsSent, staffAlertsSent };
}

const automationLog = (entry: { action: string; target_id: string; faculty_id: string; subject: string | null; details: Record<string, unknown> }) =>
  supabaseAdmin
    .from("admin_audit_log")
    .insert({ ...entry, details: entry.details as Json, actor_email: "automation", target_table: "enrollments" })
    .then(({ error }) => {
      if (error) console.error("Couldn't write admin audit log", error.message);
    });

async function sendBalanceReminders(now = new Date()) {
  if (!inSendingHours(now)) return 0;
  const today = lagosToday(now);
  const { data: plans, error } = await supabaseAdmin
    .from("enrollments")
    .select("id, faculty_id, plan_name, balance_due, balance_due_by, currency")
    .in("status", ["active", "confirmed"])
    .gt("balance_due", 0)
    .not("balance_due_by", "is", null)
    .order("balance_due_by", { ascending: true })
    .limit(200);
  if (error) throw new Error(error.message);
  const due = (plans ?? []).filter((p) => dueReminder(p.balance_due_by!, today, {}) !== null);
  if (!due.length) return 0;

  // One row per plan holds its pay link token and which reminders went out.
  const { error: seedErr } = await supabaseAdmin
    .from("balance_reminders")
    .upsert(due.map((p) => ({ enrollment_id: p.id })), { onConflict: "enrollment_id", ignoreDuplicates: true });
  // The table only exists once the balance-reminders migration has been run.
  if (seedErr) {
    console.error("balance reminders skipped", seedErr.message);
    return 0;
  }
  const ids = due.map((p) => p.id);
  const [{ data: reminders }, { data: inFlight }, profiles] = await Promise.all([
    supabaseAdmin.from("balance_reminders").select("*").in("enrollment_id", ids),
    // A student paying right now gets no reminder; the re-check will confirm it.
    supabaseAdmin
      .from("enrollment_payments")
      .select("enrollment_id")
      .in("enrollment_id", ids)
      .eq("status", "pending")
      .gte("created_at", new Date(now.getTime() - HOUR).toISOString()),
    profilesByFacultyId([...new Set(due.map((p) => p.faculty_id))]),
  ]);
  const byPlan = new Map((reminders ?? []).map((r) => [r.enrollment_id, r]));
  const paying = new Set((inFlight ?? []).map((r) => r.enrollment_id));

  let sent = 0;
  for (const plan of due) {
    const reminder = byPlan.get(plan.id);
    const profile = profiles.get(plan.faculty_id);
    if (!reminder || !profile?.email || paying.has(plan.id)) continue;
    const stage = dueReminder(plan.balance_due_by!, today, reminder);
    if (!stage) continue;
    const column = STAGE_COLUMN[stage];

    const { data: claimed } = await supabaseAdmin
      .from("balance_reminders")
      .update({ [column]: now.toISOString() } as ReminderUpdate)
      .eq("enrollment_id", plan.id)
      .is(column, null)
      .select("enrollment_id")
      .maybeSingle();
    if (!claimed) continue;
    const amount = formatAmount(Number(plan.balance_due), plan.currency);
    try {
      await sendTemplateEmail("balance-reminder", profile.email, {
        templateData: {
          name: profile.name,
          plan: plan.plan_name,
          amount,
          dueDate: formatDay(plan.balance_due_by!),
          stage,
          payUrl: `${SITE}${payBalancePath(reminder.pay_token)}`,
        },
        idempotencyKey: `balance-reminder-${stage}-${plan.id}`,
      });
      sent++;
    } catch (e) {
      console.error("balance-reminder email failed", plan.id, (e as Error).message);
      await supabaseAdmin.from("balance_reminders").update({ [column]: null } as ReminderUpdate).eq("enrollment_id", plan.id);
      continue;
    }
    await automationLog({
      action: "payment.balance_reminder_sent",
      target_id: plan.id,
      faculty_id: plan.faculty_id,
      subject: profile.name,
      details: { stage, plan: plan.plan_name, amount: plan.balance_due, currency: plan.currency, due_by: plan.balance_due_by },
    });
  }
  return sent;
}

async function sendBalanceReceipts(now = new Date()) {
  const { data: payments, error } = await supabaseAdmin
    .from("enrollment_payments")
    .select("id, enrollment_id, amount, currency, payment_reference")
    .eq("status", "paid")
    .is("receipt_sent_at", null)
    // Older payments were paid before receipts existed.
    .gte("paid_at", new Date(now.getTime() - 3 * DAY).toISOString())
    .limit(100);
  if (error) {
    console.error("balance receipts skipped", error.message);
    return 0;
  }
  if (!payments?.length) return 0;
  const { data: plans } = await supabaseAdmin
    .from("enrollments")
    .select("id, faculty_id, plan_name")
    .in("id", [...new Set(payments.map((p) => p.enrollment_id))]);
  const planById = new Map((plans ?? []).map((p) => [p.id, p]));
  const profiles = await profilesByFacultyId([...new Set((plans ?? []).map((p) => p.faculty_id))]);

  let sent = 0;
  for (const payment of payments) {
    const plan = planById.get(payment.enrollment_id);
    if (!plan) continue;
    const { data: claimed } = await supabaseAdmin
      .from("enrollment_payments")
      .update({ receipt_sent_at: now.toISOString() })
      .eq("id", payment.id)
      .is("receipt_sent_at", null)
      .select("id")
      .maybeSingle();
    if (!claimed) continue;
    const profile = profiles.get(plan.faculty_id);
    // Logged here rather than in the edge functions, so it is written once per payment.
    await automationLog({
      action: "payment.balance_paid_online",
      target_id: plan.id,
      faculty_id: plan.faculty_id,
      subject: profile?.name ?? null,
      details: { plan: plan.plan_name, amount: payment.amount, currency: payment.currency, reference: payment.payment_reference },
    });
    if (!profile?.email) continue;
    try {
      await sendTemplateEmail("balance-paid", profile.email, {
        templateData: {
          name: profile.name,
          plan: plan.plan_name,
          amount: formatAmount(Number(payment.amount), payment.currency),
          reference: payment.payment_reference,
        },
        idempotencyKey: `balance-paid-${payment.id}`,
      });
      sent++;
    } catch (e) {
      // The payment is already logged; a missing receipt is not worth a second log row.
      console.error("balance-paid email failed", payment.id, (e as Error).message);
    }
  }
  return sent;
}

export async function runPaymentFollowups() {
  const confirmationsSent = await sendConfirmations();
  const remindersSent = await sendReminders();
  const orders = await sendOrderEmails();
  const payLinks = await runPayLinkFollowups(supabaseAdmin, sendTemplateEmail);
  const balanceRemindersSent = await sendBalanceReminders();
  const balanceReceiptsSent = await sendBalanceReceipts();
  return { confirmationsSent, remindersSent, ...orders, ...payLinks, balanceRemindersSent, balanceReceiptsSent };
}
