// Flutterwave calls this after a card payment. It checks the shared secret
// hash, then confirms the payment with Flutterwave's verify API before any
// enrolment is activated, so a forged or replayed call grants nothing.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { confirmPayment } from "../_shared/flutterwave.ts";

function sameSecret(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const secretHash = Deno.env.get("FLUTTERWAVE_SECRET_HASH");
  const secretKey = Deno.env.get("FLUTTERWAVE_SECRET_KEY");
  if (!secretHash || !secretKey) {
    console.error("flutterwave-webhook: FLUTTERWAVE_SECRET_HASH or FLUTTERWAVE_SECRET_KEY is not set");
    return new Response("Not configured", { status: 500 });
  }
  if (!sameSecret(req.headers.get("verif-hash") ?? "", secretHash)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await req.json().catch(() => null);
  const txRef = payload?.data?.tx_ref ?? payload?.txRef;
  if (!txRef || typeof txRef !== "string") return new Response("ok");

  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false },
    });
    const result = await confirmPayment(admin, secretKey, txRef);
    console.log("flutterwave-webhook", txRef, result.status);
    return new Response("ok");
  } catch (e) {
    console.error("flutterwave-webhook error:", e);
    // A 5xx makes Flutterwave retry later.
    return new Response("Error", { status: 500 });
  }
});
