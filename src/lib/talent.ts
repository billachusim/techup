import { getSupabase } from "@/integrations/supabase/lazy";
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
  internal: "In-house team",
  partner: "Project role",
  client: "Client project",
};

/**
 * Card badges describe the work, not who owns it: category first, then
 * anything a candidate needs to notice at a glance.
 */
export const roleBadges = (
  role: Pick<TalentRole, "category" | "is_paid_training" | "employment_type" | "openings" | "created_at" | "is_remote"> & { city?: string | null },
): string[] => {
  const badges: string[] = [];
  if (role.category) badges.push(role.category);
  if (role.is_paid_training) badges.push("Paid training");
  badges.push(EMPLOYMENT_LABEL[role.employment_type] ?? role.employment_type);
  if (role.is_remote) badges.push(role.city ? "Hybrid" : "Remote");
  const days = (Date.now() - new Date(role.created_at).getTime()) / 86_400_000;
  if (days <= 14) badges.push("New");
  return badges;
};

export const openingsLabel = (openings: number) =>
  openings === 1 ? "1 opening" : `${openings} openings`;

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

export const formatBudget = (
  role: Pick<TalentRole, "budget_min" | "budget_max" | "budget_currency" | "budget_unit"> & { pay_text?: string | null },
) => {
  if (role.pay_text?.trim()) return role.pay_text.trim();
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
  const supabase = await getSupabase();
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
  const supabase = await getSupabase();
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

export const SELECTION_PROCESS_LABEL: Record<string, string> = {
  direct: "No assessment or interview",
  assessment: "Assessment",
  interview: "Interview",
  assessment_interview: "Assessment and interview",
};

export const INTERVIEW_CHANNEL_LABEL: Record<string, string> = {
  whatsapp: "WhatsApp call",
  google_meet: "Google Meet",
};

/**
 * Work trial before selection (Bill, 2026-11-09): matched talent who say they are
 * interested submit 1-2 pieces of work over 1-2 weeks, then staff confirm or reject.
 * 0 works = no trial. Work submissions are only for this trial; selected staff work on Slack.
 */
export const WORK_TRIAL_PRESETS = [
  { value: "off", label: "No work trial", works: 0, days: 14 },
  { value: "urgent", label: "Urgent: 1 work in 1 week", works: 1, days: 7 },
  { value: "standard", label: "Standard: 2 works over 2 weeks", works: 2, days: 14 },
] as const;

export const workTrialPreset = (role: { work_trial_works?: number | null; work_trial_days?: number | null }) => {
  const works = role.work_trial_works ?? 0;
  if (works <= 0) return "off";
  return WORK_TRIAL_PRESETS.find((p) => p.works === works && p.days === (role.work_trial_days ?? 14))?.value ?? "custom";
};

export const workTrialText = (works: number, days: number) => {
  const weeks = days % 7 === 0 ? `${days / 7} week${days === 7 ? "" : "s"}` : `${days} days`;
  return `${works === 1 ? "1 piece of work" : `${works} pieces of work`} within ${weeks}`;
};

export const hiringStepsText = (role: {
  selection_process?: string | null;
  interview_channel?: string | null;
  work_trial_works?: number | null;
  work_trial_days?: number | null;
}) => {
  const base = selectionStepsText(role);
  const works = role.work_trial_works ?? 0;
  if (works <= 0) return base;
  const trial = `Matched talent who are interested first do a short work trial: submit ${workTrialText(works, role.work_trial_days ?? 14)} from your dashboard. We confirm selection based on that work.`;
  return role.selection_process && role.selection_process !== "direct" ? `${trial} ${base}` : `${trial} Selected talent are then added to the project Slack.`;
};

const selectionStepsText = (role: { selection_process?: string | null; interview_channel?: string | null }) => {
  const p = role.selection_process ?? "direct";
  const via = INTERVIEW_CHANNEL_LABEL[role.interview_channel ?? "whatsapp"] ?? "WhatsApp call";
  if (p === "assessment") return "Shortlisted talent will be emailed a short assessment link. Selected talent are then added to the project Slack.";
  if (p === "interview") return `Shortlisted talent will be emailed a link to book an interview (${via}). Selected talent are then added to the project Slack.`;
  if (p === "assessment_interview") return `Shortlisted talent will be emailed an assessment link, then a link to book an interview (${via}). Selected talent are then added to the project Slack.`;
  return "No assessment or interview. Selected talent are added straight to the project Slack.";
};

export const MATCH_STATUS_LABEL: Record<string, string> = {
  suggested: "Awaiting review",
  approved: "Shared with talent",
  accepted: "Talent accepted",
  trial: "Work trial",
  assessment: "In assessment",
  interview: "In interview",
  shortlisted: "Shortlisted",
  interviewed: "Interviewed",
  offer_sent: "Offer sent",
  hired: "Hired",
  onboarded: "Onboarded",
  unresponsive: "Unresponsive",
  declined: "Declined",
};

export const APPLICATION_STATUS_LABEL: Record<string, string> = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  assessment: "Assessment",
  interviewing: "Interviewing",
  interviewed: "Interviewed",
  selected: "Selected",
  offer_sent: "Offer sent",
  hired: "Hired",
  onboarded: "Onboarded",
  unresponsive: "Unresponsive",
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
  const supabase = await getSupabase();
  const { data, error } = await supabase.rpc("list_public_talent");
  if (error) throw error;
  return data ?? [];
}

export async function fetchPublicTalentById(id: string): Promise<PublicTalentDetail | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.rpc("get_public_talent", { profile_id: id });
  if (error) throw error;
  return data?.[0] ?? null;
}

export async function fetchProjectGroupUrl(roleId: string): Promise<string | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.rpc("get_project_group_url", { _role_id: roleId });
  if (error) return null;
  return data ?? null;
}

export type TalentDeliverable = Database["public"]["Tables"]["talent_deliverables"]["Row"];
export type ProjectWorkspace = Database["public"]["Functions"]["get_project_workspace"]["Returns"][number];

export const DELIVERABLE_STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  reviewed: "Reviewed",
  needs_changes: "Needs changes",
};

/** Days left on a trial (negative = overdue), or null when there is no due date. */
export const trialDaysLeft = (dueAt: string | null | undefined, now = Date.now()) => {
  if (!dueAt) return null;
  const due = new Date(dueAt).getTime();
  if (Number.isNaN(due)) return null;
  return Math.ceil((due - now) / 86_400_000);
};

/** Project links are only readable by matched talent and staff (database gated). */
export async function fetchProjectWorkspace(roleId: string): Promise<ProjectWorkspace | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.rpc("get_project_workspace", { _role_id: roleId });
  if (error) return null;
  return data?.[0] ?? null;
}

export const hasWorkspaceLinks = (w: ProjectWorkspace | null | undefined) =>
  Boolean(w && (w.whatsapp_group_url || w.slack_channel_url || w.task_board_url || w.drive_url || w.project_brief));

export const startOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
};

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
