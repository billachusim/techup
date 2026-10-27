/**
 * Who a scraped event is for. The /events feed is for learners in Nigeria and the rest
 * of Africa, plus online events anyone can join. Used by the scrape-events edge function
 * (so foreign events are never stored) and by the site (so rows stored before this rule
 * existed stay hidden).
 */

export type AudienceRow = {
  title?: string | null;
  description?: string | null;
  organizer?: string | null;
  format?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  address?: string | null;
  venue_name?: string | null;
  is_featured?: boolean | null;
  source_platform?: string | null;
};

/** ISO 3166 alpha-2 codes of every African country. */
const AFRICA_ISO2 = new Set([
  "DZ", "AO", "BJ", "BW", "BF", "BI", "CV", "CM", "CF", "TD", "KM", "CG", "CD", "CI", "DJ", "EG", "GQ", "ER",
  "SZ", "ET", "GA", "GM", "GH", "GN", "GW", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ",
  "NA", "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ", "TG", "TN", "UG", "ZM", "ZW",
]);

/** Country fields come back as alpha-2, alpha-3 or a name cut to 3 letters ("UNI", "NIG"). */
const COUNTRY_ALIASES: Record<string, string> = {
  NGA: "NG", NIG: "NG", GHA: "GH", KEN: "KE", ZAF: "ZA", SOU: "ZA", RWA: "RW", EGY: "EG", UGA: "UG", TZA: "TZ",
  ETH: "ET", SEN: "SN", CIV: "CI", CMR: "CM", MAR: "MA", TUN: "TN", ZMB: "ZM", ZWE: "ZW",
  USA: "US", UNI: "US", AME: "US", GBR: "GB", ENG: "GB", CAN: "CA", IND: "IN", DEU: "DE", GER: "DE",
  FRA: "FR", AUS: "AU", IRL: "IE", NLD: "NL", ESP: "ES", ITA: "IT", BRA: "BR", MEX: "MX", ARE: "AE",
};

export function countryCode(raw: string | null | undefined): string | null {
  const c = String(raw ?? "").trim().toUpperCase().replace(/[^A-Z]/g, "");
  if (!c) return null;
  if (c.length === 2) return c === "UK" ? "GB" : c;
  return COUNTRY_ALIASES[c.slice(0, 3)] ?? null;
}

/** Places in Africa: an event naming one of these in its venue is for our audience. */
const AFRICAN_PLACES = [
  "nigeria", "lagos", "abuja", "nnewi", "onitsha", "awka", "enugu", "nsukka", "owerri", "aba", "umuahia", "asaba",
  "anambra", "imo", "abia", "ebonyi", "ibadan", "kano", "kaduna", "port harcourt", "benin city", "jos", "ilorin",
  "uyo", "calabar", "warri", "akure", "abeokuta", "ikeja", "lekki", "yaba", "victoria island",
  "africa", "ghana", "accra", "kumasi", "kenya", "nairobi", "rwanda", "kigali", "south africa", "cape town",
  "johannesburg", "egypt", "cairo", "uganda", "kampala", "tanzania", "dar es salaam", "ethiopia", "addis ababa",
  "senegal", "dakar", "morocco", "cameroon", "zambia", "zimbabwe",
];

/**
 * Places outside Africa that turn up on global listings (Microsoft Reactor, GDG, Luma).
 * "georgia", "washington" and "jersey" are left out: too easy to hit by accident.
 */
const FOREIGN_PLACES = [
  "usa", "united states", "america", "canada", "united kingdom", "england", "scotland", "europe", "india",
  "australia", "germany", "france", "ireland", "netherlands", "spain", "brazil", "mexico", "singapore", "japan",
  "china", "dubai", "uae", "pakistan", "philippines",
  "alabama", "alaska", "arizona", "arkansas", "california", "colorado", "connecticut", "delaware", "florida",
  "hawaii", "idaho", "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana", "maine", "maryland",
  "massachusetts", "michigan", "minnesota", "mississippi", "missouri", "montana", "nebraska", "nevada",
  "new hampshire", "new jersey", "new mexico", "new york", "north carolina", "north dakota", "ohio", "oklahoma",
  "oregon", "pennsylvania", "rhode island", "south carolina", "south dakota", "tennessee", "texas", "utah",
  "vermont", "virginia", "wisconsin", "wyoming",
  "san francisco", "seattle", "boston", "chicago", "los angeles", "austin", "atlanta", "denver", "houston",
  "dallas", "miami", "toronto", "vancouver", "montreal", "london", "manchester", "dublin", "berlin", "paris",
  "amsterdam", "bangalore", "bengaluru", "hyderabad", "mumbai", "delhi", "sydney", "melbourne", "redmond",
  "silicon valley", "bay area", "kansas city", "nyc",
];

/** "City, ST" with a US state abbreviation, e.g. "Overland Park, KS". */
const US_STATE_SUFFIX =
  /,\s*(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC)\b/;

/** Copy that limits who may attend: "USA only", "open to US residents", "must be based in Canada". */
const REGION_LOCK = new RegExp(
  [
    String.raw`\b(usa|u\.s\.a\.?|united states|american|canad(a|ian)|uk|u\.k\.|british|eu|europe(an)?|north america(n)?|australia(n)?)[\s-]*(only|residents?|citizens?|based)\b`,
    String.raw`\b(only|exclusively)\s+(open|available)\s+to\s+(residents|people|participants|attendees|those)\s+(in|of|from)\s+(the\s+)?(us|usa|united states|canada|uk|united kingdom|eu|europe|north america|india|australia)\b`,
    String.raw`\b(must|need to)\s+(be\s+)?(located|living|reside|based|resident)\s+(in|of)\s+(the\s+)?(us|usa|united states|canada|uk|united kingdom|eu|europe|north america|india|australia)\b`,
    String.raw`\b(us|united states)\s+(work\s+)?(authori[sz]ation|work permit)\b`,
  ].join("|"),
  "i",
);
/** Bare "US" only in capitals, so "contact us only by email" is not a region lock. */
const US_LOCK = /\b(US|U\.S\.?)[\s-]*(only|ONLY|Only|residents?|citizens?|based|Residents?|Citizens?)\b/;

/** Listing pages that cover the whole world; every other source is already scoped to Nigeria. */
const GLOBAL_SOURCES = ["Microsoft Reactor"];

function hits(text: string, places: string[]): boolean {
  const t = ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, " ")} `;
  return places.some((p) => t.includes(` ${p} `));
}

/** Why an event is not for our audience, or null when it is. */
export function audienceProblem(row: AudienceRow): string | null {
  // Our own events are always shown.
  if (row.is_featured || row.source_platform === "Tech Faculty") return null;

  const copy = `${row.title ?? ""} ${row.description ?? ""}`;
  if (REGION_LOCK.test(copy) || US_LOCK.test(copy)) return "restricted to a region outside Africa";

  const place = `${row.venue_name ?? ""} ${row.address ?? ""} ${row.city ?? ""} ${row.state ?? ""}`;
  const code = countryCode(row.country);
  const african = (code !== null && AFRICA_ISO2.has(code)) || hits(place, AFRICAN_PLACES);
  if (african) return null;

  // A named venue, country or chapter outside Africa marks a local event elsewhere, even
  // when it is streamed: a Kansas GDG meetup is for Kansas.
  const foreign =
    (code !== null && !AFRICA_ISO2.has(code)) ||
    hits(place, FOREIGN_PLACES) ||
    US_STATE_SUFFIX.test(place) ||
    hits(`${row.organizer ?? ""} ${row.title ?? ""}`, FOREIGN_PLACES);
  if (foreign) return "located outside Africa";

  // No place either way: an online event is open to everyone, and an in-person one
  // came from a Nigerian listing page unless its source covers the whole world.
  if (row.format === "VIRTUAL") return null;
  if (GLOBAL_SOURCES.includes(row.source_platform ?? "")) return "no African venue";
  return null;
}

export function servesOurAudience(row: AudienceRow): boolean {
  return audienceProblem(row) === null;
}
