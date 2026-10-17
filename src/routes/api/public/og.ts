import { createFileRoute } from "@tanstack/react-router";
import { OG_CACHE_CONTROL, parseOgInput } from "@/lib/og-image";

export const Route = createFileRoute("/api/public/og")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const parsed = parseOgInput(new URL(request.url));
        if (!parsed.success) return Response.json({ error: "Invalid image parameters" }, { status: 400, headers: { "Cache-Control": "no-store" } });
        const { renderOgImage } = await import("@/lib/og-render.server");
        const image = await renderOgImage(parsed.data);
        return new Response(image.body, {
          headers: {
            "Content-Type": image.contentType,
            "Cache-Control": OG_CACHE_CONTROL,
            "X-Content-Type-Options": "nosniff",
            "Content-Security-Policy": "default-src 'none'; img-src data:; style-src 'unsafe-inline'; sandbox",
          },
        });
      },
    },
  },
});