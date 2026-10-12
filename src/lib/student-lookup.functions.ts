import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

async function assertAdmin(supabase: SupabaseClient<Database>, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (!(data ?? []).some((r) => r.role === "admin"))
    throw new Error("Admins only");
}

export interface StudentMatch {
  facultyId: string | null;
  userId: string | null;
  name: string;
  email: string | null;
  phone: string | null;
}

/** Quotes, backslashes and wildcards would break the quoted or() values below. */
const clean = (s: string) =>
  s
    .replace(/[,()%*\\"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Admin: find students by name, email, phone or Faculty ID. Looks in both
 * profiles (signed-up accounts) and faculty_ids (registrations), merged by
 * Faculty ID so each student appears once.
 */
export const searchStudents = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ q: z.string().trim().min(2).max(100) }).parse(d),
  )
  .handler(async ({ data, context }): Promise<StudentMatch[]> => {
    await assertAdmin(context.supabase, context.userId);
    const q = clean(data.q);
    if (q.length < 2) return [];
    const like = `%${q}%`;
    // Phones are stored in mixed formats (+234…, 080…), so match the last 10 digits.
    const digits = q.replace(/\D/g, "");
    const phoneLike = digits.length >= 6 ? `%${digits.slice(-10)}%` : null;
    const orFor = (cols: string[]) =>
      [
        ...cols.map((c) => `${c}.ilike."${like}"`),
        ...(phoneLike ? [`phone.ilike."${phoneLike}"`] : []),
      ].join(",");

    const { supabaseAdmin } =
      await import("@/integrations/supabase/client.server");
    const [profiles, registrations] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("id, faculty_id, name, email, phone")
        .or(orFor(["name", "email", "faculty_id", "phone"]))
        .limit(25),
      supabaseAdmin
        .from("faculty_ids")
        .select("faculty_id, name, email, phone")
        .or(orFor(["name", "email", "faculty_id", "phone"]))
        .limit(25),
    ]);
    if (profiles.error) throw new Error(profiles.error.message);
    if (registrations.error) throw new Error(registrations.error.message);

    const out = new Map<string, StudentMatch>();
    for (const p of profiles.data ?? []) {
      out.set(p.faculty_id ?? `user:${p.id}`, {
        facultyId: p.faculty_id,
        userId: p.id,
        name: p.name || "Student",
        email: p.email || null,
        phone: p.phone,
      });
    }
    for (const r of registrations.data ?? []) {
      const existing = out.get(r.faculty_id);
      if (existing) {
        existing.phone ??= r.phone || null;
        existing.email ??= r.email || null;
      } else {
        out.set(r.faculty_id, {
          facultyId: r.faculty_id,
          userId: null,
          name: r.name || "Student",
          email: r.email || null,
          phone: r.phone || null,
        });
      }
    }
    return [...out.values()].slice(0, 30);
  });

const RecordInput = z
  .object({
    facultyId: z.string().trim().min(1).max(50).optional(),
    userId: z.string().uuid().optional(),
  })
  .refine((d) => d.facultyId || d.userId, "Faculty ID or user id required");

/** Admin: one student's profile, enrolments, payments, work scores and certificates. */
export const getStudentRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => RecordInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } =
      await import("@/integrations/supabase/client.server");

    const profileQ = supabaseAdmin
      .from("profiles")
      .select(
        "id, faculty_id, name, email, phone, department, learning_mode, cohort_month, cohort_year, slack_channel_name, created_at",
      );
    const { data: profile } = data.userId
      ? await profileQ.eq("id", data.userId).maybeSingle()
      : await profileQ.eq("faculty_id", data.facultyId!).maybeSingle();

    const facultyId = profile?.faculty_id ?? data.facultyId ?? null;
    const userId = profile?.id ?? null;

    const none = { data: [], error: null };
    const [
      registration,
      enrollments,
      courseEnrollments,
      progress,
      deliverables,
      certificates,
    ] = await Promise.all([
      facultyId
        ? supabaseAdmin
            .from("faculty_ids")
            .select(
              "name, email, phone, course_interest, department, hear_about_us, status, created_at",
            )
            .eq("faculty_id", facultyId)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      facultyId
        ? supabaseAdmin
            .from("enrollments")
            .select(
              "id, plan_name, learning_mode, status, amount_due, currency, coupon_code, tx_ref, payment_reference, paid_at, enrollment_date, created_at",
            )
            .eq("faculty_id", facultyId)
            .order("created_at", { ascending: false })
        : Promise.resolve(none),
      facultyId
        ? supabaseAdmin
            .from("course_enrollments")
            .select(
              "id, course_id, status, enrollment_date, courses(name, department)",
            )
            .eq("faculty_id", facultyId)
            .order("enrollment_date", { ascending: false })
        : Promise.resolve(none),
      facultyId
        ? supabaseAdmin
            .from("course_progress")
            .select(
              "course_id, progress_percentage, classes_completed, completed_at, last_accessed",
            )
            .eq("faculty_id", facultyId)
        : Promise.resolve(none),
      // Work is keyed by account where there is one, so older rows without a Faculty ID still show.
      userId || facultyId
        ? supabaseAdmin
            .from("student_deliverables")
            .select(
              "id, course_name, class_number, title, status, score, reviewer_note, proof_url, week_of, created_at",
            )
            .eq(userId ? "user_id" : "faculty_id", (userId ?? facultyId)!)
            .order("created_at", { ascending: false })
            .limit(200)
        : Promise.resolve(none),
      facultyId
        ? supabaseAdmin
            .from("certificates")
            .select(
              "id, certificate_number, certificate_type, course_name, date_issued, issued_at, created_at",
            )
            .eq("faculty_id", facultyId)
            .order("created_at", { ascending: false })
        : Promise.resolve(none),
    ]);
    for (const r of [
      registration,
      enrollments,
      courseEnrollments,
      progress,
      deliverables,
      certificates,
    ]) {
      if (r.error) throw new Error(r.error.message);
    }
    if (!profile && !registration.data) throw new Error("Student not found");

    const scored = (deliverables.data ?? []).filter((d) => d.score != null);
    const progressByCourse = new Map(
      (progress.data ?? []).map((p) => [p.course_id, p]),
    );

    return {
      facultyId,
      userId,
      name: profile?.name || registration.data?.name || "Student",
      email: profile?.email || registration.data?.email || null,
      phone: profile?.phone || registration.data?.phone || null,
      department: profile?.department || registration.data?.department || null,
      courseInterest: registration.data?.course_interest ?? null,
      heardAboutUs: registration.data?.hear_about_us ?? null,
      learningMode: profile?.learning_mode ?? null,
      cohort:
        profile?.cohort_month && profile?.cohort_year
          ? { month: profile.cohort_month, year: profile.cohort_year }
          : null,
      slackChannel: profile?.slack_channel_name ?? null,
      registeredAt: registration.data?.created_at ?? null,
      signedUpAt: profile?.created_at ?? null,
      enrollments: enrollments.data ?? [],
      courses: (courseEnrollments.data ?? []).map((c) => ({
        id: c.id,
        name: c.courses?.name ?? "Course",
        status: c.status,
        enrollmentDate: c.enrollment_date,
        progress: progressByCourse.get(c.course_id) ?? null,
      })),
      work: deliverables.data ?? [],
      averageScore: scored.length
        ? Math.round(
            scored.reduce((s, d) => s + (d.score ?? 0), 0) / scored.length,
          )
        : null,
      reviewedCount: scored.length,
      certificates: certificates.data ?? [],
    };
  });
