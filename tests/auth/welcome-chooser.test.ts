import { describe, expect, it } from "vitest";
import { shouldOfferWelcome } from "@/lib/welcome-chooser";

const now = new Date("2026-11-20T08:00:00Z");
const base = {
  accountCreatedAt: "2026-11-20T07:55:00Z",
  now,
  path: "/",
  hasFacultyId: false,
  hasTalentProfile: false,
  dismissed: false,
};

describe("welcome after creating an account", () => {
  it("shows to a brand-new account with nothing set up", () => {
    expect(shouldOfferWelcome(base)).toBe(true);
  });
  it("does not show to someone who already has a talent profile", () => {
    expect(shouldOfferWelcome({ ...base, hasTalentProfile: true })).toBe(false);
  });
  it("does not show to a student who already has a Faculty ID", () => {
    expect(shouldOfferWelcome({ ...base, hasFacultyId: true })).toBe(false);
  });
  it("does not show again once closed or answered", () => {
    expect(shouldOfferWelcome({ ...base, dismissed: true })).toBe(false);
  });
  it("does not show to accounts older than 3 days", () => {
    expect(shouldOfferWelcome({ ...base, accountCreatedAt: "2026-11-16T07:00:00Z" })).toBe(false);
  });
  it("stays quiet on talent and payment pages", () => {
    expect(shouldOfferWelcome({ ...base, path: "/talent/profile" })).toBe(false);
    expect(shouldOfferWelcome({ ...base, path: "/payment-success" })).toBe(false);
  });
  it("still shows on the student dashboard", () => {
    expect(shouldOfferWelcome({ ...base, path: "/dashboard" })).toBe(true);
  });
});
