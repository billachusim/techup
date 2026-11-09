// One task per online class (pure; used by the generate-class-content edge
// function, the Slack class post and the AI review). Online classes have no
// tutor: the AI writes the task with the class handout, the student submits a
// link on the dashboard, the AI scores it, and a pass unlocks the next class.

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export function courseLevel(raw: unknown): CourseLevel {
  return raw === "beginner" || raw === "advanced" ? raw : "intermediate";
}

/** How often the classes of a course run (matches public.class_day_ok in the database). */
export const PACE: Record<CourseLevel, string> = {
  beginner: "3 classes a week (Mon, Wed, Fri at 6pm)",
  intermediate: "2 classes a week (Tue and Thu at 6pm)",
  advanced: "1 class a week (Tue at 6pm), with a week-long project",
};

const TIME_FOR: Record<CourseLevel, string> = {
  beginner: "30-60 minutes, done before the next class two days later",
  intermediate: "1-2 hours, done before the next class two or three days later",
  advanced:
    "a week-long project of about 6-10 hours, done before next week's class",
};

export function buildTaskPrompt(input: {
  classTitle: string;
  courseName: string;
  classNumber: number;
  level: CourseLevel;
}): string {
  return `Write the task for one online class at Tech Faculty NG, a Nigerian tech school.

COURSE: ${input.courseName}
CLASS ${input.classNumber}: ${input.classTitle}
LEVEL: ${input.level} (${PACE[input.level]})
TIME THE TASK SHOULD TAKE: ${TIME_FOR[input.level]}

Rules:
- One practical task that uses what this class teaches. The student does it alone, with a phone or laptop and free tools only.
- There is no tutor: an AI marks it from a link the student pastes on the dashboard. So the result must be something they can share as a link: a Google Doc or Sheet, a GitHub repo or live page, a Canva or Figma link, or screenshots in a Google Drive file shared with "anyone with the link".
- Say exactly what to hand in and how it will be judged (2-3 checks).
- Plain English, short sentences, no markdown headings. 60-140 words. Start with the action, e.g. "Build...", "Write...", "Use ChatGPT to...".

Return only the task text.`;
}

/** Tidies the model's reply; null when it is unusable. */
export function cleanTask(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const text = raw
    .replace(/^\s*```[a-z]*\s*|\s*```\s*$/gi, "")
    .replace(/^#+\s*/gm, "")
    .trim();
  if (text.length < 40) return null;
  return text.slice(0, 1500);
}

/** Used when the AI can't write a task, so a class is never without one. */
export function fallbackTask(input: {
  classTitle: string;
  level: CourseLevel;
}): string {
  const size =
    input.level === "advanced" ? "a small project" : "a short exercise";
  return `Do ${size} that puts "${input.classTitle}" into practice. Write what you did, step by step, in a Google Doc with screenshots of your work, set sharing to "anyone with the link can view", and paste the link on your dashboard. It is marked on: you followed this class's topic, your screenshots show real work, and you explain one thing you learned.`;
}

/** Asks the AI gateway for a task; null when it fails (callers then use fallbackTask, unsaved). */
export async function writeClassTaskWithAi(
  apiKey: string | undefined,
  input: {
    classTitle: string;
    courseName: string;
    classNumber: number;
    level: CourseLevel;
  },
  doFetch: typeof fetch = fetch,
): Promise<string | null> {
  if (!apiKey) return null;
  try {
    const res = await doFetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(45_000),
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "user", content: buildTaskPrompt(input) }],
        }),
      },
    );
    if (!res.ok) {
      console.error("AI task error:", res.status);
      return null;
    }
    const data = await res.json();
    return cleanTask(data?.choices?.[0]?.message?.content);
  } catch (e) {
    console.error("Failed to write class task:", (e as Error).message);
    return null;
  }
}

/**
 * The task for one class: the saved one, or a new AI one that is saved so
 * every student of that class gets the same task. Never throws.
 */
export async function getOrCreateClassTask(
  store: {
    get: () => Promise<string | null>;
    put: (task: string) => Promise<void>;
  },
  apiKey: string | undefined,
  input: {
    classTitle: string;
    courseName: string;
    classNumber: number;
    level: CourseLevel;
  },
  doFetch: typeof fetch = fetch,
): Promise<string> {
  try {
    const saved = await store.get();
    if (saved) return saved;
  } catch (e) {
    console.error("Class task lookup failed:", (e as Error).message);
  }
  const written = await writeClassTaskWithAi(apiKey, input, doFetch);
  if (!written) return fallbackTask(input);
  try {
    await store.put(written);
    // Two students may hit a new class at once; whoever saved first wins.
    return (await store.get()) ?? written;
  } catch {
    return written;
  }
}
