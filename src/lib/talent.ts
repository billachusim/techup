import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type TalentRole = Database["public"]["Tables"]["talent_roles"]["Row"];
export type TalentProfile = Database["public"]["Tables"]["talent_profiles"]["Row"];
export type RoleMatch = Database["public"]["Tables"]["role_matches"]["Row"];
export type TalentApplication = Database["public"]["Tables"]["talent_applications"]["Row"];
export type BusinessBrief = Database["public"]["Tables"]["business_briefs"]["Row"];

export const TALENT_WHATSAPP_NUMBER = "2348068597140";

export const talentWhatsAppUrl = (message: string) =>
  `https://wa.me/${TALENT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const ROLE_KIND_LABEL: Record<string, string> = {
  internal: "Tech Faculty role",
  partner: "Partner role",
  client: "Client project",
};

export const EMPLOYMENT_LABEL: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
  freelance: "Freelance",
};

export const SENIORITY_LABEL: Record<string, string> = {
  entry: "Entry level",
  mid: "Mid level",
  senior: "Senior",
  lead: "Lead",
};

export const WORK_MODE_LABEL: Record<string, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

const UNIT_LABEL: Record<string, string> = {
  MONTH: "month",
  WEEK: "week",
  HOUR: "hour",
  DAY: "day",
  PROJECT: "project",
  YEAR: "year",
};

const currencySymbol = (code: string) => (code === "USD" ? "$" : code === "NGN" ? "₦" : `${code} `);

export const formatMoney = (amount: number, currency: string) =>
  `${currencySymbol(currency)}${Math.round(amount).toLocaleString("en-NG")}`;

export const formatBudget = (role: Pick<TalentRole, "budget_min" | "budget_max" | "budget_currency" | "budget_unit">) => {
  const unit = UNIT_LABEL[role.budget_unit] ?? role.budget_unit.toLowerCase();
  if (role.budget_min && role.budget_max) {
    return `${formatMoney(role.budget_min, role.budget_currency)} – ${formatMoney(role.budget_max, role.budget_currency)} / ${unit}`;
  }
  if (role.budget_min) return `From ${formatMoney(role.budget_min, role.budget_currency)} / ${unit}`;
  if (role.budget_max) return `Up to ${formatMoney(role.budget_max, role.budget_currency)} / ${unit}`;
  return "Pay discussed on shortlist";
};

export const roleLocationLabel = (role: Pick<TalentRole, "city" | "country" | "is_remote">) => {
  if (role.is_remote && !role.city) return `Remote (${role.country})`;
  if (role.is_remote && role.city) return `${role.city}, ${role.country} · Remote friendly`;
  return [role.city, role.country].filter(Boolean).join(", ");
};

export async function fetchPublishedRoles(kind?: string): Promise<TalentRole[]> {
  let query = supabase
    .from("talent_roles")
    .select("*")
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (kind) query = query.eq("role_kind", kind);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchRoleBySlug(slug: string): Promise<TalentRole | null> {
  const { data, error } = await supabase.from("talent_roles").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}

export const SKILL_SUGGESTIONS = [
  "JavaScript", "React", "TypeScript", "Node.js", "Python", "Data analysis", "Excel", "Power BI",
  "SQL", "UI/UX design", "Graphic design", "Figma", "Digital marketing", "Social media",
  "Sales", "Marketing", "Project management", "Copywriting", "Cyber security", "Networking",
  "Machine learning", "Prompt engineering", "Data annotation", "Customer support", "WordPress",
  "Mobile development", "Flutter", "Video editing", "Bookkeeping", "Virtual assistance",
];

type StrengthInput = Partial<
  Pick<
    TalentProfile,
    "full_name" | "city" | "phone" | "skills" | "cv_path" | "headline" | "bio" |
    "linkedin_url" | "github_url" | "portfolio_url" | "years_experience" | "hours_per_week" | "rate_amount"
  >
>;

export function profileStrength(p: StrengthInput): number {
  let score = 0;
  if (p.full_name) score += 10;
  if (p.city) score += 5;
  if (p.phone) score += 10;
  if ((p.skills?.length ?? 0) >= 3) score += 15;
  else if ((p.skills?.length ?? 0) > 0) score += 7;
  if (p.cv_path) score += 15;
  if (p.headline) score += 10;
  if (p.bio && p.bio.length > 80) score += 10;
  if (p.linkedin_url) score += 5;
  if (p.github_url || p.portfolio_url) score += 5;
  if (p.years_experience != null) score += 5;
  if (p.hours_per_week != null) score += 5;
  if (p.rate_amount != null) score += 5;
  return Math.min(100, score);
}

export const parseList = (value: string): string[] =>
  value
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const MATCH_STATUS_LABEL: Record<string, string> = {
  suggested: "Awaiting review",
  approved: "Shared with talent",
  accepted: "Talent accepted",
  assessment: "In assessment",
  interview: "In interview",
  hired: "Hired",
  declined: "Declined",
};

export const APPLICATION_STATUS_LABEL: Record<string, string> = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  assessment: "Assessment",
  interviewing: "Interviewing",
  hired: "Hired",
  rejected: "Not selected",
};

export const ENGAGEMENT_STATUS_LABEL: Record<string, string> = {
  active: "Active",
  paused: "Paused",
  ended: "Ended",
};

export type TalentEngagement = Database["public"]["Tables"]["talent_engagements"]["Row"];
export type PublicTalentSummary = Database["public"]["Functions"]["list_public_talent"]["Returns"][number];
export type PublicTalentDetail = Database["public"]["Functions"]["get_public_talent"]["Returns"][number];

export async function fetchPublicTalent(): Promise<PublicTalentSummary[]> {
  const { data, error } = await supabase.rpc("list_public_talent");
  if (error) throw error;
  return data ?? [];
}

export async function fetchPublicTalentById(id: string): Promise<PublicTalentDetail | null> {
  const { data, error } = await supabase.rpc("get_public_talent", { profile_id: id });
  if (error) throw error;
  return data?.[0] ?? null;
}

export async function fetchProjectGroupUrl(roleId: string): Promise<string | null> {
  const { data, error } = await supabase.rpc("get_project_group_url", { _role_id: roleId });
  if (error) return null;
  return data ?? null;
}

export const introRequestUrl = (name: string, skills: string[]) =>
  talentWhatsAppUrl(
    `Hello Tech Faculty, I would like an introduction to ${name} from your talent pool` +
      (skills.length ? ` (${skills.slice(0, 4).join(", ")}).` : ".") +
      " Please tell me about availability and rates."
  );

export const contactUrl = (phone: string | null, name: string) => {
  const digits = (phone ?? "").replace(/\D/g, "");
  const normalised = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
  const message = `Hello ${name.split(" ")[0]}, this is Tech Faculty about a role you were matched to.`;
  return `https://wa.me/${normalised}?text=${encodeURIComponent(message)}`;
};

export const projectManagerUrl = (roleTitle: string, talentName?: string) =>
  talentWhatsAppUrl(
    `Hello Tech Faculty, I am ${talentName ?? "a matched talent"} and I was matched to "${roleTitle}". ` +
      "I would like to speak with the project manager about the assessment and next steps."
  );

export const weeksSince = (isoDate: string) => {
  const start = new Date(isoDate).getTime();
  if (Number.isNaN(start)) return 0;
  return Math.max(1, Math.floor((Date.now() - start) / (7 * 24 * 60 * 60 * 1000)) + 1);
};
