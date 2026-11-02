import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  CAMPAIGN_ID, CAMPAIGN_TEMPLATES, campaignParams, canMessage, phoneKey, segmentFor,
  type CampaignLead, type CourseOffer, type Segment,
} from "@/lib/whatsapp-campaign";

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
  if (!data) throw new Error("Admins only");
}

const SEGMENTS: Segment[] = ["general", "siwes", "course", "student"];

async function loadAudience() {
  const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
  const [leads, enrols, profiles, regs, sends] = await Promise.all([
    db.from("leads").select("id, name, contact, interest, status, notes, source, whatsapp_opt_out_at, channel").order("created_at", { ascending: true }).limit(5000),
    db.from("enrollments").select("faculty_id").in("status", ["active", "confirmed"]),
    db.from("profiles").select("faculty_id, phone").not("phone", "is", null),
    db.from("faculty_ids").select("faculty_id, phone").not("phone", "is", null),
    db.from("whatsapp_campaign_sends").select("lead_id, phone, status, error").eq("campaign", CAMPAIGN_ID),
  ]);
  for (const r of [leads, enrols, profiles, regs, sends]) if (r.error) throw new Error(r.error.message);

  const enrolled = new Set((enrols.data ?? []).map((e) => e.faculty_id));
  const studentPhones = new Set<string>();
  for (const p of [...(profiles.data ?? []), ...(regs.data ?? [])]) {
    if (p.faculty_id && enrolled.has(p.faculty_id) && p.phone) studentPhones.add(phoneKey(p.phone));
  }
  const { departments } = await import("@/data/departments");
  const { planMinimum } = await import("@/lib/fees");
  const courses: Record<string, CourseOffer> = {};
  for (const d of departments) {
    const price = d.planId ? planMinimum(d.planId) : undefined;
    if (price) courses[d.slug] = { slug: d.slug, title: d.title, price };
  }
  const sentByLead = new Map((sends.data ?? []).map((s) => [s.lead_id, s]));
  const sentPhones = new Set((sends.data ?? []).filter((s) => s.status === "sent").map((s) => phoneKey(s.phone)));

  // One message per phone number, even when the same person filled several forms.
  const seen = new Set<string>();
  const audience = (leads.data as (CampaignLead & { channel: string })[]).map((l) => {
    const segment = segmentFor(l, studentPhones);
    const key = phoneKey(l.contact);
    const duplicate = seen.has(key);
    seen.add(key);
    return { lead: l, segment, duplicate, send: sentByLead.get(l.id) ?? null, ok: canMessage(l) && !duplicate };
  });
  return { db, audience, courses, sentPhones };
}

async function templateStatuses() {
  const { gateway } = await import("@/lib/whatsapp.server");
  const res = await gateway("/message_templates?limit=200&fields=name,status,language,category");
  const map: Record<string, string> = {};
  for (const t of (res?.data ?? []) as Array<{ name: string; status: string; language: string }>) {
    if (t.language === "en_US" || !map[t.name]) map[t.name] = t.status;
  }
  return map;
}

/** Admin: who gets which message, template approval and progress. */
export const getCampaignOverview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { audience } = await loadAudience();
    let templates: Record<string, string> = {};
    let templateError: string | null = null;
    try { templates = await templateStatuses(); } catch (e) { templateError = (e as Error).message; }
    const groups = SEGMENTS.map((s) => {
      const rows = audience.filter((a) => a.segment === s);
      const t = CAMPAIGN_TEMPLATES[s];
      return {
        segment: s,
        template: t.name,
        preview: t.body,
        templateStatus: templates[t.name] ?? "NOT_SUBMITTED",
        total: rows.length,
        reachable: rows.filter((r) => r.ok).length,
        sent: rows.filter((r) => r.send?.status === "sent").length,
        failed: rows.filter((r) => r.send?.status === "failed").length,
        lastError: rows.find((r) => r.send?.status === "failed")?.send?.error ?? null,
      };
    });
    return {
      campaign: CAMPAIGN_ID,
      totalLeads: audience.length,
      optedOut: audience.filter((a) => a.lead.whatsapp_opt_out_at).length,
      duplicates: audience.filter((a) => a.duplicate).length,
      noPhone: audience.filter((a) => !a.duplicate && !a.lead.whatsapp_opt_out_at && !canMessage(a.lead)).length,
      groups,
      templateError,
    };
  });

/** Admin: submit the four campaign messages to Meta for approval (skips ones already there). */
export const submitCampaignTemplates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { gateway } = await import("@/lib/whatsapp.server");
    const existing = await templateStatuses();
    const results: Array<{ name: string; ok: boolean; error?: string }> = [];
    for (const s of SEGMENTS) {
      const t = CAMPAIGN_TEMPLATES[s];
      if (existing[t.name] && existing[t.name] !== "REJECTED") { results.push({ name: t.name, ok: true }); continue; }
      try {
        await gateway("/message_templates", {
          method: "POST",
          body: {
            name: t.name, language: "en_US", category: "MARKETING",
            components: [{ type: "BODY", text: t.body, example: { body_text: [t.examples] } }],
          },
        });
        results.push({ name: t.name, ok: true });
      } catch (e) {
        results.push({ name: t.name, ok: false, error: (e as Error).message.slice(0, 300) });
      }
    }
    return { results };
  });

/** Admin: send the next batch. Safe to press repeatedly; nobody gets the message twice. */
export const sendCampaignBatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ limit: z.number().int().min(1).max(40).default(25), retryFailed: z.boolean().default(false) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { db, audience, courses, sentPhones } = await loadAudience();
    const templates = await templateStatuses();
    const approved = new Set(SEGMENTS.filter((s) => templates[CAMPAIGN_TEMPLATES[s].name] === "APPROVED"));
    if (approved.size === 0) return { sent: 0, failed: 0, remaining: 0, note: "No campaign message is approved by Meta yet." };

    const queue = audience.filter((a) =>
      a.ok && approved.has(a.segment) && !sentPhones.has(phoneKey(a.lead.contact)) &&
      (!a.send || (data.retryFailed && a.send.status === "failed")));
    const { sendWhatsApp } = await import("@/lib/whatsapp.server");
    let sent = 0, failed = 0;
    for (const a of queue.slice(0, data.limit)) {
      const template = CAMPAIGN_TEMPLATES[a.segment].name;
      // Reserve first, so two clicks can't both send to this lead.
      if (!a.send) {
        const { error } = await db.from("whatsapp_campaign_sends").insert({
          campaign: CAMPAIGN_ID, lead_id: a.lead.id, segment: a.segment, template_name: template,
          phone: a.lead.contact, status: "sending", sent_by: context.userId,
        });
        if (error) continue;
      } else {
        const { data: claimed } = await db.from("whatsapp_campaign_sends")
          .update({ status: "sending", error: null }).eq("campaign", CAMPAIGN_ID).eq("lead_id", a.lead.id).eq("status", "failed").select("id");
        if (!claimed?.length) continue;
      }
      try {
        const r = await sendWhatsApp({
          to: a.lead.contact,
          template: { name: template, language: "en_US", params: campaignParams(a.lead, a.segment, courses) },
          sentBy: context.userId,
        });
        await db.from("whatsapp_campaign_sends").update({ status: "sent", message_id: r.id }).eq("campaign", CAMPAIGN_ID).eq("lead_id", a.lead.id);
        sentPhones.add(phoneKey(a.lead.contact));
        sent++;
      } catch (e) {
        await db.from("whatsapp_campaign_sends").update({ status: "failed", error: (e as Error).message.slice(0, 500) }).eq("campaign", CAMPAIGN_ID).eq("lead_id", a.lead.id);
        failed++;
      }
    }
    return { sent, failed, remaining: Math.max(0, queue.length - data.limit), note: null };
  });
