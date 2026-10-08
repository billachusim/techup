import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Input = z.object({
  event: z.enum([
    "application_submitted",
    "match_updated",
    "deliverable_reviewed",
    "talent_approved",
    "profile_submitted",
    "intro_approved",
  ]),
  id: z.string().uuid(),
});

const MATCH_EMAIL_STATUSES = ["approved", "accepted", "assessment", "interview", "hired"];

/**
 * Sends the marketplace email for one event. The recipient is always looked up
 * server-side from the record — callers only pass the event and record id.
 */
export const notifyMarketplaceEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
    const { data: staff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });

    const send = async (template: string, to: string | null | undefined, templateData: Record<string, unknown>, key: string) => {
      if (!to) return;
      try {
        await sendTemplateEmail(template, to, { templateData, idempotencyKey: `${template}-${key}` });
      } catch (e) {
        console.error("marketplace email failed", template, (e as Error).message);
      }
    };

    if (data.event === "application_submitted") {
      const { data: app } = await supabaseAdmin
        .from("talent_applications")
        .select("id, talent_profiles(user_id, full_name, email), talent_roles(title, company)")
        .eq("id", data.id)
        .maybeSingle();
      const p = app?.talent_profiles as any, r = app?.talent_roles as any;
      if (!app || p?.user_id !== context.userId) return { ok: false };
      await send("application-received", p.email, { name: p.full_name, roleTitle: r?.title, company: r?.company }, app.id);
      await send("new-application-admin", "staff", { talentName: p.full_name, roleTitle: r?.title, company: r?.company }, app.id);
      return { ok: true };
    }

    if (data.event === "profile_submitted") {
      const { data: p } = await supabaseAdmin
        .from("talent_profiles")
        .select("id, user_id, full_name, email, faculty_id, profile_strength")
        .eq("id", data.id)
        .maybeSingle();
      if (!p || (p.user_id !== context.userId && !staff)) return { ok: false };
      await send(
        "profile-submitted",
        p.email,
        { name: p.full_name, strength: p.profile_strength, facultyId: p.faculty_id },
        `${p.id}-${p.profile_strength}`,
      );
      return { ok: true };
    }

    if (!staff) return { ok: false };

    if (data.event === "intro_approved") {
      const { data: req } = await supabaseAdmin
        .from("talent_interest_requests")
        .select("id, requester_name, requester_contact, status, talent_profiles(full_name)")
        .eq("id", data.id)
        .maybeSingle();
      if (!req || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(req.requester_contact ?? "")) return { ok: false };
      await send(
        "intro-approved",
        req.requester_contact,
        { requesterName: req.requester_name, talentName: (req.talent_profiles as any)?.full_name },
        req.id,
      );
      return { ok: true };
    }

    if (data.event === "match_updated") {
      const { data: m } = await supabaseAdmin
        .from("role_matches")
        .select("id, status, talent_profiles(full_name, email), talent_roles(title, company)")
        .eq("id", data.id)
        .maybeSingle();
      if (!m || !MATCH_EMAIL_STATUSES.includes(m.status)) return { ok: false };
      const p = m.talent_profiles as any, r = m.talent_roles as any;
      await send("match-update", p?.email, { name: p?.full_name, roleTitle: r?.title, company: r?.company, status: m.status }, `${m.id}-${m.status}`);
      return { ok: true };
    }

    if (data.event === "deliverable_reviewed") {
      const { data: d } = await supabaseAdmin
        .from("talent_deliverables")
        .select("id, title, status, reviewer_note, updated_at, talent_profiles(full_name, email), talent_roles(title)")
        .eq("id", data.id)
        .maybeSingle();
      if (!d || d.status === "submitted") return { ok: false };
      const p = d.talent_profiles as any, r = d.talent_roles as any;
      await send("deliverable-reviewed", p?.email, { name: p?.full_name, title: d.title, roleTitle: r?.title, status: d.status, note: d.reviewer_note }, `${d.id}-${d.updated_at}`);
      return { ok: true };
    }

    const { data: t } = await supabaseAdmin
      .from("talent_profiles")
      .select("id, full_name, email, faculty_id, is_vetted")
      .eq("id", data.id)
      .maybeSingle();
    if (!t?.is_vetted) return { ok: false };
    await send("talent-approved", t.email, { name: t.full_name, facultyId: t.faculty_id }, t.id);
    return { ok: true };
  });

/**
 * Staff-only check that email delivery works: sends one sample email to the
 * signed-in staff member and returns the provider's error instead of hiding it,
 * so "domain not verified" shows up plainly until alerts.techfaculty.ng is live.
 */
export const sendTestEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: staff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!staff) return { ok: false as const, error: "Staff only" };
    const to = context.claims.email as string | undefined;
    if (!to) return { ok: false as const, error: "Your account has no email address" };
    try {
      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
      const res = await sendTemplateEmail("talent-approved", to, { templateData: { name: "Test", facultyId: "TF-TEST-0000" } });
      return res.sent ? { ok: true as const, to } : { ok: false as const, error: `${to} is on the suppression list` };
    } catch (e) {
      const err = e as Error & { code?: string; status?: number };
      return { ok: false as const, error: [err.code, err.status, err.message].filter(Boolean).join(" · ") };
    }
  });
