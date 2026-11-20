import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { SERVICES } from "@/data/services";
import listSideHustles from "@/lib/mcp/tools/list_side_hustles";
import listBusinessServices from "@/lib/mcp/tools/list_business_services";
import mcp from "@/lib/mcp/index";

const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");

/** robots.txt groups: each group's user agents and its rules. */
function robotsGroups(txt: string) {
  const groups: { agents: string[]; rules: string[] }[] = [];
  let current: { agents: string[]; rules: string[] } | null = null;
  for (const raw of txt.split("\n")) {
    const line = raw.replace(/#.*/, "").trim();
    if (!line) continue;
    const [key, ...rest] = line.split(":");
    const value = rest.join(":").trim();
    if (/^user-agent$/i.test(key)) {
      if (!current || current.rules.length) groups.push((current = { agents: [], rules: [] }));
      current.agents.push(value.toLowerCase());
    } else if (current && /^(allow|disallow)$/i.test(key)) current.rules.push(`${key.toLowerCase()}:${value}`);
  }
  return groups;
}

describe("robots.txt welcomes AI assistants", () => {
  const groups = robotsGroups(read("public/robots.txt"));
  const rulesFor = (agent: string) => groups.find((g) => g.agents.includes(agent.toLowerCase()))?.rules;

  it.each(["GPTBot", "OAI-SearchBot", "ChatGPT-User", "Google-Extended", "ClaudeBot", "PerplexityBot"])("%s may read the whole site", (bot) => {
    expect(rulesFor(bot)).toEqual(["allow:/"]);
  });

  it("keeps the general allow-everyone rule", () => {
    expect(rulesFor("*")).toEqual(["allow:/"]);
  });

  it("blocks nothing for anyone", () => {
    expect(groups.flatMap((g) => g.rules).filter((r) => r.startsWith("disallow"))).toEqual([]);
  });
});

describe("AI summary files cover the services and side hustles", () => {
  it("there are 107 services", () => {
    expect(SERVICES).toHaveLength(107);
  });

  it("llms.txt links every business service and every side hustle", () => {
    const llms = read("public/llms.txt");
    for (const s of SERVICES) {
      expect(llms).toContain(`https://techfaculty.ng/services/${s.slug})`);
      expect(llms).toContain(`https://techfaculty.ng/side-hustles/${s.slug})`);
    }
  });

  it("llms-full.txt states side hustle pay of ₦5,000 and ₦10,000 per task, paid weekly", () => {
    const full = read("public/llms-full.txt");
    expect(full).toContain("₦5,000 per standard task or ₦10,000 per big task");
    expect(full).toContain("paid weekly, every Friday");
  });
});

describe("AI tools", () => {
  const call = (tool: { handler: unknown }, args: object) =>
    (tool.handler as (a: object, ctx: object) => { structuredContent: Record<string, unknown> })(args, {}).structuredContent;

  it("Testing & QA side hustles all pay ₦5,000 per task", () => {
    const out = call(listSideHustles, { category: "testing-qa", limit: 107 }) as { sideHustles: { payPerTaskNGN: number }[] };
    expect(out.sideHustles.length).toBe(11);
    expect(new Set(out.sideHustles.map((h) => h.payPerTaskNGN))).toEqual(new Set([5000]));
  });

  it("business services start from ₦7,500", () => {
    const out = call(listBusinessServices, { limit: 107 }) as { services: { priceFromNGN: number }[] };
    expect(out.services).toHaveLength(107);
    expect(Math.min(...out.services.map((s) => s.priceFromNGN))).toBe(7500);
  });
});

describe("public AI tools server", () => {
  const server = mcp as unknown as { auth?: unknown; tools: { name: string; annotations?: { readOnlyHint?: boolean } }[] };

  it("needs no sign-in", () => {
    expect(server.auth).toBeUndefined();
  });

  it("only offers read-only tools", () => {
    expect(server.tools.filter((t) => t.annotations?.readOnlyHint !== true).map((t) => t.name)).toEqual([]);
  });

  it("offers no student account tools", () => {
    expect(server.tools.map((t) => t.name).filter((n) => /my_|like_blog/.test(n))).toEqual([]);
  });
});
