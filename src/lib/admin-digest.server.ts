// Morning digest for staff: one email a day listing what is waiting in /admin.
// pg_cron calls /api/admin-digest each morning. The day is claimed in
// admin_digest_sends before sending, so extra calls never send a second email.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";
import { needsYouTodayRows, withWhatsAppWaiting, type NeedsYouTodayCounts } from "@/lib/needs-you-today";

export async function runAdminDigest() {
  const { data, error } = await supabaseAdmin.rpc("needs_you_today_counts");
  if (error) throw new Error(error.message);
  const counts = await withWhatsAppWaiting(data as unknown as NeedsYouTodayCounts, () => supabaseAdmin.rpc("whatsapp_chats_waiting"));
  const rows = needsYouTodayRows(counts);
  const total = rows.reduce((n, r) => n + r.count, 0);
  if (total === 0) return { status: "nothing_waiting" as const };

  const day = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });
  const { error: claimed } = await supabaseAdmin
    .from("admin_digest_sends")
    .insert({ sent_on: day, counts: data });
  if (claimed) return { status: "already_sent" as const, day };

  try {
    await sendTemplateEmail("admin-morning-digest", "", {
      templateData: { rows },
      idempotencyKey: `admin-morning-digest-${day}`,
    });
    return { status: "sent" as const, day, total };
  } catch (e) {
    // Free the day so a later call can retry.
    await supabaseAdmin.from("admin_digest_sends").delete().eq("sent_on", day);
    throw e;
  }
}
