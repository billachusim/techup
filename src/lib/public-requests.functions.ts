import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Public confirmation emails for the two sign-in-free client forms.
// Recipients are read from the stored record, never from the caller, and the
// record must have been created in the last few minutes.

const RECENT_MS = 10 * 60 * 1000;
const isEmail = (v?: string | null) => !!v && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

async function sendSafely(template: string, to: string | null | undefined, templateData: Record<string, unknown>, key: string) {
  if (!to) return;
  try {
    const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
    await sendTemplateEmail(template, to, { templateData, idempotencyKey: `${template}-${key}` });
  } catch (e) {
    console.error("public request email failed", template, (e as Error).message);
  }
}

/** Confirms a client's "introduce me to this talent" request and alerts staff. */
export const notifyIntroRequest = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ talentId: z.string().uuid(), contact: z.string().min(5).max(160) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: req } = await supabaseAdmin
      .from("talent_interest_requests")
      .select("id, created_at, requester_name, requester_org, requester_contact, message, talent_profiles(full_name)")
      .eq("talent_profile_id", data.talentId)
      .eq("requester_contact", data.contact.trim())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!req || Date.now() - new Date(req.created_at).getTime() > RECENT_MS) return { ok: false };

    const talentName = req.talent_profiles?.full_name as string | undefined;
    if (isEmail(req.requester_contact)) {
      await sendSafely("intro-request-received", req.requester_contact, { requesterName: req.requester_name, talentName }, req.id);
    }
    await sendSafely(
      "intro-request-admin",
      "staff",
      {
        requesterName: req.requester_name,
        requesterOrg: req.requester_org,
        requesterContact: req.requester_contact,
        talentName,
        message: req.message,
      },
      req.id,
    );
    return { ok: true };
  });

/** Confirms a business hiring request and alerts staff. */
export const notifyHiringRequest = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ briefId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: brief } = await supabaseAdmin
      .from("business_briefs")
      .select("id, created_at, company, contact_name, email, phone, project_title")
      .eq("id", data.briefId)
      .maybeSingle();
    if (!brief || Date.now() - new Date(brief.created_at).getTime() > RECENT_MS) return { ok: false };

    if (isEmail(brief.email)) {
      await sendSafely(
        "hiring-request-received",
        brief.email,
        { contactName: brief.contact_name, company: brief.company, projectTitle: brief.project_title },
        brief.id,
      );
    }
    await sendSafely(
      "hiring-request-admin",
      "staff",
      { contactName: brief.contact_name, company: brief.company, projectTitle: brief.project_title, phone: brief.phone, email: brief.email },
      brief.id,
    );
    return { ok: true };
  });
