/**
 * Google Analytics 4 conversion events. gtag itself is loaded in __root.tsx;
 * these helpers are safe to call during SSR or before gtag has loaded.
 *
 * Event names follow GA4's recommended events where one exists, so GA4 can
 * report them without custom setup: generate_lead, begin_checkout,
 * add_payment_info and purchase. WhatsApp clicks use whatsapp_click.
 */

type GtagParams = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (command: "event", name: string, params?: GtagParams) => void;
  }
}

export function trackEvent(name: string, params: GtagParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try {
    window.gtag("event", name, params);
  } catch {
    // Analytics must never break the page.
  }
}

/** A lead or enquiry form saved successfully. */
export function trackLead(form: string, params: GtagParams = {}) {
  trackEvent("generate_lead", { form, ...params });
}

const WHATSAPP_URL = /^https?:\/\/(?:wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com|(?:www\.)?whatsapp\.com)\b/i;

export function isWhatsAppUrl(url: string | URL | null | undefined): boolean {
  return !!url && WHATSAPP_URL.test(String(url));
}

/** "chat" for a direct message (wa.me), "group" for a community/group invite. */
export function whatsAppLinkType(url: string): "group" | "chat" {
  return /chat\.whatsapp\.com/i.test(url) ? "group" : "chat";
}

function trackWhatsAppClick(url: string) {
  trackEvent("whatsapp_click", {
    link_type: whatsAppLinkType(url),
    page_path: window.location.pathname,
  });
}

let installed = false;

/**
 * Counts every WhatsApp link the site opens, from plain links and from
 * buttons that call window.open, without touching each component.
 */
export function installWhatsAppClickTracking() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  document.addEventListener(
    "click",
    (e) => {
      const anchor = (e.target as Element | null)?.closest?.("a[href]");
      const href = anchor?.getAttribute("href");
      if (href && isWhatsAppUrl(href)) trackWhatsAppClick(href);
    },
    { capture: true },
  );

  const open = window.open.bind(window);
  window.open = (url?: string | URL, ...rest: [string?, string?]) => {
    if (isWhatsAppUrl(url)) trackWhatsAppClick(String(url));
    return open(url, ...rest);
  };
}

const PENDING_CHECKOUT_KEY = "tf_ga_pending_checkout";

type PendingCheckout = { plan: string; value: number; currency: string };

/** Remembered across the Flutterwave redirect so the purchase event carries its value. */
export function rememberCheckout(checkout: PendingCheckout) {
  try {
    localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(checkout));
  } catch {
    // Storage can be blocked; the purchase is still sent, without a value.
  }
}

function takeCheckout(): PendingCheckout | null {
  try {
    const raw = localStorage.getItem(PENDING_CHECKOUT_KEY);
    localStorage.removeItem(PENDING_CHECKOUT_KEY);
    return raw ? (JSON.parse(raw) as PendingCheckout) : null;
  } catch {
    return null;
  }
}

/** Sends purchase once per payment reference, even if the success page is reloaded. */
export function trackPurchase(txRef: string, plan: string) {
  const sentKey = `tf_ga_purchase_${txRef}`;
  try {
    if (localStorage.getItem(sentKey)) return;
    localStorage.setItem(sentKey, "1");
  } catch {
    // Without storage, GA4 still de-duplicates purchases by transaction_id.
  }
  const checkout = takeCheckout();
  trackEvent("purchase", {
    transaction_id: txRef,
    payment_type: "card",
    items: [{ item_name: plan || checkout?.plan || "Plan" }],
    ...(checkout ? { value: checkout.value, currency: checkout.currency } : {}),
  });
}
