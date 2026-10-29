import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { recordAdminAction } from "@/lib/admin-audit";

async function assertAdmin(supabase: SupabaseClient<Database>, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (!(data ?? []).some((r) => r.role === "admin")) throw new Error("Admins only");
}

/** Admin: paid enrolments still waiting on a payment, newest first. */
export const listPendingEnrollments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("enrollments")
      .select("id, faculty_id, plan_name, learning_mode, coupon_code, tx_ref, amount_due, currency, created_at, payment_reminder_sent_at, pay_link_url, pay_link_created_at, pay_link_sent_at, pay_link_reminder_sent_at, pay_link_skipped_reason")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    const ids = [...new Set((rows ?? []).map((r) => r.faculty_id))];
    const { data: profiles } = ids.length
      ? await supabaseAdmin.from("profiles").select("faculty_id, name, email, phone").in("faculty_id", ids)
      : { data: [] };
    const byId = new Map((profiles ?? []).map((p) => [p.faculty_id, p]));
    return (rows ?? []).map((r) => ({
      ...r,
      student_name: byId.get(r.faculty_id)?.name || "Student",
      student_email: byId.get(r.faculty_id)?.email || null,
      student_phone: byId.get(r.faculty_id)?.phone || null,
    }));
  });

const PAYMENT_METHODS = ["bank", "whatsapp", "cash", "card", "other"] as const;

const DecideInput = z.discriminatedUnion("decision", [
  z.object({
    id: z.string().uuid(),
    decision: z.literal("paid"),
    amount: z.number().positive().max(100_000_000),
    currency: z.enum(["NGN", "USD"]),
    method: z.enum(PAYMENT_METHODS),
  }),
  z.object({ id: z.string().uuid(), decision: z.literal("cancel") }),
]);

/** Admin: mark a WhatsApp/bank/cash payment as received (with what came in), or cancel the request. */
export const decidePendingEnrollment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => DecideInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const update = data.decision === "paid"
      ? {
          status: "active",
          paid_at: new Date().toISOString(),
          payment_reference: `manual:${context.userId}`,
          amount_paid: data.amount,
          currency: data.currency,
          payment_method: data.method,
        }
      : { status: "cancelled" };
    const { data: row, error } = await supabaseAdmin
      .from("enrollments")
      .update(update)
      .eq("id", data.id)
      .eq("status", "pending")
      .select("id, faculty_id, plan_name, amount_due, currency")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("This enrolment is no longer pending");

    const { data: profile } = await supabaseAdmin
      .from("profiles").select("name").eq("faculty_id", row.faculty_id).limit(1).maybeSingle();
    await recordAdminAction(supabaseAdmin, context.userId, {
      action: data.decision === "paid" ? "payment.marked_paid" : "enrollment.cancelled",
      target_table: "enrollments",
      target_id: row.id,
      faculty_id: row.faculty_id,
      subject: profile?.name ?? null,
      details:
        data.decision === "paid"
          ? { from: "pending", to: update.status, plan: row.plan_name, amount: data.amount, currency: data.currency, method: data.method }
          : { from: "pending", to: update.status, plan: row.plan_name, amount: row.amount_due, currency: row.currency },
    });
    return { ok: true as const };
  });

/** Admin: instalment plans with a balance still to pay, soonest due first. */
export const listOutstandingBalances = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("enrollments")
      .select("id, faculty_id, plan_name, amount_due, instalment_total, balance_due, balance_due_by, currency, paid_at")
      .in("status", ["active", "confirmed"])
      .gt("balance_due", 0)
      .order("balance_due_by", { ascending: true })
      .limit(200);
    if (error) throw new Error(error.message);
    const ids = [...new Set((rows ?? []).map((r) => r.faculty_id))];
    const { data: profiles } = ids.length
      ? await supabaseAdmin.from("profiles").select("faculty_id, name, email, phone").in("faculty_id", ids)
      : { data: [] };
    const byId = new Map((profiles ?? []).map((p) => [p.faculty_id, p]));
    // Which automatic reminders went out (empty until the balance-reminders migration runs).
    const { data: reminders } = rows?.length
      ? await supabaseAdmin
          .from("balance_reminders")
          .select("enrollment_id, due_soon_sent_at, due_tomorrow_sent_at, overdue_sent_at")
          .in("enrollment_id", rows.map((r) => r.id))
      : { data: [] };
    const remindedById = new Map((reminders ?? []).map((r) => [r.enrollment_id, r]));
    return (rows ?? []).map((r) => {
      const sent = remindedById.get(r.id);
      return {
        ...r,
        student_name: byId.get(r.faculty_id)?.name || "Student",
        student_email: byId.get(r.faculty_id)?.email || null,
        student_phone: byId.get(r.faculty_id)?.phone || null,
        last_reminder: sent?.overdue_sent_at
          ? "overdue"
          : sent?.due_tomorrow_sent_at
            ? "day before"
            : sent?.due_soon_sent_at
              ? "7 days before"
              : null,
      };
    });
  });

/** Admin: the balance of an instalment plan came in by bank transfer, cash or WhatsApp. */
export const markBalancePaid = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid(), method: z.enum(PAYMENT_METHODS) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: plan, error: readErr } = await supabaseAdmin
      .from("enrollments")
      .select("id, faculty_id, plan_name, instalment_total, balance_due, currency")
      .eq("id", data.id)
      .gt("balance_due", 0)
      .maybeSingle();
    if (readErr) throw new Error(readErr.message);
    if (!plan) throw new Error("This plan has no balance left to pay");
    const { error } = await supabaseAdmin
      .from("enrollments")
      .update({ balance_due: 0, balance_paid_at: new Date().toISOString(), amount_paid: plan.instalment_total })
      .eq("id", plan.id);
    if (error) throw new Error(error.message);

    const { data: profile } = await supabaseAdmin
      .from("profiles").select("name").eq("faculty_id", plan.faculty_id).limit(1).maybeSingle();
    await recordAdminAction(supabaseAdmin, context.userId, {
      action: "payment.balance_marked_paid",
      target_table: "enrollments",
      target_id: plan.id,
      faculty_id: plan.faculty_id,
      subject: profile?.name ?? null,
      details: { plan: plan.plan_name, amount: plan.balance_due, currency: plan.currency, method: data.method },
    });
    return { ok: true as const };
  });
