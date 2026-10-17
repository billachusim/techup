import { z } from "zod";
import { SITE_URL } from "./seo";

export const OG_CACHE_CONTROL = "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";
export const ogInputSchema = z.object({
  title: z.string().trim().min(1).max(240).default("Tech Faculty NG"),
  category: z.string().trim().min(1).max(64).default("Tech skills"),
  subtitle: z.string().trim().max(320).default("Licensed technology training, career guides and opportunities across Nigeria."),
  format: z.enum(["png", "svg"]).default("png"),
});
export type OgInput = z.infer<typeof ogInputSchema>;

/** One deterministic URL shared by article metadata and BlogPosting schema. */
export function articleOgImage(post: { title: string; description: string; tags: string[] }) {
  const query = new URLSearchParams({
    title: post.title.slice(0, 240),
    category: (post.tags[0] || "Career guide").slice(0, 64),
    subtitle: post.description.slice(0, 320),
    v: "1",
  });
  return `${SITE_URL}/api/public/og?${query}`;
}

export function parseOgInput(url: URL) {
  return ogInputSchema.safeParse(Object.fromEntries(
    ["title", "category", "subtitle", "format"].flatMap((key) => {
      const value = url.searchParams.get(key);
      return value === null ? [] : [[key, value]];
    }),
  ));
}