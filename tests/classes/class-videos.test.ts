import { describe, expect, it } from "vitest";
import {
  classResources,
  classTopic,
  parseVideoLine,
  slackVideoLines,
  videoSource,
  youtubeSearchUrl,
} from "../../supabase/functions/_shared/class-videos";

describe("class video links", () => {
  it("always gives a class at least one YouTube link", () => {
    const r = classResources({
      classTitle: "Class 1 — Web Development Basics",
      courseName: "General Tech",
      aiResources: [],
    });
    expect(r).toHaveLength(1);
    expect(r[0].type).toBe("youtube");
    expect(r[0].url).toBe(
      youtubeSearchUrl("Web Development Basics General Tech tutorial"),
    );
  });

  it("puts curated tutor videos first and keeps Drive links", () => {
    const r = classResources({
      classTitle: "Linux permissions",
      curated: [
        {
          title: "Week 1 day 2",
          url: "https://drive.google.com/file/d/abc/view",
        },
      ],
      aiResources: [
        { type: "documentation", title: "Docs", url: "https://linux.die.net" },
      ],
    });
    expect(r.map((x) => x.type)).toEqual(["drive", "documentation", "youtube"]);
  });

  it("does not add a search when a curated YouTube video exists", () => {
    const r = classResources({
      classTitle: "HTML",
      curated: [{ title: "HTML intro", url: "https://youtu.be/xyz" }],
    });
    expect(r).toEqual([
      { type: "youtube", title: "HTML intro", url: "https://youtu.be/xyz" },
    ]);
  });

  it("turns AI-guessed YouTube video ids into searches and drops unsafe links", () => {
    const r = classResources({
      classTitle: "Nmap",
      aiResources: [
        {
          type: "youtube",
          title: "Nmap tutorial - NetworkChuck",
          url: "https://www.youtube.com/watch?v=FAKE123",
        },
        { type: "website", title: "bad", url: "javascript:alert(1)" },
      ],
    });
    expect(r).toEqual([
      {
        type: "youtube",
        title: "Nmap tutorial - NetworkChuck",
        url: youtubeSearchUrl("Nmap tutorial - NetworkChuck"),
      },
    ]);
  });

  it("formats Slack lines for videos only", () => {
    const lines = slackVideoLines([
      { type: "drive", title: "Day <1>", url: "https://drive.google.com/x" },
      { type: "documentation", title: "Docs", url: "https://d" },
    ]);
    expect(lines).toEqual(["• <https://drive.google.com/x|Day 1>"]);
  });

  it("detects sources and topics", () => {
    expect(videoSource("https://m.youtube.com/watch?v=1")).toBe("youtube");
    expect(videoSource("https://drive.google.com/file/d/1")).toBe("drive");
    expect(videoSource("https://vimeo.com/1")).toBe("other");
    expect(classTopic("Class 2 — Network Security Fundamentals")).toBe(
      "Network Security Fundamentals",
    );
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
