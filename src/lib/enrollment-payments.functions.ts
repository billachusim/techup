import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

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
      .select("id, faculty_id, plan_name, learning_mode, coupon_code, tx_ref, amount_due, currency, created_at, payment_reminder_sent_at")
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

    // The service key has no auth.uid(), so the audit triggers can't see who did this; record it here.
    const [{ data: profile }, { data: actor }] = await Promise.all([
      supabaseAdmin.from("profiles").select("name").eq("faculty_id", row.faculty_id).limit(1).maybeSingle(),
      supabaseAdmin.auth.admin.getUserById(context.userId),
    ]);
    const { error: auditError } = await supabaseAdmin.from("admin_audit_log").insert({
      actor_id: context.userId,
      actor_email: actor?.user?.email ?? null,
      action: data.decision === "paid" ? "payment.marked_paid" : "enrollment.cancelled",
      target_table: "enrollments",
      target_id: row.id,
      faculty_id: row.faculty_id,
      subject: profile?.name ?? null,
      details: {
        from: "pending",
        to: update.status,
        plan: row.plan_name,
        amount: row.amount_due,
        currency: row.currency,
      },
    });
    if (auditError) console.error("Couldn't write admin audit log", auditError.message);
    return { ok: true as const };
  });
