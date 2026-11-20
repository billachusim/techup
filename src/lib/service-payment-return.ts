/**
 * Reads the Flutterwave return URL on a service page (/services/<slug>?paid=1&status=...).
 * Only a "successful"/"completed" status counts as paid; cancelled, failed or a missing
 * status means the payment did not go through. The order is only marked paid by the
 * webhook, so this decides what the visitor sees, nothing more.
 */
export type PaymentReturn = "paid" | "unpaid" | null;

export function paymentReturnState(search: string): PaymentReturn {
  const params = new URLSearchParams(search);
  if (params.get("paid") !== "1") return null;
  const status = (params.get("status") || "").toLowerCase();
  return status === "successful" || status === "completed" ? "paid" : "unpaid";
}
