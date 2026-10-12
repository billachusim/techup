import { createFileRoute } from "@tanstack/react-router";

// Called by pg_cron every morning. It sends at most one email a day, to the
// fixed staff address, so it needs no secret.
export const Route = createFileRoute("/api/admin-digest")({
  server: {
    handlers: {
      POST: async () => {
        const { runAdminDigest } = await import("@/lib/admin-digest.server");
        try {
          return Response.json(await runAdminDigest());
        } catch (e) {
          console.error("admin-digest error", (e as Error).message);
          return Response.json({ error: "Could not send the digest" }, { status: 500 });
        }
      },
    },
  },
});
