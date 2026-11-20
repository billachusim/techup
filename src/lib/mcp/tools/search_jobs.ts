import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SITE, matches, publicClient, toolError } from "../_shared/publicClient";

type JobRow = {
  slug: string;
  title: string;
  company: string;
  source_platform: string;
  employment_type: string;
  is_remote: boolean;
  location: string | null;
  country: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  salary_unit: string | null;
  tags: string[] | null;
  last_seen_at: string;
};

const salary = (j: JobRow) => {
  if (!j.salary_min && !j.salary_max) return "";
  const unit = j.salary_unit ? `/${j.salary_unit.toLowerCase()}` : "";
  const cur = j.salary_currency ?? "";
  const n = (x: number) => x.toLocaleString("en-NG");
  return j.salary_min && j.salary_max ? `${cur} ${n(j.salary_min)} – ${n(j.salary_max)}${unit}` : `${cur} ${n((j.salary_min ?? j.salary_max)!)}${unit}`;
};

export default defineTool({
  name: "search_jobs",
  title: "Search remote tech jobs",
  description:
    "Search curated remote tech, AI-training and Nigerian jobs listed on the Tech Faculty careers board (refreshed twice a month), with salary where known and the job page link.",
  inputSchema: {
    query: z.string().max(100).optional().describe("Words to match in the job title, company, platform or tags, e.g. 'data annotation' or 'python'."),
    remoteOnly: z.boolean().optional().describe("Only remote jobs."),
    limit: z.number().int().min(1).max(50).optional().describe("Max jobs to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, remoteOnly, limit }) => {
    const supabase = publicClient();
    if (!supabase) return toolError("Jobs are unavailable right now. See https://techfaculty.ng/careers.");
    let q = supabase
      .from("jobs")
      .select("slug,title,company,source_platform,employment_type,is_remote,location,country,salary_min,salary_max,salary_currency,salary_unit,tags,last_seen_at")
      .eq("is_expired", false)
      .order("last_seen_at", { ascending: false })
      .limit(300);
    if (remoteOnly) q = q.eq("is_remote", true);
    const { data, error } = await q;
    if (error) return toolError("Could not load jobs. See https://techfaculty.ng/careers.");
    const found = ((data ?? []) as JobRow[]).filter((j) => matches(query, j.title, j.company, j.source_platform, j.location, j.tags ?? []));
    const jobs = found.slice(0, limit ?? 20).map((j) => ({
      title: j.title,
      company: j.company,
      platform: j.source_platform,
      employmentType: j.employment_type,
      remote: j.is_remote,
      location: [j.location, j.country].filter(Boolean).join(", "),
      salary: salary(j),
      tags: j.tags ?? [],
      lastSeen: j.last_seen_at,
      url: `${SITE}/careers/jobs/${j.slug}`,
    }));
    const result = {
      matched: found.length,
      returned: jobs.length,
      note: `Tech Faculty's own roles and client projects are listed by list_open_roles; pay-per-task work by list_side_hustles. Full board: ${SITE}/careers`,
      jobs,
    };
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], structuredContent: result };
  },
});
