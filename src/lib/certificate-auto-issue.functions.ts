import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Student: issue any certificate they have now earned, right after they tick
 * their last class. Only ever looks at the signed-in student's own courses;
 * the rules are in certificate-auto-issue.server.ts.
 */
export const claimMyCertificates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("faculty_id")
      .eq("id", context.userId)
      .maybeSingle();
    if (!profile?.faculty_id) return { issued: 0, emailed: 0, waitingPayment: 0, waitingWork: 0 };
    const { runCertificateAutoIssue } = await import("@/lib/certificate-auto-issue.server");
    return runCertificateAutoIssue(profile.faculty_id);
  });
