import { createFileRoute } from "@tanstack/react-router";
import LocationDetail from "@/pages/LocationDetail";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/locations/$slug")({
  // Looked up in the loader so the campus data loads with this route,
  // not in the main bundle.
  loader: async ({ params }) => {
    const [{ campuses }, { campusMetaTitle, campusMetaDescription }] =
      await Promise.all([
        import("@/data/campuses"),
        import("@/data/campusContent"),
      ]);
    const campus = campuses.find((c) => c.slug === params.slug);
    return campus
      ? {
          title: campusMetaTitle(campus),
          description: campusMetaDescription(campus),
        }
      : null;
  },
  head: ({ loaderData, params }) =>
    pageHead({
      title: loaderData?.title ?? "Campus Not Found",
      description:
        loaderData?.description ??
        "This Tech Faculty campus page is not available.",
      path: `/locations/${params.slug}`,
      noindex: !loaderData,
    }),
  component: LocationDetail,
});
