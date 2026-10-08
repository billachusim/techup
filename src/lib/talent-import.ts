import { profileStrength, type TalentProfile } from "@/lib/talent";
import type { Database } from "@/integrations/supabase/types";

// Turns a Google Form "Download responses (.csv)" export into talent_profiles
// rows. Column names vary per form, so headers are matched by keyword and any
// answer we can't place is kept in admin_notes rather than dropped.

export type TalentInsert =
  Database["public"]["Tables"]["talent_profiles"]["Insert"];

export type ImportField =
  | "full_name"
  | "first_name"
  | "last_name"
  | "email"
  | "phone"
  | "whatsapp"
  | "city"
  | "country"
  | "headline"
  | "bio"
  | "skills"
  | "tools"
  | "linkedin_url"
  | "github_url"
  | "portfolio_url"
  | "years_experience"
  | "hours_per_week"
  | "cv_link"
  | "timestamp";

export const IMPORT_FIELD_LABEL: Record<ImportField, string> = {
  full_name: "Full name",
  first_name: "First name",
  last_name: "Last name",
  email: "Email",
  phone: "Phone",
  whatsapp: "WhatsApp",
  city: "City",
  country: "Country",
  headline: "Headline",
  bio: "Bio",
  skills: "Skills",
  tools: "Tools",
  linkedin_url: "LinkedIn",
  github_url: "GitHub",
  portfolio_url: "Portfolio",
  years_experience: "Years of experience",
  hours_per_week: "Hours per week",
  cv_link: "CV link (kept in notes)",
  timestamp: "Form timestamp (kept in notes)",
};

// Checked in order; the first rule that matches a header wins, and each field
// is used by at most one column.
const HEADER_RULES: [ImportField, RegExp][] = [
  ["timestamp", /^timestamp$/i],
  ["email", /e-?mail/i],
  ["whatsapp", /whats\s?app/i],
  ["phone", /phone|mobile|telephone|contact number/i],
  ["linkedin_url", /linked\s?in/i],
  ["github_url", /git\s?hub/i],
  ["portfolio_url", /portfolio|website|behance|dribbble/i],
  ["cv_link", /\bcv\b|resume|résumé/i],
  ["first_name", /first\s*name|given name/i],
  ["last_name", /last\s*name|surname|family name/i],
  ["full_name", /name/i],
  ["country", /country|nationality/i],
  ["years_experience", /years?\b.*experience|experience.*\byears?|how long/i],
  ["hours_per_week", /hours/i],
  ["tools", /tools|software/i],
  ["skills", /skill|stack|expertise|track|speciali[sz]/i],
  [
    "headline",
    /headline|job title|current (role|position|job)|profession|occupation/i,
  ],
  ["bio", /bio|about (you|yourself)|describe yourself|tell us/i],
  ["city", /city|state|location|where .*(live|based|reside)/i],
];

/** Parses CSV text (RFC 4180: quoted fields, doubled quotes, CRLF, newlines inside quotes). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

/** Maps each column index to the field it fills, or null to keep it as a note. */
export function mapHeaders(headers: string[]): (ImportField | null)[] {
  const used = new Set<ImportField>();
  return headers.map((h) => {
    const rule = HEADER_RULES.find(
      ([field, re]) => !used.has(field) && re.test(h.trim()),
    );
    if (!rule) return null;
    used.add(rule[0]);
    return rule[0];
  });
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/** Nigerian numbers to +234…; Sheets often drops the leading 0. Anything else is kept as typed. */
export function normalizePhone(raw: string): string {
  const v = raw.trim();
  const digits = v.replace(/\D/g, "");
  if (!digits) return "";
  if (/^234[789]\d{9}$/.test(digits)) return `+${digits}`;
  if (/^0[789]\d{9}$/.test(digits)) return `+234${digits.slice(1)}`;
  if (/^[789]\d{9}$/.test(digits)) return `+234${digits}`;
  return v;
}

const phoneKey = (v: string | null | undefined) =>
  v ? v.replace(/\D/g, "").replace(/^0/, "234") : "";

const normalizeUrl = (raw: string): string | null => {
  const v = raw.trim();
  if (!v || /^(n\/?a|none|nil|-)$/i.test(v)) return null;
  if (/^https?:\/\//i.test(v)) return v;
  return /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(v) ? `https://${v}` : null;
};

const firstNumber = (raw: string): number | null => {
  const m = raw.match(/\d+/);
  return m ? Math.min(Number(m[0]), 80) : null;
};

const splitList = (raw: string): string[] => {
  const seen = new Set<string>();
  return raw
    .split(/[,;\n|]/)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter((s) => {
      const k = s.toLowerCase();
      if (!s || s.length > 60 || seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, 25);
};

export type ImportRow = {
  line: number;
  status: "ready" | "duplicate" | "invalid";
  problem?: string;
  profile: TalentInsert;
};

/**
 * Builds one insert per response. A row is a duplicate when its email or phone
 * matches an existing profile or an earlier row in the same file; email
 * duplicates would also break claim_my_talent_profile, which expects one
 * unclaimed profile per email.
 */
export function buildImportRows(
  csvRows: string[][],
  existing: Pick<TalentProfile, "email" | "phone" | "whatsapp">[],
): { headers: string[]; mapping: (ImportField | null)[]; rows: ImportRow[] } {
  const [headers = [], ...body] = csvRows;
  const mapping = mapHeaders(headers);
  const emails = new Set(
    existing
      .map((p) => p.email?.trim().toLowerCase())
      .filter(Boolean) as string[],
  );
  const phones = new Set(
    existing
      .flatMap((p) => [phoneKey(p.phone), phoneKey(p.whatsapp)])
      .filter(Boolean),
  );

  const rows = body.map((cells, i): ImportRow => {
    const get = (f: ImportField) => {
      const idx = mapping.indexOf(f);
      return idx >= 0 ? (cells[idx] ?? "").trim() : "";
    };
    const notes: string[] = [];
    headers.forEach((h, idx) => {
      const value = (cells[idx] ?? "").trim();
      const field = mapping[idx];
      if (
        value &&
        (field === null || field === "cv_link" || field === "timestamp")
      )
        notes.push(`${h.trim()}: ${value}`);
    });

    const fullName =
      get("full_name") ||
      [get("first_name"), get("last_name")].filter(Boolean).join(" ");
    const rawEmail = get("email").toLowerCase();
    const email = isEmail(rawEmail) ? rawEmail : null;
    if (rawEmail && !email) notes.push(`Email as submitted: ${rawEmail}`);
    const phone = normalizePhone(get("phone")) || null;
    const whatsapp = normalizePhone(get("whatsapp")) || null;

    const profile: TalentInsert = {
      full_name: fullName.replace(/\s+/g, " "),
      email,
      phone: phone ?? whatsapp,
      whatsapp,
      city: get("city") || null,
      country: get("country") || "Nigeria",
      headline: get("headline").slice(0, 120) || null,
      bio: get("bio") || null,
      skills: splitList(get("skills")),
      tools: splitList(get("tools")),
      linkedin_url: normalizeUrl(get("linkedin_url")),
      github_url: normalizeUrl(get("github_url")),
      portfolio_url: normalizeUrl(get("portfolio_url")),
      years_experience: firstNumber(get("years_experience")),
      hours_per_week: firstNumber(get("hours_per_week")),
      source: "google_form",
      // Hidden until staff review it, since these people never saw the site's profile builder.
      is_public: false,
      admin_notes: notes.length
        ? `Imported from Google Form.\n${notes.join("\n")}`
        : "Imported from Google Form.",
    };
    profile.profile_strength = profileStrength(
      profile as Parameters<typeof profileStrength>[0],
    );

    const line = i + 2;
    if (!profile.full_name)
      return { line, status: "invalid", problem: "No name", profile };
    if (!email && !profile.phone)
      return { line, status: "invalid", problem: "No email or phone", profile };

    const keys = [phoneKey(profile.phone), phoneKey(whatsapp)].filter(Boolean);
    const dup = (email && emails.has(email)) || keys.some((k) => phones.has(k));
    if (email) emails.add(email);
    keys.forEach((k) => phones.add(k));
    if (dup)
      return {
        line,
        status: "duplicate",
        problem: "Already in the pool",
        profile,
      };
    return { line, status: "ready", profile };
  });

  return { headers, mapping, rows };
}
