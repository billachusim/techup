// Follow-up emails for card checkouts, sent when the recover-checkouts edge
// function calls /api/payment-followups after re-checking Flutterwave:
// - "payment confirmed" for payments that re-check confirmed (the student
//   left before the payment page could tell them), and
// - one "finish your enrolment" reminder for checkouts still unpaid.
// - a receipt to the buyer and a "new paid order" email to staff for each
//   online order (Virtual SIWES, logbook service, Success Kit) once it is paid.
// Everything is driven by enrolment and order rows and each email is claimed
// on its row before sending, so extra calls never send an email twice.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";
import { accessEnrollment } from "../../supabase/functions/_shared/enrollment-access.ts";
import { PRODUCTS, successKitDownloadPath, type ProductId } from "../../supabase/functions/_shared/products.ts";

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

export async function runPaymentFollowups() {
  const confirmationsSent = await sendConfirmations();
  const remindersSent = await sendReminders();
  const orders = await sendOrderEmails();
  return { confirmationsSent, remindersSent, ...orders };
}
