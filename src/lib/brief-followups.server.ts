// Daily client follow-ups for /hire briefs and /services orders (pg_cron ->
// /api/brief-followups, 09:00 Lagos). A brief that is still new or reviewing and
// unpaid gets at most two nudges: 2 and 5 days after it was sent, or after the
// quote went out once there is one (the quote resets the count). Clients with no
// email are left to the GM's WhatsApp routine.

const DAY = 24 * 60 * 60 * 1000;
const NUDGE_AFTER_DAYS = [2, 5];
const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

export type BriefFollowupResult = {
  checked: number;
  sent: number;
  failed: number;
};

/** Which nudge (0 or 1) is due for a brief, or null. Exported for tests. */
export function dueNudge(
  b: {
    created_at: string;
    quote_sent_at: string | null;
    followup_count: number;
  },
  now: number,
): number | null {
  const n = b.followup_count;
  if (n >= NUDGE_AFTER_DAYS.length) return null;
  const from = Date.parse(b.quote_sent_at ?? b.created_at);
  return now - from >= NUDGE_AFTER_DAYS[n] * DAY ? n : null;
}

export async function runBriefFollowups(): Promise<BriefFollowupResult> {
  const { supabaseAdmin } =
    await import("@/integrations/supabase/client.server");
  const { sendTemplateEmail } =
    await import("@/lib/email-templates/send-email");
  const { data, error } = await supabaseAdmin
    .from("business_briefs")
    .select(
      "id, created_at, status, contact_name, email, project_title, quote_amount, quote_sent_at, pay_link_url, followup_count",
    )
    .in("status", ["new", "reviewing"])
    .is("paid_at", null)
    .not("email", "is", null)
    .limit(200);
  if (error) throw new Error(error.message);

  const now = Date.now();
  const res: BriefFollowupResult = { checked: 0, sent: 0, failed: 0 };
  for (const b of data ?? []) {
    res.checked++;
    const n = dueNudge(b, now);
    if (n === null) continue;
    // Claim the nudge first so a repeat run never sends it twice.
    const { data: claimed } = await supabaseAdmin
      .from("business_briefs")
      .update({
        followup_count: n + 1,
        last_followup_at: new Date().toISOString(),
      })
      .eq("id", b.id)
      .eq("followup_count", n)
      .select("id")
      .maybeSingle();
    if (!claimed) continue;
    const quoted = Boolean(b.quote_sent_at);
    const title = b.project_title.replace(/^(Service order|Custom request): /, "");
    try {
      await sendTemplateEmail("brief-followup", b.email!, {
        templateData: {
          contactName: b.contact_name,
          title,
          quoted,
          amount: quoted && b.quote_amount ? naira(b.quote_amount) : undefined,
          payUrl: quoted ? b.pay_link_url : undefined,
        },
        idempotencyKey: `brief-followup-${b.id}-${quoted ? "q" : "b"}-${n + 1}`,
      });
      res.sent++;
    } catch (e) {
      res.failed++;
      console.error("brief follow-up failed", b.id, (e as Error).message);
    }
  }
  return res;
}
