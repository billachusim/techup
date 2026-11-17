// Public: prices a standard /services order and creates its Flutterwave pay link.
// The order (business_briefs row "Service order: <name>") is created by the visitor's
// form just before this call. The amount always comes from the shared price list
// (_shared/service-prices.ts), never from the request. The link is saved on the
// brief as its quote, so the order email carries it, the day-2/day-5 follow-ups
// remind about it, and flutterwave-webhook marks the brief paid ("brief-" refs).
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { MAX_ORDER_QUANTITY, SERVICE_PRICES } from "../_shared/service-prices.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

// Only orders created in the last few minutes can be priced here.
const RECENT_MS = 15 * 60 * 1000;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return reply({ error: "Method not allowed" }, 405);
  try {
    const { briefId, slug, quantity } = (await req.json().catch(() => ({}))) as { briefId?: string; slug?: string; quantity?: number };
    const service = slug ? SERVICE_PRICES[slug] : undefined;
    const qty = Math.floor(Number(quantity));
    if (!briefId || !service || !Number.isFinite(qty) || qty < 1 || qty > MAX_ORDER_QUANTITY) {
      return reply({ error: "Unknown service or quantity" }, 400);
    }

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false },
    });
    const { data: brief } = await admin
      .from("business_briefs")
      .select("id, created_at, project_title, contact_name, email, phone, pay_link_url, quote_amount, paid_at")
      .eq("id", briefId)
      .maybeSingle();
    if (!brief || Date.now() - Date.parse(brief.created_at) > RECENT_MS) return reply({ error: "Order not found" }, 404);
    if (brief.project_title !== `Service order: ${service.name}`) return reply({ error: "Order does not match this service" }, 400);
    if (brief.paid_at) return reply({ error: "Already paid" }, 409);
    // A repeat click returns the link already made.
    if (brief.pay_link_url) return reply({ ok: true, payUrl: brief.pay_link_url, amount: brief.quote_amount });

    const secretKey = Deno.env.get("FLUTTERWAVE_SECRET_KEY");
    if (!secretKey) return reply({ error: "Payments are not configured" }, 500);
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://techfaculty.ng";
    const amount = service.price * qty;
    const txRef = `brief-${brief.id.slice(0, 8)}-${Date.now()}`;
    const what = `${qty} × ${service.name} (${service.unit})`;

    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        tx_ref: txRef,
        amount,
        currency: "NGN",
        redirect_url: `${siteUrl}/services/${slug}?paid=1`,
        meta: { brief_id: brief.id, source: "service-pay-now", slug, quantity: qty },
        customer: { email: brief.email || "payments@techfaculty.ng", name: brief.contact_name, phonenumber: brief.phone },
        customizations: { title: "Tech Faculty NG", description: what.slice(0, 200), logo: "https://techfaculty.ng/favicon.png" },
      }),
    });
    const body = await res.json().catch(() => null);
    const link = res.ok && body?.status === "success" ? String(body?.data?.link ?? "") : "";
    if (!link) {
      console.error("create-service-checkout: Flutterwave link failed", { status: res.status, message: body?.message });
      return reply({ error: "Could not create the pay link. We will email you a quote instead." }, 502);
    }

    const { error } = await admin
      .from("business_briefs")
      .update({
        quote_amount: amount,
        quote_note: what,
        pay_link_url: link,
        pay_tx_ref: txRef,
        quote_sent_at: new Date().toISOString(),
        status: "reviewing",
      })
      .eq("id", brief.id)
      .is("pay_link_url", null);
    if (error) throw error;
    return reply({ ok: true, payUrl: link, amount });
  } catch (e) {
    console.error("create-service-checkout error", e);
    return reply({ error: "Server error" }, 500);
  }
});
