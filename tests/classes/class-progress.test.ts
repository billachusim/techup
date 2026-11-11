import { describe, expect, it } from "vitest";
import { classBriefingText, classGroupNoticeText, progressAfterAcceptedWork } from "@/lib/class-progress";
import {
  buildTaskPrompt,
  cleanTask,
  courseLevel,
  fallbackTask,
  getOrCreateClassTask,
} from "../../supabase/functions/_shared/class-task.ts";

describe("progressAfterAcceptedWork", () => {
  it("moves on only for the current class", () => {
    expect(progressAfterAcceptedWork({ classesCompleted: 0, classNumber: 1, totalClasses: 4 })).toEqual({
      classesCompleted: 1,
      percent: 25,
      finished: false,
    });
    expect(progressAfterAcceptedWork({ classesCompleted: 2, classNumber: 2, totalClasses: 4 })).toBeNull();
    expect(progressAfterAcceptedWork({ classesCompleted: 1, classNumber: 3, totalClasses: 4 })).toBeNull();
    expect(progressAfterAcceptedWork({ classesCompleted: 0, classNumber: null, totalClasses: 4 })).toBeNull();
  });

  it("finishes the course on the last class and never goes past it", () => {
    expect(progressAfterAcceptedWork({ classesCompleted: 3, classNumber: 4, totalClasses: 4 })).toEqual({
      classesCompleted: 4,
      percent: 100,
      finished: true,
    });
    expect(progressAfterAcceptedWork({ classesCompleted: 4, classNumber: 5, totalClasses: 4 })).toBeNull();
  });
});

describe("classBriefingText", () => {
  it("includes videos, the task and where to submit", () => {
    const text = classBriefingText({
      who: "<@U1>",
      classNumber: 2,
      classTitle: "Writing good prompts",
      date: "Wed Nov 18 2026",
      videos: ["https://youtu.be/x"],
      task: "Write three prompts.",
    });
    expect(text).toContain("Class 2 — Writing good prompts");
    expect(text).toContain("https://youtu.be/x");
    expect(text).toContain("*Your task:* Write three prompts.");
    expect(text).toContain("techfaculty.ng/dashboard");
  });

  it("points to the dashboard when the task isn't written yet", () => {
    expect(classBriefingText({ who: "Ada", classTitle: "Intro", videos: [] })).toContain("on your dashboard");
  });
});

describe("classGroupNoticeText", () => {
  it("tags the student, names the class, and points to their DMs without task or videos", () => {
    const text = classGroupNoticeText({ who: "<@U1>", classNumber: 2, classTitle: "Writing good prompts", hasDm: true });
    expect(text).toContain("<@U1>");
    expect(text).toContain("Class 2 — Writing good prompts");
    expect(text).toContain("Check your DMs");
    expect(text).not.toContain("http");
  });

  it("points to email when the DM couldn't be sent", () => {
    expect(classGroupNoticeText({ who: "Ada", classTitle: "Intro", hasDm: false })).toContain("Check your email");
  });
});

describe("class tasks", () => {
  const input = { classTitle: "Linux basics", courseName: "Cybersecurity", classNumber: 1, level: courseLevel("advanced") };

  it("reads the level safely", () => {
    expect(courseLevel("beginner")).toBe("beginner");
    expect(courseLevel(undefined)).toBe("intermediate");
  });

  it("asks for a shareable, AI-markable result sized to the level", () => {
    const prompt = buildTaskPrompt(input);
    expect(prompt).toContain("week-long project");
    expect(prompt).toContain("link");
  });

  it("cleans replies and refuses empty ones", () => {
    expect(cleanTask("```\n## Task\nBuild a page that lists five Linux commands with a screenshot of each.\n```")).toBe(
      "Task\nBuild a page that lists five Linux commands with a screenshot of each.",
    );
    expect(cleanTask("ok")).toBeNull();
    expect(fallbackTask(input)).toContain("Linux basics");
  });

  it("reuses a saved task and saves a new one", async () => {
    let saved: string | null = "Saved task";
    const store = { get: async () => saved, put: async (t: string) => void (saved = t) };
    const noFetch = (() => {
      throw new Error("should not call");
    }) as unknown as typeof fetch;
    expect(await getOrCreateClassTask(store, "k", input, noFetch)).toBe("Saved task");

    saved = null;
    const okFetch = (async () =>
      new Response(JSON.stringify({ choices: [{ message: { content: "Write a short report on file permissions with screenshots in a Google Doc." } }] }))) as unknown as typeof fetch;
    const task = await getOrCreateClassTask(store, "k", input, okFetch);
    expect(task).toContain("file permissions");
    expect(saved).toBe(task);
  });

  it("falls back without saving when the AI fails", async () => {
    let saved: string | null = null;
    const store = { get: async () => saved, put: async (t: string) => void (saved = t) };
    const badFetch = (async () => new Response("no", { status: 500 })) as unknown as typeof fetch;
    expect(await getOrCreateClassTask(store, "k", input, badFetch)).toContain("Linux basics");
    expect(saved).toBeNull();
  });
});
