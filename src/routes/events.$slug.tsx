import { createFileRoute } from "@tanstack/react-router";
import EventDetail from "@/pages/EventDetail";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/events/$slug")({
  loader: async ({ params }) => {
    try {
      const { fetchEventBySlug, isOwnEvent } = await import("@/lib/events");
      const event = await fetchEventBySlug(params.slug);
      if (!event) return null;
      return {
        title: event.title,
        description: event.description.slice(0, 160),
        image: event.image_url ?? undefined,
        // Only our own, still-listed events are worth indexing; listings
        // gathered from other organisers, and expired ones, are thin pages.
        indexable: isOwnEvent(event) && !event.is_expired,
      };
    } catch {
      // A failed lookup isn't a missing page: keep the generic, indexable head.
      return undefined;
    }
  },
  head: ({ loaderData, params }) =>
    pageHead({
      title: loaderData?.title ?? "Tech Event",
      description:
        loaderData?.description ??
        "Details for this tech event in Nigeria or Africa, curated by Tech Faculty.",
      path: `/events/${params.slug}`,
      image: loaderData?.image,
      type: "article",
      noindex: loaderData === null || loaderData?.indexable === false,
      follow: true,
    }),
  component: EventDetail,
});
