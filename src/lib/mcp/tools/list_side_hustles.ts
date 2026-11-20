import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { OPENINGS_PER_SERVICE, SERVICES, SERVICE_CATEGORIES, talentPay } from "../../../data/services";
import { SITE, matches } from "../_shared/publicClient";

const categorySlugs = SERVICE_CATEGORIES.map((c) => c.slug) as [string, ...string[]];

export default defineTool({
  name: "list_side_hustles",
  title: "List paid side hustles",
  description:
    "List Tech Faculty's pay-per-task side hustles for people in Nigeria (₦5,000 or ₦10,000 per approved task, paid weekly every Friday), with what each task needs and how to apply.",
  inputSchema: {
    category: z.enum(categorySlugs).optional().describe("Category slug, e.g. content-creative or field-sales."),
    query: z.string().max(100).optional().describe("Words to match in the side hustle title, requirements or keywords, e.g. 'video' or 'tester'."),
    pay: z.union([z.literal(5000), z.literal(10000)]).optional().describe("Only side hustles paying this many naira per task."),
    limit: z.number().int().min(1).max(107).optional().describe("Max side hustles to return (default 30)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, query, pay, limit }) => {
    const found = SERVICES.filter(
      (s) =>
        (!category || s.category === category) &&
        (!pay || talentPay(s) === pay) &&
        matches(query, s.hustleTitle, s.name, s.hustleNeeds, s.keywords),
    );
    const sideHustles = found.slice(0, limit ?? 30).map((s) => ({
      slug: s.slug,
      title: s.hustleTitle,
      category: SERVICE_CATEGORIES.find((c) => c.slug === s.category)?.name ?? s.category,
      payPerTaskNGN: talentPay(s),
      task: `${s.name} (${s.unit})`,
      needs: [...s.hustleNeeds],
      openings: OPENINGS_PER_SERVICE,
      url: `${SITE}/side-hustles/${s.slug}`,
    }));
    const result = {
      total: SERVICES.length,
      matched: found.length,
      returned: sideHustles.length,
      payment: "Paid weekly, every Friday, for every task a Tech Faculty manager approves.",
      howToApply: `Join the free talent pool at ${SITE}/talent and mention the side hustle, then pass a short skills check or sample task.`,
      sideHustles,
    };
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], structuredContent: result };
  },
});
