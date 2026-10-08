import { createFileRoute } from "@tanstack/react-router";
import BlogCategory from "@/pages/BlogCategory";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/blog/category/$slug")({
  // Looked up in the loader so the category data loads with this route,
  // not in the main bundle.
  loader: async ({ params }) => {
    const { getCategoryBySlug } = await import("@/data/blogCategories");
    const category = getCategoryBySlug(params.slug);
    return category
      ? { title: category.title, description: category.description }
      : null;
  },
  head: ({ loaderData, params }) =>
    pageHead({
      title: loaderData?.title ?? "Blog Category",
      description:
        loaderData?.description ??
        "Browse articles in this category on the Tech Faculty NG blog.",
      path: `/blog/category/${params.slug}`,
      noindex: !loaderData,
    }),
  component: BlogCategory,
});
