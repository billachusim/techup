import type { SupabaseClient } from "@supabase/supabase-js";
import {
  hasRepliedSince,
  isApprovedUtilityTemplate,
  isEligibleForWhatsAppFollowup,
  WHATSAPP_ADMISSIONS_TEMPLATES,
  whatsAppInterestCopy,
} from "@/lib/whatsapp-followups";

type FollowupRow = {
  id: string;
  lead_id: string;
  stage: "confirmation" | "follow_up";
  recipient_phone: string;
  template_name: string;
  template_language: string;
  attempt_count: number;
  lead_name: string | null;
  lead_interest: string;
  lead_created_at: string;
};

type ProviderStatusResponse = {
  data?: Array<{ name: string; language: string; category?: string; status: string }>;
};

const followupParam = (row: FollowupRow) => {
  const name = row.lead_name?.trim().split(/\s+/)[0] || "there";
  const interest = whatsAppInterestCopy(row.lead_interest);
  return row.stage === "confirmation" ? [name, interest] : [name, interest];
};

function providerHeaders() {
  const lov = process.env["LOVABLE_API_KEY"];
  const wa = process.env["WHATSAPP_API_KEY"];
  if (!lov || !wa) throw new Error("WhatsApp sending is not configured");
  return {
    Authorization: `Bearer ${lov}`,
    "X-Connection-Api-Key": wa,
    "Content-Type": "application/json",
  };
}

async function getApprovedTemplates(): Promise<ProviderStatusResponse["data"]> {
  const res = await fetch("https://connector-gateway.lovable.dev/whatsapp/message_templates?limit=100&fields=name,status,language,category", {
    headers: providerHeaders(),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Template status lookup failed [${res.status}]: ${text.slice(0, 500)}`);
  const parsed = JSON.parse(text) as ProviderStatusResponse;
  return parsed.data ?? [];
}

async function templateParameter(row: FollowupRow, db: SupabaseClient) {
  const { data, error } = await db.from("leads").select("whatsapp_last_inbound_at").eq("id", row.lead_id).single();
  if (error || !data) throw new Error(`Could not recheck lead reply status: ${error?.message ?? "Lead missing"}`);

  const { data: confirmation, error: confirmationError } = await db.from("whatsapp_lead_followups")
    .select("sent_at").eq("lead_id", row.lead_id).eq("stage", "confirmation").maybeSingle();
  if (confirmationError) throw new Error(`Could not recheck follow-up timing: ${confirmationError.message}`);

  if (row.stage === "confirmation") {
    if (hasRepliedSince({ whatsapp_last_inbound_at: data.whatsapp_last_inbound_at }, row.lead_created_at)) {
      return null;
    }
  } else if (hasRepliedSince({ whatsapp_last_inbound_at: data.whatsapp_last_inbound_at }, confirmation?.sent_at ?? null)) {
    return null;
  }
  return followupParam(row);
}

async function sendTemplate(row: FollowupRow, params: string[]) {
  const headers = providerHeaders();
  const res = await fetch("https://connector-gateway.lovable.dev/whatsapp/messages", {
    method: "POST",
    headers,
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: row.recipient_phone,
      type: "template",
      template: {
        name: row.template_name,
        language: { code: row.template_language },
        components: [{
          type: "body",
          parameters: params.map((text) => ({ type: "text", text })),
        }],
      },
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`WhatsApp template send failed [${res.status}]: ${text.slice(0, 500)}`);
  const body = JSON.parse(text) as { messages?: Array<{ id?: string }> };
  const messageId = body.messages?.[0]?.id;
  if (!messageId) throw new Error("WhatsApp accepted the request without a message id; send outcome is ambiguous");
  return messageId;
}

async function resolve(db: SupabaseClient, id: string, status: "pending" | "failed" | "unresolved" | "cancelled", message: string, retrySeconds?: number) {
  const { data, error } = await db.rpc("resolve_whatsapp_lead_followup", {
    p_id: id,
    p_status: status,
    p_error: message.slice(0, 1000),
    p_retry_after_seconds: retrySeconds ?? null,
  });
  if (error || data !== true) throw new Error(`Could not save WhatsApp follow-up result: ${error?.message ?? "row not claimed"}`);
}

async function markSent(db: SupabaseClient, row: FollowupRow, messageId: string) {
  const sentAt = new Date().toISOString();
  const { error: savedMessageError } = await db.from("whatsapp_messages").upsert({
    direction: "outbound",
    contact_phone: row.recipient_phone,
    type: "template",
    template_name: row.template_name,
    body: `[Template] ${row.template_name}: ${followupParam(row).join(" | ")}`,
    wa_message_id: messageId,
    status: "accepted",
  }, { onConflict: "wa_message_id", ignoreDuplicates: true });
  if (savedMessageError) throw new Error(`WhatsApp accepted a message but its inbox record could not be saved: ${savedMessageError.message}`);
  const { data, error } = await db.rpc("complete_whatsapp_lead_followup", {
    p_id: row.id,
    p_provider_message_id: messageId,
    p_sent_at: sentAt,
  });
  if (error || data !== true) throw new Error(`WhatsApp accepted a message but its result could not be saved: ${error?.message ?? "row not claimed"}`);
}

async function processClaim(db: SupabaseClient, row: FollowupRow, approvedTemplates: ProviderStatusResponse["data"]) {
  const { data: lead, error: leadError } = await db.from("leads")
    .select("id, channel, interest, status, whatsapp_opt_in, whatsapp_opt_out_at, whatsapp_last_inbound_at, created_at")
    .eq("id", row.lead_id).single();
  if (leadError || !lead) {
    await resolve(db, row.id, "cancelled", `Lead unavailable: ${leadError?.message ?? "missing"}`);
    return "cancelled";
  }
  if (!isEligibleForWhatsAppFollowup(lead)) {
    await resolve(db, row.id, "cancelled", "Lead no longer meets consent or enquiry eligibility checks");
    return "cancelled";
  }

  const { data: accountState, error: accountStateError } = await db.from("whatsapp_account_state")
    .select("sending_paused,last_event").eq("id", 1).maybeSingle();
  if (accountStateError) throw new Error(`Could not verify WhatsApp sending state: ${accountStateError.message}`);
  if (accountState?.sending_paused) {
    await resolve(db, row.id, "pending", `WhatsApp sending is paused (${accountState.last_event ?? "account update"})`, 3600);
    return "paused";
  }

  const params = await templateParameter(row, db);
  if (!params) {
    await resolve(db, row.id, "cancelled", "Lead replied after the previous message");
    return "cancelled";
  }

  try {
    const latestTemplates = await getApprovedTemplates();
    if (!isApprovedUtilityTemplate(latestTemplates ?? [], row.template_name, row.template_language)) {
      await resolve(db, row.id, "pending", "The exact template is not currently approved", 3600);
      return "waiting_for_approval";
    }
    const messageId = await sendTemplate(row, params);
    await markSent(db, row, messageId);
    return "sent";
  } catch (error) {
    const reason = (error as Error).message;
    if (/message id|accepted the request|network|fetch failed|timed out|\[5\d\d\]/i.test(reason)) {
      await resolve(db, row.id, "unresolved", reason);
      return "unresolved";
    }
    const retryable = row.attempt_count < 3;
    await resolve(db, row.id, retryable ? "pending" : "failed", reason, 120 * row.attempt_count);
    return retryable ? "retrying" : "failed";
  }
}

export async function runWhatsAppLeadFollowups(db: SupabaseClient) {
  const { data: staleCount, error: staleError } = await db.rpc("mark_stale_whatsapp_lead_followups_unresolved");
  if (staleError) throw new Error(`Could not resolve stale WhatsApp send attempts: ${staleError.message}`);

  let templates: ProviderStatusResponse["data"];
  try {
    templates = await getApprovedTemplates();
  } catch (error) {
    console.error("WhatsApp follow-up template status lookup failed", (error as Error).message);
    return { claimed: 0, sent: 0, waitingForApproval: 0, unresolved: 0, failed: 0, staleResolved: Number(staleCount ?? 0), blocked: true };
  }

  const allowed = Object.values(WHATSAPP_ADMISSIONS_TEMPLATES).filter((name) =>
    isApprovedUtilityTemplate(templates ?? [], name, "en_US"),
  );
  if (!allowed.length) return { claimed: 0, sent: 0, waitingForApproval: 0, unresolved: 0, failed: 0, staleResolved: Number(staleCount ?? 0), blocked: true };

  const { data: rows, error } = await db.rpc("claim_whatsapp_lead_followups", {
    p_limit: 10,
    p_approved_template_names: allowed,
  });
  if (error) throw new Error(`Could not claim WhatsApp follow-ups: ${error.message}`);

  const result = { claimed: rows?.length ?? 0, sent: 0, waitingForApproval: 0, unresolved: 0, failed: 0, cancelled: 0, paused: 0, staleResolved: Number(staleCount ?? 0), blocked: false };
  for (const row of (rows ?? []) as FollowupRow[]) {
    try {
      const outcome = await processClaim(db, row, templates);
      if (outcome === "sent") result.sent += 1;
      else if (outcome === "waiting_for_approval") result.waitingForApproval += 1;
      else if (outcome === "unresolved") result.unresolved += 1;
      else if (outcome === "failed") result.failed += 1;
      else if (outcome === "cancelled") result.cancelled += 1;
      else if (outcome === "paused") result.paused += 1;
    } catch (error) {
      console.error("WhatsApp follow-up processing failed", row.id, (error as Error).message);
      try {
        await resolve(db, row.id, "pending", (error as Error).message, 300);
      } catch (resolveError) {
        console.error("Could not release WhatsApp follow-up claim", row.id, (resolveError as Error).message);
      }
      result.failed += 1;
    }
  }
  return result;
}

export async function processInboundLeadWhatsApp(db: SupabaseClient, input: { from: string; text: string; timestamp?: string }) {
  const rawTimestamp = input.timestamp ? Number(input.timestamp) : NaN;
  const providerTime = Number.isFinite(rawTimestamp) ? new Date(rawTimestamp * 1000).toISOString() : new Date().toISOString();
  const { error } = await db.rpc("process_whatsapp_lead_inbound", {
    inbound_phone: input.from,
    inbound_message: input.text,
    provider_received_at: providerTime,
  });
  if (error) throw new Error(`Could not update WhatsApp lead consent state: ${error.message}`);
}