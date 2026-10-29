//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/products-Dwo_SXcO.js
var PRODUCTS = {
	virtual_siwes: {
		id: "virtual_siwes",
		name: "Virtual SIWES placement",
		priceNGN: 45e3,
		leadInterest: "virtual_siwes",
		nextStep: "Your virtual IT slot is confirmed. A coordinator contacts you on WhatsApp within one working day, and your acceptance letter for your school follows within 48 hours."
	},
	logbook_service: {
		id: "logbook_service",
		name: "Logbook review, signing and waybill",
		priceNGN: 15e3,
		leadInterest: "logbook_service",
		nextStep: "Your logbook service is booked. We contact you on WhatsApp to arrange the courier pickup. Turnaround is 5–7 working days from the day your logbook reaches our headquarters."
	},
	success_kit: {
		id: "success_kit",
		name: "SIWES Success Kit",
		priceNGN: 4500,
		leadInterest: "success_kit",
		nextStep: "Your SIWES Success Kit is ready to download. Keep this email: the download link is below."
	}
};
/** Card payment references for orders start with this; enrolments use "TF-". */
var ORDER_REF_PREFIX = "TFO-";
var isOrderRef = (txRef) => txRef.startsWith(ORDER_REF_PREFIX);
/** Where the buyer of a paid order downloads the Success Kit (relative to the site). Not a public file. */
var successKitDownloadPath = (txRef) => `/api/success-kit?ref=${encodeURIComponent(txRef)}`;
//#endregion
export { isOrderRef as n, successKitDownloadPath as r, PRODUCTS as t };
