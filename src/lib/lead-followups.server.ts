// Sends the lead follow-up emails (copy and timing in src/lib/lead-followups.ts).
// pg_cron calls /api/lead-followups every hour. Each run:
// 1. starts a sequence for every recent lead with an email address, one per
//    address however many forms that person fills in, and
// 2. sends each email that is due, claiming it on its row first so extra or
//    overlapping calls never send the same email twice.
import { accessEnrollment } from "../../supabase/functions/_shared/enrollment-access.ts";
import {
  CLOSED_STATUSES,
  ENROL_WINDOW_MS,
  LEAD_REPLY_TO,
  SITE,
  followupDueAt,
  followupEmail,
  isSendingHour,
  normaliseEmail,
  startsSequence,
  type LeadForSequence,
} from "@/lib/lead-followups";

// The table comes from a migration that generated types may not include yet.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = { from: (table: string) => any };

export type SendEmail = (
  template: string,
  to: string,
  options: {
    templateData: Record<string, unknown>;
    idempotencyKey: string;
    replyTo?: string;
  },
) => Promise<{ sent: boolean }>;

type Lead = LeadForSequence & { id: string; name: string | null };
type Followup = {
  email: string;
  lead_id: string;
  interest: string;
  name: string | null;
  lead_created_at: string;
  steps_sent: number;
  next_due_at: string | null;
  unsubscribe_token: string;
};

const BATCH = 50;

async function startSequences(db: Db, now: number) {
  const { data: leads, error } = await db
    .from("leads")
    .select("id, name, email, interest, status, created_at, whatsapp_opt_in, email_marketing_opt_in")
    .not("email", "is", null)
    .gte("created_at", new Date(now - ENROL_WINDOW_MS).toISOString())
    .order("created_at", { ascending: true })
    .limit(500);
  if (error) throw new Error(`Could not load leads: ${error.message}`);

  // Oldest first, so a person's first enquiry sets their sequence.
  const candidates = new Map<string, Lead>();
  for (const lead of (leads ?? []) as Lead[]) {
    if (!startsSequence(lead, now)) continue;
    if (!lead.email) continue;
    const email = normaliseEmail(lead.email);
    if (!candidates.has(email)) candidates.set(email, lead);
  }
  if (!candidates.size) return 0;

  const { data: existing, error: existingError } = await db
    .from("lead_email_followups")
    .select("email")
    .in("email", [...candidates.keys()]);
  if (existingError)
    throw new Error(`Could not load follow-ups: ${existingError.message}`);
  const known = new Set(
    ((existing ?? []) as { email: string }[]).map((r) => r.email),
  );

  let started = 0;
  for (const [email, lead] of candidates) {
    if (known.has(email)) continue;
    const { error: insertError } = await db
      .from("lead_email_followups")
      .insert({
        email,
        lead_id: lead.id,
        interest: lead.interest,
        name: lead.name,
        lead_created_at: lead.created_at,
        steps_sent: 0,
        next_due_at: followupDueAt(lead.created_at, 0, now),
      });
    // A duplicate key means an overlapping run started it first.
    if (insertError && !/duplicate key/i.test(insertError.message)) {
      throw new Error(
        `Could not start follow-up for a lead: ${insertError.message}`,
      );
    }
    if (!insertError) started++;
  }
  return started;
}

/** Why this person should get no more emails, or null to carry on. */
async function stopReason(db: Db, email: string): Promise<string | null> {
  // Lead forms and sign-up both store email addresses lower-cased.
  const { data: leads } = await db
    .from("leads")
    .select("status, email_marketing_opt_in")
    .eq("email", email);
  if (!leads?.some((lead: { email_marketing_opt_in?: boolean }) => lead.email_marketing_opt_in === true)) return "no_email_consent";
  if (
    ((leads ?? []) as { status: string }[]).some((l) =>
      CLOSED_STATUSES.has(l.status),
    )
  )
    return "lead_closed";

  const { data: profile } = await db
    .from("profiles")
    .select("faculty_id")
    .eq("email", email)
    .maybeSingle();
  if (profile?.faculty_id) {
    const { data: enrolments } = await db
      .from("enrollments")
      .select("status, plan_name, paid_at")
      .eq("faculty_id", profile.faculty_id);
    if (accessEnrollment(enrolments ?? [])) return "enrolled";
  }
  return null;
}

async function stop(db: Db, row: Followup, reason: string) {
  await db
    .from("lead_email_followups")
    .update({
      stopped_at: new Date().toISOString(),
      stop_reason: reason,
      next_due_at: null,
    })
    .eq("email", row.email)
    .is("stopped_at", null);
}

async function sendDue(db: Db, send: SendEmail, now: number) {
  const { data: due, error } = await db
    .from("lead_email_followups")
    .select(
      "email, lead_id, interest, name, lead_created_at, steps_sent, next_due_at, unsubscribe_token",
    )
    .is("stopped_at", null)
    .lte("next_due_at", new Date(now).toISOString())
    .order("next_due_at", { ascending: true })
    .limit(BATCH);
  if (error) throw new Error(`Could not load due follow-ups: ${error.message}`);

  const result = { sent: 0, stopped: 0, failed: 0 };
  for (const row of (due ?? []) as Followup[]) {
    const step = row.steps_sent;
    const email = followupEmail(row.interest, step);
    if (!email) {
      await stop(db, row, "completed");
      continue;
    }
    const reason = await stopReason(db, row.email);
    if (reason) {
      await stop(db, row, reason);
      result.stopped++;
      continue;
    }

    // Claim this step: only the run that moves steps_sent on from `step` sends it.
    const nextDue = followupDueAt(row.lead_created_at, step + 1, now);
    const sentAt = new Date(now).toISOString();
    const { data: claimed } = await db
      .from("lead_email_followups")
      .update({
        steps_sent: step + 1,
        last_sent_at: sentAt,
        next_due_at: nextDue,
        ...(nextDue ? {} : { stopped_at: sentAt, stop_reason: "completed" }),
      })
      .eq("email", row.email)
      .eq("steps_sent", step)
      .is("stopped_at", null)
      .select("email")
      .maybeSingle();
    if (!claimed) continue;

    try {
      const outcome = await send("lead-follow-up", row.email, {
        templateData: {
          name: row.name,
          interest: row.interest,
          step,
          unsubscribeUrl: `${SITE}/api/lead-unsubscribe?t=${row.unsubscribe_token}`,
        },
        idempotencyKey: `lead-follow-up-${row.lead_id}-${step}`,
        replyTo: LEAD_REPLY_TO,
      });
      if (outcome.sent) result.sent++;
      else {
        // The address has bounced or complained before; stop writing to it.
        await stop(db, row, "suppressed");
        result.stopped++;
      }
    } catch (e) {
      console.error(
        "lead follow-up email failed",
        row.email,
        (e as Error).message,
      );
      // Put the step back and try again in an hour.
      await db
        .from("lead_email_followups")
        .update({
          steps_sent: step,
          next_due_at: new Date(now + 60 * 60 * 1000).toISOString(),
          stopped_at: null,
          stop_reason: null,
        })
        .eq("email", row.email)
        .eq("steps_sent", step + 1);
      result.failed++;
    }
  }
  return result;
}

export async function runLeadFollowups(
  db: Db,
  send: SendEmail,
  now = Date.now(),
  provider: "disabled" | "dedicated-marketing" = "disabled",
) {
  if (provider !== "dedicated-marketing") {
    return { started: 0, sent: 0, stopped: 0, failed: 0, quietHours: false, blocked: true };
  }
  const started = await startSequences(db, now);
  if (!isSendingHour(now))
    return { started, sent: 0, stopped: 0, failed: 0, quietHours: true };
  return { started, ...(await sendDue(db, send, now)), quietHours: false };
}

/** Unsubscribe link handler: true when the token matched a sequence. */
export async function unsubscribeLeadFollowups(db: Db, token: string) {
  if (!/^[0-9a-f-]{36}$/i.test(token)) return false;
  const { data } = await db
    .from("lead_email_followups")
    .update({
      stopped_at: new Date().toISOString(),
      stop_reason: "unsubscribed",
      next_due_at: null,
    })
    .eq("unsubscribe_token", token)
    .select("email")
    .maybeSingle();
  return !!data;
}
