import { describe, expect, it } from "vitest";
import { groupPendingRequests } from "@/lib/pending-requests";

const row = (
  id: string,
  faculty_id: string,
  plan_name: string,
  created_at: string,
  pay_link_url: string | null = null,
) => ({
  id,
  faculty_id,
  plan_name,
  created_at,
  pay_link_url,
});

describe("groupPendingRequests", () => {
  it("shows one request per student and plan, newest first", () => {
    const out = groupPendingRequests([
      row("a", "TF1", "Developer Pro", "2026-11-05T10:00:00Z"),
      row("b", "TF1", "Developer Pro", "2026-11-06T10:00:00Z"),
      row("c", "TF1", "Developer Pro", "2026-11-04T10:00:00Z"),
      row("d", "TF2", "Developer Pro", "2026-11-03T10:00:00Z"),
    ]);
    expect(out.map((r) => r.id)).toEqual(["b", "d"]);
    expect(out[0].duplicate_ids.sort()).toEqual(["a", "c"]);
    expect(out[1].duplicate_ids).toEqual([]);
  });

  it("keeps the request that has a pay link in front", () => {
    const out = groupPendingRequests([
      row(
        "old",
        "TF1",
        "Data Wizard",
        "2026-11-01T10:00:00Z",
        "https://pay.example/x",
      ),
      row("new", "TF1", "Data Wizard", "2026-11-06T10:00:00Z"),
    ]);
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe("old");
    expect(out[0].duplicate_ids).toEqual(["new"]);
  });

  it("keeps different plans of the same student apart", () => {
    const out = groupPendingRequests([
      row("a", "TF1", "Developer Pro", "2026-11-05T10:00:00Z"),
      row("b", "TF1", "Data Wizard", "2026-11-05T11:00:00Z"),
    ]);
    expect(out).toHaveLength(2);
  });
});
