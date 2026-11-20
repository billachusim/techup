import { describe, expect, it } from "vitest";
import { profilesToAutoApprove } from "@/lib/talent-approval-rules";

describe("talent approval on profile save", () => {
  it("approves a brand-new profile whatever its strength", () => {
    const picked = profilesToAutoApprove([{ id: "a", approved_at: null }], new Set());
    expect(picked.map((p) => p.id)).toEqual(["a"]);
  });
  it("skips a profile that is already approved", () => {
    const picked = profilesToAutoApprove([{ id: "a", approved_at: "2026-11-20T07:00:00Z" }], new Set());
    expect(picked).toEqual([]);
  });
  it("does not re-approve a profile staff un-approved after automation approved it", () => {
    const picked = profilesToAutoApprove([{ id: "a", approved_at: null }], new Set(["a"]));
    expect(picked).toEqual([]);
  });
});
