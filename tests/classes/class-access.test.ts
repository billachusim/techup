import { describe, expect, it } from "vitest";
import { canOpenClass, embedUrl } from "@/lib/class-access";

describe("class access", () => {
  it("opens past classes and the current class", () => {
    expect(canOpenClass(1, 2)).toBe(true);
    expect(canOpenClass(3, 2)).toBe(true);
  });
  it("locks future classes", () => {
    expect(canOpenClass(4, 2)).toBe(false);
    expect(canOpenClass(2, 0)).toBe(false);
  });
  it("new students open class 1 only", () => {
    expect(canOpenClass(1, 0)).toBe(true);
  });
});

describe("embedUrl", () => {
  it("embeds YouTube and Drive", () => {
    expect(embedUrl("https://www.youtube.com/watch?v=abc123")).toBe("https://www.youtube-nocookie.com/embed/abc123");
    expect(embedUrl("https://youtu.be/xyz")).toBe("https://www.youtube-nocookie.com/embed/xyz");
    expect(embedUrl("https://drive.google.com/file/d/FILEID123/view")).toBe("https://drive.google.com/file/d/FILEID123/preview");
  });
  it("returns null for other links", () => {
    expect(embedUrl("https://example.com/x")).toBeNull();
  });
});
