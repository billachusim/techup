import { createFileRoute } from "@tanstack/react-router";
import { sameKey } from "@/lib/hr-api-rules";

// Called by pg_cron once a month (1st, 07:40 Lagos) with the "certificate-auto-issue"
// secret from cron_secrets. Anyone else is refused. It only issues certificates the
// rules in certificate-auto-issue.server.ts allow, and emails each one once.
export const Route = createFileRoute("/api/certificate-auto-issue")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const [{ supabaseAdmin }, { runCertificateAutoIssue }] = await Promise.all([
          import("@/integrations/supabase/client.server"),
          import("@/lib/certificate-auto-issue.server"),
        ]);
        const given = request.headers.get("x-cron-secret") ?? "";
        const { data: cron } = await supabaseAdmin.from("cron_secrets").select("secret").eq("job", "certificate-auto-issue").maybeSingle();
        if (!given || !cron?.secret || !sameKey(given, cron.secret)) {
          return Response.json({ error: "Not allowed" }, { status: 401 });
        }
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
