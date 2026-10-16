import { describe, expect, it } from "vitest";
import { autoMatchBlocker, pickAutoMatches, type MatchRole } from "../../src/lib/matching";
import { isHrStatus, sameKey, toMatchStatus, fillTemplate } from "../../src/lib/hr-api-rules";

const role: MatchRole = {
  id: "r1", status: "published", applications_closed: false, openings: 2,
  auto_match_enabled: true, auto_match_threshold: 75,
  required_skills: [], nice_to_have: [], city: null, is_remote: true,
};

describe("auto-matching rules", () => {
  it("only matches scores at or above the threshold", () => {
    const picks = pickAutoMatches([{ id: "a", score: 75, reason: "" }, { id: "b", score: 74, reason: "" }], 75, new Set());
    expect(picks.map((p) => p.id)).toEqual(["a"]);
  });
  it("never matches the same talent twice", () => {
    const picks = pickAutoMatches([{ id: "a", score: 90, reason: "" }, { id: "a", score: 95, reason: "" }, { id: "c", score: 90, reason: "" }], 75, new Set(["c"]));
    expect(picks.map((p) => p.id)).toEqual(["a"]);
  });
  it("skips closed roles, full roles and paused switches", () => {
    expect(autoMatchBlocker({ ...role, status: "closed" }, 0, false)).not.toBeNull();
    expect(autoMatchBlocker({ ...role, applications_closed: true }, 0, false)).not.toBeNull();
    expect(autoMatchBlocker(role, 2, false)).not.toBeNull();
    expect(autoMatchBlocker({ ...role, auto_match_enabled: false }, 0, false)).not.toBeNull();
    expect(autoMatchBlocker(role, 0, true)).not.toBeNull();
    expect(autoMatchBlocker(role, 1, false)).toBeNull();
  });
});

describe("HR API rules", () => {
  it("rejects a wrong or empty key", () => {
    expect(sameKey("wrong", "right")).toBe(false);
    expect(sameKey("", "")).toBe(false);
    expect(sameKey("right", "right")).toBe(true);
  });
  it("only allows the listed statuses", () => {
    expect(isHrStatus("offer_sent")).toBe(true);
    expect(isHrStatus("deleted")).toBe(false);
    expect(toMatchStatus("matched")).toBe("approved");
    expect(toMatchStatus("selected")).toBe("accepted");
  });
  it("fills template placeholders", () => {
    expect(fillTemplate("Hi {{name}}, {{role}}", { name: "Ada", role: "Dev" })).toBe("Hi Ada, Dev");
  });
});
