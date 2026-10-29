// When a finished course counts as paid in full, for automatic certificates
// (certificate-auto-issue.server.ts). Plain functions so they can be tested.
import { isFreePlan } from "../../supabase/functions/_shared/enrollment-access.ts";

const PAID_UP_STATUSES = ["active", "confirmed"];

export type CertEnrollment = { plan_name: string; status: string; balance_due: number | null };
export type CertCourse = { id: string; name: string; plan_required: string };

/** "Digital Marketing Pro" -> "digital_marketing_pro", the key courses.plan_required uses. */
export const planKey = (planName: string) => planName.trim().toLowerCase().replace(/\s+/g, "_");

/** True when one of the student's paid plans for this course is confirmed with no balance left owing. */
export function paidInFull(enrollments: CertEnrollment[], course: Pick<CertCourse, "plan_required">) {
  return enrollments.some(
    (e) =>
      !isFreePlan(e.plan_name) &&
      planKey(e.plan_name) === course.plan_required &&
      PAID_UP_STATUSES.includes(e.status) &&
      Number(e.balance_due ?? 0) <= 0,
  );
}
