import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SERVICES, SERVICE_CATEGORIES, businessPrice } from "../../../data/services";
import { SITE, matches } from "../_shared/publicClient";

const categorySlugs = SERVICE_CATEGORIES.map((c) => c.slug) as [string, ...string[]];

export default defineTool({
  name: "list_business_services",
  title: "List pay-per-task business services",
  description:
    "List Tech Faculty's fixed-price, pay-per-task services for businesses in Nigeria (video editing, social media, field sales reps, website fixes, app testing, cybersecurity, AI automation, virtual assistance), with starting price in NGN, turnaround and order link.",
  inputSchema: {
    category: z.enum(categorySlugs).optional().describe("Category slug, e.g. testing-qa or field-sales."),
    query: z.string().max(100).optional().describe("Words to match in the service name, summary or keywords, e.g. 'instagram' or 'logo'."),
    limit: z.number().int().min(1).max(107).optional().describe("Max services to return (default 30)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, query, limit }) => {
    const found = SERVICES.filter(
      (s) => (!category || s.category === category) && matches(query, s.name, s.summary, s.keywords, s.unit),
    );
    const services = found.slice(0, limit ?? 30).map((s) => ({
      slug: s.slug,
      name: s.name,
      category: SERVICE_CATEGORIES.find((c) => c.slug === s.category)?.name ?? s.category,
      priceFromNGN: businessPrice(s),
      unit: s.unit,
      turnaround: s.turnaround,
      summary: s.summary,
      forWho: s.forWho,
      deliverables: [...s.deliverables],
      url: `${SITE}/services/${s.slug}`,
    }));
    const categories = SERVICE_CATEGORIES.map((c) => ({
      slug: c.slug,
      name: c.name,
      count: SERVICES.filter((s) => s.category === c.slug).length,
      url: `${SITE}/services/category/${c.slug}`,
    }));
    const result = {
      total: SERVICES.length,
      matched: found.length,
      returned: services.length,
      howToOrder: "Open the service page and send a brief. Standard orders can be paid online immediately; custom or bulk work gets a quote with a pay link.",
      categories,
      services,
    };
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], structuredContent: result };
  },
});
