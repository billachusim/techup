//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/analytics-BrZRoVBL.js
function trackEvent(name, params = {}) {
	if (typeof window === "undefined" || typeof window.gtag !== "function") return;
	try {
		window.gtag("event", name, params);
	} catch {}
}
/** A lead or enquiry form saved successfully. */
function trackLead(form, params = {}) {
	trackEvent("generate_lead", {
		form,
		...params
	});
}
var WHATSAPP_URL = /^https?:\/\/(?:wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com|(?:www\.)?whatsapp\.com)\b/i;
function isWhatsAppUrl(url) {
	return !!url && WHATSAPP_URL.test(String(url));
}
/** "chat" for a direct message (wa.me), "group" for a community/group invite. */
function whatsAppLinkType(url) {
	return /chat\.whatsapp\.com/i.test(url) ? "group" : "chat";
}
function trackWhatsAppClick(url) {
	trackEvent("whatsapp_click", {
		link_type: whatsAppLinkType(url),
		page_path: window.location.pathname
	});
}
var installed = false;
/**
* Counts every WhatsApp link the site opens, from plain links and from
* buttons that call window.open, without touching each component.
*/
function installWhatsAppClickTracking() {
	if (installed || typeof window === "undefined") return;
	installed = true;
	document.addEventListener("click", (e) => {
		const href = (e.target?.closest?.("a[href]"))?.getAttribute("href");
		if (href && isWhatsAppUrl(href)) trackWhatsAppClick(href);
	}, { capture: true });
	const open = window.open.bind(window);
	window.open = (url, ...rest) => {
		if (isWhatsAppUrl(url)) trackWhatsAppClick(String(url));
		return open(url, ...rest);
	};
}
var PENDING_CHECKOUT_KEY = "tf_ga_pending_checkout";
/** Remembered across the Flutterwave redirect so the purchase event carries its value. */
function rememberCheckout(checkout) {
	try {
		localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(checkout));
	} catch {}
}
function takeCheckout() {
	try {
		const raw = localStorage.getItem(PENDING_CHECKOUT_KEY);
		localStorage.removeItem(PENDING_CHECKOUT_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
/** Sends purchase once per payment reference, even if the success page is reloaded. */
function trackPurchase(txRef, plan) {
	const sentKey = `tf_ga_purchase_${txRef}`;
	try {
		if (localStorage.getItem(sentKey)) return;
		localStorage.setItem(sentKey, "1");
	} catch {}
	const checkout = takeCheckout();
	trackEvent("purchase", {
		transaction_id: txRef,
		payment_type: "card",
		items: [{ item_name: plan || checkout?.plan || "Plan" }],
		...checkout ? {
			value: checkout.value,
			currency: checkout.currency
		} : {}
	});
}
//#endregion
export { trackPurchase as a, trackLead as i, rememberCheckout as n, trackEvent as r, installWhatsAppClickTracking as t };
