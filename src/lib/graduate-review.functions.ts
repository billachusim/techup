import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Google review link for the Nnewi Tech Faculty (Tech Hub) listing.
const REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJ5ZxSzmi9QxAR23OzR7YbAkM";

const Input = z.object({
  certificateNumber: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(320).optional(),
});

export type GraduateReviewResult =
  | { status: "sent"; email: string }
  | { status: "already_sent"; email: string }
  | { status: "no_email" }
  | { status: "suppressed"; email: string }
  | { status: "failed"; error: string };

/**
 * Admin: after a certificate is issued, email the graduate a Google review
 * request. Sent at most once per graduate email address.
 */
export const requestGraduateReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data, context }): Promise<GraduateReviewResult> => {
    const { data: roles } = await context.supabase
      .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin");
    if (!roles?.length) throw new Error("Admins only");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: cert } = await supabaseAdmin
      .from("certificates")
      .select("certificate_number, student_name, course_name, faculty_id")
      .eq("certificate_number", data.certificateNumber.toUpperCase())
      .maybeSingle();
    if (!cert) throw new Error("Certificate not found");

    // A typed email wins; otherwise use the email on the student's profile.
    let email = data.email;
    let name = cert.student_name as string | null;
    if (!email && cert.faculty_id) {
      const { data: profile } = await supabaseAdmin
        .from("profiles").select("name, email").eq("faculty_id", cert.faculty_id).maybeSingle();
      email = profile?.email ?? undefined;
      name = name || profile?.name || null;
    }
    if (!email) return { status: "no_email" };
    email = email.toLowerCase();

    const { error: dup } = await supabaseAdmin
      .from("graduate_review_requests")
      .insert({ email, certificate_number: cert.certificate_number });
    if (dup) return { status: "already_sent", email };

    try {
      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
      const res = await sendTemplateEmail("graduate-review-request", email, {
        templateData: { name, courseName: cert.course_name, reviewUrl: REVIEW_URL },
        idempotencyKey: `graduate-review-request-${email}`,
      });
      return res.sent ? { status: "sent", email } : { status: "suppressed", email };
    } catch (e) {
      // Free the slot so the admin can retry.
      await supabaseAdmin.from("graduate_review_requests").delete().eq("email", email);
      console.error("graduate review email failed", (e as Error).message);
      return { status: "failed", error: (e as Error).message };
    }
  });
