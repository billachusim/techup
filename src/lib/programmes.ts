// What the homepage "Departments & fees" section and each department page
// show for a pricing plan: names, fee and what it includes. Prices come from
// the same table create-checkout charges (supabase/functions/_shared/pricing.ts).
import { departments, type Department } from "@/data/departments";
import {
  INSTALMENTS,
  PLAN_PRICING,
  instalmentSplit,
} from "../../supabase/functions/_shared/pricing.ts";

/** The free plan the Free Tech Bootcamp enrols students in. */
export const FREE_PLAN_ID = "bootcamp-starter";
/** The plan where students pick any courses from every department. */
export const CUSTOM_PLAN_ID = "custom-builder";

/** The programme name each plan is sold under (sent to checkout and GA4). */
export const PLAN_TITLES: Record<string, string> = {
  "bootcamp-starter": "Free Tech Bootcamp",
  "developer-pro": "AI for Full-Stack Web Development",
  "data-wizard": "AI for Data Analytics & Business Intelligence",
  "ai-innovator": "AI & Autonomous Agents Engineering",
  "security-shield": "AI for Cybersecurity & Threat Intelligence",
  "mobile-app-developer": "AI for Mobile App Development",
  "cloud-architect": "AI for Cloud & DevOps Engineering",
  "design-master": "AI for UI/UX & Product Design",
  "digital-marketing-pro": "AI for Digital Marketing & Growth",
  "custom-builder": "Custom Programme",
};

/** A plan's fee: the flat fee, or the least a custom selection can come to. */
export const planFee = (planId: string): number =>
  PLAN_PRICING[planId]?.minimumAmount ?? 0;

/** The two instalments for a fee, or null when it must be paid in full. */
export const feeInstalments = (fee: number) =>
  INSTALMENTS.enabled ? instalmentSplit(fee) : null;

/** Departments with a paid plan, in the order the site lists them. */
export const paidDepartments: Department[] = departments.filter(
  (d) => d.planId && d.planId !== FREE_PLAN_ID,
);

/** Departments without a plan yet, quoted on WhatsApp. */
export const quotedDepartments: Department[] = departments.filter(
  (d) => !d.planId,
);

/** The department a plan belongs to, if any. */
export const departmentForPlan = (planId: string): Department | undefined =>
  departments.find((d) => d.planId === planId);

/** What a student has picked for a plan. */
export interface EnrolDraft {
  planId: string;
  learningModeId: string;
  benefitIds: string[];
  courseIds: string[];
}

/** A plan's starting selection: every course of a flat plan, online study and the free extras. */
export function draftFor(planId: string): EnrolDraft {
  const plan = PLAN_PRICING[planId];
  return {
    planId,
    learningModeId: plan?.learningModes[0]?.id ?? "online-only",
    benefitIds:
      plan?.benefits.filter((b) => b.price === 0).map((b) => b.id) ?? [],
    courseIds:
      planId === CUSTOM_PLAN_ID ? [] : (plan?.courses.map((c) => c.id) ?? []),
  };
}
