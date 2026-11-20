import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SITE, matches, publicClient, toolError } from "../_shared/publicClient";

type TalentRow = {
  id: string;
  full_name: string | null;
  headline: string | null;
  city: string | null;
  country: string | null;
  skills: string[] | null;
  tools: string[] | null;
  years_experience: number | null;
  hours_per_week: number | null;
  work_mode: string | null;
  availability: string | null;
  is_vetted: boolean | null;
};

export default defineTool({
  name: "search_talent_pool",
  title: "Search the talent pool",
  description:
    "Search Tech Faculty's public talent pool of Nigerian and African tech talent by skill, tool or city, for businesses looking to hire. Returns first names, skills and profile links only; introductions go through Tech Faculty.",
  inputSchema: {
    query: z.string().max(100).optional().describe("Skills, tools, role or city to match, e.g. 'react developer' or 'video editing Lagos'."),
    vettedOnly: z.boolean().optional().describe("Only talent with a Vetted badge (passed a Tech Faculty assessment or work trial, or a Tech Faculty student/graduate)."),
    limit: z.number().int().min(1).max(30).optional().describe("Max profiles to return (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, vettedOnly, limit }) => {
    const supabase = publicClient();
    if (!supabase) return toolError("The talent pool is unavailable right now. See https://techfaculty.ng/talent/pool.");
    const { data, error } = await supabase.rpc("list_public_talent");
    if (error) return toolError("Could not load the talent pool. See https://techfaculty.ng/talent/pool.");
    const found = ((data ?? []) as TalentRow[]).filter(
      (t) => (!vettedOnly || t.is_vetted) && matches(query, t.headline, t.city, t.country, t.skills ?? [], t.tools ?? []),
    );
    const talent = found.slice(0, limit ?? 10).map((t) => ({
      firstName: (t.full_name ?? "").trim().split(/\s+/)[0] ?? "",
      headline: t.headline ?? "",
      location: [t.city, t.country].filter(Boolean).join(", "),
      skills: t.skills ?? [],
      tools: t.tools ?? [],
      yearsExperience: t.years_experience ?? 0,
      hoursPerWeek: t.hours_per_week ?? 0,
      workMode: t.work_mode ?? "",
      availability: t.availability ?? "",
      vetted: Boolean(t.is_vetted),
      profileUrl: `${SITE}/talent/pool/${t.id}`,
    }));
    const result = {
      matched: found.length,
      returned: talent.length,
      howToHire: `Open a profile to request an introduction, or send a brief at ${SITE}/hire.`,
      talent,
    };
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], structuredContent: result };
  },
});
