// Server side of class video links: loads a class's curated tutor videos and
// cached AI resources, then applies the shared rule in
// supabase/functions/_shared/class-videos.ts (always at least one YouTube link).
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  classResources,
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

/** Slack bullet lines for a class's videos; never empty. */
export async function classVideosFor(
  opts: Parameters<typeof classResourcesFor>[0],
): Promise<string[]> {
  return slackVideoLines(await classResourcesFor(opts));
}
