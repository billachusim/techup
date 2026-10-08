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
      .select("id, faculty_id, plan_name, learning_mode, coupon_code, tx_ref, amount_due, currency, created_at")
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

const DecideInput = z.object({ id: z.string().uuid(), decision: z.enum(["paid", "cancel"]) });

/** Admin: mark a WhatsApp/email/bank payment as received, or cancel the request. */
export const decidePendingEnrollment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => DecideInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const update = data.decision === "paid"
      ? { status: "active", paid_at: new Date().toISOString(), payment_reference: `manual:${context.userId}` }
      : { status: "cancelled" };
    const { data: row, error } = await supabaseAdmin
      .from("enrollments")
      .update(update)
      .eq("id", data.id)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("This enrolment is no longer pending");
    return { ok: true as const };
  });
