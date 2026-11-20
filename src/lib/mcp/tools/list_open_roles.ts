import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SITE, matches, publicClient, toolError } from "../_shared/publicClient";

type RoleRow = {
  slug: string;
  title: string;
  company: string;
  category: string | null;
  employment_type: string;
  seniority: string;
  city: string | null;
  country: string;
  is_remote: boolean;
  openings: number;
  pay_text: string | null;
  budget_min: number | null;
  budget_max: number | null;
  budget_currency: string;
  budget_unit: string;
  summary: string;
  required_skills: string[] | null;
  apply_deadline: string | null;
  is_paid_training: boolean;
};

const money = (n: number, cur: string) => `${cur === "NGN" ? "₦" : cur === "USD" ? "$" : `${cur} `}${Math.round(n).toLocaleString("en-NG")}`;
const payLabel = (r: RoleRow) => {
  if (r.pay_text?.trim()) return r.pay_text.trim();
  const unit = r.budget_unit.toLowerCase();
  if (r.budget_min && r.budget_max) return `${money(r.budget_min, r.budget_currency)} – ${money(r.budget_max, r.budget_currency)} / ${unit}`;
  if (r.budget_min) return `From ${money(r.budget_min, r.budget_currency)} / ${unit}`;
  if (r.budget_max) return `Up to ${money(r.budget_max, r.budget_currency)} / ${unit}`;
  return "Pay discussed on shortlist";
};

export default defineTool({
  name: "list_open_roles",
  title: "List open Tech Faculty roles",
  description:
    "List open roles on the Tech Faculty jobs marketplace: Tech Faculty team roles, tutors, field reps and client projects in Nigeria (remote and on-site), with pay and the apply link.",
  inputSchema: {
    query: z.string().max(100).optional().describe("Words to match in the title, summary, skills or city, e.g. 'tutor' or 'Nnewi'."),
    remoteOnly: z.boolean().optional().describe("Only roles that can be done remotely."),
    limit: z.number().int().min(1).max(50).optional().describe("Max roles to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, remoteOnly, limit }) => {
    const supabase = publicClient();
    if (!supabase) return toolError("Roles are unavailable right now. See https://techfaculty.ng/careers.");
    let q = supabase
      .from("talent_roles")
      .select("slug,title,company,category,employment_type,seniority,city,country,is_remote,openings,pay_text,budget_min,budget_max,budget_currency,budget_unit,summary,required_skills,apply_deadline,is_paid_training")
      .eq("status", "published")
      .eq("applications_closed", false)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(200);
    if (remoteOnly) q = q.eq("is_remote", true);
    const { data, error } = await q;
    if (error) return toolError("Could not load roles. See https://techfaculty.ng/careers.");
    const found = ((data ?? []) as RoleRow[]).filter((r) =>
      matches(query, r.title, r.summary, r.category, r.city, r.company, r.required_skills ?? []),
    );
    const roles = found.slice(0, limit ?? 20).map((r) => ({
      title: r.title,
      company: r.company,
      category: r.category ?? "",
      employmentType: r.employment_type,
      seniority: r.seniority,
      location: r.is_remote ? (r.city ? `${r.city}, ${r.country} (remote friendly)` : `Remote (${r.country})`) : [r.city, r.country].filter(Boolean).join(", "),
      openings: r.openings,
      pay: payLabel(r),
      paidTraining: r.is_paid_training,
      summary: r.summary,
      requiredSkills: r.required_skills ?? [],
      applyDeadline: r.apply_deadline ?? "",
      applyUrl: `${SITE}/talent/roles/${r.slug}`,
    }));
    const result = {
      matched: found.length,
      returned: roles.length,
      howToApply: `Open the role and apply with a free Tech Faculty talent profile (${SITE}/talent).`,
      roles,
    };
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], structuredContent: result };
  },
});
