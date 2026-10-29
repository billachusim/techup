import { createFileRoute } from "@tanstack/react-router";
import { sameKey } from "@/lib/hr-api-rules";

// Called by the class-reminders pg_cron job every morning with the
// "class-reminders" secret from cron_secrets. Anyone else is refused.
// Each run is logged to scheduled_job_runs, and a run that emails anyone
// also gets one row in the admin activity log, by "automation".
export const Route = createFileRoute("/api/class-reminders")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const given = request.headers.get("x-cron-secret") ?? "";
        const { supabaseAdmin } =
          await import("@/integrations/supabase/client.server");
        const { data } = await supabaseAdmin
          .from("cron_secrets")
          .select("secret")
          .eq("job", "class-reminders")
          .maybeSingle();
        if (!given || !data?.secret || !sameKey(given, data.secret)) {
          return Response.json({ error: "Not allowed" }, { status: 401 });
        }
        const { runClassReminders } =
          await import("@/lib/class-reminders.server");
        const started = Date.now();
        try {
          const result = await runClassReminders();
          const { error: logError } = await supabaseAdmin
            .from("scheduled_job_runs")
            .insert({
              job: "class-reminders",
              trigger: "cron",
              success: result.failed === 0,
              items: result.sent,
              report: result,
              duration_ms: Date.now() - started,
            });
          if (logError)
            console.error("Could not log class reminder run", logError.message);
          if (result.sent > 0) {
            const { error: auditError } = await supabaseAdmin
              .from("admin_audit_log")
              .insert({
                actor_email: "automation",
                action: "class_reminders.sent",
                target_table: "lectures",
                subject: `${result.sent} class reminder${result.sent === 1 ? "" : "s"} for ${result.classes.length} class${result.classes.length === 1 ? "" : "es"}`,
                details: {
                  classes: result.classes,
                  skipped: result.skipped,
                  failed: result.failed,
                },
              });
            if (auditError)
              console.error(
                "Could not write admin audit log",
                auditError.message,
              );
          }
          return Response.json(result);
        } catch (e) {
          const message = (e as Error).message;
          console.error("class-reminders error", message);
          await supabaseAdmin.from("scheduled_job_runs").insert({
            job: "class-reminders",
            trigger: "cron",
            success: false,
            items: 0,
            report: {},
            error: message,
            duration_ms: Date.now() - started,
          });
          return Response.json(
            { error: "Could not send class reminders" },
            { status: 500 },
          );
        }
      },
    },
  },
});
