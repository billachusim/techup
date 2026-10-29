import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

// Works out who is calling an edge function from their sign-in token, using a
// service-role client. Never trust a faculty ID or course ID the browser sends
// without checking it against the caller here.

export interface Caller {
  userId: string;
  facultyId: string | null;
  isStaff: boolean;
}

export async function getCaller(req: Request, admin: SupabaseClient): Promise<Caller | null> {
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data } = await admin.auth.getUser(token);
  const user = data?.user;
  if (!user) return null;
  const [{ data: profile }, { data: staff }] = await Promise.all([
    admin.from("profiles").select("faculty_id").eq("id", user.id).maybeSingle(),
    admin.rpc("is_staff", { _user_id: user.id }),
  ]);
  return { userId: user.id, facultyId: profile?.faculty_id ?? null, isStaff: staff === true };
}

/** True when the caller is staff or is enrolled in the course. */
export async function canUseCourse(admin: SupabaseClient, caller: Caller, courseId: string): Promise<boolean> {
  if (caller.isStaff) return true;
  if (!caller.facultyId || !courseId) return false;
  const { data } = await admin
    .from("course_enrollments")
    .select("id, status")
    .eq("faculty_id", caller.facultyId)
    .eq("course_id", courseId)
    .limit(5);
  return (data ?? []).some((r: { status: string }) => r.status !== "cancelled");
}
