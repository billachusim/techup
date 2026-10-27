import { createFileRoute } from "@tanstack/react-router";
import { sameKey } from "@/lib/hr-api-rules";

// Legacy callback stays closed to public callers and never uses app emails
// for promotional sequences. A dedicated marketing provider is required.
export const Route = createFileRoute("/api/lead-followups")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env["LEAD_EMAIL_CRON_SECRET"] ?? "";
        if (!sameKey(request.headers.get("x-cron-secret") ?? "", expected)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const [{ supabaseAdmin }, { runLeadFollowups }] =
          await Promise.all([
            import("@/integrations/supabase/client.server"),
            import("@/lib/lead-followups.server"),
          ]);
        const started = Date.now();
        try {
          const result = await runLeadFollowups(
            supabaseAdmin,
            async () => ({ sent: false }),
          );
          const { error: logError } = await supabaseAdmin
            .from("scheduled_job_runs")
            .insert({
              job: "lead-email-followups",
              trigger: "cron",
              success: !result.failed,
              items: result.sent,
              report: result,
              duration_ms: Date.now() - started,
            });
          if (logError)
            console.error("Could not log lead follow-up run", logError.message);
          return Response.json(result);
        } catch (e) {
          const message = (e as Error).message;
          console.error("lead-followups error", message);
          await supabaseAdmin.from("scheduled_job_runs").insert({
            job: "lead-email-followups",
            trigger: "cron",
            success: false,
            items: 0,
            report: {},
            error: message,
            duration_ms: Date.now() - started,
          });
          return Response.json(
            { error: "Could not send lead follow-up emails" },
            { status: 500 },
          );
        }
      },
    },
  },
});
