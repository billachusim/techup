import { createFileRoute, redirect } from "@tanstack/react-router";
import HubDetail from "@/pages/HubDetail";
import { pageHead } from "@/lib/seo";
import { REMOVED_HUB_SLUGS } from "@/data/techHubs";

export const Route = createFileRoute("/hubs/$slug")({
  // Hub pages outside Nigeria were removed; send their old URLs to the directory.
  beforeLoad: ({ params }) => {
    if (REMOVED_HUB_SLUGS.has(params.slug)) {
      throw redirect({ to: "/hubs", statusCode: 301 });
    }
  },
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
