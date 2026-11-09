// Pure rules for moving an online student on to their next class
// (see class-progress.server.ts). Online classes run without a tutor: when the
// AI (or staff) accepts the work for the student's current class, that class
// is marked done and the next one is queued in their Slack class group.

export type ProgressStep = {
  classesCompleted: number;
  percent: number;
  finished: boolean;
};

/**
 * The progress after accepted work for `classNumber`. Only work for the
 * current class (completed + 1) moves the student on; work for a class already
 * done, or for a later class, changes nothing (null).
 */
export function progressAfterAcceptedWork(input: {
  classesCompleted: number;
  classNumber: number | null;
  totalClasses: number;
}): ProgressStep | null {
  const total = Math.max(1, input.totalClasses);
  const done = Math.max(0, input.classesCompleted);
  if (!input.classNumber || input.classNumber !== done + 1 || done >= total)
    return null;
  const classesCompleted = input.classNumber;
  return {
    classesCompleted,
    percent: Math.min(100, Math.round((classesCompleted / total) * 100)),
    finished: classesCompleted >= total,
  };
}

/** The Slack post that queues a class: title, date, videos, and the task to hand in. */
export function classBriefingText(input: {
  who: string;
  classNumber?: number;
  classTitle: string;
  date?: string;
  videos: string[];
  task?: string | null;
}): string {
  const head = `:books: Next class for ${input.who}: *${input.classNumber ? `Class ${input.classNumber} — ` : ""}${input.classTitle}*${input.date ? ` (${input.date})` : ""}.`;
  const videos = input.videos.length
    ? `\n:tv: Class videos:\n${input.videos.join("\n")}`
    : "";
  const task = input.task?.trim()
    ? `\n:pencil: *Your task:* ${input.task.trim()}`
    : "\n:pencil: Your task for this class is on your dashboard.";
  return (
    head +
    videos +
    task +
    "\nSubmit it here: https://techfaculty.ng/dashboard. The AI tutor marks it in a few minutes, and when it passes your next class unlocks."
  );
}
