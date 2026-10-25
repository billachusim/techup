import { createFileRoute } from "@tanstack/react-router";
import SiwesCourseDetail from "@/pages/SiwesCourseDetail";
import { ogImage, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/siwes/courses/$slug")({
  // Looked up in the loader so the course data loads with this route,
  // not in the main bundle.
  loader: async ({ params }) => {
    const { getSiwesCourse } = await import("@/data/siwesCourses");
    const course = getSiwesCourse(params.slug);
    return course
      ? { title: course.metaTitle, description: course.metaDescription }
      : null;
  },
  head: ({ loaderData, params }) =>
    pageHead({
      title: loaderData?.title ?? "SIWES Course Not Found",
      description:
        loaderData?.description ?? "This SIWES course page is not available.",
      path: `/siwes/courses/${params.slug}`,
      image: loaderData ? ogImage("siwes.jpg") : undefined,
      noindex: !loaderData,
    }),
  component: SiwesCourseDetail,
});
