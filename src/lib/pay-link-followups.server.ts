// Emails for WhatsApp and email (bank transfer) requests that recover-checkouts
// chases with a Flutterwave pay link (supabase/functions/_shared/manual-payments.ts):
// - the pay link, as soon as it exists,
// - one reminder two days after the link, if still unpaid,
// - a note when the request is cancelled 14 days after the link.
// Each email is claimed on its enrolment row before sending, so repeat calls
// never send one twice. What is sent is logged to the admin activity log.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type Db = SupabaseClient<Database>;
export type SendEmail = (template: string, to: string, options: { templateData: Record<string, unknown>; idempotencyKey: string }) => Promise<unknown>;

const DAY = 24 * 60 * 60 * 1000;
export const PAY_LINK_REMIND_AFTER = 2 * DAY;
// Matches CANCEL_AFTER in manual-payments.ts.
const CANCEL_AFTER_DAYS = 14;

type Row = { id: string; faculty_id: string; plan_name: string; amount_due: number | null; currency: string | null; pay_link_url: string | null; pay_link_created_at: string | null };
type Column = "pay_link_sent_at" | "pay_link_reminder_sent_at" | "cancel_email_sent_at";
type Kind = { column: Column; template: string; action: string };

const KINDS = {
  link: { column: "pay_link_sent_at", template: "pay-link", action: "payment.pay_link_emailed" },
  reminder: { column: "pay_link_reminder_sent_at", template: "pay-link", action: "payment.pay_link_reminded" },
  cancelled: { column: "cancel_email_sent_at", template: "pay-link-cancelled", action: "enrollment.auto_cancel_emailed" },
} satisfies Record<string, Kind>;

const stamp = (column: Column, value: string | null) => ({ [column]: value }) as Partial<Record<Column, string | null>>;

const COLUMNS = "id, faculty_id, plan_name, amount_due, currency, pay_link_url, pay_link_created_at";

function formatAmount(amount: number | null, currency: string | null) {
  if (amount == null) return undefined;
  return currency === "USD" ? `$${amount.toLocaleString("en-US")}` : `₦${amount.toLocaleString("en-NG")}`;
}

function cancelDate(createdAt: string | null) {
  if (!createdAt) return undefined;
  return new Date(Date.parse(createdAt) + CANCEL_AFTER_DAYS * DAY).toLocaleDateString("en-GB", { day: "numeric", month: "long", timeZone: "Africa/Lagos" });
}

async function sendAll(db: Db, send: SendEmail, rows: Row[], kind: Kind) {
  if (!rows.length) return 0;
  const { data: profiles } = await db
    .from("profiles")
    .select("faculty_id, name, email")
    .in("faculty_id", [...new Set(rows.map((r) => r.faculty_id))]);
  const byId = new Map((profiles ?? []).map((p) => [p.faculty_id, p]));

  let sent = 0;
  for (const row of rows) {
    const profile = byId.get(row.faculty_id);
    // No email address: the link stays on /admin/students for staff to send on WhatsApp.
    if (!profile?.email) continue;
    const { data: claimed } = await db
      .from("enrollments")
      .update(stamp(kind.column, new Date().toISOString()))
      .eq("id", row.id)
      .is(kind.column, null)
      .select("id")
      .maybeSingle();
    if (!claimed) continue;
    try {
      await send(kind.template, profile.email, {
        templateData: {
          name: profile.name,
          plan: row.plan_name,
          amount: formatAmount(row.amount_due, row.currency),
          payUrl: row.pay_link_url,
          cancelOn: cancelDate(row.pay_link_created_at),
          reminder: kind === KINDS.reminder,
        },
        idempotencyKey: `${kind.column}-${row.id}`,
      });
      sent++;
    } catch (e) {
      console.error(`${kind.template} email failed`, row.id, (e as Error).message);
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
      details: { plan: row.plan_name, amount: row.amount_due, currency: row.currency },
    });
    if (error) console.error("Couldn't write admin audit log", error.message);
  }
  return sent;
}

export async function runPayLinkFollowups(db: Db, send: SendEmail, now = Date.now()) {
  const pending = () =>
    db.from("enrollments").select(COLUMNS).eq("status", "pending").not("pay_link_url", "is", null).limit(100);

  const [links, reminders, cancelled] = await Promise.all([
    pending().is("pay_link_sent_at", null),
    pending()
      .is("pay_link_reminder_sent_at", null)
      .lte("pay_link_sent_at", new Date(now - PAY_LINK_REMIND_AFTER).toISOString()),
    db
      .from("enrollments")
      .select(COLUMNS)
      .eq("status", "cancelled")
      .not("auto_cancelled_at", "is", null)
      .is("cancel_email_sent_at", null)
      .limit(100),
  ]);
  // The columns only exist once the manual-payments migration has been run.
  const failed = links.error ?? reminders.error ?? cancelled.error;
  if (failed) {
    console.error("pay link emails skipped", failed.message);
    return { payLinksSent: 0, payLinkRemindersSent: 0, cancelNoticesSent: 0 };
  }

  return {
    payLinksSent: await sendAll(db, send, (links.data ?? []) as Row[], KINDS.link),
    payLinkRemindersSent: await sendAll(db, send, (reminders.data ?? []) as Row[], KINDS.reminder),
    cancelNoticesSent: await sendAll(db, send, (cancelled.data ?? []) as Row[], KINDS.cancelled),
  };
}
