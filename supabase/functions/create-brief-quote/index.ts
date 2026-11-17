// Staff-only: creates a Flutterwave pay link for a client brief or /services order
// and saves the quote on business_briefs. The site then emails the quote
// (sendBriefQuote in src/lib/brief-quotes.functions.ts). flutterwave-webhook marks
// the brief paid when a "brief-" payment is confirmed.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false },
    });
    const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? "";
    const { data: auth } = token ? await admin.auth.getUser(token) : { data: { user: null } };
    if (!auth.user) return reply({ error: "Please sign in with a staff account" }, 401);
    const { data: staff } = await admin.rpc("is_staff", { _user_id: auth.user.id });
    if (!staff) return reply({ error: "Staff only" }, 403);

    const { briefId, amount, note } = (await req.json().catch(() => ({}))) as { briefId?: string; amount?: number; note?: string };
    const naira = Math.round(Number(amount));
    if (!briefId || !Number.isFinite(naira) || naira < 1000 || naira > 10_000_000) {
      return reply({ error: "briefId and an amount between ₦1,000 and ₦10,000,000 are required" }, 400);
    }
    const { data: brief } = await admin
      .from("business_briefs")
      .select("id, company, contact_name, email, phone, project_title, paid_at")
      .eq("id", briefId)
      .maybeSingle();
    if (!brief) return reply({ error: "Brief not found" }, 404);
    if (brief.paid_at) return reply({ error: "This brief is already paid" }, 409);

    const secretKey = Deno.env.get("FLUTTERWAVE_SECRET_KEY");
    if (!secretKey) return reply({ error: "Payments are not configured" }, 500);
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://techfaculty.ng";
    const txRef = `brief-${brief.id.slice(0, 8)}-${Date.now()}`;
    const title = String(brief.project_title).replace(/^(Service order|Custom request): /, "");

    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: naira,
        currency: "NGN",
        redirect_url: `${siteUrl}/services?paid=1`,
        meta: { brief_id: brief.id, source: "brief-quote" },
        customer: { email: brief.email || "payments@techfaculty.ng", name: brief.contact_name, phonenumber: brief.phone },
        customizations: { title: "Tech Faculty NG", description: title.slice(0, 200), logo: "https://techfaculty.ng/favicon.png" },
      }),
    });
    const body = await res.json().catch(() => null);
    const link = res.ok && body?.status === "success" ? String(body?.data?.link ?? "") : "";
    if (!link) {
      console.error("create-brief-quote: Flutterwave link failed", { status: res.status, message: body?.message });
      return reply({ error: "Could not create the pay link. Try again." }, 502);
    }

    const { error } = await admin
      .from("business_briefs")
      .update({
        quote_amount: naira,
        quote_note: note ? String(note).slice(0, 1000) : null,
        pay_link_url: link,
        pay_tx_ref: txRef,
        status: "reviewing",
      })
      .eq("id", brief.id);
    if (error) throw error;
    return reply({ ok: true, payUrl: link, txRef });
  } catch (e) {
    console.error("create-brief-quote error", e);
    return reply({ error: "Server error" }, 500);
  }
});
