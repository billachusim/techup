import { describe, expect, it } from "vitest";
import {
  accessEnrollment,
  awaitingPayment,
  grantsAccess,
  isFreePlan,
} from "../../supabase/functions/_shared/enrollment-access.ts";

describe("grantsAccess", () => {
  const cases: [string, string, boolean][] = [
    // Paid plans only count once payment is confirmed.
    ["Developer Pro", "pending", false],
    ["Developer Pro", "active", true],
    ["Developer Pro", "confirmed", true],
    ["Developer Pro", "cancelled", false],
    ["Developer Pro", "failed", false],
    ["Developer Pro", "", false],
    ["Custom Program", "pending", false],
    // Free plans count straight away, unless cancelled.
    ["Bootcamp Starter", "pending", true],
    ["Bootcamp Starter", "active", true],
    ["Free Bootcamp", "pending", true],
    ["Bootcamp Starter", "cancelled", false],
    ["Free Bootcamp", "cancelled", false],
  ];
  it.each(cases)("%s with status %j -> %s", (plan_name, status, expected) => {
    expect(grantsAccess({ plan_name, status })).toBe(expected);
  });

  it("treats only the free plans as free", () => {
    expect(isFreePlan("Bootcamp Starter")).toBe(true);
    expect(isFreePlan("Free Bootcamp")).toBe(true);
    expect(isFreePlan("Developer Pro")).toBe(false);
    expect(isFreePlan("bootcamp starter")).toBe(false);
  });
});

describe("accessEnrollment", () => {
  it("returns the newest enrolment that grants access", () => {
    const rows = [
      { id: "new", plan_name: "AI Innovator", status: "pending" },
      { id: "mid", plan_name: "Developer Pro", status: "active" },
      { id: "old", plan_name: "Bootcamp Starter", status: "pending" },
    ];
    expect(accessEnrollment(rows)?.id).toBe("mid");
  });

  it("returns nothing when only unpaid or cancelled enrolments exist", () => {
    expect(
      accessEnrollment([
        { plan_name: "Data Wizard", status: "pending" },
        { plan_name: "Bootcamp Starter", status: "cancelled" },
      ]),
    ).toBeNull();
    expect(accessEnrollment([])).toBeNull();
    expect(accessEnrollment(null)).toBeNull();
    expect(accessEnrollment(undefined)).toBeNull();
  });
});

describe("awaitingPayment", () => {
  it("returns the newest enrolment when it is an unpaid paid plan", () => {
    const rows = [
      { id: "new", plan_name: "Data Wizard", status: "pending" },
      { id: "old", plan_name: "Developer Pro", status: "active" },
    ];
    expect(awaitingPayment(rows)?.id).toBe("new");
  });

  it("ignores older pending enrolments, free plans and paid ones", () => {
    expect(
      awaitingPayment([
        { plan_name: "Developer Pro", status: "active" },
        { plan_name: "Data Wizard", status: "pending" },
      ]),
    ).toBeNull();
    expect(awaitingPayment([{ plan_name: "Bootcamp Starter", status: "pending" }])).toBeNull();
    expect(awaitingPayment([{ plan_name: "Data Wizard", status: "cancelled" }])).toBeNull();
    expect(awaitingPayment([])).toBeNull();
    expect(awaitingPayment(null)).toBeNull();
  });
});
