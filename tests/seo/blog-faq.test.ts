import { describe, expect, it } from "vitest";
import { extractFaq } from "../../src/lib/blog-faq";
import blogPosts from "../../src/data/blogPosts";

describe("extractFaq", () => {
  it("reads ### questions under the FAQ heading and stops at the next ## heading", () => {
    const md = `## Intro\n\nText.\n\n## Frequently asked questions\n\n### Is it **free**?\nYes, see [pricing](/#pricing).\n\n### How long?\nSix months.\n\n## Next step\n\n### Not a question\nIgnored.`;
    expect(extractFaq(md)).toEqual([
      { question: "Is it free?", answer: "Yes, see pricing." },
      { question: "How long?", answer: "Six months." },
    ]);
  });

  it("returns nothing when a post has no FAQ section", () => {
    expect(extractFaq("## Intro\n\n### Heading\nText")).toEqual([]);
  });

  it("finds an FAQ in each refreshed AI-cited post", () => {
    for (const slug of [
      "siwes-allowance-nigeria-2026-itf-rates",
      "cybersecurity-salary-nigeria-2026",
      "how-to-find-siwes-placement-tech-nigeria-2026",
    ]) {
      const post = blogPosts.find((p) => p.slug === slug);
      expect(extractFaq(post!.content).length, slug).toBeGreaterThanOrEqual(3);
    }
  });
});
