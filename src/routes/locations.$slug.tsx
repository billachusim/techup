import { createFileRoute } from "@tanstack/react-router";
import LocationDetail from "@/pages/LocationDetail";
import { campuses } from "@/data/campuses";
import { campusMetaTitle, campusMetaDescription } from "@/data/campusContent";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/locations/$slug")({
  head: ({ params }) => {
    const campus = campuses.find((c) => c.slug === params.slug);
    return pageHead({
      title: campus
        ? campusMetaTitle(campus)
        : "Campus not found | Tech Faculty NG",
      description: campus
        ? campusMetaDescription(campus)
        : "This Tech Faculty campus page is not available.",
      path: `/locations/${params.slug}`,
      noindex: !campus,
    });
  },
  component: LocationDetail,
});
