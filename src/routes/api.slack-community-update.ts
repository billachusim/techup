import { createFileRoute } from "@tanstack/react-router";
import { sameKey } from "@/lib/hr-api-rules";

// Called by pg_cron every Monday with the "slack-community-update" secret from cron_secrets.
export const Route = createFileRoute("/api/slack-community-update")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const given = request.headers.get("x-cron-secret") ?? "";
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data } = await supabaseAdmin.from("cron_secrets").select("secret").eq("job", "slack-community-update").maybeSingle();
        if (!given || !data?.secret || !sameKey(given, data.secret)) {
          return Response.json({ error: "Not allowed" }, { status: 401 });
        }
        const { runWeeklyCommunityUpdate } = await import("@/lib/slack-community.server");
        try {
          return Response.json(await runWeeklyCommunityUpdate());
        } catch (e) {
          console.error("slack-community-update error", (e as Error).message);
          return Response.json({ error: "Could not post the update" }, { status: 500 });
        }
      },
    },
  },
});
