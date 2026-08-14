import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { BlogPost } from "@/types/blog";
import blogPosts from "@/data/blogPosts";

/** Row shape of the auto-generated posts table. */
type DbPost = {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  read_time: string;
  published_at: string;
};

function toBlogPost(row: DbPost): BlogPost {
  const minutes = parseInt(row.read_time, 10);
  const tags = row.tags?.length ? row.tags : [row.category];
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    content: row.content,
    date: row.published_at,
    author: row.author || "Tech Faculty NG",
    tags: tags[0] === row.category ? tags : [row.category, ...tags],
    readTime: Number.isFinite(minutes) ? minutes : 8,
  };
}

async function fetchDbPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, title, description, content, category, tags, author, read_time, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as DbPost[]).map(toBlogPost);
}

/**
 * All blog posts: the curated static library plus weekly auto-generated posts,
 * newest first. Static posts win on slug collisions.
 */
export function useAllBlogPosts() {
  const query = useQuery({
    queryKey: ["blog-posts-db"],
    queryFn: fetchDbPosts,
    staleTime: 10 * 60 * 1000,
  });

  const staticSlugs = new Set(blogPosts.map((p) => p.slug));
  const merged = [
    ...blogPosts,
    ...(query.data ?? []).filter((p) => !staticSlugs.has(p.slug)),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { posts: merged, isLoading: query.isLoading };
}
