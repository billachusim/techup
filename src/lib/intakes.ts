import { getSupabase } from "@/integrations/supabase/lazy";
import type { Tables } from "@/integrations/supabase/types";

// Intake (cohort start) dates, set by admins on /admin/intakes and shown on
// the department pages. An intake with no department is open to every one.

export type Intake = Tables<"intakes">;

export const INTAKE_MODES = [
  { value: "any", label: "Any study mode" },
  { value: "online-only", label: "Online" },
  { value: "hybrid", label: "Hybrid" },
  { value: "physical", label: "On campus" },
] as const;

export const intakeModeLabel = (mode: string) =>
  INTAKE_MODES.find((m) => m.value === mode)?.label ?? mode;

/** Today in Lagos, as YYYY-MM-DD, so an intake starting today still shows. */
export const lagosToday = (now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(now);

/** "Mon, 3 Nov 2026" for a YYYY-MM-DD date. */
export const formatIntakeDate = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

/** Whether an intake can still be joined on `today`. */
export const isOpen = (
  intake: Pick<Intake, "starts_on" | "enrol_by">,
  today = lagosToday(),
) => (intake.enrol_by ?? intake.starts_on) >= today;

/** Published intakes for a department (and the ones for every department) still open, soonest first. */
export async function fetchUpcomingIntakes(
  departmentSlug: string,
  limit = 3,
): Promise<Intake[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("intakes")
    .select("*")
    .eq("published", true)
    .gte("starts_on", lagosToday())
    .or(`department_slug.is.null,department_slug.eq.${departmentSlug}`)
    .order("starts_on", { ascending: true })
    .limit(limit + 5);
  if (error) throw error;
  return (data ?? []).filter((i) => isOpen(i)).slice(0, limit);
}
