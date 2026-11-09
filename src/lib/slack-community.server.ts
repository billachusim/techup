// Server side of the Slack community: weekly update and the question assistant.
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { SLACK_GENERAL_CHANNEL_ID, postChannelMessage, slackPost } from "@/lib/slack.server";
import { decideAutoAnswer } from "@/lib/whatsapp-auto-answers";
import {
  LINKS, SKIP, assistantInstructions, buildWeeklyUpdate, prioritiseRoles, roleUrl,
  type OpenRole, type SlackMessageEvent, type UpcomingEvent,
} from "@/lib/slack-community";

const MODEL = "openai/gpt-6-astra";
const db = supabaseAdmin as any;

async function loadRoles(): Promise<OpenRole[]> {
  const { data } = await db.from("talent_roles")
    .select("slug,title,company,city,is_remote,pay_text,is_featured,applications_closed")
    .eq("status", "published");
  return data ?? [];
}

async function loadEvents(): Promise<UpcomingEvent[]> {
  const { data } = await db.from("events").select("slug,title,city,starts_at")
    .eq("is_expired", false).gte("starts_at", new Date().toISOString())
    .order("is_featured", { ascending: false }).order("starts_at").limit(3);
  return data ?? [];
}

/** Posts the Monday update to #general. Once per day at most. */
export async function runWeeklyCommunityUpdate() {
  const today = new Date().toISOString().slice(0, 10);
  const key = `weekly-update-${today}`;
  const { error } = await db.from("slack_assistant_log").insert({
    event_id: key, channel_id: SLACK_GENERAL_CHANNEL_ID, thread_ts: today, status: "weekly_update",
  });
  if (error) return { posted: false, reason: "Already posted today" };
  const [roles, events] = await Promise.all([loadRoles(), loadEvents()]);
  await postChannelMessage(SLACK_GENERAL_CHANNEL_ID, buildWeeklyUpdate(roles, events));
  return { posted: true, roles: roles.length, events: events.length };
}

async function buildFacts(): Promise<string> {
  const roles = prioritiseRoles(await loadRoles());
  const auto = (q: string) => {
    const d = decideAutoAnswer(q);
    return d.kind === "answer" ? d.reply.replace(/\n\nThis is an automatic answer[\s\S]*$/, "") : "";
  };
  return [
    `Links: free bootcamp ${LINKS.freeBootcamp}; courses & fees ${LINKS.courses}; departments ${LINKS.departments}; jobs ${LINKS.careers}; events ${LINKS.events}; SIWES ${LINKS.siwes}; Virtual SIWES ${LINKS.virtualSiwes}; campuses ${LINKS.locations}; certificate check ${LINKS.verify}.`,
    "Online classes run 2-3 times a week at 6pm Lagos depending on level (beginner Mon/Wed/Fri, intermediate Tue/Thu, advanced Tue only); each student starts from class 1 on their own timetable. Every class has a task the AI tutor marks, and a pass unlocks the next class. Graduates get a verifiable Certificate of Achievement.",
    "Open roles (apply on the page; matching is automatic, selected people are added to the project Slack channel):",
    ...roles.map((r) => `- ${r.title} | ${r.company ?? ""} | ${r.is_remote ? "remote" : r.city ?? ""}${r.pay_text ? ` | pay: ${r.pay_text}` : ""} | ${roleUrl(r.slug)}`),
    "Fees:", auto("how much are your course prices"),
    "Campuses:", auto("where is your campus location"),
    "SIWES:", auto("siwes"), auto("virtual siwes online"),
  ].filter(Boolean).join("\n");
}

async function askAssistant(question: string): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not set");
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  const result = streamText({
    model: provider.responses(MODEL),
    system: assistantInstructions(await buildFacts()),
    messages: [{ role: "user", content: question }],
    providerOptions: {
      openai: { store: false, forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", include: ["reasoning.encrypted_content"] },
    },
  });
  return (await result.text).trim();
}

/** Same logic Slack events and the admin simulator use. Returns the reply, or null when it stays quiet. */
export async function draftAnswer(question: string): Promise<string | null> {
  const text = question.replace(/<@[A-Z0-9]+>/g, "").trim();
  if (!text) return null;
  const reply = await askAssistant(text);
  return !reply || reply.toUpperCase().startsWith(SKIP) ? null : reply;
}

/** Handles one verified Slack event: answers once per thread, in the thread. */
export async function handleSlackQuestion(e: SlackMessageEvent, eventId: string) {
  const threadTs = e.thread_ts ?? e.ts!;
  const { error } = await db.from("slack_assistant_log").insert({
    event_id: eventId, channel_id: e.channel, thread_ts: threadTs, user_id: e.user, question: e.text?.slice(0, 1200),
  });
  if (error) return; // duplicate delivery
  const { count } = await db.from("slack_assistant_log").select("id", { count: "exact", head: true })
    .eq("channel_id", e.channel).eq("thread_ts", threadTs).eq("status", "answered");
  if ((count ?? 0) > 0 && e.type !== "app_mention") {
    await db.from("slack_assistant_log").update({ status: "skipped_thread_answered" }).eq("event_id", eventId);
    return;
  }
  try {
    const reply = await draftAnswer(e.text ?? "");
    if (!reply) {
      await db.from("slack_assistant_log").update({ status: "skipped" }).eq("event_id", eventId);
      return;
    }
    const res = await slackPost("chat.postMessage", {
      channel: e.channel, thread_ts: threadTs, text: reply, unfurl_links: false,
      username: "Tech Faculty NG", icon_url: "https://techfaculty.ng/logo.png",
    });
    await db.from("slack_assistant_log").update({ status: res.ok ? "answered" : `post_failed:${res.error}`, answer: reply })
      .eq("event_id", eventId);
  } catch (err) {
    await db.from("slack_assistant_log").update({ status: `error:${(err as Error).message.slice(0, 200)}` }).eq("event_id", eventId);
  }
}
