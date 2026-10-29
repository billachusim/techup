import { createFileRoute } from "@tanstack/react-router";

// Called by pg_cron every hour. It only issues certificates the rules in
// certificate-auto-issue.server.ts allow, and emails each one once, so an
// extra call does nothing a scheduled run wouldn't. It needs no secret.
export const Route = createFileRoute("/api/certificate-auto-issue")({
  server: {
    handlers: {
      POST: async () => {
        const [{ supabaseAdmin }, { runCertificateAutoIssue }] = await Promise.all([
          import("@/integrations/supabase/client.server"),
          import("@/lib/certificate-auto-issue.server"),
        ]);
        const started = Date.now();
        try {
          const result = await runCertificateAutoIssue();
          const { error: logError } = await supabaseAdmin.from("scheduled_job_runs").insert({
            job: "certificate-auto-issue",
            trigger: "cron",
            success: true,
            items: result.issued,
            report: result,
            duration_ms: Date.now() - started,
          });
          if (logError) console.error("Could not log certificate run", logError.message);
          return Response.json(result);
        } catch (e) {
          const message = (e as Error).message;
          console.error("certificate-auto-issue error", message);
          await supabaseAdmin.from("scheduled_job_runs").insert({
            job: "certificate-auto-issue",
            trigger: "cron",
            success: false,
            items: 0,
            report: {},
            error: message,
            duration_ms: Date.now() - started,
          });
          return Response.json({ error: "Could not issue certificates" }, { status: 500 });
        }
      },
    },
  },
});
