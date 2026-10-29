// Class reminder emails. pg_cron calls /api/class-reminders every morning at
// 07:30 Lagos time. Each run emails every student with active access to a
// course about each of its scheduled lectures starting in the next 24 hours,
// so a class gets one reminder: the same morning, or the morning before when
// it starts before 07:30. Each email is claimed in class_reminder_sends before
// sending, so extra or overlapping calls never send the same reminder twice.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";
import { accessEnrollment } from "../../supabase/functions/_shared/enrollment-access.ts";

const HOUR = 60 * 60 * 1000;
const WINDOW = 24 * HOUR;

// The claim table comes from a migration that generated types may not include yet.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as unknown as { from: (table: string) => any };

type Lecture = {
  id: string;
  title: string;
  scheduled_at: string;
  duration_minutes: number | null;
  course_id: string;
  courses: { name: string } | { name: string }[] | null;
};
type Profile = {
  faculty_id: string;
  name: string | null;
  email: string | null;
};

/** "today, Thursday 29 October at 4:00 pm (Lagos time)" */
export function classTime(at: Date, now: Date) {
  const day = (d: Date) =>
    d.toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });
  const date = at.toLocaleDateString("en-GB", {
    timeZone: "Africa/Lagos",
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const time = at
    .toLocaleTimeString("en-US", {
      timeZone: "Africa/Lagos",
      hour: "numeric",
      minute: "2-digit",
    })
    .toLowerCase();
  const prefix =
    day(at) === day(now)
      ? "today, "
      : day(at) === day(new Date(now.getTime() + 24 * HOUR))
        ? "tomorrow, "
        : "";
  return `${prefix}${date} at ${time} (Lagos time)`;
}

export async function runClassReminders(now = new Date()) {
  const { data: lectures, error } = await supabaseAdmin
    .from("lectures")
    .select(
      "id, title, scheduled_at, duration_minutes, course_id, courses(name)",
    )
    .eq("status", "scheduled")
    .gt("scheduled_at", now.toISOString())
    .lte("scheduled_at", new Date(now.getTime() + WINDOW).toISOString())
    .order("scheduled_at", { ascending: true });
  if (error) throw new Error(`Could not load lectures: ${error.message}`);

  let sent = 0;
  let skipped = 0;
  let failed = 0;
  const classes: { lecture_id: string; title: string; sent: number }[] = [];

  for (const lecture of (lectures ?? []) as Lecture[]) {
    const { data: enrolled, error: enrolledError } = await supabaseAdmin
      .from("course_enrollments")
      .select("faculty_id")
      .eq("course_id", lecture.course_id)
      .eq("status", "active");
    if (enrolledError)
      throw new Error(
        `Could not load course students: ${enrolledError.message}`,
      );
    const ids = [...new Set((enrolled ?? []).map((e) => e.faculty_id))];
    if (!ids.length) continue;

    const [{ data: profiles }, { data: enrolments }] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("faculty_id, name, email")
        .in("faculty_id", ids),
      supabaseAdmin
        .from("enrollments")
        .select("faculty_id, status, plan_name, paid_at, created_at")
        .in("faculty_id", ids)
        .order("created_at", { ascending: false }),
    ]);
    const course = Array.isArray(lecture.courses)
      ? lecture.courses[0]
      : lecture.courses;
    const when = classTime(new Date(lecture.scheduled_at), now);
    let lectureSent = 0;

    for (const profile of (profiles ?? []) as Profile[]) {
      const own = (enrolments ?? []).filter(
        (e) => e.faculty_id === profile.faculty_id,
      );
      // Only students whose payment has gone through (or who are on a free plan).
      if (!profile.email || !accessEnrollment(own)) {
        skipped++;
        continue;
      }
      const { error: claimError } = await db
        .from("class_reminder_sends")
        .insert({
          lecture_id: lecture.id,
          faculty_id: profile.faculty_id,
          email: profile.email,
        });
      // A duplicate key means an earlier or overlapping run already sent it.
      if (claimError) {
        if (!/duplicate key/i.test(claimError.message))
          throw new Error(`Could not claim reminder: ${claimError.message}`);
        continue;
      }
      try {
        const result = await sendTemplateEmail(
          "class-reminder",
          profile.email,
          {
            templateData: {
              name: profile.name ?? undefined,
              classTitle: lecture.title,
              courseName: course?.name,
              when,
              durationMinutes: lecture.duration_minutes ?? undefined,
            },
            idempotencyKey: `class-reminder-${lecture.id}-${profile.faculty_id}`,
          },
        );
        if (result.sent) {
          sent++;
          lectureSent++;
        } else skipped++;
      } catch (e) {
        failed++;
        console.error(
          "class reminder failed",
          lecture.id,
          (e as Error).message,
        );
        // Free the claim so the next run can retry.
        await db
          .from("class_reminder_sends")
          .delete()
          .eq("lecture_id", lecture.id)
          .eq("faculty_id", profile.faculty_id);
      }
    }
    classes.push({
      lecture_id: lecture.id,
      title: lecture.title,
      sent: lectureSent,
    });
  }

  return { lectures: lectures?.length ?? 0, sent, skipped, failed, classes };
}
