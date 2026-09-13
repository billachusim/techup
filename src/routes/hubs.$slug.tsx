import { createFileRoute } from "@tanstack/react-router";
import HubDetail from "@/pages/HubDetail";
import { techHubs } from "@/data/techHubs";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/hubs/$slug")({
  head: ({ params }) => {
    const hub = techHubs.find((h) => h.slug === params.slug);
    const title = hub
      ? `${hub.name} — Tech Hub in ${hub.city}`.slice(0, 60)
      : "Hub not found | Tech Faculty Hubs";
    return pageHead({
      title,
      description: hub
        ? `${hub.name} in ${hub.city}: courses, programmes and how to enrol through Tech Faculty.`.slice(0, 160)
        : "This tech hub page is not available.",
      path: `/hubs/${params.slug}`,
      noindex: !hub,
    });
  },
  component: HubDetail,
});
