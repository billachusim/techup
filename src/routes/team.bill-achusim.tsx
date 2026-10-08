import { createFileRoute } from "@tanstack/react-router";
import Founder from "@/pages/Founder";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/team/bill-achusim")({
  // Blog data is large, so it is loaded here rather than imported at the top of the route.
  loader: async () => {
    const [{ getAllBlogPosts }, { default: cityGuides }] = await Promise.all([
      import("@/data/blogPosts"),
      import("@/data/cityBlogPosts"),
    ]);
    // The city guides share one template, so they would crowd out the essays.
    const guideSlugs = new Set(cityGuides.map((p) => p.slug));
    const articles = getAllBlogPosts()
      .filter((p) => !guideSlugs.has(p.slug))
      .slice(0, 10)
      .map(({ slug, title, date }) => ({ slug, title, date }));
    return { articles };
  },
  head: () =>
    pageHead({
      title: "Bill Achusim - Founder of Tech Faculty NG",
      description:
        "Nnamdi Bill Achusim founded Tech Faculty NG in Nnewi, Anambra State, and the Nnewi Tech Meetup. He holds an MSc in Systems Engineering from the University of Lagos. His background, links and articles.",
      path: "/team/bill-achusim",
      type: "profile",
    }),
  component: Founder,
});
