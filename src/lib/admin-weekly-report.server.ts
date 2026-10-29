// Weekly report for staff: what the site and admins got done in the last 7 days,
// and what is still waiting. pg_cron calls /api/admin-weekly-report every Monday.
// The week is claimed in admin_weekly_report_sends before sending, so extra calls
// never send a second email.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";
import { needsYouTodayRows, type NeedsYouTodayCounts } from "@/lib/needs-you-today";

export type ReportRow = { label: string; count: number; path: string; detail?: string };

const DAY = 24 * 3600 * 1000;
const MATCHED = ["approved", "accepted", "assessment", "interview", "hired", "onboarded", "offer_sent", "shortlisted", "interviewed"];
const SELECTED = ["accepted", "hired", "onboarded"];

const ACTION_LABEL: Record<string, string> = {
  "payment.marked_paid": "Payments marked paid",
  "payment.balance_marked_paid": "Instalment balances marked paid",
  "enrollment.status_changed": "Enrolment status changes",
  "enrollment.cancelled": "Enrolments cancelled",
  "certificate.issued": "Certificates issued",
  "lead.status_changed": "Lead status updates",
  "lead.auto_converted": "Leads marked enrolled automatically (they enrolled)",
  "lead.auto_archived": "Silent leads archived automatically",
  "referral.reward_paid": "Referral rewards paid",
  "slack.channel_created": "Project Slack channels created",
  "talent.auto_approved": "Talent profiles approved automatically",
};

const names = (rows: { title: string }[] | null, max = 5) => {
  const list = (rows ?? []).map((r) => r.title);
  if (!list.length) return undefined;
  return list.slice(0, max).join(", ") + (list.length > max ? ` and ${list.length - max} more` : "");
};

async function count(q: PromiseLike<{ count: number | null }>) {
  return (await q).count ?? 0;
}

export async function buildWeeklyReport(now = new Date()) {
  const since = new Date(now.getTime() - 7 * DAY).toISOString();
  const head = { count: "exact" as const, head: true };

  const [autoMatches, promotedOrManual, selected, joinedPool, projectInvites, approvedTalent, audit, jobRuns] = await Promise.all([
    count(supabaseAdmin.from("role_matches").select("id", head).eq("source", "auto").gte("created_at", since)),
    count(supabaseAdmin.from("role_matches").select("id", head).neq("source", "auto").in("status", MATCHED).gte("updated_at", since)),
    count(supabaseAdmin.from("role_matches").select("id", head).in("status", SELECTED).gte("updated_at", since)),
    count(supabaseAdmin.from("talent_profiles").select("id", head).gte("slack_general_joined_at", since)),
    count(supabaseAdmin.from("role_matches").select("id", head).gte("slack_invited_at", since)),
    count(supabaseAdmin.from("talent_profiles").select("id", head).gte("vetted_at", since)),
    supabaseAdmin.from("admin_audit_log").select("action").gte("created_at", since).limit(5000),
    supabaseAdmin.from("scheduled_job_runs").select("job, success").gte("ran_at", since).limit(1000),
  ]);

  const done: ReportRow[] = [
    { label: "Talent auto-matched to roles", count: autoMatches, path: "/admin/talent" },
    { label: "AI or manual matches approved", count: promotedOrManual, path: "/admin/talent" },
    { label: "Talent selected for projects", count: selected, path: "/admin/talent" },
    { label: "Talent approved in total", count: approvedTalent, path: "/admin/talent" },
    { label: "Added to the Slack talent channel", count: joinedPool, path: "/admin/talent" },
    { label: "Added to project Slack channels", count: projectInvites, path: "/admin/talent" },
  ];
  const byAction = new Map<string, number>();
  for (const row of audit.data ?? []) byAction.set(row.action, (byAction.get(row.action) ?? 0) + 1);
  for (const [action, label] of Object.entries(ACTION_LABEL)) {
    done.push({ label, count: byAction.get(action) ?? 0, path: "/admin/activity" });
  }

  const [needs, suggested, unvetted, noWhatsApp, noSlack, notInSlack] = await Promise.all([
    supabaseAdmin.rpc("needs_you_today_counts"),
    count(supabaseAdmin.from("role_matches").select("id", head).eq("status", "suggested")),
    count(supabaseAdmin.from("talent_profiles").select("id", head).eq("is_vetted", false)),
    supabaseAdmin.from("talent_roles").select("title").eq("status", "published").is("whatsapp_group_url", null),
    supabaseAdmin.from("talent_roles").select("title").eq("status", "published").is("slack_channel_id", null).is("slack_channel_url", null),
    supabaseAdmin
      .from("role_matches")
      .select("talent_profile_id, talent_profiles!inner(slack_user_id)")
      .in("status", MATCHED)
      .is("talent_profiles.slack_user_id", null)
      .limit(1000),
  ]);

  const todo: ReportRow[] = [
    ...(needs.data ? needsYouTodayRows(needs.data as unknown as NeedsYouTodayCounts) : []),
    { label: "AI match suggestions below the threshold to review", count: suggested, path: "/admin/talent" },
    { label: "Talent profiles not approved yet (under 70% strength or un-vetted by staff)", count: unvetted, path: "/admin/talent" },
    {
      label: "Open roles without a WhatsApp group link",
      count: noWhatsApp.data?.length ?? 0,
      path: "/admin/talent",
      detail: names(noWhatsApp.data),
    },
    {
      label: "Open roles whose Slack channel couldn't be created",
      count: noSlack.data?.length ?? 0,
      path: "/admin/talent",
      detail: names(noSlack.data),
    },
    {
      label: "Matched talent not in the Slack workspace yet (emailed the join link)",
      count: new Set((notInSlack.data ?? []).map((r) => r.talent_profile_id)).size,
      path: "/admin/talent",
    },
  ];

  const failedJobs = [...new Set((jobRuns.data ?? []).filter((r) => !r.success).map((r) => r.job))];
  if (failedJobs.length) {
    todo.push({ label: "Scheduled jobs that failed this week", count: failedJobs.length, path: "/admin", detail: failedJobs.join(", ") });
  }

  return { since, done: done.filter((r) => r.count > 0), todo: todo.filter((r) => r.count > 0) };
}

/** Plain-text version for Slack. */
export function weeklyReportText(report: { done: ReportRow[]; todo: ReportRow[] }) {
  const line = (r: ReportRow) => `• ${r.count} ${r.label.toLowerCase()}${r.detail ? ` (${r.detail})` : ""}`;
  return [
    "*Tech Faculty weekly admin report*",
    "*Done in the last 7 days*",
    ...(report.done.length ? report.done.map(line) : ["• Nothing recorded"]),
    "*Still to do*",
    ...(report.todo.length ? report.todo.map(line) : ["• Nothing waiting"]),
    "https://techfaculty.ng/admin",
  ].join("\n");
}

export async function runWeeklyReport() {
  const report = await buildWeeklyReport();
  const week = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });
  const { error: claimed } = await supabaseAdmin
    .from("admin_weekly_report_sends")
    .insert({ week_of: week, report });
  if (claimed) return { status: "already_sent" as const, week };

  try {
    await sendTemplateEmail("admin-weekly-report", "", {
      templateData: { done: report.done, todo: report.todo },
      idempotencyKey: `admin-weekly-report-${week}`,
    });
  } catch (e) {
    // Free the week so a later call can retry.
    await supabaseAdmin.from("admin_weekly_report_sends").delete().eq("week_of", week);
    throw e;
  }

  // Optional Slack copy, to the channel set in SLACK_REPORTS_CHANNEL_ID.
  const channel = process.env["SLACK_REPORTS_CHANNEL_ID"];
  if (channel) {
    const { postChannelMessage } = await import("@/lib/slack.server");
    await postChannelMessage(channel, weeklyReportText(report));
  }
  return { status: "sent" as const, week, done: report.done.length, todo: report.todo.length };
}
