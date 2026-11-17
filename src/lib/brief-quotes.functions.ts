import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Staff: emails the client the quote saved by the create-brief-quote function
 * (amount, note and Flutterwave pay link) and restarts the follow-up count, so
 * the daily follow-ups remind them about the quote on days 2 and 5.
 */
export const sendBriefQuote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ briefId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: staff } = await context.supabase.rpc("is_staff", {
      _user_id: context.userId,
    });
    if (!staff) return { ok: false, error: "Staff only" };
    const { supabaseAdmin } =
      await import("@/integrations/supabase/client.server");
    const { data: b } = await supabaseAdmin
      .from("business_briefs")
      .select(
        "id, contact_name, email, project_title, quote_amount, quote_note, pay_link_url, pay_tx_ref",
      )
      .eq("id", data.briefId)
      .maybeSingle();
    if (!b?.pay_link_url || !b.quote_amount)
      return { ok: false, error: "Create the quote first" };
    if (!b.email)
      return {
        ok: false,
        error: "No client email: send the pay link on WhatsApp",
      };
    const { sendTemplateEmail } =
      await import("@/lib/email-templates/send-email");
    await sendTemplateEmail("service-quote", b.email, {
      templateData: {
        contactName: b.contact_name,
        title: b.project_title.replace(/^Service order: /, ""),
        amount: `₦${b.quote_amount.toLocaleString("en-NG")}`,
        note: b.quote_note,
        payUrl: b.pay_link_url,
      },
      idempotencyKey: `service-quote-${b.id}-${b.pay_tx_ref}`,
    });
    await supabaseAdmin
      .from("business_briefs")
      .update({
        quote_sent_at: new Date().toISOString(),
        followup_count: 0,
        last_followup_at: null,
      })
      .eq("id", b.id);
    return { ok: true };
  });
