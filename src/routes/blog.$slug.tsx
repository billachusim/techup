import { createFileRoute } from "@tanstack/react-router";
import BlogPost from "@/pages/BlogPost";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    // Imported here, not at the top, so the posts table stays out of the main bundle.
    const { default: blogPosts } = await import("@/data/blogPosts");
    const local = blogPosts.find((p) => p.slug === params.slug);
    if (local) {
      return {
        title: local.seoTitle ?? `${local.title} | Tech Faculty NG Blog`,
        description: local.description,
      };
    }
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase
        .from("blog_posts")
        .select("title, description")
        .eq("slug", params.slug)
        .maybeSingle();
      if (data) {
        return {
          title: `${data.title} | Tech Faculty NG Blog`,
          description: data.description,
        };
      }
    } catch {
      // fall through to generic metadata
    }
    return null;
  },
  head: ({ loaderData, params }) =>
    pageHead({
      title: loaderData?.title ?? "Blog & Resources - Tech Faculty NG",
      description:
        loaderData?.description ??
        "Tech career guides, course deep-dives, SIWES tips, and AI insights from Tech Faculty NG.",
      path: `/blog/${params.slug}`,
      type: "article",
    }),
  component: BlogPost,
});
