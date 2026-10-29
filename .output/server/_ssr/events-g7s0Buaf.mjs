import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/events-g7s0Buaf.js
/** ISO 3166 alpha-2 codes of every African country. */
var AFRICA_ISO2 = /* @__PURE__ */ new Set([
	"DZ",
	"AO",
	"BJ",
	"BW",
	"BF",
	"BI",
	"CV",
	"CM",
	"CF",
	"TD",
	"KM",
	"CG",
	"CD",
	"CI",
	"DJ",
	"EG",
	"GQ",
	"ER",
	"SZ",
	"ET",
	"GA",
	"GM",
	"GH",
	"GN",
	"GW",
	"KE",
	"LS",
	"LR",
	"LY",
	"MG",
	"MW",
	"ML",
	"MR",
	"MU",
	"MA",
	"MZ",
	"NA",
	"NE",
	"NG",
	"RW",
	"ST",
	"SN",
	"SC",
	"SL",
	"SO",
	"ZA",
	"SS",
	"SD",
	"TZ",
	"TG",
	"TN",
	"UG",
	"ZM",
	"ZW"
]);
/** Country fields come back as alpha-2, alpha-3 or a name cut to 3 letters ("UNI", "NIG"). */
var COUNTRY_ALIASES = {
	NGA: "NG",
	NIG: "NG",
	GHA: "GH",
	KEN: "KE",
	ZAF: "ZA",
	SOU: "ZA",
	RWA: "RW",
	EGY: "EG",
	UGA: "UG",
	TZA: "TZ",
	ETH: "ET",
	SEN: "SN",
	CIV: "CI",
	CMR: "CM",
	MAR: "MA",
	TUN: "TN",
	ZMB: "ZM",
	ZWE: "ZW",
	USA: "US",
	UNI: "US",
	AME: "US",
	GBR: "GB",
	ENG: "GB",
	CAN: "CA",
	IND: "IN",
	DEU: "DE",
	GER: "DE",
	FRA: "FR",
	AUS: "AU",
	IRL: "IE",
	NLD: "NL",
	ESP: "ES",
	ITA: "IT",
	BRA: "BR",
	MEX: "MX",
	ARE: "AE"
};
function countryCode(raw) {
	const c = String(raw ?? "").trim().toUpperCase().replace(/[^A-Z]/g, "");
	if (!c) return null;
	if (c.length === 2) return c === "UK" ? "GB" : c;
	return COUNTRY_ALIASES[c.slice(0, 3)] ?? null;
}
/** Places in Africa: an event naming one of these in its venue is for our audience. */
var AFRICAN_PLACES = [
	"nigeria",
	"lagos",
	"abuja",
	"nnewi",
	"onitsha",
	"awka",
	"enugu",
	"nsukka",
	"owerri",
	"aba",
	"umuahia",
	"asaba",
	"anambra",
	"imo",
	"abia",
	"ebonyi",
	"ibadan",
	"kano",
	"kaduna",
	"port harcourt",
	"benin city",
	"jos",
	"ilorin",
	"uyo",
	"calabar",
	"warri",
	"akure",
	"abeokuta",
	"ikeja",
	"lekki",
	"yaba",
	"victoria island",
	"africa",
	"ghana",
	"accra",
	"kumasi",
	"kenya",
	"nairobi",
	"rwanda",
	"kigali",
	"south africa",
	"cape town",
	"johannesburg",
	"egypt",
	"cairo",
	"uganda",
	"kampala",
	"tanzania",
	"dar es salaam",
	"ethiopia",
	"addis ababa",
	"senegal",
	"dakar",
	"morocco",
	"cameroon",
	"zambia",
	"zimbabwe"
];
/**
* Places outside Africa that turn up on global listings (Microsoft Reactor, GDG, Luma).
* "georgia", "washington" and "jersey" are left out: too easy to hit by accident.
*/
var FOREIGN_PLACES = [
	"usa",
	"united states",
	"america",
	"canada",
	"united kingdom",
	"england",
	"scotland",
	"europe",
	"india",
	"australia",
	"germany",
	"france",
	"ireland",
	"netherlands",
	"spain",
	"brazil",
	"mexico",
	"singapore",
	"japan",
	"china",
	"dubai",
	"uae",
	"pakistan",
	"philippines",
	"alabama",
	"alaska",
	"arizona",
	"arkansas",
	"california",
	"colorado",
	"connecticut",
	"delaware",
	"florida",
	"hawaii",
	"idaho",
	"illinois",
	"indiana",
	"iowa",
	"kansas",
	"kentucky",
	"louisiana",
	"maine",
	"maryland",
	"massachusetts",
	"michigan",
	"minnesota",
	"mississippi",
	"missouri",
	"montana",
	"nebraska",
	"nevada",
	"new hampshire",
	"new jersey",
	"new mexico",
	"new york",
	"north carolina",
	"north dakota",
	"ohio",
	"oklahoma",
	"oregon",
	"pennsylvania",
	"rhode island",
	"south carolina",
	"south dakota",
	"tennessee",
	"texas",
	"utah",
	"vermont",
	"virginia",
	"wisconsin",
	"wyoming",
	"san francisco",
	"seattle",
	"boston",
	"chicago",
	"los angeles",
	"austin",
	"atlanta",
	"denver",
	"houston",
	"dallas",
	"miami",
	"toronto",
	"vancouver",
	"montreal",
	"london",
	"manchester",
	"dublin",
	"berlin",
	"paris",
	"amsterdam",
	"bangalore",
	"bengaluru",
	"hyderabad",
	"mumbai",
	"delhi",
	"sydney",
	"melbourne",
	"redmond",
	"silicon valley",
	"bay area",
	"kansas city",
	"nyc"
];
/** "City, ST" with a US state abbreviation, e.g. "Overland Park, KS". */
var US_STATE_SUFFIX = /,\s*(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC)\b/;
/** Copy that limits who may attend: "USA only", "open to US residents", "must be based in Canada". */
var REGION_LOCK = new RegExp([
	String.raw`\b(usa|u\.s\.a\.?|united states|american|canad(a|ian)|uk|u\.k\.|british|eu|europe(an)?|north america(n)?|australia(n)?)[\s-]*(only|residents?|citizens?|based)\b`,
	String.raw`\b(only|exclusively)\s+(open|available)\s+to\s+(residents|people|participants|attendees|those)\s+(in|of|from)\s+(the\s+)?(us|usa|united states|canada|uk|united kingdom|eu|europe|north america|india|australia)\b`,
	String.raw`\b(must|need to)\s+(be\s+)?(located|living|reside|based|resident)\s+(in|of)\s+(the\s+)?(us|usa|united states|canada|uk|united kingdom|eu|europe|north america|india|australia)\b`,
	String.raw`\b(us|united states)\s+(work\s+)?(authori[sz]ation|work permit)\b`
].join("|"), "i");
/** Bare "US" only in capitals, so "contact us only by email" is not a region lock. */
var US_LOCK = /\b(US|U\.S\.?)[\s-]*(only|ONLY|Only|residents?|citizens?|based|Residents?|Citizens?)\b/;
/** Listing pages that cover the whole world; every other source is already scoped to Nigeria. */
var GLOBAL_SOURCES = ["Microsoft Reactor"];
function hits(text, places) {
	const t = ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, " ")} `;
	return places.some((p) => t.includes(` ${p} `));
}
/** Why an event is not for our audience, or null when it is. */
function audienceProblem(row) {
	if (row.is_featured || row.source_platform === "Tech Faculty") return null;
	const copy = `${row.title ?? ""} ${row.description ?? ""}`;
	if (REGION_LOCK.test(copy) || US_LOCK.test(copy)) return "restricted to a region outside Africa";
	const place = `${row.venue_name ?? ""} ${row.address ?? ""} ${row.city ?? ""} ${row.state ?? ""}`;
	const code = countryCode(row.country);
	if (code !== null && AFRICA_ISO2.has(code) || hits(place, AFRICAN_PLACES)) return null;
	if (code !== null && !AFRICA_ISO2.has(code) || hits(place, FOREIGN_PLACES) || US_STATE_SUFFIX.test(place) || hits(`${row.organizer ?? ""} ${row.title ?? ""}`, FOREIGN_PLACES)) return "located outside Africa";
	if (row.format === "VIRTUAL") return null;
	if (GLOBAL_SOURCES.includes(row.source_platform ?? "")) return "no African venue";
	return null;
}
function servesOurAudience(row) {
	return audienceProblem(row) === null;
}
var events_exports = /* @__PURE__ */ __exportAll({
	EVENT_CATEGORIES: () => EVENT_CATEGORIES,
	EVENT_FORMATS: () => EVENT_FORMATS,
	OWN_EVENT_SOURCE: () => OWN_EVENT_SOURCE,
	categoryLabel: () => categoryLabel,
	dateLabel: () => dateLabel,
	eventSchema: () => eventSchema,
	eventUrl: () => eventUrl,
	fetchEventBySlug: () => fetchEventBySlug,
	fetchEvents: () => fetchEvents,
	formatLabel: () => formatLabel,
	isOwnEvent: () => isOwnEvent,
	localFirst: () => localFirst,
	locationLabel: () => locationLabel,
	priceLabel: () => priceLabel,
	resolveStartDate: () => resolveStartDate,
	upcomingStart: () => upcomingStart
});
/** Events we organise ourselves, as opposed to listings gathered from other organisers. */
var OWN_EVENT_SOURCE = "Tech Faculty";
function isOwnEvent(event) {
	return event.source_platform === OWN_EVENT_SOURCE;
}
var EVENT_CATEGORIES = [
	{
		value: "CONFERENCE",
		label: "Conferences"
	},
	{
		value: "SUMMIT",
		label: "Summits"
	},
	{
		value: "MEETUP",
		label: "Meetups"
	},
	{
		value: "WORKSHOP",
		label: "Workshops"
	},
	{
		value: "HACKATHON",
		label: "Hackathons"
	},
	{
		value: "WEBINAR",
		label: "Webinars"
	},
	{
		value: "BOOTCAMP",
		label: "Bootcamps"
	},
	{
		value: "CAREER_FAIR",
		label: "Career fairs"
	}
];
var EVENT_FORMATS = [
	{
		value: "IN_PERSON",
		label: "In person"
	},
	{
		value: "VIRTUAL",
		label: "Online"
	},
	{
		value: "HYBRID",
		label: "Hybrid"
	}
];
function categoryLabel(value) {
	return EVENT_CATEGORIES.find((c) => c.value === value)?.label.replace(/s$/, "") ?? "Event";
}
function formatLabel(value) {
	return EVENT_FORMATS.find((f) => f.value === value)?.label ?? "In person";
}
function locationLabel(event) {
	if (event.format === "VIRTUAL") return "Online";
	const parts = [event.city, event.state].filter(Boolean);
	if (parts.length) return parts.join(", ");
	return event.venue_name ?? "Venue announced by organiser";
}
/**
* The start time to show. Our own recurring events keep their seeded date after it passes,
* so a past date on one of them means "next date not set yet" and its date_text is shown instead.
*/
function upcomingStart(event) {
	if (!event.starts_at) return null;
	if (event.is_featured && new Date(event.ends_at ?? event.starts_at).getTime() < Date.now()) return null;
	return event.starts_at;
}
/** Third-party listings need a date that has not passed; the nightly archive may lag behind. */
function isCurrent(event) {
	if (event.is_featured) return true;
	const end = event.ends_at ?? event.starts_at;
	return end !== null && new Date(end).getTime() >= Date.now();
}
function dateLabel(event) {
	const startsAt = upcomingStart(event);
	if (startsAt) {
		const start = new Date(startsAt);
		return `${start.toLocaleDateString("en-NG", {
			weekday: "short",
			day: "numeric",
			month: "short",
			year: "numeric",
			timeZone: "Africa/Lagos"
		})} · ${start.toLocaleTimeString("en-NG", {
			hour: "numeric",
			minute: "2-digit",
			timeZone: "Africa/Lagos"
		})} WAT`;
	}
	return event.date_text ?? "Date announced by organiser";
}
function priceLabel(event) {
	if (event.is_free) return "Free";
	return event.price_text ?? null;
}
/** Nigeria/Africa and online events first, then soonest start date. */
var LOCAL_HINTS = [
	"nigeria",
	"ng",
	"africa",
	"ghana",
	"kenya",
	"rwanda",
	"za"
];
/** Cities near our campuses, ranked ahead of the rest of Nigeria. */
var SOUTH_EAST_CITIES = [
	"nnewi",
	"awka",
	"onitsha",
	"uli",
	"enugu",
	"nsukka",
	"owerri",
	"aba",
	"umuahia",
	"asaba"
];
function localFirst(a, b) {
	const score = (e) => {
		if (e.is_featured) return -2;
		if (SOUTH_EAST_CITIES.includes((e.city ?? "").trim().toLowerCase())) return -1;
		const hay = `${e.country ?? ""} ${e.city ?? ""}`.toLowerCase();
		if (LOCAL_HINTS.some((h) => hay.includes(h))) return 0;
		return e.format === "VIRTUAL" ? 1 : 2;
	};
	const diff = score(a) - score(b);
	if (diff !== 0) return diff;
	const as = upcomingStart(a);
	const bs = upcomingStart(b);
	const at = as ? new Date(as).getTime() : Number.MAX_SAFE_INTEGER;
	const bt = bs ? new Date(bs).getTime() : Number.MAX_SAFE_INTEGER;
	if (at !== bt) return at - bt;
	return new Date(b.last_seen_at).getTime() - new Date(a.last_seen_at).getTime();
}
async function fetchEvents(limit = 300) {
	const { data, error } = await (await getSupabase()).from("events").select("*").eq("is_expired", false).limit(limit);
	if (error) throw error;
	return (data ?? []).filter((e) => isCurrent(e) && servesOurAudience(e)).sort(localFirst);
}
async function fetchEventBySlug(slug) {
	const { data, error } = await (await getSupabase()).from("events").select("*").eq("slug", slug).maybeSingle();
	if (error) throw error;
	return data ?? null;
}
function eventUrl(event) {
	return `https://techfaculty.ng/events/${event.slug}`;
}
/** Try to recover an ISO start date (YYYY-MM-DD) from free-text date labels like "12 September 2026". */
function resolveStartDate(event) {
	const startsAt = upcomingStart(event);
	if (startsAt) return startsAt;
	if (event.is_featured && event.starts_at) return null;
	const text = (event.date_text ?? "").trim();
	if (!text) return null;
	const cleaned = text.replace(/\b(\d{1,2})(st|nd|rd|th)\b/gi, "$1").split(/\s*(?:–|—|-\s|to\s)/)[0];
	const parsed = new Date(cleaned);
	if (Number.isNaN(parsed.getTime())) return null;
	const pad = (n) => String(n).padStart(2, "0");
	return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
}
function organizerUrl(event) {
	if (event.is_featured) return "https://techfaculty.ng/events";
	try {
		return new URL(event.source_url).origin;
	} catch {
		return "https://techfaculty.ng/events";
	}
}
/** Returns null when no start date can be established — invalid Event markup is never emitted. */
function eventSchema(event) {
	const start = resolveStartDate(event);
	if (!start) return null;
	const virtual = event.format === "VIRTUAL";
	const hybrid = event.format === "HYBRID";
	const place = {
		"@type": "Place",
		name: event.venue_name ?? event.city ?? "Venue announced by organiser",
		address: {
			"@type": "PostalAddress",
			streetAddress: event.address ?? void 0,
			addressLocality: event.city ?? void 0,
			addressRegion: event.state ?? void 0,
			addressCountry: event.country ?? "NG"
		}
	};
	const online = {
		"@type": "VirtualLocation",
		url: event.source_url
	};
	const priceNumber = event.is_free ? "0" : event.price_text?.match(/[\d][\d,.]*/)?.[0]?.replace(/,/g, "") ?? null;
	return {
		"@context": "https://schema.org",
		"@type": "Event",
		name: event.title,
		description: event.description.slice(0, 900),
		eventAttendanceMode: virtual ? "https://schema.org/OnlineEventAttendanceMode" : hybrid ? "https://schema.org/MixedEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
		eventStatus: "https://schema.org/EventScheduled",
		startDate: start,
		endDate: event.ends_at ?? void 0,
		location: virtual ? online : hybrid ? [place, online] : place,
		organizer: {
			"@type": "Organization",
			name: event.organizer,
			url: organizerUrl(event)
		},
		image: event.image_url ? [event.image_url] : void 0,
		url: eventUrl(event),
		isAccessibleForFree: event.is_free,
		offers: {
			"@type": "Offer",
			url: event.source_url,
			price: priceNumber ?? void 0,
			priceCurrency: event.is_free ? "NGN" : event.currency ?? (priceNumber ? "NGN" : void 0),
			availability: "https://schema.org/InStock",
			category: event.is_free ? "Free" : "Paid"
		},
		keywords: event.tags.join(", ") || void 0
	};
}
//#endregion
export { eventSchema as a, fetchEventBySlug as c, locationLabel as d, priceLabel as f, dateLabel as i, fetchEvents as l, EVENT_FORMATS as n, eventUrl as o, categoryLabel as r, events_exports as s, EVENT_CATEGORIES as t, formatLabel as u };
