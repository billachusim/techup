import { n as campuses } from "./campuses-DtkbL75I.mjs";
import { f as naira, n as HYBRID_FEE, p as planMinimum, r as INSTALMENTS, s as PHYSICAL_FEE } from "./fees-B-53IxaZ.mjs";
import { r as departments } from "./departments-DtVPzGk2.mjs";
import { n as CITY_COUNT, r as VIRTUAL_SIWES, t as CAMPUS_COUNT } from "./virtualSiwes-DYcaq-8X.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/whatsapp-auto-answers-BHpo12w7.js
var AUTO_ANSWER_LABEL = {
	prices: "Prices",
	location: "Location",
	siwes: "SIWES",
	virtual_siwes: "Virtual SIWES",
	other: "Handed to staff"
};
var SITE = "https://techfaculty.ng";
var AUTO_ANSWER_FOOTER = "This is an automatic answer. Reply here with any other question and our team will get back to you.";
var HANDOFF_ACK = "Thanks for your message. Someone from our team will reply here shortly.\n\nIf you want prices, campus locations or SIWES details, just ask and you'll get an answer straight away.";
/** Messages that always go to a person, even if they also mention a price or SIWES. */
var STAFF_ONLY = [
	/\b(i|we)\s*(have|'ve|ve|just|already)?\s*(paid|transferred|sent (the )?money|made (the )?payment)\b/,
	/\b(receipt|proof of payment|payment proof|debited|refund|reversal|chargeback)\b/,
	/\b(account (number|details)|bank (details|account)|pay by transfer|transfer to)\b/,
	/\b(discount|promo|coupon|code|scholarship|sponsor|free slot)\b/,
	/\b(complain|complaint|not happy|disappointed|scam|fraud|cheat)\w*\b/,
	/\b(call me|speak (to|with)|talk (to|with)|human|real person|agent|manager|founder|mr\.? bill)\b/,
	/\b(certificate|result|transcript|my (account|dashboard|login|password))\b/,
	/\b(partner|partnership|collaborat\w*|hire|hiring|recruit\w*|vacanc\w*)\b/
];
var PRICE = /\b(price|prices|pricing|cost|costs|how much|fee|fees|tuition|charge|charges|amount|naira|instal+ments?|payment plan|afford\w*)\b|₦|\bngn\b/;
var LOCATION = /\b(where (are|is) (you|your|the|una)|location|located|locate|address|direction|directions|campus|campuses|branch|branches|centre|center|office|come (to|over)|visit)\b/;
var SIWES = /\b(siwes|s\.i\.w\.e\.s|industrial (training|attachment)|i\.?t\.? (placement|letter|programme|program|students?)|placement|attachment|logbook|log book|itf)\b/;
var VIRTUAL = /\b(virtual|online|remote|remotely|from home|waybill|courier|logbook|log book)\b/;
/** Words people use for each department, matched against the message. */
var DEPARTMENT_WORDS = {
	"web-development": /\b(web|website|websites|frontend|front end|backend|back end|full ?stack|react|javascript|node)\b/,
	"mobile-app-development": /\b(mobile|app development|apps?|flutter|android|ios)\b/,
	"data-science-analytics": /\b(data|analytics|analysis|analyst|excel|power ?bi|sql)\b/,
	cybersecurity: /\b(cyber ?security|cyber|ethical hack\w*|hacking|security)\b/,
	"ai-machine-learning": /\b(machine learning|artificial intelligence|ml|ai engineer\w*|deep learning)\b/,
	"basic-internet-ai-studies": /\b(basic|beginners?|computer appreciation|internet)\b/,
	"digital-marketing": /\b(digital marketing|marketing|social media)\b/,
	design: /\b(design|designer|ui|ux|graphics?|figma)\b/,
	"cloud-computing": /\b(cloud|aws|azure|devops)\b/,
	"robotics-iot": /\b(robotics?|iot|arduino|embedded|electronics)\b/
};
var normalize = (text) => text.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();
var spokenWeeks = (d) => d.replace(/^(\d+)-(\d+)/, "$1 to $2");
function mentionedDepartments(t) {
	return departments.filter((d) => DEPARTMENT_WORDS[d.slug]?.test(t));
}
function mentionedCampuses(t) {
	return campuses.filter((c) => {
		const city = c.city.toLowerCase();
		const short = city === "port harcourt" ? /\b(port harcourt|ph|portharcourt)\b/ : city === "benin city" ? /\bbenin\b/ : null;
		return short ? short.test(t) : new RegExp(`\\b${city}\\b`).test(t) || new RegExp(`\\b${c.state.toLowerCase()}\\b`).test(t);
	});
}
var instalmentLine = () => INSTALMENTS.enabled ? `Fees of ${naira(INSTALMENTS.minimumTotal)} or more can be paid in two parts: ${INSTALMENTS.depositPercent}% to start and the rest within ${INSTALMENTS.balanceDueDays} days.` : "";
function departmentPrice(d) {
	const min = d.planId ? planMinimum(d.planId) : void 0;
	if (min === void 0) return null;
	if (min === 0) return `${d.title} is free. It takes ${spokenWeeks(d.duration)}, online or at any of our campuses.`;
	return `${d.title} takes ${spokenWeeks(d.duration)} and costs from ${naira(min)} for online study.`;
}
function pricesAnswer(t) {
	const named = mentionedDepartments(t);
	const modes = `Hybrid study (online plus monthly meetups) adds ${naira(HYBRID_FEE)}, and weekly on-site classes add ${naira(PHYSICAL_FEE)}.`;
	if (named.length) {
		const lines = named.map(departmentPrice);
		if (lines.some((l) => l === null)) return null;
		const link = named.length === 1 ? `${SITE}/departments/${named[0].slug}` : `${SITE}/departments`;
		return [
			lines.join("\n"),
			modes,
			instalmentLine(),
			`Details and enrolment: ${link}`
		].filter(Boolean).join("\n\n");
	}
	const paid = departments.map((d) => ({
		d,
		min: d.planId ? planMinimum(d.planId) : void 0
	})).filter((x) => typeof x.min === "number" && x.min > 0).sort((a, b) => a.min - b.min);
	const free = departments.filter((d) => d.planId && planMinimum(d.planId) === 0);
	return [
		"Our course fees for online study:",
		paid.map(({ d, min }) => `• ${d.title}: from ${naira(min)}`).join("\n"),
		free.length ? `${free.map((d) => d.title).join(", ")} is free.` : "",
		modes,
		instalmentLine(),
		`Tell us which course you want and we can give you the exact amount. All courses: ${SITE}/departments`
	].filter(Boolean).join("\n\n");
}
function locationAnswer(t) {
	const named = mentionedCampuses(t);
	if (named.length) return named.map((c) => `Our ${c.city} campus (${c.name}) is at ${c.address}.\nMap and details: ${SITE}/locations/${c.slug}`).join("\n\n");
	const hq = campuses.find((c) => c.isHeadquarters) ?? campuses[0];
	const cities = [...new Set(campuses.map((c) => c.city))].sort((a, b) => a.localeCompare(b));
	return [
		`Our headquarters is at the ${hq.address}.`,
		`We have campuses in these ${CITY_COUNT} cities: ${cities.join(", ")}. You can also study fully online from anywhere.`,
		`Tell us your city and we'll send the nearest campus. All campuses: ${SITE}/locations`
	].join("\n\n");
}
function siwesAnswer() {
	return [
		`On-site SIWES (IT) at any of our ${CAMPUS_COUNT} campuses has no placement fee. You choose one of two tracks:`,
		"• Learn & Pay: structured mentorship and real client projects. You pay your department's course fee, with a discount for SIWES students.\n• Tutor & Earn: for students already skilled in tech. You teach other learners and get paid during your IT.",
		"Both tracks end with a certificate and a recommendation letter. ITF accepts placements with any registered business.",
		`Can't attend in person? Virtual SIWES is ${naira(VIRTUAL_SIWES.placementPriceNGN)}, and logbook review with courier delivery is ${naira(VIRTUAL_SIWES.logbookPriceNGN)}.`,
		`To apply, send your full name, school, department and preferred track here. Details: ${SITE}/siwes`
	].join("\n\n");
}
function virtualSiwesAnswer() {
	return [
		`Virtual SIWES costs ${naira(VIRTUAL_SIWES.placementPriceNGN)}. It includes your placement letter for your school, weekly live sessions with a mentor from your department, real project work, supervision records for your school and the ITF, and a completion certificate with a recommendation letter.`,
		`Logbook review, signing and stamping is ${naira(VIRTUAL_SIWES.logbookPriceNGN)}, with courier pickup and return included. It takes ${VIRTUAL_SIWES.turnaround}.`,
		`Apply and pay online: ${SITE}/virtual-siwes`
	].join("\n\n");
}
/** Decides whether a message gets an automatic answer, and builds it. */
function decideAutoAnswer(rawText) {
	const t = normalize(rawText);
	if (!t || t.startsWith("[")) return {
		kind: "handoff",
		intent: "other",
		reason: "Not a text message"
	};
	if (t.length > 400) return {
		kind: "handoff",
		intent: "other",
		reason: "Long message"
	};
	if (STAFF_ONLY.some((re) => re.test(t))) return {
		kind: "handoff",
		intent: "other",
		reason: "Needs a person (payment, discount, complaint or request for staff)"
	};
	const intents = [];
	const siwes = SIWES.test(t);
	if (siwes && VIRTUAL.test(t)) intents.push("virtual_siwes");
	else if (siwes) intents.push("siwes");
	if (PRICE.test(t) && !siwes) intents.push("prices");
	if (LOCATION.test(t) || mentionedCampuses(t).length && /\b(where|near|nearest|in)\b/.test(t)) intents.push("location");
	if (!intents.length) return {
		kind: "handoff",
		intent: "other",
		reason: "No common question recognised"
	};
	const parts = [];
	for (const intent of intents) {
		const part = intent === "prices" ? pricesAnswer(t) : intent === "location" ? locationAnswer(t) : intent === "siwes" ? siwesAnswer() : virtualSiwesAnswer();
		if (!part) return {
			kind: "handoff",
			intent,
			reason: "Fee is quoted by staff for this course"
		};
		parts.push(part);
	}
	return {
		kind: "answer",
		intents,
		reply: [...parts, AUTO_ANSWER_FOOTER].join("\n\n")
	};
}
/** Limits that keep the auto-answers from talking over staff or repeating themselves. */
var AUTO_ANSWER_RULES = {
	/** Staff replied to this contact within this many hours: stay quiet and leave it to them. */
	staffActiveHours: 6,
	/** The same answer isn't sent to the same contact twice within this window. */
	repeatHours: 24,
	/** At most this many automatic messages per contact per day. */
	maxPerDay: 4,
	/** The "someone will reply" note is sent at most once in this window. */
	ackHours: 12,
	/** Messages older than this (webhook backlog) are handed off without a reply. */
	staleMinutes: 60
};
//#endregion
export { decideAutoAnswer as i, AUTO_ANSWER_RULES as n, HANDOFF_ACK as r, AUTO_ANSWER_LABEL as t };
