// Which enrolment gives a student access to a programme. A paid plan only
// counts once its payment is confirmed (status "active" or "confirmed");
// free plans count straight away. Plain data with no imports, so the app
// and the edge functions share one rule.

export const FREE_PLAN_NAMES = ["Bootcamp Starter", "Free Bootcamp"];
const PAID_UP_STATUSES = ["active", "confirmed"];

export interface EnrollmentLike {
  plan_name: string;
  status: string;
}

export function isFreePlan(planName: string): boolean {
  return FREE_PLAN_NAMES.includes(planName);
}

export function grantsAccess(enrollment: EnrollmentLike): boolean {
  if (enrollment.status === "cancelled") return false;
  return isFreePlan(enrollment.plan_name) || PAID_UP_STATUSES.includes(enrollment.status);
}

/** The newest enrolment that grants access. Pass rows newest first. */
export function accessEnrollment<T extends EnrollmentLike>(rows: T[] | null | undefined): T | null {
  return (rows ?? []).find(grantsAccess) ?? null;
}

/** The newest enrolment, when it is a paid plan still waiting on payment. */
export function awaitingPayment<T extends EnrollmentLike>(rows: T[] | null | undefined): T | null {
  const latest = (rows ?? [])[0];
  return latest && latest.status === "pending" && !isFreePlan(latest.plan_name) ? latest : null;
}
