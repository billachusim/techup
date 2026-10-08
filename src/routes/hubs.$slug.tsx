import { createFileRoute } from "@tanstack/react-router";
import HubDetail from "@/pages/HubDetail";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/hubs/$slug")({
  // Looked up in the loader so the hubs data loads with this route,
  // not in the main bundle.
  loader: async ({ params }) => {
    const { techHubs } = await import("@/data/techHubs");
    const hub = techHubs.find((h) => h.slug === params.slug);
    return hub ? { name: hub.name, city: hub.city } : null;
  },
  head: ({ loaderData: hub, params }) =>
    pageHead({
      title: hub
        ? `${hub.name}, Tech Hub in ${hub.city}`
        : "Hub Not Found",
      description: hub
        ? `${hub.name} in ${hub.city}: courses, programmes and how to enrol through Tech Faculty.`.slice(0, 160)
        : "This tech hub page is not available.",
      path: `/hubs/${params.slug}`,
      noindex: !hub,
    }),
  component: HubDetail,
});
