import { createFileRoute } from "@tanstack/react-router";

// Called by the recover-checkouts edge function after it re-checks pending
// card payments. Sends only emails that are due, each once, so it needs no secret.
export const Route = createFileRoute("/api/payment-followups")({
  server: {
    handlers: {
      POST: async () => {
        const { runPaymentFollowups } = await import("@/lib/payment-followups.server");
        try {
          return Response.json(await runPaymentFollowups());
        } catch (e) {
          console.error("payment-followups error", (e as Error).message);
          return Response.json({ error: "Could not send follow-up emails" }, { status: 500 });
        }
      },
    },
  },
});
