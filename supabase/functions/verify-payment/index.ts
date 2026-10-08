// The payment-success page calls this with the tx_ref Flutterwave sent back.
// It confirms the payment server-side (same check as the webhook) and tells
// the page whether the enrolment is active yet.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { confirmPayment } from "../_shared/flutterwave.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const secretKey = Deno.env.get("FLUTTERWAVE_SECRET_KEY");
    if (!secretKey) return json({ error: "Flutterwave is not configured" }, 500);

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false },
    });
    const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    const { data: { user } } = await admin.auth.getUser(token);
    if (!user) return json({ error: "Please sign in" }, 401);

    const { txRef } = await req.json().catch(() => ({}));
    if (!txRef || typeof txRef !== "string") return json({ error: "txRef is required" }, 400);

    // Students can only check their own payments.
    const { data: profile } = await admin.from("profiles").select("faculty_id").eq("id", user.id).maybeSingle();
    const { data: owned } = await admin
      .from("enrollments")
      .select("id")
      .eq("tx_ref", txRef)
      .eq("faculty_id", profile?.faculty_id ?? "")
      .maybeSingle();
    if (!owned) return json({ status: "not_found" }, 404);

    const result = await confirmPayment(admin, secretKey, txRef);
    return json(result.status === "active" ? { status: "active", planName: result.planName, facultyId: result.facultyId } : { status: result.status });
  } catch (e) {
    console.error("verify-payment error:", e);
    return json({ error: "Could not check the payment" }, 500);
  }
});
