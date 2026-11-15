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
