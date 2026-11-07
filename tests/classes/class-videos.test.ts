import { describe, expect, it } from "vitest";
import {
  classResources,
  parseVideoLine,
  slackVideoLines,
  videoSource,
} from "../../supabase/functions/_shared/class-videos";

describe("class video links", () => {
  it("shows no made-up video when none is saved", () => {
    const r = classResources({
      classTitle: "Web Development Basics",
      aiResources: [],
    });
    expect(r).toEqual([]);
  });

  it("puts saved videos first and keeps AI reading links", () => {
    const r = classResources({
      classTitle: "Linux permissions",
      curated: [
        {
          title: "Week 1 day 2",
          url: "https://drive.google.com/file/d/abc/view",
        },
        {
          title: "Linux permissions explained",
          url: "https://www.youtube.com/watch?v=real1",
        },
      ],
      aiResources: [
        { type: "documentation", title: "Docs", url: "https://linux.die.net" },
      ],
    });
    expect(r.map((x) => x.type)).toEqual(["drive", "youtube", "documentation"]);
  });

  it("drops AI-guessed YouTube links and unsafe links", () => {
    const r = classResources({
      classTitle: "Nmap",
      aiResources: [
        {
          type: "youtube",
          title: "Nmap tutorial",
          url: "https://www.youtube.com/watch?v=FAKE123",
        },
        { type: "website", title: "Guessed", url: "https://youtu.be/FAKE" },
        { type: "website", title: "bad", url: "javascript:alert(1)" },
      ],
    });
    expect(r).toEqual([]);
  });

  it("formats Slack lines for videos only", () => {
    const lines = slackVideoLines([
      { type: "drive", title: "Day <1>", url: "https://drive.google.com/x" },
      { type: "documentation", title: "Docs", url: "https://d" },
    ]);
    expect(lines).toEqual(["• <https://drive.google.com/x|Day 1>"]);
  });

  it("detects sources", () => {
    expect(videoSource("https://m.youtube.com/watch?v=1")).toBe("youtube");
    expect(videoSource("https://drive.google.com/file/d/1")).toBe("drive");
    expect(videoSource("https://vimeo.com/1")).toBe("other");
  });

  it("parses pasted admin lines", () => {
    expect(parseVideoLine("3 | Recon | https://drive.google.com/a")).toEqual({
      class_number: 3,
      title: "Recon",
      url: "https://drive.google.com/a",
    });
    expect(parseVideoLine("x | Recon | https://a")).toBeNull();
    expect(parseVideoLine("3 | Recon | ftp://a")).toBeNull();
  });
});
