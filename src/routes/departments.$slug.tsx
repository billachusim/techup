import { createFileRoute } from "@tanstack/react-router";
import DepartmentDetail from "@/pages/DepartmentDetail";
import { departments } from "@/data/departments";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/departments/$slug")({
  head: ({ params }) => {
    const dept = departments.find((d) => d.slug === params.slug);
    return pageHead({
      title: dept?.metaTitle ?? "Department not found | Tech Faculty",
      description:
        dept?.metaDescription ??
        "This Tech Faculty department page is not available.",
      path: `/departments/${params.slug}`,
      noindex: !dept,
    });
  },
  component: DepartmentDetail,
});
