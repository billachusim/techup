import { createFileRoute } from "@tanstack/react-router";

// HR automation agent API. Auth (x-hr-api-key), rate limit and audit are in hr-api.server.
export const Route = createFileRoute("/api/public/hr-api/$")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { handleHrApi } = await import("@/lib/hr-api.server");
        return handleHrApi(request, params._splat ?? "");
      },
      POST: async ({ request, params }) => {
        const { handleHrApi } = await import("@/lib/hr-api.server");
        return handleHrApi(request, params._splat ?? "");
      },
    },
  },
});
