import { describe, expect, it } from "vitest";
import blogPosts from "../../src/data/blogPosts";
import { BLOG_REDIRECTS } from "../../supabase/functions/_shared/blog-redirects";

const staticSlugs = new Set(blogPosts.map((p) => p.slug));

describe("Retired blog posts", () => {
  it("are gone from the curated library", () => {
    for (const slug of Object.keys(BLOG_REDIRECTS)) expect(staticSlugs.has(slug), slug).toBe(false);
  });

  it("point straight at a live post, never another retired one", () => {
    for (const [slug, target] of Object.entries(BLOG_REDIRECTS)) {
      expect(target, slug).not.toBe(slug);
      expect(BLOG_REDIRECTS[target], `${slug} -> ${target}`).toBeUndefined();
    }
  });

  it("are not linked from any curated post", () => {
    for (const post of blogPosts) {
      for (const [, slug] of post.content.matchAll(/\/blog\/([a-z0-9-]+)/g)) {
        expect(BLOG_REDIRECTS[slug], `${post.slug} links to /blog/${slug}`).toBeUndefined();
      }
    }
  });
});
