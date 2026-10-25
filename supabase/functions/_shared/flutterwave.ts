// Confirms a Flutterwave card payment and activates the enrolment it pays for,
// or, for the balance of an instalment plan, clears what was left to pay.
// Used by the flutterwave-webhook, verify-payment and recover-checkouts functions. A payment only
// counts after Flutterwave's own verify API says it succeeded for the amount
// and currency create-checkout recorded on the enrolment.
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

/** The paid-for amount check: same currency, and at least what was due. */
const paysEnough = (tx: FlutterwaveTransaction, due: unknown, currency: unknown) =>
  tx.currency === currency && Number(tx.amount) + 0.005 >= Number(due);

/**
 * The balance of an instalment plan (an enrollment_payments row). Once paid,
 * the plan has nothing left to pay and amount_paid holds its full total.
 */
async function confirmBalancePayment(admin: SupabaseClient, secretKey: string, txRef: string): Promise<ConfirmResult> {
  const { data: payment, error } = await admin
    .from("enrollment_payments")
    .select("id, enrollment_id, status, amount, currency")
    .eq("tx_ref", txRef)
    .maybeSingle();
  if (error) throw error;
  if (!payment) return { status: "not_found", reason: "No enrolment for this payment reference" };
  const { data: enrollment, error: enrollErr } = await admin
    .from("enrollments")
    .select("id, faculty_id, plan_name, instalment_total")
    .eq("id", payment.enrollment_id)
    .maybeSingle();
  if (enrollErr) throw enrollErr;
  if (!enrollment) return { status: "not_found", reason: "The enrolment for this payment is gone" };

  const done = { status: "active" as const, enrollmentId: enrollment.id, planName: enrollment.plan_name, facultyId: enrollment.faculty_id };
  if (payment.status === "paid") return done;
  if (payment.status !== "pending") return { status: "failed", reason: `Payment is ${payment.status}` };

  const tx = await fetchTransaction(secretKey, txRef);
  if (!tx) return { status: "pending", reason: "Flutterwave has no record of this payment yet" };
  if (tx.tx_ref !== txRef) return { status: "failed", reason: "Payment reference mismatch" };
  if (tx.status !== "successful") {
    return { status: tx.status === "failed" ? "failed" : "pending", reason: `Payment is ${tx.status}` };
  }
  if (!paysEnough(tx, payment.amount, payment.currency)) {
    console.error("Flutterwave amount mismatch", { txRef, paid: tx.amount, currency: tx.currency, due: payment.amount, expected: payment.currency });
    return { status: "failed", reason: "Amount paid does not match the amount due" };
  }

  const paidAt = new Date().toISOString();
  const { error: paymentErr } = await admin
    .from("enrollment_payments")
    .update({ status: "paid", paid_at: paidAt, payment_reference: String(tx.id) })
    .eq("id", payment.id)
    .eq("status", "pending");
  if (paymentErr) throw paymentErr;
  const { error: updateErr } = await admin
    .from("enrollments")
    .update({ balance_due: 0, balance_paid_at: paidAt, amount_paid: enrollment.instalment_total })
    .eq("id", enrollment.id);
  if (updateErr) throw updateErr;
  return done;
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
  if (!enrollment) return confirmBalancePayment(admin, secretKey, txRef);

  const done = { status: "active" as const, enrollmentId: enrollment.id, planName: enrollment.plan_name, facultyId: enrollment.faculty_id };
  if (enrollment.status === "active" || enrollment.status === "confirmed") return done;
  if (enrollment.status !== "pending") return { status: "failed", reason: `Enrolment is ${enrollment.status}` };

  const tx = await fetchTransaction(secretKey, txRef);
  if (!tx) return { status: "pending", reason: "Flutterwave has no record of this payment yet" };
  if (tx.tx_ref !== txRef) return { status: "failed", reason: "Payment reference mismatch" };
  if (tx.status !== "successful") {
    return { status: tx.status === "failed" ? "failed" : "pending", reason: `Payment is ${tx.status}` };
  }
  if (!paysEnough(tx, enrollment.amount_due, enrollment.currency)) {
    console.error("Flutterwave amount mismatch", { txRef, paid: tx.amount, currency: tx.currency, due: enrollment.amount_due, expected: enrollment.currency });
    return { status: "failed", reason: "Amount paid does not match the amount due" };
  }

  const { error: updateErr } = await admin
    .from("enrollments")
    .update({ ...extra, status: "active", paid_at: new Date().toISOString(), payment_reference: String(tx.id) })
    .eq("id", enrollment.id)
    .eq("status", "pending");
  if (updateErr) throw updateErr;
  return done;
}
