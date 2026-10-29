import { describe, expect, it } from "vitest";
import { paidInFull, planKey } from "@/lib/certificate-rules";

const course = { plan_required: "developer_pro" };
const plan = (over: Partial<{ plan_name: string; status: string; balance_due: number | null }> = {}) => ({
  plan_name: "Developer Pro",
  status: "active",
  balance_due: null,
  ...over,
});

describe("automatic certificate rules", () => {
  it("maps plan names to course plan keys", () => {
    expect(planKey("Digital Marketing Pro")).toBe("digital_marketing_pro");
    expect(planKey("AI Innovator")).toBe("ai_innovator");
  });

  it("counts a confirmed plan with nothing owing as paid in full", () => {
    expect(paidInFull([plan()], course)).toBe(true);
    expect(paidInFull([plan({ status: "confirmed", balance_due: 0 })], course)).toBe(true);
  });

  it("waits while an instalment balance is still owed", () => {
    expect(paidInFull([plan({ balance_due: 25000 })], course)).toBe(false);
  });

  it("waits for unconfirmed or cancelled payments", () => {
    expect(paidInFull([plan({ status: "pending" })], course)).toBe(false);
    expect(paidInFull([plan({ status: "cancelled" })], course)).toBe(false);
  });

  it("needs the plan the course belongs to", () => {
    expect(paidInFull([plan({ plan_name: "Data Wizard" })], course)).toBe(false);
  });

  it("never counts a free plan", () => {
    expect(paidInFull([plan({ plan_name: "Bootcamp Starter" })], { plan_required: "bootcamp_starter" })).toBe(false);
  });
});
