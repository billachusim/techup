import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { buildRssFeed, rssResponse } = await import("@/lib/rss.server");
        return rssResponse(await buildRssFeed());
      },
    },
  },
});
