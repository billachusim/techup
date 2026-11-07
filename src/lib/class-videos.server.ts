// Server side of class video links: loads a class's curated tutor videos and
// cached AI resources, then applies the shared rule in
// supabase/functions/_shared/class-videos.ts (real saved videos only).
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  classResources,
  lessonTitle,
  parseLessonName,
  pickClassFor,
  slackVideoLines,
  type ClassResource,
} from "../../supabase/functions/_shared/class-videos.ts";

// class_videos comes from a migration that generated types may not include yet.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as unknown as { from: (table: string) => any };

export async function classResourcesFor(opts: {
  courseId?: string;
  classNumber?: number;
  classTitle: string;
  courseName?: string | null;
}): Promise<ClassResource[]> {
  let curated: { title: string; url: string; source: string | null }[] = [];
  let aiResources: ClassResource[] = [];
  if (opts.courseId && opts.classNumber) {
    try {
      const [{ data: videos }, { data: cached }] = await Promise.all([
        db
          .from("class_videos")
          .select("title, url, source")
          .eq("course_id", opts.courseId)
          .eq("class_number", opts.classNumber)
          .order("position", { ascending: true })
          .order("created_at", { ascending: true }),
        db
          .from("ai_class_content")
          .select("resources")
          .eq("course_id", opts.courseId)
          .eq("class_number", opts.classNumber)
          .maybeSingle(),
      ]);
      curated = videos ?? [];
      aiResources = Array.isArray(cached?.resources)
        ? (cached.resources as ClassResource[])
        : [];
    } catch (e) {
      console.error("class videos lookup failed", (e as Error).message);
    }
  }
  return classResources({
    classTitle: opts.classTitle,
    courseName: opts.courseName,
    curated,
    aiResources,
  });
}

/** Slack bullet lines for a class's saved videos (empty when none are saved). */
export async function classVideosFor(
  opts: Parameters<typeof classResourcesFor>[0],
): Promise<string[]> {
  return slackVideoLines(await classResourcesFor(opts));
}

const FILE_ID = /^[A-Za-z0-9_-]{10,}$/;

/**
 * Attach a newly uploaded lesson video to its class. Its course and class
 * come from the same folder's videos already in class_videos (same month and
 * week, else the nearest lesson). Returns why it was skipped otherwise.
 */
export async function ingestLessonVideo(input: {
  fileId?: string;
  name?: string;
  siblings?: { fileId?: string; name?: string }[];
}): Promise<{ ok: boolean; skipped?: string; course_id?: string; class_number?: number }> {
  const fileId = String(input.fileId ?? "");
  if (!FILE_ID.test(fileId)) return { ok: false, skipped: "bad fileId" };
  const lesson = parseLessonName(String(input.name ?? ""));
  if (!lesson) return { ok: false, skipped: "name has no month/week/day" };

  const sibs = (input.siblings ?? [])
    .map((s) => ({ fileId: String(s.fileId ?? ""), lesson: parseLessonName(String(s.name ?? "")) }))
    .filter((s) => FILE_ID.test(s.fileId) && s.fileId !== fileId && s.lesson)
    .slice(0, 300);
  if (!sibs.length) return { ok: false, skipped: "no dated videos in folder" };

  const { data: rows } = await db
    .from("class_videos")
    .select("course_id, class_number, url")
    .eq("source", "drive")
    .or(sibs.map((s) => `url.ilike.%${s.fileId}%`).join(","));
  const known = ((rows ?? []) as { course_id: string; class_number: number; url: string }[])
    .map((r) => {
      const s = sibs.find((x) => r.url.includes(x.fileId));
      return s?.lesson ? { ...s.lesson, course_id: r.course_id, class_number: r.class_number } : null;
    })
    .filter((x): x is NonNullable<typeof x> => !!x);
  const target = pickClassFor(lesson, known);
  if (!target) return { ok: false, skipped: "folder has no attached videos yet" };

  const { data: existing } = await db
    .from("class_videos")
    .select("id")
    .eq("course_id", target.course_id)
    .eq("class_number", target.class_number);
  const { error } = await db.from("class_videos").upsert(
    {
      course_id: target.course_id,
      class_number: target.class_number,
      title: lessonTitle(lesson),
      url: `https://drive.google.com/file/d/${fileId}/view`,
      source: "drive",
      position: (existing ?? []).length,
    },
    { onConflict: "course_id,class_number,url" },
  );
  if (error) return { ok: false, skipped: error.message };
  return { ok: true, ...target };
}
