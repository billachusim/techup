// Starts a Flutterwave card payment for Virtual SIWES, the logbook service or
// the SIWES Success Kit. No sign-in or Faculty ID: the buyer gives a name,
// email and phone. The buyer is saved as a lead (so the order shows in the
// leads inbox) and the order is saved as pending with the amount due. Only a
// payment Flutterwave verifies for that amount marks it paid (verify-payment
// on return, or recover-checkouts every 30 minutes).
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { ORDER_REF_PREFIX, priceOrder } from "../_shared/products.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

/** Trimmed text, cut to `max` characters; empty becomes null. */
const clean = (value: unknown, max: number) => {
  const text = typeof value === "string" ? value.trim().slice(0, max) : "";
  return text || null;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const flutterwaveKey = Deno.env.get("FLUTTERWAVE_SECRET_KEY");
    if (!flutterwaveKey) return json({ error: "Card payment is not set up yet. Please reserve your slot instead." }, 500);

    const body = await req.json().catch(() => ({}));
    const priced = priceOrder(body.items);
    if (!priced.ok) return json({ error: priced.error }, 400);

    const name = clean(body.name, 120);
    const email = clean(body.email, 200)?.toLowerCase() ?? null;
    const phone = clean(body.phone, 40);
    if (!name) return json({ error: "Enter your name" }, 400);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Enter a valid email address for your receipt" }, 400);
    if (!phone || phone.replace(/\D/g, "").length < 10) return json({ error: "Enter a WhatsApp number we can reach you on" }, 400);
    const school = clean(body.school, 160);
    const notes = clean(body.notes, 600);
    const source = clean(body.source, 200) ?? "online-order";

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false },
    });

    const { products, totalNGN } = priced;
    const items = products.map((p) => p.id);
    const txRef = `${ORDER_REF_PREFIX}${crypto.randomUUID()}`;
    const leadId = crypto.randomUUID();
    const itemNames = products.map((p) => p.name).join(" + ");

    // Filed in the leads inbox like a reserve form, so a coordinator sees it either way.
    const { error: leadErr } = await admin.from("leads").insert({
      id: leadId,
      name,
      channel: "email",
      contact: email,
      email,
      school,
      interest: products[0].leadInterest,
      source,
      notes: [`Card checkout started: ${itemNames}, ₦${totalNGN.toLocaleString("en-NG")}`, `WhatsApp: ${phone}`, notes]
        .filter(Boolean)
        .join(" | ")
        .slice(0, 1000),
    });
    if (leadErr) {
      console.error("create-order-checkout: could not save lead", leadErr);
      return json({ error: "Could not start your payment. Please try again." }, 500);
    }

    const { error: orderErr } = await admin.from("product_orders").insert({
      tx_ref: txRef,
      items,
      amount_due: totalNGN,
      currency: "NGN",
      name,
      email,
      phone,
      school,
      notes,
      lead_id: leadId,
      status: "pending",
    });
    if (orderErr) {
      console.error("create-order-checkout: could not save order", orderErr);
      return json({ error: "Could not start your payment. Please try again." }, 500);
    }
    const dropPending = () => admin.from("product_orders").delete().eq("tx_ref", txRef).eq("status", "pending");

    // The return page is always our own site, never a URL from the request.
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://techfaculty.ng";
    const flwResponse = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${flutterwaveKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: totalNGN,
        currency: "NGN",
        redirect_url: `${siteUrl}/order-complete?tx_ref=${encodeURIComponent(txRef)}`,
        meta: { items: items.join(","), source },
        customer: { email, name, phonenumber: phone },
        customizations: {
          title: "Tech Faculty NG",
          description: itemNames,
          logo: "https://techfaculty.ng/favicon.png",
        },
      }),
    });
    const flwData = await flwResponse.json().catch(() => null) as { status?: string; message?: string; data?: { link?: string } } | null;
    if (!flwResponse.ok || flwData?.status !== "success" || !flwData?.data?.link) {
      console.error("create-order-checkout: Flutterwave error", { status: flwResponse.status, data: flwData });
      await dropPending();
      return json({ error: flwData?.message || "Could not open the payment page. Please try again or reserve your slot instead." }, 502);
    }

    return json({ url: flwData.data.link, txRef });
  } catch (e) {
    console.error("create-order-checkout error:", e);
    return json({ error: "Could not start your payment. Please try again." }, 500);
  }
});
