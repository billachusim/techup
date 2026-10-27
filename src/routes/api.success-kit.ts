import { createFileRoute } from "@tanstack/react-router";

// Serves the paid SIWES Success Kit. See src/lib/success-kit-download.server.ts for who may download it.
export const Route = createFileRoute("/api/success-kit")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { checkKitAccess, kitFileResponse } = await import("@/lib/success-kit-download.server");
        const url = new URL(request.url);
        const token = (request.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "") || null;
        try {
          const access = await checkKitAccess(supabaseAdmin as never, url.searchParams.get("ref"), token);
          if (!access.ok) {
            return new Response(`${access.message} Need help? WhatsApp us on +2348068597140.`, {
              status: access.status,
              headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
            });
          }
          return kitFileResponse();
        } catch (e) {
          console.error("success-kit download error", (e as Error).message);
          return new Response("Could not prepare your download. Please try again.", { status: 500 });
        }
      },
    },
  },
});
