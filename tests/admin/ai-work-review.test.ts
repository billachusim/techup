import { describe, expect, it } from "vitest";
import { buildReviewPrompt, isFetchableUrl, pageText, parseReview, PASS_MARK } from "../../src/lib/ai-work-review";

describe("parseReview", () => {
  it("reads a clean JSON reply", () => {
    expect(parseReview('{"score":82,"verdict":"reviewed","feedback":"Nice work.","confidence":0.9}')).toEqual({
      score: 82, verdict: "reviewed", feedback: "Nice work.", confidence: 0.9,
    });
  });

  it("reads fenced JSON and clamps numbers", () => {
    const r = parseReview('```json\n{"score":140,"verdict":"reviewed","feedback":"Great","confidence":3}\n```');
    expect(r?.score).toBe(100);
    expect(r?.confidence).toBe(1);
  });

  it("never accepts work under the pass mark", () => {
    expect(parseReview(`{"score":${PASS_MARK - 1},"verdict":"reviewed","feedback":"ok","confidence":0.9}`)?.verdict).toBe("needs_changes");
  });

  it("treats anything but 'reviewed' as needs changes, and missing confidence as unsure", () => {
    const r = parseReview('{"score":90,"verdict":"accepted","feedback":"ok"}');
    expect(r?.verdict).toBe("needs_changes");
    expect(r?.confidence).toBe(0);
  });

  it("rejects replies without a score or feedback", () => {
    expect(parseReview("not json")).toBeNull();
    expect(parseReview('{"score":"high","feedback":"x"}')).toBeNull();
    expect(parseReview('{"score":70,"feedback":"  "}')).toBeNull();
  });
});

describe("isFetchableUrl", () => {
  it("allows public web links", () => {
    expect(isFetchableUrl("https://github.com/ada/todo-app")).toBe(true);
    expect(isFetchableUrl("http://ada.netlify.app/")).toBe(true);
  });

  it("refuses private, local and odd links", () => {
    for (const url of [
      null, "", "not a url", "ftp://example.com/x", "file:///etc/passwd", "http://localhost:3000",
      "http://127.0.0.1/", "http://10.1.2.3/", "http://192.168.0.1/", "http://172.20.0.1/", "http://169.254.169.254/latest",
      "http://[::1]/", "https://user:pass@example.com/", "http://intranet/", "http://printer.local/",
    ]) {
      expect(isFetchableUrl(url), String(url)).toBe(false);
    }
  });
});

describe("pageText", () => {
  it("strips scripts, styles and tags from HTML", () => {
    const html = "<html><style>p{}</style><script>alert(1)</script><h1>My &amp; app</h1><p>Hello\n\n world</p></html>";
    expect(pageText(html, "text/html; charset=utf-8")).toBe("My & app Hello world");
  });

  it("keeps plain text and cuts it short", () => {
    expect(pageText("a".repeat(50), "text/plain", 10)).toBe("a".repeat(10));
  });
});

describe("buildReviewPrompt", () => {
  it("includes the work and says when the link wasn't opened", () => {
    const p = buildReviewPrompt({ title: "Todo app", summary: null, proof_url: null, course_name: "Web Dev", class_number: 3 }, null);
    expect(p).toContain("TITLE: Todo app");
    expect(p).toContain("CLASS: 3");
    expect(p).toContain("The link was not opened.");
  });
});
