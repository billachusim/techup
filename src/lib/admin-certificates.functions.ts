import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { recordAdminAction } from "@/lib/admin-audit";

export type AdminCertificate = {
  id: string;
  certificate_number: string;
  student_name: string | null;
  course_name: string;
  certificate_type: string;
  issued_by: string;
  date_issued: string | null;
  faculty_id: string;
  issued_at: string | null;
  revoked_at: string | null;
  revoked_reason: string | null;
};

const COLUMNS =
  "id, certificate_number, student_name, course_name, certificate_type, issued_by, date_issued, faculty_id, issued_at, revoked_at, revoked_reason";

async function requireAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data: roles } = await context.supabase
    .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin");
  if (!roles?.length) throw new Error("Admins only");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

const SearchInput = z.object({ query: z.string().trim().max(100).default("") });

/** Admin: the latest certificates, or those matching a number, name, course or faculty ID. */
export const searchCertificates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => SearchInput.parse(d))
  .handler(async ({ data, context }): Promise<AdminCertificate[]> => {
    const admin = await requireAdmin(context);
    let q = admin.from("certificates").select(COLUMNS).order("issued_at", { ascending: false }).limit(50);
    // Drop characters that have meaning in a PostgREST filter.
    const term = data.query.replace(/[,()*%\\:"']/g, " ").trim();
    if (term) {
      const like = `%${term}%`;
      q = q.or(
        `certificate_number.ilike.${like},student_name.ilike.${like},course_name.ilike.${like},faculty_id.ilike.${like}`,
      );
    }
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return (rows ?? []) as AdminCertificate[];
  });

const UpdateInput = z.object({
  id: z.string().uuid(),
  studentName: z.string().trim().min(1).max(200),
  courseName: z.string().trim().min(1).max(200),
  certificateType: z.string().trim().max(200),
  issuedBy: z.string().trim().max(200),
  dateIssued: z.string().trim().min(1).max(100),
});

/** Admin: correct a certificate's details. The number stays fixed; no email is sent. */
export const updateCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => UpdateInput.parse(d))
  .handler(async ({ data, context }): Promise<AdminCertificate> => {
    const admin = await requireAdmin(context);
    const { data: row, error } = await admin
      .from("certificates")
      .update({
        student_name: data.studentName,
        course_name: data.courseName,
        certificate_type: data.certificateType || "Certificate of Achievement",
        issued_by: data.issuedBy || "Tech Faculty NG",
        date_issued: data.dateIssued,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id)
      .select(COLUMNS)
      .single();
    if (error) throw new Error(error.message);
    await recordAdminAction(admin, context.userId, {
      action: "certificate.edited",
      target_table: "certificates",
      target_id: row.id,
      faculty_id: row.faculty_id,
      subject: row.student_name,
      details: { certificate_number: row.certificate_number, course: row.course_name },
    });
    return row as AdminCertificate;
  });

const RevokeInput = z.object({
  id: z.string().uuid(),
  revoke: z.boolean(),
  reason: z.string().trim().max(500).optional(),
});

/** Admin: revoke a certificate (it stops verifying on /verify), or reinstate it. */
export const setCertificateRevoked = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => RevokeInput.parse(d))
  .handler(async ({ data, context }): Promise<AdminCertificate> => {
    const admin = await requireAdmin(context);
    if (data.revoke && !data.reason) throw new Error("Give a reason for revoking");
    const now = new Date().toISOString();
    const { data: row, error } = await admin
      .from("certificates")
      .update(
        data.revoke
          ? { revoked_at: now, revoked_reason: data.reason, revoked_by: context.userId, updated_at: now }
          : { revoked_at: null, revoked_reason: null, revoked_by: null, updated_at: now },
      )
      .eq("id", data.id)
      .select(COLUMNS)
      .single();
    if (error) throw new Error(error.message);
    await recordAdminAction(admin, context.userId, {
      action: data.revoke ? "certificate.revoked" : "certificate.reinstated",
      target_table: "certificates",
      target_id: row.id,
      faculty_id: row.faculty_id,
      subject: row.student_name,
      details: { certificate_number: row.certificate_number, course: row.course_name, reason: data.reason ?? null },
    });
    return row as AdminCertificate;
  });
