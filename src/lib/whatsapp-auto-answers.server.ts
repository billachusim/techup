// Runs the automatic answers for one inbound WhatsApp message. Called from the
// webhook after the message is saved. Each inbound message is claimed once in
// whatsapp_auto_replies before anything is sent, so webhook retries never send
// twice. Never throws: a failure here must not hold up the inbox.
//
// Fixed answers (prices, campuses, SIWES, jobs, business services) go out at
// once. Anything else that isn't for staff only is passed to Ms. Claire, the AI
// assistant, after the webhook has answered; she replies, stays quiet for a
// plain "ok/thanks", or hands the chat to staff.
import type { SupabaseClient } from "@supabase/supabase-js";
import { AUTO_ANSWER_RULES as RULES, HANDOFF_ACK, decideAutoAnswer, type AutoAnswerIntent } from "@/lib/whatsapp-auto-answers";
import { isWhatsAppOptOutMessage } from "@/lib/whatsapp-followups";
import { claireInstructions, conversationInput, parseClaireReply, type ChatTurn, type ClaireDecision } from "@/lib/whatsapp-ai-reply";

const HOUR = 3600 * 1000;
const MODEL = "openai/gpt-6-astra";
const SITE = "https://techfaculty.ng";

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
  const ackSince = now - RULES.ackHours * HOUR;
  const recentlyTold = (recent ?? []).some((r) => (r.acknowledged || r.outcome === "answered") && new Date(r.created_at).getTime() >= ackSince);

  // Why this message gets no automatic reply, if it doesn't.
  let quiet: string | null = null;
  if (state && state.auto_answer_enabled === false) quiet = "Auto-answers are switched off";
  else if (state?.sending_paused) quiet = "WhatsApp sending is paused";
  else if (staffMsgs?.length) quiet = "Staff are already chatting with this contact";
  else if (now - sentAt > RULES.staleMinutes * 60 * 1000) quiet = "Message arrived late";
  else if (sentToday >= RULES.maxPerDay) quiet = "Daily limit of automatic messages reached";

  // Not a common question and not staff-only: Ms. Claire (AI) takes it after the webhook answers.
  if (!quiet && decision.kind === "handoff" && decision.canTryAi) {
    const { data: claim, error } = await db.from("whatsapp_auto_replies").insert({
      inbound_wa_message_id: m.waMessageId, contact_phone: m.from, contact_name: m.name,
      inbound_text: m.text.slice(0, 1000), intent: "ai", outcome: "handed_off", reason: "Ms. Claire is replying", acknowledged: false,
    }).select("id").maybeSingle();
    if (error || !claim) return;
    const { runAfterResponse } = await import("@/lib/worker-ctx");
    await runAfterResponse(() => claireReplies(db, m, claim.id as string, recentlyTold));
    return;
  }

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
  if (!quiet && outcome === "handed_off" && !recentlyTold) { reply = HANDOFF_ACK; acknowledged = true; }

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

/** What Ms. Claire may say: the same answers and links the fixed replies use, plus open roles. */
export async function claireFacts(db: SupabaseClient): Promise<string> {
  const { prioritiseRoles, roleUrl } = await import("@/lib/slack-community");
  const { data: roles } = await db.from("talent_roles")
    .select("slug,title,company,city,is_remote,pay_text,is_featured,applications_closed").eq("status", "published");
  const fixed = (q: string) => {
    const d = decideAutoAnswer(q);
    return d.kind === "answer" ? d.reply.replace(/\n\nThis is an automatic answer[\s\S]*$/, "") : "";
  };
  return [
    `Free AI Course (Everyday AI & Digital Productivity, online, free, one tap to join): ${SITE}/#free-bootcamp`,
    `Courses and fees: ${SITE}/#pricing ; all departments: ${SITE}/departments ; events: ${SITE}/events ; check a certificate: ${SITE}/verify`,
    "Online classes run at 6pm Lagos time, 1-3 times a week depending on level; each student starts from class 1 on their own timetable. Every class has a task, and passing it unlocks the next class. Graduates get a verifiable Certificate of Achievement.",
    "Course fees:", fixed("how much are your course prices"),
    "Campuses:", fixed("where is your campus location"),
    "SIWES:", fixed("siwes"), fixed("virtual siwes online"),
    "Finding work:", fixed("I want a job"),
    "Business services:", fixed("I want to hire someone for my business"),
    "Open roles (apply on the page; matching is automatic):",
    ...prioritiseRoles((roles ?? []) as any).slice(0, 15).map((r) => `- ${r.title}${r.company ? ` | ${r.company}` : ""} | ${r.is_remote ? "remote" : r.city ?? ""}${r.pay_text ? ` | pay: ${r.pay_text}` : ""} | ${roleUrl(r.slug)}`),
    "Payments, receipts, instalment questions and anything staff must decide: hand off (the team replies in this chat).",
  ].filter(Boolean).join("\n");
}

export async function askClaire(db: SupabaseClient, m: Inbound): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not set");
  const { data: history } = await db.from("whatsapp_messages").select("direction,body,created_at")
    .eq("contact_phone", m.from).order("created_at", { ascending: false }).limit(10);
  const turns: ChatTurn[] = ((history ?? []) as Array<{ direction: string; body: string | null }>)
    .reverse().filter((h) => h.body).map((h) => ({ from: h.direction === "inbound" ? "customer" : "us", text: h.body as string }));
  if (!turns.length || turns[turns.length - 1].from !== "customer") turns.push({ from: "customer", text: m.text });

  const [{ createOpenAI }, { streamText }] = await Promise.all([import("@ai-sdk/openai"), import("ai")]);
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  const result = streamText({
    model: provider.responses(MODEL),
    system: claireInstructions(await claireFacts(db)),
    messages: [{ role: "user", content: conversationInput(turns) }],
    // Background work after the webhook response has a limited time to finish.
    abortSignal: AbortSignal.timeout(25_000),
    providerOptions: {
      openai: { store: false, forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", include: ["reasoning.encrypted_content"] },
    },
  });
  return (await result.text).trim();
}

async function claireReplies(db: SupabaseClient, m: Inbound, claimId: string, recentlyTold: boolean) {
  let decision: ClaireDecision;
  try {
    decision = parseClaireReply(await askClaire(db, m));
  } catch (e) {
    decision = { kind: "handoff", reason: `Ms. Claire couldn't answer: ${(e as Error).message.slice(0, 200)}` };
  }
  const update = (patch: Record<string, unknown>) => db.from("whatsapp_auto_replies").update(patch).eq("id", claimId);

  if (decision.kind === "skip") {
    await update({ reason: "No reply needed (just an acknowledgement)", resolved_at: new Date().toISOString() });
    return;
  }
  const { sendWhatsApp } = await import("@/lib/whatsapp.server");
  if (decision.kind === "reply") {
    try {
      const sent = await sendWhatsApp({ to: m.from, text: decision.text, sentBy: null });
      await update({ outcome: "answered", reason: null, reply_message_id: sent.id });
      await logAutomation(db, {
        action: "whatsapp.ai_answered", target_id: sent.id, subject: m.name || `+${m.from}`,
        details: { question: m.text.slice(0, 300) },
      });
      return;
    } catch (e) {
      decision = { kind: "handoff", reason: `Ms. Claire's reply failed to send: ${(e as Error).message.slice(0, 200)}` };
    }
  }
  // Handed to staff: tell the sender someone will reply, unless we already did recently.
  await update({ reason: decision.reason, acknowledged: !recentlyTold });
  if (recentlyTold) return;
  try {
    const sent = await sendWhatsApp({ to: m.from, text: HANDOFF_ACK, sentBy: null });
    await update({ reply_message_id: sent.id });
  } catch {
    await update({ acknowledged: false });
  }
}
