// The things a visitor can buy online without a Faculty ID: Virtual SIWES,
// the logbook service and the SIWES Success Kit. Prices are in naira and are
// the only prices create-order-checkout will charge. Plain data with no
// imports, so the pages and the edge functions share one price list.

export type ProductId = "virtual_siwes" | "logbook_service" | "success_kit";

export interface Product {
  id: ProductId;
  name: string;
  priceNGN: number;
  /** The leads.interest value an order for this product is filed under. */
  leadInterest: string;
  /** What happens after payment, shown on /order-complete and in the receipt email. */
  nextStep: string;
}

export const PRODUCTS: Record<ProductId, Product> = {
  virtual_siwes: {
    id: "virtual_siwes",
    name: "Virtual SIWES placement",
    priceNGN: 45000,
    leadInterest: "virtual_siwes",
    nextStep:
      "Your virtual IT slot is confirmed. A coordinator contacts you on WhatsApp within one working day, and your acceptance letter for your school follows within 48 hours.",
  },
  logbook_service: {
    id: "logbook_service",
    name: "Logbook review, signing and waybill",
    priceNGN: 15000,
    leadInterest: "logbook_service",
    nextStep:
      "Your logbook service is booked. We contact you on WhatsApp to arrange the courier pickup. Turnaround is 5–7 working days from the day your logbook reaches our headquarters.",
  },
  success_kit: {
    id: "success_kit",
    name: "SIWES Success Kit",
    priceNGN: 4500,
    leadInterest: "success_kit",
    nextStep: "Your SIWES Success Kit is ready to download. Keep this email: the download link is below.",
  },
};

/** Card payment references for orders start with this; enrolments use "TF-". */
export const ORDER_REF_PREFIX = "TFO-";

export const isOrderRef = (txRef: string) => txRef.startsWith(ORDER_REF_PREFIX);

export type PricedOrder =
  | { ok: true; products: Product[]; totalNGN: number }
  | { ok: false; error: string };

/** Prices a list of product ids. Each product counts once, whatever the request repeats. */
export function priceOrder(items: unknown): PricedOrder {
  if (!Array.isArray(items) || items.length === 0) return { ok: false, error: "Choose what you want to pay for" };
  const ids = [...new Set(items.map(String))];
  const unknown = ids.find((id) => !(id in PRODUCTS));
  if (unknown) return { ok: false, error: `Unknown product: ${unknown}` };
  const products = ids.map((id) => PRODUCTS[id as ProductId]);
  return { ok: true, products, totalNGN: products.reduce((n, p) => n + p.priceNGN, 0) };
}

/** Where the buyer of a paid order downloads the Success Kit (relative to the site). Not a public file. */
export const successKitDownloadPath = (txRef: string) => `/api/success-kit?ref=${encodeURIComponent(txRef)}`;
