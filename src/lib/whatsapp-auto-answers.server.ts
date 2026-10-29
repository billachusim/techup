// Runs the automatic answers for one inbound WhatsApp message. Called from the
// webhook after the message is saved. Each inbound message is claimed once in
// whatsapp_auto_replies before anything is sent, so webhook retries never send
// twice. Never throws: a failure here must not hold up the inbox.
import type { SupabaseClient } from "@supabase/supabase-js";
import { AUTO_ANSWER_RULES as RULES, HANDOFF_ACK, decideAutoAnswer, type AutoAnswerIntent } from "@/lib/whatsapp-auto-answers";
import { isWhatsAppOptOutMessage } from "@/lib/whatsapp-followups";

const HOUR = 3600 * 1000;

type Inbound = { waMessageId: string; from: string; name: string | null; text: string; timestamp?: string };

async function logAutomation(db: SupabaseClient, entry: { action: string; target_id: string | null; subject: string; details: Record<string, unknown> }) {
  const { error } = await db.from("admin_audit_log").insert({
    actor_id: null, actor_email: "automation", target_table: "whatsapp_messages", faculty_id: null, ...entry,
  });
  if (error) console.error("Couldn't write WhatsApp automation to the audit log", error.message);
}

export async function autoAnswerInbound(db: SupabaseClient, m: Inbound) {
  try {
    await run(db, m);
  } catch (e) {
    console.error("WhatsApp auto-answer failed", m.waMessageId, (e as Error).message);
  }
}

async function run(db: SupabaseClient, m: Inbound) {
  if (isWhatsAppOptOutMessage(m.text)) return;

  const now = Date.now();
  const [{ data: state }, { data: recent }] = await Promise.all([
    db.from("whatsapp_account_state").select("sending_paused,auto_answer_enabled").eq("id", 1).maybeSingle(),
    db.from("whatsapp_auto_replies").select("intent,outcome,acknowledged,created_at")
      .eq("contact_phone", m.from).gte("created_at", new Date(now - RULES.repeatHours * HOUR).toISOString()),
  ]);
  const { data: staffMsgs } = await db.from("whatsapp_messages").select("id").eq("contact_phone", m.from)
    .eq("direction", "outbound").not("sent_by", "is", null)
    .gte("created_at", new Date(now - RULES.staffActiveHours * HOUR).toISOString()).limit(1);

  const decision = decideAutoAnswer(m.text);
  const sentToday = (recent ?? []).filter((r) => r.outcome === "answered" || r.acknowledged).length;
  const sentAt = m.timestamp ? Number(m.timestamp) * 1000 : now;

  // Why this message gets no automatic reply, if it doesn't.
  let quiet: string | null = null;
  if (state && state.auto_answer_enabled === false) quiet = "Auto-answers are switched off";
  else if (state?.sending_paused) quiet = "WhatsApp sending is paused";
  else if (staffMsgs?.length) quiet = "Staff are already chatting with this contact";
  else if (now - sentAt > RULES.staleMinutes * 60 * 1000) quiet = "Message arrived late";
  else if (sentToday >= RULES.maxPerDay) quiet = "Daily limit of automatic messages reached";

  let outcome: "answered" | "handed_off" = "handed_off";
  let intents: (AutoAnswerIntent | "other")[] = [decision.kind === "handoff" ? decision.intent : "other"];
  let reason = decision.kind === "handoff" ? decision.reason : null;
  let reply: string | null = null;
  let acknowledged = false;

  if (!quiet && decision.kind === "answer") {
    const repeated = decision.intents.filter((i) => (recent ?? []).some((r) => r.outcome === "answered" && r.intent.split(",").includes(i)));
    if (repeated.length === decision.intents.length) {
      reason = "Already answered this today; they may need more detail";
      intents = decision.intents;
    } else {
      outcome = "answered";
      intents = decision.intents;
      reply = decision.reply;
    }
  }
  if (quiet) reason = reason ? `${quiet} (${reason})` : quiet;

  // Handoffs get a short "someone will reply" note, at most once in a while.
  if (!quiet && outcome === "handed_off") {
    const ackSince = now - RULES.ackHours * HOUR;
    const recentlyTold = (recent ?? []).some((r) => (r.acknowledged || r.outcome === "answered") && new Date(r.created_at).getTime() >= ackSince);
    if (!recentlyTold) { reply = HANDOFF_ACK; acknowledged = true; }
  }

  // Claim this inbound message. A retry of the same webhook stops here.
  const { data: claim, error: claimError } = await db.from("whatsapp_auto_replies").insert({
    inbound_wa_message_id: m.waMessageId, contact_phone: m.from, contact_name: m.name,
    inbound_text: m.text.slice(0, 1000), intent: intents.join(","), outcome, reason, acknowledged,
  }).select("id").maybeSingle();
  if (claimError || !claim) return;

  if (!reply) return;
  const { sendWhatsApp } = await import("@/lib/whatsapp.server");
  try {
    const sent = await sendWhatsApp({ to: m.from, text: reply, sentBy: null });
    await db.from("whatsapp_auto_replies").update({ reply_message_id: sent.id }).eq("id", claim.id);
    if (outcome === "answered") {
      await logAutomation(db, {
        action: "whatsapp.auto_answered", target_id: sent.id, subject: m.name || `+${m.from}`,
        details: { intents, question: m.text.slice(0, 300) },
      });
    }
  } catch (e) {
    await db.from("whatsapp_auto_replies").update({
      outcome: "handed_off", acknowledged: false, reason: `Automatic reply failed: ${(e as Error).message.slice(0, 300)}`,
    }).eq("id", claim.id);
  }
}
