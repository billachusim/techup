import { createFileRoute } from "@tanstack/react-router";
import BlogPost from "@/pages/BlogPost";
import { pageHead } from "@/lib/seo";
import { articleOgImage } from "@/lib/og-image";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    // Imported here, not at the top, so the posts table stays out of the main bundle.
    const { default: blogPosts } = await import("@/data/blogPosts");
    const local = blogPosts.find((p) => p.slug === params.slug);
    if (local) {
      return {
        title: local.seoTitle ?? local.title,
        description: local.description,
        published: local.date,
        modified: local.updated ?? local.date,
        image: articleOgImage(local),
      };
    }
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase
        .from("blog_posts")
        .select("title, description, category, tags, published_at, updated_at")
        .eq("slug", params.slug)
        .eq("is_published", true)
        .maybeSingle();
      if (data) {
        return {
          title: data.title,
          description: data.description,
          published: data.published_at,
          modified: data.updated_at ?? data.published_at,
          image: articleOgImage({ title: data.title, description: data.description, tags: [data.category || data.tags?.[0] || "Career guide"] }),
        };
      }
    } catch {
      // fall through to generic metadata
    }
    return null;
  },
  head: ({ loaderData, params }) =>
    pageHead({
      title: loaderData?.title ?? "Blog & Resources",
      description:
        loaderData?.description ??
        "Tech career guides, course deep-dives, SIWES tips, and AI insights from Tech Faculty NG.",
      path: `/blog/${params.slug}`,
      type: "article",
      image: loaderData?.image,
      publishedTime: loaderData?.published,
      modifiedTime: loaderData?.modified,
    }),
  component: BlogPost,
});
