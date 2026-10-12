import { describe, expect, it } from "vitest";
import {
  ALL_COURSES,
  LEARNING_MODES,
  PLAN_NAMES,
  PLAN_PRICING,
  priceSelection,
} from "../../supabase/functions/_shared/pricing.ts";
import { LOWEST_PAID_PLAN, planMinimum } from "../../src/lib/fees.ts";

const paidPlans = Object.entries(PLAN_PRICING).filter(([id]) => id !== "bootcamp-starter");
const ids = (items: { id: string }[]) => items.map((i) => i.id);

describe("plan catalogue", () => {
  it("prices every paid plan between ₦50,000 and ₦150,000", () => {
    expect(paidPlans.length).toBeGreaterThan(0);
    for (const [id, plan] of paidPlans) {
      expect(plan.minimumAmount, id).toBeGreaterThanOrEqual(50000);
      expect(plan.minimumAmount, id).toBeLessThanOrEqual(150000);
    }
    expect(LOWEST_PAID_PLAN).toBe(50000);
    expect(Math.max(...paidPlans.map(([, p]) => p.minimumAmount))).toBe(150000);
  });

  it("keeps Bootcamp Starter free", () => {
    const starter = PLAN_PRICING["bootcamp-starter"];
    expect(starter.minimumAmount).toBe(0);
    for (const item of [...starter.courses, ...starter.benefits, ...starter.learningModes]) {
      expect(item.price, item.id).toBe(0);
    }
  });

  it("has an enrolment name for every priced plan and no others", () => {
    expect(Object.keys(PLAN_NAMES).sort()).toEqual(Object.keys(PLAN_PRICING).sort());
  });

  it("uses whole, non-negative naira prices", () => {
    const items = [
      ...ALL_COURSES,
      ...LEARNING_MODES,
      ...Object.values(PLAN_PRICING).flatMap((p) => [...p.courses, ...p.benefits, ...p.learningModes]),
    ];
    for (const item of items) {
      expect(Number.isInteger(item.price), item.id).toBe(true);
      expect(item.price, item.id).toBeGreaterThanOrEqual(0);
    }
  });

  it("charges the same for a course in a plan as in the custom builder", () => {
    const custom = new Map(ALL_COURSES.map((c) => [c.id, c.price]));
    for (const [planId, plan] of Object.entries(PLAN_PRICING)) {
      for (const course of plan.courses) {
        if (custom.has(course.id)) expect(course.price, `${planId}/${course.id}`).toBe(custom.get(course.id));
      }
    }
  });

  it("lets a student reach every paid plan's minimum", () => {
    for (const [id, plan] of paidPlans) {
      const courses = id === "custom-builder" ? ALL_COURSES : plan.courses;
      const result = priceSelection(id, ids(courses), ids(plan.benefits), "physical");
      expect(result.ok, id).toBe(true);
    }
  });

  it("matches the minimums the site quotes", () => {
    for (const [id, plan] of Object.entries(PLAN_PRICING)) expect(planMinimum(id)).toBe(plan.minimumAmount);
    expect(planMinimum("no-such-plan")).toBeUndefined();
  });
});

describe("priceSelection", () => {
  const devPro = PLAN_PRICING["developer-pro"];

  it("adds up courses, benefits and the learning mode from the catalogue", () => {
    const result = priceSelection("developer-pro", ids(devPro.courses), ["job-placement", "internship"], "hybrid");
    const courses = devPro.courses.reduce((s, c) => s + c.price, 0);
    expect(result).toMatchObject({ ok: true, total: courses + 15000 + 12000 + 12000 });
  });

  it("charges nothing extra for online-only or no learning mode", () => {
    const withOnline = priceSelection("developer-pro", ids(devPro.courses), [], "online-only");
    const withNone = priceSelection("developer-pro", ids(devPro.courses), [], null);
    expect(withOnline.ok && withNone.ok && withOnline.total === withNone.total).toBe(true);
    expect(withNone.ok && withNone.learningMode).toBe(null);
  });

  it("counts a repeated id once", () => {
    const once = priceSelection("developer-pro", ids(devPro.courses), ["job-placement"], null);
    const twice = priceSelection(
      "developer-pro",
      [...ids(devPro.courses), ...ids(devPro.courses)],
      ["job-placement", "job-placement"],
      null,
    );
    expect(once.ok && twice.ok && twice.total === once.total).toBe(true);
  });

  it("rejects an unknown plan", () => {
    expect(priceSelection("free-everything", [], [], null)).toEqual({ ok: false, error: "Unknown plan" });
  });

  it("rejects unknown courses, benefits and learning modes instead of skipping them", () => {
    expect(priceSelection("developer-pro", [...ids(devPro.courses), "made-up"], [], null)).toEqual({
      ok: false,
      error: "Unknown course: made-up",
    });
    expect(priceSelection("developer-pro", ids(devPro.courses), ["made-up"], null)).toEqual({
      ok: false,
      error: "Unknown benefit: made-up",
    });
    expect(priceSelection("developer-pro", ids(devPro.courses), [], "made-up")).toEqual({
      ok: false,
      error: "Unknown learning mode: made-up",
    });
  });

  it("only allows a plan's own courses, except in the custom builder", () => {
    expect(priceSelection("developer-pro", ["deep-learning"], [], null)).toEqual({
      ok: false,
      error: "Unknown course: deep-learning",
    });
    const custom = priceSelection("custom-builder", ["deep-learning", "react", "aws"], [], null);
    expect(custom).toMatchObject({ ok: true, total: 27000 + 18000 + 18000 });
  });

  it("only allows benefits the plan offers", () => {
    // VIP classes belong to AI Innovator only.
    expect(priceSelection("developer-pro", ids(devPro.courses), ["vip-classes"], null)).toEqual({
      ok: false,
      error: "Unknown benefit: vip-classes",
    });
  });

  it("refuses a selection below the plan minimum", () => {
    expect(priceSelection("developer-pro", ["html-css"], [], null)).toEqual({
      ok: false,
      error: "Selection is below the plan minimum",
    });
    expect(priceSelection("ai-innovator", ids(PLAN_PRICING["ai-innovator"].courses).slice(0, 2), [], null)).toEqual({
      ok: false,
      error: "Selection is below the plan minimum",
    });
  });

  it("accepts a selection exactly at the minimum", () => {
    // 12,000 + 15,000 + 15,000 + 18,000 = ₦60,000, Digital Marketing Pro's minimum.
    const exact = priceSelection(
      "digital-marketing-pro",
      ["content-marketing", "seo-sem"],
      ["job-placement", "mentor-network"],
      "online-only",
    );
    expect(exact).toMatchObject({ ok: true, total: 60000 });
  });
});
