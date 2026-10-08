import { createFileRoute } from "@tanstack/react-router";
import Blog from "@/pages/Blog";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  head: () =>
    pageHead({
      title: "Blog: Tech Career Tips & Guides",
      description:
        "Tech career guides, course deep-dives, SIWES tips, and AI insights from Tech Faculty NG. Practical advice for starting and growing your tech career in Nigeria.",
      path: "/blog",
    }),
  component: Blog,
});
