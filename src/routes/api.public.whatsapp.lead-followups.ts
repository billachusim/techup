import { createFileRoute } from "@tanstack/react-router";
import { sameKey } from "@/lib/hr-api-rules";

export const Route = createFileRoute("/api/public/whatsapp/lead-followups")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const given = request.headers.get("x-cron-secret") ?? "";
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.from("cron_secrets")
          .select("secret").eq("job", "whatsapp-lead-followups").maybeSingle();
        if (error || !data?.secret || !sameKey(given, data.secret)) return new Response("Unauthorized", { status: 401 });

        const { runWhatsAppLeadFollowups } = await import("@/lib/whatsapp-followups.server");
        const started = Date.now();
        try {
          const result = await runWhatsAppLeadFollowups(supabaseAdmin as any);
          const { error: logError } = await supabaseAdmin.from("scheduled_job_runs").insert({
            job: "whatsapp-lead-followups",
            trigger: "cron",
            success: !result.failed && !result.unresolved,
            items: result.sent,
            report: result,
            duration_ms: Date.now() - started,
          });
          if (logError) console.error("Could not log WhatsApp follow-up run", logError.message);
          return Response.json(result);
        } catch (error) {
          const message = (error as Error).message;
          await supabaseAdmin.from("scheduled_job_runs").insert({
            job: "whatsapp-lead-followups",
            trigger: "cron",
            success: false,
            items: 0,
            report: {},
            error: message,
            duration_ms: Date.now() - started,
          });
          console.error("WhatsApp lead follow-ups failed", message);
          return Response.json({ error: "WhatsApp follow-up run failed" }, { status: 500 });
        }
      },
    },
  },
});