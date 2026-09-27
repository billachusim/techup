// Server-only Slack helpers. Calls go through the Lovable connector gateway.
const GATEWAY = "https://connector-gateway.lovable.dev/slack/api";

/** The workspace-wide channel every vetted talent is added to. */
export const SLACK_GENERAL_CHANNEL_ID = process.env["SLACK_GENERAL_CHANNEL_ID"] || "C05DJTURDM4";

type SlackResponse = Record<string, any> & { ok: boolean; error?: string };

async function call(method: string, init: { query?: Record<string, string>; body?: Record<string, unknown> }): Promise<SlackResponse> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const slackKey = process.env["SLACK_API_KEY"];
  if (!lovableKey) throw new Error("LOVABLE_API_KEY is not configured");
  if (!slackKey) throw new Error("Slack is not connected for this project");

  const qs = init.query ? `?${new URLSearchParams(init.query).toString()}` : "";
  const headers: Record<string, string> = {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": slackKey,
  };
  if (init.body) headers["Content-Type"] = "application/json; charset=utf-8";

  const res = await fetch(`${GATEWAY}/${method}${qs}`, {
    method: "POST",
    headers,
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  const raw = await res.text();
  let data: SlackResponse;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`Slack ${method} returned an unexpected response (HTTP ${res.status})`);
  }
  if (!res.ok) throw new Error(`Slack ${method} failed [${res.status}]: ${raw.slice(0, 300)}`);
  return data;
}

export const slackGet = (method: string, query?: Record<string, string>) => call(method, { query });
export const slackPost = (method: string, body?: Record<string, unknown>) => call(method, { body });

export interface SlackChannel {
  id: string;
  name: string;
  is_private: boolean;
  num_members?: number;
}

/** All channels the bot can see (public + private channels it was invited to). */
export async function listChannels(): Promise<SlackChannel[]> {
  const out: SlackChannel[] = [];
  let cursor = "";
  do {
    const query: Record<string, string> = { limit: "200", types: "public_channel,private_channel", exclude_archived: "true" };
    if (cursor) query.cursor = cursor;
    const page = await slackGet("conversations.list", query);
    if (!page.ok) throw new Error(`Slack channel list failed: ${page.error}`);
    for (const c of page.channels ?? []) {
      out.push({ id: c.id, name: c.name, is_private: !!c.is_private, num_members: c.num_members });
    }
    cursor = page.response_metadata?.next_cursor ?? "";
  } while (cursor);
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/** Resolves a talent's Slack member id from their email address. */
export async function findSlackUserByEmail(email?: string | null): Promise<string | null> {
  if (!email) return null;
  const res = await slackGet("users.lookupByEmail", { email });
  if (res.ok) return res.user?.id ?? null;
  if (res.error === "users_not_found") return null;
  throw new Error(`Slack user lookup failed: ${res.error}`);
}

export type InviteOutcome = "invited" | "already_in_channel" | "no_slack_account";

/** Adds a Slack member to a channel. Treats "already there" as success. */
export async function inviteToChannel(channelId: string, slackUserId: string): Promise<InviteOutcome> {
  let res = await slackPost("conversations.invite", { channel: channelId, users: slackUserId });
  if (!res.ok && res.error === "not_in_channel") {
    // Public channels: the app can add itself first, then invite.
    const joined = await slackPost("conversations.join", { channel: channelId });
    if (joined.ok) res = await slackPost("conversations.invite", { channel: channelId, users: slackUserId });
  }
  if (res.ok) return "invited";
  if (res.error === "already_in_channel") return "already_in_channel";
  if (res.error === "not_in_channel" || res.error === "channel_not_found") {
    throw new Error("Add the Tech Faculty app to that channel in Slack first, then try again.");
  }
  throw new Error(`Slack invite failed: ${res.error}`);
}

/** Best-effort channel announcement; never blocks the main flow. */
export async function postChannelMessage(channelId: string, text: string): Promise<void> {
  try {
    const res = await slackPost("chat.postMessage", { channel: channelId, text, unfurl_links: false });
    if (!res.ok) console.error("slack chat.postMessage failed", res.error);
  } catch (e) {
    console.error("slack chat.postMessage error", (e as Error).message);
  }
}
