// AI review of student work. The student's dashboard asks for it right after a
// submission, and pg_cron calls /api/ai-work-review every 5 minutes for anything
// that was missed. A confident review is applied straight away (score, feedback,
// accepted or needs changes) and the student is emailed; an unsure one is kept
// as a draft for staff. Staff can change any AI review on /admin/students.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  MAX_ATTEMPTS,
  MIN_CONFIDENCE,
  buildReviewPrompt,
  isFetchableUrl,
  pageText,
  parseReview,
  type AiReview,
  type WorkForReview,
} from "@/lib/ai-work-review";

const MODEL = "openai/gpt-6-astra";
/** A submission stuck in "running" this long (crashed worker) is picked up again. */
const STALE_RUNNING_MS = 10 * 60 * 1000;

/** Fetches the proof link as text, following at most 3 redirects to public hosts only. */
async function fetchProof(raw: string | null): Promise<{ text: string; status: string } | null> {
  let url = raw;
  for (let hop = 0; hop < 4 && url; hop++) {
    if (!isFetchableUrl(url)) return null;
    try {
      const res = await fetch(url, {
        redirect: "manual",
        signal: AbortSignal.timeout(8000),
        headers: { "User-Agent": "TechFacultyReviewer/1.0 (+https://techfaculty.ng)", Accept: "text/html,text/plain,application/json;q=0.9,*/*;q=0.5" },
      });
      if (res.status >= 300 && res.status < 400) {
        const next = res.headers.get("location");
        url = next ? new URL(next, url).toString() : null;
        continue;
      }
      const type = res.headers.get("content-type") ?? "";
      if (!/text|html|json|xml|markdown/i.test(type)) return { text: `(a ${type || "binary"} file, not readable as text)`, status: `HTTP ${res.status}` };
      const body = (await res.text()).slice(0, 300_000);
      return { text: pageText(body, type), status: `HTTP ${res.status}` };
    } catch (e) {
      return { text: `(could not open: ${(e as Error).name})`, status: "error" };
    }
  }
  return null;
}

async function askAi(work: WorkForReview): Promise<AiReview | null> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("LOVABLE_API_KEY is not set");
  const page = await fetchProof(work.proof_url);
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(60_000),
    body: JSON.stringify({
      model: MODEL,
      reasoning_effort: "low",
      messages: [{ role: "user", content: buildReviewPrompt(work, page) }],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) throw new Error(`AI gateway ${res.status}`);
  const json = await res.json();
  return parseReview(json?.choices?.[0]?.message?.content ?? "");
}

function waitingForAi(row: { status: string; ai_status: string; ai_attempts: number; ai_reviewed_at: string | null }) {
  if (row.status !== "submitted" || row.ai_attempts >= MAX_ATTEMPTS) return false;
  if (row.ai_status === "pending" || row.ai_status === "failed") return true;
  return row.ai_status === "running" && (!row.ai_reviewed_at || Date.now() - new Date(row.ai_reviewed_at).getTime() > STALE_RUNNING_MS);
}

export type AiReviewOutcome = "applied" | "needs_staff" | "failed" | "not_claimed";

/** Scores one submission if it is still waiting for the AI. Safe to call more than once. */
export async function aiReviewSubmission(id: string): Promise<AiReviewOutcome> {
  const { data: row } = await supabaseAdmin
    .from("student_deliverables")
    .select("id, user_id, faculty_id, title, summary, proof_url, course_name, class_number, status, ai_status, ai_attempts, ai_reviewed_at")
    .eq("id", id)
    .maybeSingle();
  if (!row || !waitingForAi(row)) return "not_claimed";

  // Claim it, so the dashboard call and the cron never score the same work twice.
  // The attempt is counted up front, so work that crashes the AI call is retried at most MAX_ATTEMPTS times.
  const attempts = row.ai_attempts + 1;
  const { data: claimed } = await supabaseAdmin
    .from("student_deliverables")
    .update({ ai_status: "running", ai_attempts: attempts, ai_reviewed_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "submitted")
    .eq("ai_status", row.ai_status)
    .eq("ai_attempts", row.ai_attempts)
    .select("id, user_id, faculty_id, title, summary, proof_url, course_name, class_number")
    .maybeSingle();
  if (!claimed) return "not_claimed";

  let review: AiReview | null = null;
  try {
    review = await askAi(claimed);
  } catch (e) {
    console.error("AI work review failed", (e as Error).message);
  }
  if (!review) {
    await supabaseAdmin
      .from("student_deliverables")
      .update({ ai_status: attempts >= MAX_ATTEMPTS ? "needs_staff" : "failed" })
      .eq("id", id);
    return "failed";
  }

  const confident = review.confidence >= MIN_CONFIDENCE;
  const now = new Date().toISOString();
  const aiFields = {
    ai_score: review.score,
    ai_verdict: review.verdict,
    ai_feedback: review.feedback,
    ai_confidence: review.confidence,
    ai_reviewed_at: now,
  };

  if (!confident) {
    await supabaseAdmin.from("student_deliverables").update({ ...aiFields, ai_status: "needs_staff" }).eq("id", id);
    return "needs_staff";
  }

  // Only apply if staff haven't reviewed it while the AI was thinking.
  const { data: applied } = await supabaseAdmin
    .from("student_deliverables")
    .update({
      ...aiFields,
      ai_status: "done",
      status: review.verdict,
      score: review.score,
      reviewer_note: review.feedback,
      reviewed_at: now,
      reviewed_by: "ai",
    })
    .eq("id", id)
    .eq("status", "submitted")
    .select("id")
    .maybeSingle();
  if (!applied) {
    await supabaseAdmin.from("student_deliverables").update({ ...aiFields, ai_status: "skipped" }).eq("id", id);
    return "not_claimed";
  }

  const { data: profile } = await supabaseAdmin.from("profiles").select("name").eq("id", claimed.user_id).maybeSingle();
  const { error: auditError } = await supabaseAdmin.from("admin_audit_log").insert({
    actor_id: null,
    actor_email: "automation",
    action: "work.ai_reviewed",
    target_table: "student_deliverables",
    target_id: id,
    faculty_id: claimed.faculty_id,
    subject: profile?.name ?? null,
    details: {
      title: claimed.title,
      to: review.verdict === "reviewed" ? "accepted" : "needs changes",
      score: review.score,
      confidence: review.confidence,
    },
  });
  if (auditError) console.error("Couldn't write admin audit log", auditError.message);

  const { notifyStudentReviewed } = await import("@/lib/student-review.server");
  await notifyStudentReviewed({
    id,
    user_id: claimed.user_id,
    title: claimed.title,
    status: review.verdict,
    score: review.score,
    note: review.feedback,
    byAi: true,
  });
  return "applied";
}

/** Cron safety net: scores up to 10 submissions the instant review missed. */
export async function runAiWorkReviewSweep() {
  const started = Date.now();
  const staleBefore = new Date(started - STALE_RUNNING_MS).toISOString();
  // Leave brand-new work to the dashboard call that is probably running now.
  const settled = new Date(started - 60_000).toISOString();
  const { data: rows, error } = await supabaseAdmin
    .from("student_deliverables")
    .select("id")
    .eq("status", "submitted")
    .lt("ai_attempts", MAX_ATTEMPTS)
    .lt("created_at", settled)
    .or(`ai_status.in.(pending,failed),and(ai_status.eq.running,ai_reviewed_at.lt.${staleBefore})`)
    .order("created_at", { ascending: true })
    .limit(10);
  if (error) throw new Error(error.message);

  const outcomes: Record<AiReviewOutcome, number> = { applied: 0, needs_staff: 0, failed: 0, not_claimed: 0 };
  for (const row of rows ?? []) outcomes[await aiReviewSubmission(row.id)]++;

  const items = (rows ?? []).length;
  if (items > 0) {
    await supabaseAdmin.from("scheduled_job_runs").insert({
      job: "ai-work-review",
      trigger: "cron",
      success: outcomes.failed === 0,
      items,
      report: outcomes,
      duration_ms: Date.now() - started,
    });
  }
  return { checked: items, ...outcomes };
}
