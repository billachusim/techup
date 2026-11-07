// Video links for a class. Every class a student is sent (dashboard handout and
// the Slack "next class" post) carries the real videos saved for it in
// public.class_videos (managed at /admin/class-videos): our own Google Drive
// class videos and hand-checked YouTube videos. AI-suggested YouTube links are
// never shown, because the model invents video ids that often don't exist.
// Plain data with no imports, so the app and the edge functions share one rule.

export interface ClassResource {
  type: string;
  title: string;
  url: string;
}

export interface CuratedVideo {
  title: string;
  url: string;
  source?: string | null;
}

export function videoSource(url: string): "youtube" | "drive" | "other" {
  let host = "";
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return "other";
  }
  if (
    host === "youtu.be" ||
    host === "youtube.com" ||
    host.endsWith(".youtube.com")
  )
    return "youtube";
  if (host === "drive.google.com" || host === "docs.google.com") return "drive";
  return "other";
}

/** Only http(s) links. */
function isSafeUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * The resources list a student sees for one class: real curated videos first
 * (our Drive videos and checked YouTube videos), then AI-suggested non-video
 * reading.
 */
export function classResources(opts: {
  classTitle: string;
  courseName?: string | null;
  curated?: CuratedVideo[] | null;
  aiResources?: ClassResource[] | null;
}): ClassResource[] {
  const out: ClassResource[] = [];
  const seen = new Set<string>();
  const push = (r: ClassResource) => {
    if (!r.url || !isSafeUrl(r.url) || seen.has(r.url)) return;
    seen.add(r.url);
    out.push(r);
  };

  for (const v of opts.curated ?? []) {
    const source = v.source || videoSource(v.url);
    push({
      type:
        source === "youtube"
          ? "youtube"
          : source === "drive"
            ? "drive"
            : "video",
      title: v.title,
      url: v.url,
    });
  }

  // AI-suggested YouTube links are left out: the model guesses video ids
  // that often don't exist. Real videos come only from class_videos.
  for (const r of opts.aiResources ?? []) {
    if (!r || typeof r.url !== "string" || typeof r.title !== "string")
      continue;
    if (
      String(r.type).toLowerCase() === "youtube" ||
      videoSource(r.url) === "youtube"
    )
      continue;
    push(r);
  }

  return out;
}

/** Slack lines for the class videos (curated first, at most `max`). */
export function slackVideoLines(resources: ClassResource[], max = 5): string[] {
  return resources
    .filter(
      (r) => r.type === "youtube" || r.type === "drive" || r.type === "video",
    )
    .slice(0, max)
    .map((r) => `• <${r.url}|${r.title.replace(/[<>|]/g, "")}>`);
}

/** "3 | Linux file permissions | https://..." → one row; returns null for blank or bad lines. */
export function parseVideoLine(
  line: string,
): { class_number: number; title: string; url: string } | null {
  const parts = line.split("|").map((p) => p.trim());
  if (parts.length < 3) return null;
  const n = Number.parseInt(parts[0], 10);
  const url = parts.slice(2).join("|").trim();
  if (
    !Number.isInteger(n) ||
    n < 1 ||
    n > 52 ||
    !parts[1] ||
    !/^https?:\/\//i.test(url)
  )
    return null;
  return { class_number: n, title: parts[1], url };
}

/**
 * The Google Drive file id in a Drive link, or null for any other link.
 * Handles /file/d/<id>/..., open?id=<id> and uc?id=<id>.
 */
export function driveFileId(url: string): string | null {
  if (videoSource(url) !== "drive") return null;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const m = u.pathname.match(/\/(?:file\/)?d\/([A-Za-z0-9_-]{10,})/);
  const id = m?.[1] ?? u.searchParams.get("id");
  return id && /^[A-Za-z0-9_-]{10,}$/.test(id) ? id : null;
}

export interface Lesson {
  month: number;
  week: number;
  day: number;
}

/** "month1week3day2_topic.mp4", "Month2-Week3-Day1.mp4", "M1 wk3 day2" → lesson; else null. */
export function parseLessonName(name: string): Lesson | null {
  const m = name
    .toLowerCase()
    .match(/m(?:onth)?\s*[-_ ]?\s*(\d{1,2}).*?w(?:ee)?k?\s*[-_ ]?\s*(\d{1,2}).*?d(?:ay)?\s*[-_ ]?\s*(\d{1,2})/);
  if (!m) return null;
  const [month, week, day] = [m[1], m[2], m[3]].map(Number);
  if (!month || !week || !day || week > 6 || day > 7) return null;
  return { month, week, day };
}

const lessonOrder = (l: Lesson) => l.month * 100 + l.week * 10 + l.day;

/**
 * Which course and class a new lesson video belongs to, judged from the videos
 * already attached from the same folder: the sibling from the same month and
 * week, else the closest earlier lesson, else the closest later one.
 */
export function pickClassFor(
  target: Lesson,
  siblings: (Lesson & { course_id: string; class_number: number })[],
): { course_id: string; class_number: number } | null {
  if (!siblings.length) return null;
  const same = siblings.find(
    (s) => s.month === target.month && s.week === target.week,
  );
  const t = lessonOrder(target);
  const earlier = siblings
    .filter((s) => lessonOrder(s) <= t)
    .sort((a, b) => lessonOrder(b) - lessonOrder(a))[0];
  const later = siblings
    .filter((s) => lessonOrder(s) > t)
    .sort((a, b) => lessonOrder(a) - lessonOrder(b))[0];
  const pick = same ?? earlier ?? later;
  return pick ? { course_id: pick.course_id, class_number: pick.class_number } : null;
}

export function lessonTitle(l: Lesson): string {
  return `Tech Faculty: Month ${l.month} Week ${l.week} Day ${l.day} class video`;
}
