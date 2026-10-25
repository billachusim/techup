// Confirms a Flutterwave card payment and activates the enrolment it pays for
// (confirmPayment) or marks the online order it pays for as paid
// (confirmOrderPayment). Used by the flutterwave-webhook, verify-payment and
// recover-checkouts functions. A payment only counts after Flutterwave's own
// verify API says it succeeded for the amount and currency recorded when the
// checkout was created.
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

interface FlutterwaveTransaction {
  id: number;
  tx_ref: string;
  status: string;
  amount: number;
  currency: string;
}

export type ConfirmResult =
  | { status: "active"; enrollmentId: string; planName: string; facultyId: string }
  | { status: "pending" | "failed" | "not_found"; reason: string };

async function fetchTransaction(secretKey: string, txRef: string): Promise<FlutterwaveTransaction | null> {
  const res = await fetch(
    `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef)}`,
    { headers: { Authorization: `Bearer ${secretKey}`, Accept: "application/json" } },
  );
  const body = await res.json().catch(() => null);
  if (!res.ok || body?.status !== "success" || !body?.data) return null;
  return body.data as FlutterwaveTransaction;
}

type CheckResult = { ok: true; tx: FlutterwaveTransaction } | { ok: false; status: "pending" | "failed"; reason: string };

/** Asks Flutterwave whether txRef was paid in full, in the currency due. */
async function checkTransaction(secretKey: string, txRef: string, amountDue: number, currency: string): Promise<CheckResult> {
  const tx = await fetchTransaction(secretKey, txRef);
  if (!tx) return { ok: false, status: "pending", reason: "Flutterwave has no record of this payment yet" };
  if (tx.tx_ref !== txRef) return { ok: false, status: "failed", reason: "Payment reference mismatch" };
  if (tx.status !== "successful") {
    return { ok: false, status: tx.status === "failed" ? "failed" : "pending", reason: `Payment is ${tx.status}` };
  }
  if (tx.currency !== currency || Number(tx.amount) + 0.005 < Number(amountDue)) {
    console.error("Flutterwave amount mismatch", { txRef, paid: tx.amount, currency: tx.currency, due: amountDue, expected: currency });
    return { ok: false, status: "failed", reason: "Amount paid does not match the amount due" };
  }
  return { ok: true, tx };
}

/** `extra` is saved with the activation, only when this call is the one that activates it. */
export async function confirmPayment(
  admin: SupabaseClient,
  secretKey: string,
  txRef: string,
  extra: Record<string, unknown> = {},
): Promise<ConfirmResult> {
  const { data: enrollment, error } = await admin
    .from("enrollments")
    .select("id, faculty_id, plan_name, status, amount_due, currency")
    .eq("tx_ref", txRef)
    .maybeSingle();
  if (error) throw error;
  if (!enrollment) return { status: "not_found", reason: "No enrolment for this payment reference" };

  const done = { status: "active" as const, enrollmentId: enrollment.id, planName: enrollment.plan_name, facultyId: enrollment.faculty_id };
  if (enrollment.status === "active" || enrollment.status === "confirmed") return done;
  if (enrollment.status !== "pending") return { status: "failed", reason: `Enrolment is ${enrollment.status}` };

  const check = await checkTransaction(secretKey, txRef, enrollment.amount_due, enrollment.currency);
  if (!check.ok) return { status: check.status, reason: check.reason };
  const { tx } = check;

  const { error: updateErr } = await admin
    .from("enrollments")
    .update({ ...extra, status: "active", paid_at: new Date().toISOString(), payment_reference: String(tx.id) })
    .eq("id", enrollment.id)
    .eq("status", "pending");
  if (updateErr) throw updateErr;
  return done;
}

export type OrderConfirmResult =
  | { status: "paid"; orderId: string; items: string[] }
  | { status: "pending" | "failed" | "not_found"; reason: string };

/** Same check for an online order (product_orders). `extra` is saved only by the call that marks it paid. */
export async function confirmOrderPayment(
  admin: SupabaseClient,
  secretKey: string,
  txRef: string,
  extra: Record<string, unknown> = {},
): Promise<OrderConfirmResult> {
  const { data: order, error } = await admin
    .from("product_orders")
    .select("id, items, status, amount_due, currency, lead_id")
    .eq("tx_ref", txRef)
    .maybeSingle();
  if (error) throw error;
  if (!order) return { status: "not_found", reason: "No order for this payment reference" };

  const done = { status: "paid" as const, orderId: order.id, items: order.items as string[] };
  if (order.status === "paid") return done;
  if (order.status !== "pending") return { status: "failed", reason: `Order is ${order.status}` };

  const check = await checkTransaction(secretKey, txRef, order.amount_due, order.currency);
  if (!check.ok) return { status: check.status, reason: check.reason };

  const { error: updateErr } = await admin
    .from("product_orders")
    .update({ ...extra, status: "paid", paid_at: new Date().toISOString(), payment_reference: String(check.tx.id) })
    .eq("id", order.id)
    .eq("status", "pending");
  if (updateErr) throw updateErr;

  // A paying buyer is no longer a lead to chase: this closes the lead in the
  // inbox and keeps the lead follow-up emails from starting for them.
  if (order.lead_id) {
    const { error: leadErr } = await admin
      .from("leads")
      .update({ status: "enrolled", status_updated_at: new Date().toISOString() })
      .eq("id", order.lead_id);
    if (leadErr) console.error("Could not close the lead for a paid order", { txRef, leadErr });
  }
  return done;
}
