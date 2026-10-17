import { describe, expect, it } from "vitest";
import { articleOgImage, OG_CACHE_CONTROL, parseOgInput } from "../../src/lib/og-image";
import { renderOgSvg } from "../../src/lib/og-svg";
import { pageHead, ogImage } from "../../src/lib/seo";

describe("Automated social previews", () => {
  it("gives each article an absolute encoded URL used by both share tags", () => {
    const image = articleOgImage({ title: "Cybersecurity & Nigeria 2026", description: "Pay in ₦ & USD", tags: ["Career Guide"] });
    const url = new URL(image);
    expect(url.origin + url.pathname).toBe("https://techfaculty.ng/api/public/og");
    expect(url.searchParams.get("title")).toBe("Cybersecurity & Nigeria 2026");
    expect(url.searchParams.get("category")).toBe("Career Guide");
    const head = pageHead({ title: "Salaries", description: "Pay", path: "/blog/salaries", image });
    expect(head.meta.find((m) => "property" in m && m.property === "og:image")?.content).toBe(image);
    expect(head.meta.find((m) => "name" in m && m.name === "twitter:image")?.content).toBe(image);
  });
  it("preserves explicit static department, location and SIWES previews", () => {
    for (const file of ["departments/cybersecurity.jpg", "locations/lagos.jpg", "siwes.jpg", "virtual-siwes.jpg", "siwes-success-kit.jpg"]) {
      const image = ogImage(file);
      expect(pageHead({ title: "Page", description: "Description", path: "/", image }).meta.find((m) => "property" in m && m.property === "og:image")?.content).toBe(`https://techfaculty.ng/og/${file}`);
    }
  });
  it("bounds public inputs and defaults to PNG", () => {
    const defaults = parseOgInput(new URL("https://techfaculty.ng/api/public/og"));
    expect(defaults.success && defaults.data.format).toBe("png");
    expect(parseOgInput(new URL(`https://techfaculty.ng/api/public/og?title=${"a".repeat(241)}`)).success).toBe(false);
    expect(parseOgInput(new URL("https://techfaculty.ng/api/public/og?format=html")).success).toBe(false);
  });
  it("uses the requested public cache durations", () => {
    expect(OG_CACHE_CONTROL).toBe("public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400");
  });
});