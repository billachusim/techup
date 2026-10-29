import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const sql = readFileSync(
  new URL("../../drizzle/migrations/0021_allow_lead_email_consent_submission.sql", import.meta.url),
  "utf8",
).replace(/--[^\n]*/g, "").trim();

describe("lead submission permission repair", () => {
  it("allows visitors and signed-in users to insert explicit email consent only", () => {
    expect(sql).toMatch(/^GRANT INSERT\s*\(email_marketing_opt_in\)\s+ON public\.leads TO anon, authenticated;$/);
  });
});