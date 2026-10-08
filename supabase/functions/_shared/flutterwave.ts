// Confirms a Flutterwave card payment and activates the enrolment it pays for.
// Used by the flutterwave-webhook and verify-payment functions. A payment only
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

export async function confirmPayment(
  admin: SupabaseClient,
  secretKey: string,
  txRef: string,
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

  const tx = await fetchTransaction(secretKey, txRef);
  if (!tx) return { status: "pending", reason: "Flutterwave has no record of this payment yet" };
  if (tx.tx_ref !== txRef) return { status: "failed", reason: "Payment reference mismatch" };
  if (tx.status !== "successful") {
    return { status: tx.status === "failed" ? "failed" : "pending", reason: `Payment is ${tx.status}` };
  }
  if (tx.currency !== enrollment.currency || Number(tx.amount) + 0.005 < Number(enrollment.amount_due)) {
    console.error("Flutterwave amount mismatch", { txRef, paid: tx.amount, currency: tx.currency, due: enrollment.amount_due, expected: enrollment.currency });
    return { status: "failed", reason: "Amount paid does not match the amount due" };
  }

  const { error: updateErr } = await admin
    .from("enrollments")
    .update({ status: "active", paid_at: new Date().toISOString(), payment_reference: String(tx.id) })
    .eq("id", enrollment.id)
    .eq("status", "pending");
  if (updateErr) throw updateErr;
  return done;
}
