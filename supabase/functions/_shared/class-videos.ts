// Video links for a class. Every class a student is sent (dashboard handout and
// the Slack "next class" post) must carry at least one working video link.
//
// Curated links come first: tutors' YouTube or Google Drive videos saved per
// class in public.class_videos (managed at /admin/class-videos). AI-suggested
// YouTube links are rewritten to YouTube searches, because the model invents
// video ids that often don't exist. If a class has no YouTube link at all, a
// search for the class topic is added, so a student is never left without one.
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

export function youtubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim())}`;
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

/** A link we can trust: http(s), and for YouTube a search page rather than an AI-guessed video id. */
function isSafeUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/** Strip "Class 3 —", "Session 2" and similar so the topic makes a good search. */
export function classTopic(classTitle: string): string {
  return classTitle
    .replace(/^\s*(class|session)\s+\d+\s*[—–:-]\s*/i, "")
    .replace(/\s*-?\s*(session|class)\s+\d+/gi, "")
    .trim();
}

/**
 * The resources list a student sees for one class: curated videos first, then
 * the AI-suggested resources (YouTube ones turned into searches), always with
 * at least one YouTube link.
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

  for (const r of opts.aiResources ?? []) {
    if (!r || typeof r.url !== "string" || typeof r.title !== "string")
      continue;
    if (
      String(r.type).toLowerCase() === "youtube" ||
      videoSource(r.url) === "youtube"
    ) {
      const alreadySearch = /youtube\.com\/results\?/.test(r.url);
      push({
        type: "youtube",
        title: r.title,
        url: alreadySearch ? r.url : youtubeSearchUrl(r.title),
      });
    } else {
      push(r);
    }
  }

  if (!out.some((r) => r.type === "youtube")) {
    const topic = classTopic(opts.classTitle) || opts.classTitle;
    const query = [
      topic,
      opts.courseName &&
      !topic.toLowerCase().includes(opts.courseName.toLowerCase())
        ? opts.courseName
        : "",
      "tutorial",
    ]
      .filter(Boolean)
      .join(" ");
    push({
      type: "youtube",
      title: `YouTube: ${topic} videos`,
      url: youtubeSearchUrl(query),
    });
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
