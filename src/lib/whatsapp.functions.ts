import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertStaff(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase.rpc("is_staff", { _user_id: ctx.userId });
  if (!data) throw new Error("Staff only");
}

const SendInput = z.object({
  to: z.string().min(6).max(20),
  text: z.string().trim().min(1).max(4096).optional(),
  template: z.object({
    name: z.string().min(1).max(512),
    language: z.string().min(2).max(15),
    params: z.array(z.string().max(1000)).max(20).optional(),
  }).optional(),
}).refine((d) => !!d.text !== !!d.template, "Send either text or a template");

export const sendWhatsAppMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => SendInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { sendWhatsApp } = await import("@/lib/whatsapp.server");
    try {
      const r = data.template
        ? await sendWhatsApp({ to: data.to, template: data.template, sentBy: context.userId })
        : await sendWhatsApp({ to: data.to, text: data.text!, sentBy: context.userId });
      return { ok: true as const, id: r.id };
    } catch (e) {
      return { ok: false as const, error: (e as Error).message };
    }
  });

export const listWhatsAppTemplates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { gateway } = await import("@/lib/whatsapp.server");
    try {
      const res = await gateway("/message_templates?limit=100&fields=name,status,language,category,components");
      return { ok: true as const, templates: (res?.data ?? []) as Array<{ name: string; status: string; language: string; category: string; components: any[] }> };
    } catch (e) {
      return { ok: false as const, templates: [], error: (e as Error).message };
    }
  });

const TemplateInput = z.object({
  name: z.string().regex(/^[a-z0-9_]{1,512}$/, "Use lowercase letters, numbers and underscores"),
  language: z.string().min(2).max(15),
  category: z.enum(["UTILITY", "MARKETING"]),
  body: z.string().trim().min(10).max(1024),
  examples: z.array(z.string().min(1).max(200)).max(20),
});

export const createWhatsAppTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => TemplateInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const vars = data.body.match(/\{\{\d+\}\}/g)?.length ?? 0;
    if (vars !== data.examples.length) return { ok: false as const, error: `Give one example for each of the ${vars} blanks.` };
    const { gateway } = await import("@/lib/whatsapp.server");
    try {
      await gateway("/message_templates", {
        method: "POST",
        body: {
          name: data.name, language: data.language, category: data.category,
          components: [{ type: "BODY", text: data.body, ...(vars ? { example: { body_text: [data.examples] } } : {}) }],
        },
      });
      return { ok: true as const };
    } catch (e) {
      return { ok: false as const, error: (e as Error).message };
    }
  });

export const deleteWhatsAppTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ name: z.string().regex(/^[a-z0-9_]+$/) }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) return { ok: false as const, error: "Admins only" };
    const { gateway } = await import("@/lib/whatsapp.server");
    try {
      await gateway(`/message_templates?name=${encodeURIComponent(data.name)}`, { method: "DELETE" });
      return { ok: true as const };
    } catch (e) {
      return { ok: false as const, error: (e as Error).message };
    }
  });

/** Streams an inbound photo/document to staff, size-capped. Returns base64 data URL. */
export const getWhatsAppMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ mediaId: z.string().regex(/^\d+$/) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const MAX = 8 * 1024 * 1024;
    const { gateway } = await import("@/lib/whatsapp.server");
    try {
      const meta = await gateway(`/media/${data.mediaId}`);
      if (Number(meta?.file_size ?? 0) > MAX) return { ok: false as const, error: "File is too large to preview (over 8 MB)." };
      const res = await fetch("https://connector-gateway.lovable.dev/whatsapp/media_download", {
        headers: {
          Authorization: `Bearer ${process.env["LOVABLE_API_KEY"]}`,
          "X-Connection-Api-Key": process.env["WHATSAPP_API_KEY"] ?? "",
          "X-WhatsApp-Media-URL": meta.url,
        },
      });
      if (!res.ok || !res.body) return { ok: false as const, error: `Download failed [${res.status}]` };
      const reader = res.body.getReader();
      const chunks: Uint8Array[] = [];
      let total = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > MAX) { await reader.cancel(); return { ok: false as const, error: "File is too large to preview." }; }
        chunks.push(value);
      }
      const buf = new Uint8Array(total);
      let o = 0;
      for (const c of chunks) { buf.set(c, o); o += c.byteLength; }
      let bin = "";
      for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
      const mime = res.headers.get("content-type") ?? meta.mime_type ?? "application/octet-stream";
      return { ok: true as const, dataUrl: `data:${mime};base64,${btoa(bin)}`, mime };
    } catch (e) {
      return { ok: false as const, error: (e as Error).message };
    }
  });
