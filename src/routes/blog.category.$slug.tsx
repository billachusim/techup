import { createFileRoute } from "@tanstack/react-router";
import BlogCategory from "@/pages/BlogCategory";
import { getCategoryBySlug } from "@/data/blogCategories";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/blog/category/$slug")({
  head: ({ params }) => {
    const category = getCategoryBySlug(params.slug);
    return pageHead({
      title: category?.title ?? "Blog Category | Tech Faculty NG",
      description:
        category?.description ??
        "Browse articles in this category on the Tech Faculty NG blog.",
      path: `/blog/category/${params.slug}`,
      noindex: !category,
    });
  },
  component: BlogCategory,
});
