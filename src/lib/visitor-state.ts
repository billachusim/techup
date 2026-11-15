/**
 * Turns Cloudflare's IP-based region (request.cf.region) into a Nigerian state
 * name for the homepage hero line. Returns null outside Nigeria or when the
 * region is missing or unrecognised, so the line simply stays empty.
 */
export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const byKey = new Map(
  NIGERIAN_STATES.map((s) => [s.toLowerCase().replace(/[^a-z]/g, ""), s]),
);

export function nigerianState(
  country: unknown,
  region: unknown,
): string | null {
  if (country !== "NG" || typeof region !== "string") return null;
  const key = region
    .toLowerCase()
    .replace(/\bstate\b/g, "")
    .replace(/[^a-z]/g, "");
  if (!key) return null;
  if (key.includes("federalcapital") || key === "fct" || key === "abuja")
    return "Abuja";
  if (key === "nassarawa") return "Nasarawa";
  return byKey.get(key) ?? null;
}

/** ISO country code for visitors outside Nigeria; null for Nigeria, unknown or Tor ("XX", "T1"). */
export function foreignCountry(country: unknown): string | null {
  if (typeof country !== "string" || !/^[A-Z]{2}$/.test(country)) return null;
  if (country === "NG" || country === "XX" || country === "T1") return null;
  return country;
}

const WITH_THE: Record<string, string> = {
  US: "the United States",
  GB: "the UK",
  AE: "the UAE",
  NL: "the Netherlands",
  PH: "the Philippines",
  CD: "the DR Congo",
  CF: "the Central African Republic",
  GM: "the Gambia",
};

/** "the United States", "Ghana", "Canada"… for the hero line; null when the name is unknown. */
export function countryName(code: string): string | null {
  if (WITH_THE[code]) return WITH_THE[code];
  try {
    const name = new Intl.DisplayNames(["en"], { type: "region" }).of(code);
    return name && name !== code ? name : null;
  } catch {
    return null;
  }
}

/** African countries are pointed to the "study online from Africa" page. */
export const AFRICAN_COUNTRIES = new Set(
  "DZ AO BJ BW BF BI CV CM CF TD KM CG CD CI DJ EG GQ ER SZ ET GA GM GH GN GW KE LS LR LY MG MW ML MR MU MA MZ NA NE RW ST SN SC SL SO ZA SS SD TZ TG TN UG ZM ZW".split(
    " ",
  ),
);
