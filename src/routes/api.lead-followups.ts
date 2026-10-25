import { createFileRoute } from "@tanstack/react-router";

// Called by pg_cron every hour. Sends only follow-up emails that are due, each
// once, so it needs no secret.
export const Route = createFileRoute("/api/lead-followups")({
  server: {
    handlers: {
      POST: async () => {
        const [{ supabaseAdmin }, { runLeadFollowups }, { sendTemplateEmail }] =
          await Promise.all([
            import("@/integrations/supabase/client.server"),
            import("@/lib/lead-followups.server"),
            import("@/lib/email-templates/send-email"),
          ]);
        const started = Date.now();
        try {
          const result = await runLeadFollowups(
            supabaseAdmin,
            sendTemplateEmail,
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
