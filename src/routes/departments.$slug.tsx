import { createFileRoute } from "@tanstack/react-router";
import DepartmentDetail from "@/pages/DepartmentDetail";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/departments/$slug")({
  // Looked up in the loader so the departments data loads with this route,
  // not in the main bundle.
  loader: async ({ params }) => {
    const { departments } = await import("@/data/departments");
    const dept = departments.find((d) => d.slug === params.slug);
    return dept
      ? { title: dept.metaTitle, description: dept.metaDescription }
      : null;
  },
  head: ({ loaderData, params }) =>
    pageHead({
      title: loaderData?.title ?? "Department Not Found",
      description:
        loaderData?.description ??
        "This Tech Faculty department page is not available.",
      path: `/departments/${params.slug}`,
      noindex: !loaderData,
    }),
  component: DepartmentDetail,
});
