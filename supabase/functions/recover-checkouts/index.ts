// Runs once a day (05:30 UTC) from pg_cron. Card payments are normally confirmed by
// verify-payment when Flutterwave sends the student back to the site, so a
// student who closes the tab stays pending. This re-checks recent pending card
// checkouts with Flutterwave's verify API and activates the paid ones, then
// asks the site to send the follow-up emails (payment confirmed / reminder).
// Safe to call any time: confirmPayment and the emails are idempotent.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { confirmPayment } from "../_shared/flutterwave.ts";

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;
// Leave fresh checkouts to the payment page, and stop checking after a week.
const CHECK_AFTER = 5 * MINUTE;
const CHECK_FOR = 7 * DAY;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

serve(async () => {
  try {
    const secretKey = Deno.env.get("FLUTTERWAVE_SECRET_KEY");
    if (!secretKey) return json({ error: "Flutterwave is not configured" }, 500);

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false },
    });

    const now = Date.now();
    const { data: pending, error } = await admin
      .from("enrollments")
      .select("tx_ref")
      .eq("status", "pending")
      .not("tx_ref", "is", null)
      .lte("created_at", new Date(now - CHECK_AFTER).toISOString())
      .gte("created_at", new Date(now - CHECK_FOR).toISOString())
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;

    let confirmed = 0;
    for (const { tx_ref } of pending ?? []) {
      try {
        const result = await confirmPayment(admin, secretKey, tx_ref, { recovered_at: new Date().toISOString() });
        if (result.status === "active") confirmed++;
      } catch (e) {
        console.error("recover-checkouts: could not check", tx_ref, e);
      }
    }

    // The site sends the emails, since that is where the email templates live.
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://techfaculty.ng";
    let followups: unknown = null;
    try {
      const res = await fetch(`${siteUrl}/api/payment-followups`, { method: "POST" });
      followups = await res.json().catch(() => ({ status: res.status }));
    } catch (e) {
      console.error("recover-checkouts: follow-up emails failed", e);
    }

    console.log("recover-checkouts", { checked: pending?.length ?? 0, confirmed, followups });
    return json({ checked: pending?.length ?? 0, confirmed, followups });
  } catch (e) {
    console.error("recover-checkouts error:", e);
    return json({ error: "Could not re-check pending payments" }, 500);
  }
});
