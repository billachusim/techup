import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

// Kept in step with admin_dashboard_metrics so the CSVs and the Overview agree.
const FREE_PLANS = ["Bootcamp Starter", "Free Bootcamp"];
const PAGE = 1000;
const MAX_ROWS = 50_000;

async function assertAdmin(supabase: SupabaseClient<Database>, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (!(data ?? []).some((r) => r.role === "admin"))
    throw new Error("Admins only");
}

/** Supabase caps a select at 1,000 rows, so fetch page by page. */
async function fetchAll<T>(
  page: (
    from: number,
    to: number,
  ) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
) {
  const rows: T[] = [];
  for (let from = 0; from < MAX_ROWS; from += PAGE) {
    const { data, error } = await page(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) break;
  }
  return rows;
}

const day = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .optional();
const RangeInput = z.object({ from: day, to: day });

/** Dates are picked in Nigerian time (WAT); `to` includes the whole day. */
function range(from?: string, to?: string) {
  const end = to ? new Date(`${to}T00:00:00+01:00`) : null;
  end?.setUTCDate(end.getUTCDate() + 1);
  return {
    since: from ? `${from}T00:00:00+01:00` : null,
    until: end ? end.toISOString() : null,
  };
}

/** Admin: every student profile with their latest plan, for the Students CSV. */
export const exportStudents = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => RangeInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } =
      await import("@/integrations/supabase/client.server");
    const { since, until } = range(data.from, data.to);

    const profiles = await fetchAll((a, b) => {
      let q = supabaseAdmin
        .from("profiles")
        .select(
          "faculty_id, name, email, phone, department, learning_mode, cohort_month, cohort_year, slack_joined_at, created_at",
        )
        .not("faculty_id", "is", null);
      if (since) q = q.gte("created_at", since);
      if (until) q = q.lt("created_at", until);
      return q.order("created_at", { ascending: false }).range(a, b);
    });

    const enrollments = await fetchAll((a, b) =>
      supabaseAdmin
        .from("enrollments")
        .select("faculty_id, plan_name, status, created_at")
        .order("created_at", { ascending: false })
        .range(a, b),
    );
    const byStudent = new Map<string, typeof enrollments>();
    for (const e of enrollments) {
      const list = byStudent.get(e.faculty_id) ?? [];
      list.push(e);
      byStudent.set(e.faculty_id, list);
    }

    return profiles.map((p) => {
      const plans = byStudent.get(p.faculty_id ?? "") ?? [];
      const latest = plans.find((e) => e.status !== "cancelled") ?? plans[0];
      return {
        ...p,
        latest_plan: latest?.plan_name ?? null,
        latest_plan_status: latest?.status ?? null,
        enrolments: plans.length,
      };
    });
  });

const PaymentsInput = RangeInput.extend({
  status: z.enum(["all", "paid", "pending", "cancelled"]),
});

/** Admin: paid-plan enrolments and their payment state, for the Payments CSV. */
export const exportPayments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => PaymentsInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } =
      await import("@/integrations/supabase/client.server");
    const { since, until } = range(data.from, data.to);

    const rows = await fetchAll((a, b) => {
      let q = supabaseAdmin
        .from("enrollments")
        .select(
          "id, faculty_id, plan_name, learning_mode, status, amount_due, currency, coupon_code, tx_ref, payment_reference, paid_at, created_at",
        )
        .not(
          "plan_name",
          "in",
          `(${FREE_PLANS.map((p) => `"${p}"`).join(",")})`,
        );
      if (data.status === "paid") q = q.in("status", ["active", "confirmed"]);
      else if (data.status !== "all") q = q.eq("status", data.status);
      if (since) q = q.gte("created_at", since);
      if (until) q = q.lt("created_at", until);
      return q.order("created_at", { ascending: false }).range(a, b);
    });

    const ids = [...new Set(rows.map((r) => r.faculty_id))];
    const profiles: {
      faculty_id: string | null;
      name: string;
      email: string;
      phone: string | null;
    }[] = [];
    for (let i = 0; i < ids.length; i += 200) {
      const { data: chunk, error } = await supabaseAdmin
        .from("profiles")
        .select("faculty_id, name, email, phone")
        .in("faculty_id", ids.slice(i, i + 200));
      if (error) throw new Error(error.message);
      profiles.push(...(chunk ?? []));
    }
    const byId = new Map(profiles.map((p) => [p.faculty_id, p]));

    return rows.map((r) => ({
      ...r,
      student_name: byId.get(r.faculty_id)?.name ?? null,
      student_email: byId.get(r.faculty_id)?.email ?? null,
      student_phone: byId.get(r.faculty_id)?.phone ?? null,
      method: r.payment_reference?.startsWith("manual:")
        ? "Marked paid by admin"
        : r.tx_ref
          ? "Card (Flutterwave)"
          : "WhatsApp / email request",
    }));
  });
