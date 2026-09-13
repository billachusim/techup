import { createFileRoute } from "@tanstack/react-router";
import EventDetail from "@/pages/EventDetail";
import { fetchEventBySlug } from "@/lib/events";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/events/$slug")({
  loader: async ({ params }) => {
    try {
      const event = await fetchEventBySlug(params.slug);
      if (!event) return null;
      return {
        title: event.title.slice(0, 60),
        description: event.description.slice(0, 160),
        image: event.image_url ?? undefined,
      };
    } catch {
      return null;
    }
  },
  head: ({ loaderData, params }) =>
    pageHead({
      title: loaderData?.title ?? "Tech Event | Tech Faculty Events",
      description:
        loaderData?.description ??
        "Details for this tech event in Nigeria or Africa, curated by Tech Faculty.",
      path: `/events/${params.slug}`,
      image: loaderData?.image,
      type: "article",
    }),
  component: EventDetail,
});
