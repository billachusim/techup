/** WhatsApp Business: sending, template admin, and webhook processing. Server-only. */
import type { SupabaseClient } from "@supabase/supabase-js";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/whatsapp";
const RANK: Record<string, number> = { accepted: 0, sent: 1, delivered: 2, read: 3, failed: 4 };

function headers() {
  const lov = process.env["LOVABLE_API_KEY"];
  const wa = process.env["WHATSAPP_API_KEY"];
  if (!lov) throw new Error("LOVABLE_API_KEY is not configured");
  if (!wa) throw new Error("WHATSAPP_API_KEY is not configured");
  return { Authorization: `Bearer ${lov}`, "X-Connection-Api-Key": wa, "Content-Type": "application/json" };
}

export async function gateway(path: string, init: { method?: string; body?: unknown } = {}) {
  const res = await fetch(`${GATEWAY_URL}${path}`, {
    method: init.method ?? "GET",
    headers: headers(),
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const text = await res.text();
  let json: unknown = null;
  try { json = text ? JSON.parse(text) : null; } catch { json = text; }
  if (!res.ok) throw new Error(`WhatsApp request failed [${res.status}]: ${text.slice(0, 500)}`);
  return json as any;
}

export function normalizePhone(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("0") && d.length === 11) d = "234" + d.slice(1); // Nigerian local format
  return d;
}

async function admin(): Promise<SupabaseClient> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as unknown as SupabaseClient;
}

export type SendInput =
  | { to: string; text: string; sentBy?: string | null }
  | { to: string; template: { name: string; language: string; params?: string[] }; sentBy?: string | null };

/** Sends a message and records it. Returns the stored row id and provider message id. */
export async function sendWhatsApp(input: SendInput) {
  const db = await admin();
  const { data: state } = await db.from("whatsapp_account_state").select("sending_paused,last_event").eq("id", 1).maybeSingle();
  if (state?.sending_paused) throw new Error(`WhatsApp sending is paused (${state.last_event}). Reconnect WhatsApp in Connectors.`);

  const to = normalizePhone(input.to);
  if (to.length < 8 || to.length > 15) throw new Error("Invalid phone number");
  const isTemplate = "template" in input;
  const body = isTemplate
    ? {
        messaging_product: "whatsapp", to, type: "template",
        template: {
          name: input.template.name,
          language: { code: input.template.language },
          components: input.template.params?.length
            ? [{ type: "body", parameters: input.template.params.map((t) => ({ type: "text", text: t })) }]
            : undefined,
        },
      }
    : { messaging_product: "whatsapp", to, type: "text", text: { body: input.text } };

  const base = {
    direction: "outbound", contact_phone: to, type: isTemplate ? "template" : "text",
    body: isTemplate ? `[Template] ${input.template.name}${input.template.params?.length ? ": " + input.template.params.join(" | ") : ""}` : input.text,
    template_name: isTemplate ? input.template.name : null, sent_by: input.sentBy ?? null,
  };

  try {
    const res = await gateway("/messages", { method: "POST", body });
    const waId: string | undefined = res?.messages?.[0]?.id;
    const { data: row, error } = await db.from("whatsapp_messages")
      .insert({ ...base, wa_message_id: waId ?? null, status: "accepted" }).select("id").single();
    if (error) throw new Error(`Saved send failed: ${error.message}`);
    if (waId) await reconcilePendingStatuses(db, waId);
    return { id: row.id as string, waMessageId: waId };
  } catch (e) {
    const msg = (e as Error).message;
    if (!msg.startsWith("Saved send failed")) {
      await db.from("whatsapp_messages").insert({ ...base, status: "failed", failed_at: new Date().toISOString(), error: { message: msg } });
    }
    throw e;
  }
}

async function applyStatus(db: SupabaseClient, waId: string, status: string, ts: string | null, errors: unknown) {
  const { data: msg } = await db.from("whatsapp_messages").select("id,status,sent_at,delivered_at,read_at,failed_at").eq("wa_message_id", waId).maybeSingle();
  if (!msg) return false;
  const patch: Record<string, unknown> = {};
  const col = { sent: "sent_at", delivered: "delivered_at", read: "read_at", failed: "failed_at" }[status];
  if (col && !(msg as any)[col]) patch[col] = ts ?? new Date().toISOString();
  if ((RANK[status] ?? -1) > (RANK[msg.status] ?? -1)) patch.status = status;
  if (errors) patch.error = errors;
  if (Object.keys(patch).length) {
    const { error } = await db.from("whatsapp_messages").update(patch).eq("id", msg.id);
    if (error) throw new Error(error.message);
  }
  return true;
}

export async function reconcilePendingStatuses(db: SupabaseClient, waId: string) {
  const { data, error } = await db.from("whatsapp_status_pending").select("*").eq("wa_message_id", waId);
  if (error) throw new Error(error.message);
  for (const p of data ?? []) {
    if (await applyStatus(db, waId, p.status, p.provider_timestamp, p.errors)) {
      const { error: deleteError } = await db.from("whatsapp_status_pending").delete().eq("id", p.id);
      if (deleteError) throw new Error(deleteError.message);
    }
  }
}

const tsOf = (s?: string) => (s ? new Date(Number(s) * 1000).toISOString() : null);

/** Processes one stored webhook row. Throws on failure so it stays pending. */
export async function processEvent(db: SupabaseClient, row: { delivery_id: string; event: string; payload: any }) {
  const value = row.payload?.entry?.[0]?.changes?.[0]?.value ?? {};
  if (row.event === "whatsapp.message") {
    const names = new Map<string, string>((value.contacts ?? []).map((c: any) => [c.wa_id, c.profile?.name]));
    for (const m of value.messages ?? []) {
      const media = m[m.type] && typeof m[m.type] === "object" && m[m.type].id ? m[m.type] : null;
      const body = m.text?.body ?? m.button?.text ?? m.interactive?.button_reply?.title ?? m.interactive?.list_reply?.title
        ?? media?.caption ?? (m.reaction ? `Reacted ${m.reaction.emoji ?? ""}` : m.location ? `Location: ${m.location.latitude},${m.location.longitude}` : `[${m.type}]`);
      const { error } = await db.from("whatsapp_messages").upsert({
        wa_message_id: m.id, direction: "inbound", contact_phone: m.from, contact_name: names.get(m.from) ?? null,
        type: m.type, body, media_id: media?.id ?? null, media_mime: media?.mime_type ?? null,
        status: "received", provider_timestamp: tsOf(m.timestamp),
      }, { onConflict: "wa_message_id", ignoreDuplicates: true });
      if (error) throw new Error(error.message);
      const inboundText = m.text?.body ?? m.button?.text ?? m.interactive?.button_reply?.title ?? m.interactive?.list_reply?.title ?? m[m.type]?.caption ?? (m.type === "text" ? "" : `[${m.type}]`);
      if (m.from && inboundText) {
        const { processInboundLeadWhatsApp } = await import("@/lib/whatsapp-followups.server");
        await processInboundLeadWhatsApp(db, { from: m.from, text: inboundText, timestamp: m.timestamp });
      }
    }
  } else if (row.event === "whatsapp.status") {
    for (const s of value.statuses ?? []) {
      const ts = tsOf(s.timestamp);
      if (!(await applyStatus(db, s.id, s.status, ts, s.errors ?? null))) {
        const { error } = await db.from("whatsapp_status_pending").upsert({
          wa_message_id: s.id, status: s.status, provider_timestamp: ts, errors: s.errors ?? null, delivery_id: row.delivery_id,
        }, { onConflict: "delivery_id,wa_message_id,status", ignoreDuplicates: true });
        if (error) throw new Error(error.message);
      }
    }
  } else if (row.event === "whatsapp.account_update") {
    const ev = value.event as string | undefined;
    const banned = ev === "DISABLED_UPDATE" && value.ban_info?.waba_ban_state === "DISABLE";
    const pause = ev === "PARTNER_REMOVED" || ev === "PARTNER_APP_UNINSTALLED" || ev === "ACCOUNT_OFFBOARDED" || banned;
    if (pause || ev === "ACCOUNT_RECONNECTED") {
      await db.from("whatsapp_account_state").update({ sending_paused: pause, last_event: ev, updated_at: new Date().toISOString() }).eq("id", 1);
    }
  }
  // Other events (templates, errors, unknown) are stored and acknowledged.
}

/** Retries a few unfinished webhook rows, with backoff so failing rows don't block others. */
export async function recoverPending(db: SupabaseClient, limit = 5) {
  const { data } = await db.from("whatsapp_webhook_events").select("id,delivery_id,event,payload,attempts")
    .is("processed_at", null).lte("next_attempt_at", new Date().toISOString()).order("next_attempt_at").limit(limit);
  for (const r of data ?? []) await runRow(db, r);
  // Old pending statuses whose message was sent elsewhere: drop after 7 days.
  await db.from("whatsapp_status_pending").delete().lt("created_at", new Date(Date.now() - 7 * 864e5).toISOString());
}

export async function runRow(db: SupabaseClient, r: { id: string; delivery_id: string; event: string; payload: any; attempts: number }) {
  try {
    await processEvent(db, r);
    await db.from("whatsapp_webhook_events").update({ processed_at: new Date().toISOString(), processing_error: null, attempts: r.attempts + 1 }).eq("id", r.id);
    return true;
  } catch (e) {
    const delay = Math.min(3600, 30 * 2 ** r.attempts) * 1000;
    await db.from("whatsapp_webhook_events").update({
      processing_error: (e as Error).message, attempts: r.attempts + 1, next_attempt_at: new Date(Date.now() + delay).toISOString(),
    }).eq("id", r.id);
    return false;
  }
}
