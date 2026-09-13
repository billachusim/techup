import { createFileRoute } from "@tanstack/react-router";
import Blog from "@/pages/Blog";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  head: () =>
    pageHead({
      title: "Blog & Resources - Tech Faculty NG | Tech Career Tips",
      description:
        "Tech career guides, course deep-dives, SIWES tips, and AI insights from Tech Faculty NG. Practical advice for starting and growing your tech career in Nigeria.",
      path: "/blog",
    }),
  component: Blog,
});
