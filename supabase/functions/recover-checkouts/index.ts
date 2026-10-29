// Runs every 30 minutes from pg_cron. Card payments are normally confirmed by
// verify-payment when Flutterwave sends the student back to the site, so a
// student who closes the tab stays pending. This re-checks recent pending card
// checkouts with Flutterwave's verify API and activates the paid ones (and
// does the same for online orders: Virtual SIWES, logbook service, kit), then
// asks the site to send the follow-up emails (payment confirmed / reminder).
// It also chases WhatsApp and email (bank transfer) requests with Flutterwave
// pay links, and cancels them 14 days after the link if still unpaid
// (_shared/manual-payments.ts).
// Safe to call any time: confirmPayment and the emails are idempotent.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { triggerPaymentFollowups } from "../_shared/payment-followups.ts";
import { confirmOrderPayment, confirmPayment } from "../_shared/flutterwave.ts";
import { chaseManualPayments } from "../_shared/manual-payments.ts";

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

    // Balances of instalment plans, checked the same way.
    const { data: balances, error: balanceErr } = await admin
      .from("enrollment_payments")
      .select("tx_ref")
      .eq("status", "pending")
      .lte("created_at", new Date(now - CHECK_AFTER).toISOString())
      .gte("created_at", new Date(now - CHECK_FOR).toISOString())
      .order("created_at", { ascending: false })
      .limit(100);
    if (balanceErr) console.error("recover-checkouts: could not list balance payments", balanceErr);
    let balancesPaid = 0;
    for (const { tx_ref } of balances ?? []) {
      try {
        const result = await confirmPayment(admin, secretKey, tx_ref);
        if (result.status === "active") balancesPaid++;
      } catch (e) {
        console.error("recover-checkouts: could not check balance", tx_ref, e);
      }
    }

    const { data: pendingOrders, error: ordersErr } = await admin
      .from("product_orders")
      .select("tx_ref")
      .eq("status", "pending")
      .lte("created_at", new Date(now - CHECK_AFTER).toISOString())
      .gte("created_at", new Date(now - CHECK_FOR).toISOString())
      .order("created_at", { ascending: false })
      .limit(100);
    // Until the orders migration is run the table is missing; enrolments still get checked.
    if (ordersErr) console.error("recover-checkouts: could not list orders", ordersErr);

    let ordersPaid = 0;
    for (const { tx_ref } of pendingOrders ?? []) {
      try {
        const result = await confirmOrderPayment(admin, secretKey, tx_ref, { recovered_at: new Date().toISOString() });
        if (result.status === "paid") ordersPaid++;
      } catch (e) {
        console.error("recover-checkouts: could not check order", tx_ref, e);
      }
    }

    // Until the manual-payments migration is run its columns are missing; the rest still runs.
    let manual: unknown = null;
    try {
      manual = await chaseManualPayments(admin, secretKey);
    } catch (e) {
      console.error("recover-checkouts: chasing WhatsApp/bank requests failed", e);
    }

    // The site sends the emails, since that is where the email templates live.
    let followups: unknown = null;
    try {
      followups = await triggerPaymentFollowups(admin);
    } catch (e) {
      console.error("recover-checkouts: follow-up emails failed", e);
    }

    const summary = { checked: pending?.length ?? 0, confirmed, balancesPaid, ordersChecked: pendingOrders?.length ?? 0, ordersPaid, manual, followups };
    console.log("recover-checkouts", summary);
    return json(summary);
  } catch (e) {
    console.error("recover-checkouts error:", e);
    return json({ error: "Could not re-check pending payments" }, 500);
  }
});
