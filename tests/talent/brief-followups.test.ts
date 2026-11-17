import { describe, expect, it } from "vitest";
import { dueNudge } from "../../src/lib/brief-followups.server";

const DAY = 24 * 60 * 60 * 1000;
const t0 = Date.parse("2026-11-10T09:00:00Z");

describe("dueNudge", () => {
  it("nudges on day 2 and day 5 after the brief, then stops", () => {
    const b = { created_at: new Date(t0).toISOString(), quote_sent_at: null };
    expect(dueNudge({ ...b, followup_count: 0 }, t0 + 1 * DAY)).toBeNull();
    expect(dueNudge({ ...b, followup_count: 0 }, t0 + 2 * DAY)).toBe(0);
    expect(dueNudge({ ...b, followup_count: 1 }, t0 + 4 * DAY)).toBeNull();
    expect(dueNudge({ ...b, followup_count: 1 }, t0 + 5 * DAY)).toBe(1);
    expect(dueNudge({ ...b, followup_count: 2 }, t0 + 30 * DAY)).toBeNull();
  });

  it("counts from the quote once one is sent", () => {
    const b = {
      created_at: new Date(t0).toISOString(),
      quote_sent_at: new Date(t0 + 10 * DAY).toISOString(),
      followup_count: 0,
    };
    expect(dueNudge(b, t0 + 11 * DAY)).toBeNull();
    expect(dueNudge(b, t0 + 12 * DAY)).toBe(0);
  });
});
