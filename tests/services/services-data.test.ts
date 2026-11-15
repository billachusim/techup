import { describe, expect, it } from "vitest";
import {
  PRICE_TIERS,
  SERVICES,
  SERVICE_CATEGORIES,
  businessPrice,
  talentPay,
} from "../../src/data/services";
import blogPosts from "../../src/data/blogPosts";
import { blogCategories } from "../../src/data/blogCategories";
import { extractFaq } from "../../src/lib/blog-faq";

describe("pay-per-task services", () => {
  it("has 100+ services with unique slugs in known categories", () => {
    expect(SERVICES.length).toBeGreaterThanOrEqual(100);
    expect(new Set(SERVICES.map((s) => s.slug)).size).toBe(SERVICES.length);
    const cats = new Set(SERVICE_CATEGORIES.map((c) => c.slug));
    for (const s of SERVICES) expect(cats.has(s.category), s.slug).toBe(true);
  });

  it("never uses a slug that clashes with the category route", () => {
    expect(SERVICES.some((s) => s.slug === "category")).toBe(false);
  });

  it("charges businesses more than talent earns for every task", () => {
    for (const s of SERVICES)
      expect(businessPrice(s), s.slug).toBeGreaterThan(talentPay(s));
    expect(PRICE_TIERS.small.talentPay).toBe(5_000);
    expect(PRICE_TIERS.big.talentPay).toBe(10_000);
  });

  it("gives every category a guide post with a valid blog category and an FAQ", () => {
    const names = new Set(blogCategories.map((c) => c.name));
    for (const c of SERVICE_CATEGORIES) {
      const post = blogPosts.find((p) => p.slug === c.blogSlug);
      expect(post, c.blogSlug).toBeDefined();
      expect(names.has(post!.tags[0]), c.blogSlug).toBe(true);
      expect(extractFaq(post!.content).length).toBeGreaterThanOrEqual(3);
    }
  });
});
