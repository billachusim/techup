import { createFileRoute } from "@tanstack/react-router";
import { verifyWebhookRequest } from "@lovable.dev/webhooks-js";

export const Route = createFileRoute("/api/public/whatsapp/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["WHATSAPP_API_KEY"];
        if (!secret) return new Response("Not configured", { status: 500 });
        let payload: unknown;
        try {
          const verified = await verifyWebhookRequest({ req: request, secret, maxBodyBytes: 4 * 1024 * 1024 });
          payload = verified.payload;
        } catch {
          return new Response("Unauthorized", { status: 401 });
        }
        const deliveryId = request.headers.get("x-lovable-delivery");
        const event = request.headers.get("x-lovable-event");
        if (!deliveryId || !event) return new Response("Missing headers", { status: 400 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const db = supabaseAdmin as any;
        const { runRow, recoverPending } = await import("@/lib/whatsapp.server");

        const { error: insErr } = await db.from("whatsapp_webhook_events")
          .upsert({ delivery_id: deliveryId, event, payload }, { onConflict: "delivery_id", ignoreDuplicates: true });
        if (insErr) return new Response("Store failed", { status: 500 });
        const { data: row, error } = await db.from("whatsapp_webhook_events")
          .select("id,delivery_id,event,payload,attempts,processed_at").eq("delivery_id", deliveryId).single();
        if (error || !row) return new Response("Store failed", { status: 500 });

        if (!row.processed_at) {
          const ok = await runRow(db, row);
          if (!ok) return new Response("Processing failed", { status: 500 });
        }
        try { await recoverPending(db, 3); } catch { /* best effort */ }
        return new Response("ok");
      },
    },
  },
});
