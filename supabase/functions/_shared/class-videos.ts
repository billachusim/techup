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
