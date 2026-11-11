// The online class loop, with no tutor in it:
//   class posted in Slack with its task -> student submits on the dashboard ->
//   AI scores it -> a pass marks the class done -> the next class (with its
//   videos and task) is posted in Slack and its Drive videos are opened.
// Physical and hybrid classes run by tutors are not touched by this.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { findProgram } from "@/data/coursePrograms";
import {
  classBriefingText,
  classGroupNoticeText,
  progressAfterAcceptedWork,
} from "@/lib/class-progress";
import {
  courseLevel,
  getOrCreateClassTask,
} from "../../supabase/functions/_shared/class-task.ts";

// class_tasks and courses.level come from a migration that generated types may not include yet.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as unknown as { from: (table: string) => any };

/** The task for one class of a course (saved, or written by the AI now). */
export async function classTaskFor(input: {
  courseId: string;
  classNumber: number;
  classTitle: string;
  courseName?: string | null;
}): Promise<string> {
  const { data: course } = await db
    .from("courses")
    .select("name, level")
    .eq("id", input.courseId)
    .maybeSingle();
  return getOrCreateClassTask(
    {
      get: async () => {
        const { data } = await db
          .from("class_tasks")
          .select("task")
          .eq("course_id", input.courseId)
          .eq("class_number", input.classNumber)
          .maybeSingle();
        return (data?.task as string | undefined) ?? null;
      },
      put: async (task) => {
        await db.from("class_tasks").upsert(
          {
            course_id: input.courseId,
            class_number: input.classNumber,
            task,
          },
          { onConflict: "course_id,class_number", ignoreDuplicates: true },
        );
      },
    },
    process.env["LOVABLE_API_KEY"],
    {
      classTitle: input.classTitle,
      courseName: input.courseName ?? course?.name ?? "Tech course",
      classNumber: input.classNumber,
      level: courseLevel(course?.level),
    },
  );
}

/**
 * Posts one class to the student's Slack class group and emails them, once per
 * class (student_class_briefings dedupes on the class key, so the dashboard
 * and the automatic queue never post the same class twice).
 */
export async function sendClassBriefing(
  userId: string,
  data: {
    classKey: string;
    classTitle: string;
    classNumber?: number;
    date?: string;
    courseId?: string;
    courseName?: string;
  },
): Promise<{ alreadySent: boolean }> {
  const { error: dup } = await supabaseAdmin
    .from("student_class_briefings")
    .insert({ user_id: userId, class_key: data.classKey });
  if (dup) return { alreadySent: true };

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("name, email, department, slack_user_id, slack_channel_id")
    .eq("id", userId)
    .maybeSingle();
  const program = findProgram(profile?.department);

  const { classVideosFor } = await import("@/lib/class-videos.server");
  const videos = await classVideosFor({
    courseId: data.courseId,
    classNumber: data.classNumber,
    classTitle: data.classTitle,
    courseName: data.courseName ?? program.title,
  });
  const task =
    data.courseId && data.classNumber
      ? await classTaskFor({
          courseId: data.courseId,
          classNumber: data.classNumber,
          classTitle: data.classTitle,
          courseName: data.courseName,
        })
      : null;

  // Full details go to the student privately; the class group only gets a tag and the class name.
  try {
    const { findSlackUserByEmail, postChannelMessage, sendDirectMessage } =
      await import("@/lib/slack.server");
    let slackUserId = profile?.slack_user_id ?? null;
    if (!slackUserId && profile?.email) {
      slackUserId = await findSlackUserByEmail(profile.email).catch(() => null);
      if (slackUserId) {
        await supabaseAdmin.from("profiles").update({ slack_user_id: slackUserId }).eq("id", userId);
      }
    }
    const hasDm = slackUserId
      ? await sendDirectMessage(
          slackUserId,
          classBriefingText({
            who: "you",
            classNumber: data.classNumber,
            classTitle: data.classTitle,
            date: data.date,
            videos,
            task,
          }),
        )
      : false;
    if (profile?.slack_channel_id) {
      const firstName = (profile.name ?? "").trim().split(/\s+/)[0] || "A student";
      await postChannelMessage(
        profile.slack_channel_id,
        classGroupNoticeText({
          who: slackUserId ? `<@${slackUserId}>` : firstName,
          classNumber: data.classNumber,
          classTitle: data.classTitle,
          hasDm,
        }),
      );
    }
  } catch (e) {
    console.error("class Slack post failed", (e as Error).message);
  }
  if (profile?.email) {
    try {
      const { sendTemplateEmail } =
        await import("@/lib/email-templates/send-email");
      await sendTemplateEmail("class-unlocked", profile.email, {
        templateData: {
          name: profile.name,
          classTitle: data.classTitle,
          programme: program.title,
          classNumber: data.classNumber,
          date: data.date,
        },
        idempotencyKey: `class-unlocked-${userId}-${data.classKey}`,
      });
    } catch (e) {
      console.error("class email failed", (e as Error).message);
    }
  }
  return { alreadySent: false };
}

/** Gives the student's Google account the Drive videos of classes 1..currentClass of a course. */
export async function openDriveVideosUpTo(input: {
  email: string;
  courseId: string;
  currentClass: number;
}): Promise<number> {
  const { data: rows } = await db
    .from("class_videos")
    .select("url")
    .eq("course_id", input.courseId)
    .eq("source", "drive")
    .lte("class_number", input.currentClass);
  const urls = ((rows ?? []) as { url: string }[]).map((r) => r.url);
  if (!urls.length) return 0;
  const { grantClassVideos } = await import("@/lib/drive-share.server");
  const r = await grantClassVideos({
    email: input.email,
    urls,
    label: `course ${input.courseId} up to class ${input.currentClass}`,
  });
  return r.granted;
}

const cleanTitle = (t: string) =>
  t.replace(/\s*-?\s*(Session|Class)\s+\d+/gi, "").slice(0, 200) ||
  "Your next class";

/**
 * Called whenever a submission is accepted (by the AI or by staff). If it is
 * the work for the student's current class, that class is marked done and the
 * next class is queued. Safe to call more than once; never throws.
 */
export async function advanceAfterAcceptedWork(
  deliverableId: string,
): Promise<"advanced" | "finished" | "unchanged"> {
  try {
    const { data: work } = await supabaseAdmin
      .from("student_deliverables")
      .select(
        "id, user_id, faculty_id, course_id, course_name, class_number, status",
      )
      .eq("id", deliverableId)
      .maybeSingle();
    if (!work || work.status !== "reviewed" || !work.class_number)
      return "unchanged";

    // Which course: the one saved with the work, else the student's course with that name.
    let courseId = work.course_id;
    if (!courseId) {
      const { data: enrolments } = await supabaseAdmin
        .from("course_enrollments")
        .select("course_id, courses(name)")
        .eq("faculty_id", work.faculty_id)
        .eq("status", "active");
      const match = (enrolments ?? []).find(
        (e) =>
          (e.courses as { name?: string } | null)?.name === work.course_name,
      );
      courseId =
        match?.course_id ??
        (enrolments?.length === 1 ? enrolments[0].course_id : null);
    }
    if (!courseId) return "unchanged";

    const [{ data: progress }, { count: totalClasses }] = await Promise.all([
      supabaseAdmin
        .from("course_progress")
        .select("id, classes_completed")
        .eq("faculty_id", work.faculty_id)
        .eq("course_id", courseId)
        .maybeSingle(),
      supabaseAdmin
        .from("lectures")
        .select("id", { count: "exact", head: true })
        .eq("course_id", courseId),
    ]);
    const step = progressAfterAcceptedWork({
      classesCompleted: progress?.classes_completed ?? 0,
      classNumber: work.class_number,
      totalClasses: totalClasses || 4,
    });
    if (!step) return "unchanged";

    const now = new Date().toISOString();
    const fields = {
      classes_completed: step.classesCompleted,
      progress_percentage: step.percent,
      last_accessed: now,
      completed_at: step.finished ? now : null,
    };
    if (progress) {
      // Only move on from the value we read, so two acceptances can't skip a class.
      const { data: moved } = await supabaseAdmin
        .from("course_progress")
        .update(fields)
        .eq("id", progress.id)
        .eq("classes_completed", progress.classes_completed ?? 0)
        .select("id")
        .maybeSingle();
      if (!moved) return "unchanged";
    } else {
      const { error } = await supabaseAdmin.from("course_progress").insert({
        faculty_id: work.faculty_id,
        course_id: courseId,
        ...fields,
      });
      if (error) return "unchanged";
    }

    await queueNextClass(work.user_id, work.faculty_id);
    return step.finished ? "finished" : "advanced";
  } catch (e) {
    console.error("advanceAfterAcceptedWork failed", (e as Error).message);
    return "unchanged";
  }
}

/** Posts the student's next unfinished class (in timetable order) to Slack and opens its Drive videos. */
export async function queueNextClass(
  userId: string,
  facultyId: string,
): Promise<void> {
  const [{ data: timetable }, { data: progress }, { data: profile }] =
    await Promise.all([
      supabaseAdmin.rpc("student_timetable", { _faculty_id: facultyId }),
      supabaseAdmin
        .from("course_progress")
        .select("course_id, classes_completed")
        .eq("faculty_id", facultyId),
      supabaseAdmin
        .from("profiles")
        .select("email")
        .eq("id", userId)
        .maybeSingle(),
    ]);
  const done = new Map(
    (progress ?? []).map((p) => [p.course_id, p.classes_completed ?? 0]),
  );
  const next = (timetable ?? []).find(
    (t) => t.class_number > (done.get(t.course_id) ?? 0),
  );
  if (!next) return;

  await sendClassBriefing(userId, {
    classKey: `${next.course_id}:${next.class_number}`,
    classTitle: cleanTitle(next.title),
    classNumber: next.class_number,
    date: new Date(next.scheduled_at).toDateString(),
    courseId: next.course_id,
    courseName: next.course_name,
  });
  if (profile?.email) {
    try {
      await openDriveVideosUpTo({
        email: profile.email,
        courseId: next.course_id,
        currentClass: next.class_number,
      });
    } catch (e) {
      console.error("opening Drive videos failed", (e as Error).message);
    }
  }
}
