import processModule from "node:process";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/slack.server-BqTd8c5e.js
var GATEWAY = "https://connector-gateway.lovable.dev/slack/api";
/** The workspace-wide channel every vetted talent is added to. */
var SLACK_GENERAL_CHANNEL_ID = processModule.env["SLACK_GENERAL_CHANNEL_ID"] || "C05DJTURDM4";
async function call(method, init) {
	const lovableKey = processModule.env["LOVABLE_API_KEY"];
	const slackKey = processModule.env["SLACK_API_KEY"];
	if (!lovableKey) throw new Error("LOVABLE_API_KEY is not configured");
	if (!slackKey) throw new Error("Slack is not connected for this project");
	const qs = init.query ? `?${new URLSearchParams(init.query).toString()}` : "";
	const headers = {
		Authorization: `Bearer ${lovableKey}`,
		"X-Connection-Api-Key": slackKey
	};
	if (init.body) headers["Content-Type"] = "application/json; charset=utf-8";
	const res = await fetch(`${GATEWAY}/${method}${qs}`, {
		method: "POST",
		headers,
		body: init.body ? JSON.stringify(init.body) : void 0
	});
	const raw = await res.text();
	let data;
	try {
		data = JSON.parse(raw);
	} catch {
		throw new Error(`Slack ${method} returned an unexpected response (HTTP ${res.status})`);
	}
	if (!res.ok) throw new Error(`Slack ${method} failed [${res.status}]: ${raw.slice(0, 300)}`);
	return data;
}
var slackGet = (method, query) => call(method, { query });
var slackPost = (method, body) => call(method, { body });
/** All channels the bot can see (public + private channels it was invited to). */
async function listChannels() {
	const out = [];
	let cursor = "";
	do {
		const query = {
			limit: "200",
			types: "public_channel,private_channel",
			exclude_archived: "true"
		};
		if (cursor) query.cursor = cursor;
		const page = await slackGet("conversations.list", query);
		if (!page.ok) throw new Error(`Slack channel list failed: ${page.error}`);
		for (const c of page.channels ?? []) out.push({
			id: c.id,
			name: c.name,
			is_private: !!c.is_private,
			num_members: c.num_members
		});
		cursor = page.response_metadata?.next_cursor ?? "";
	} while (cursor);
	return out.sort((a, b) => a.name.localeCompare(b.name));
}
/**
* Finds a channel by name, creating it if it does not exist yet.
* Used for rolling student course cohort channels (#course-ai-web-dev etc).
*/
async function ensureChannel(name, topic) {
	const clean = name.replace(/^#/, "").toLowerCase();
	const existing = (await listChannels()).find((c) => c.name === clean);
	if (existing) return existing;
	const created = await slackPost("conversations.create", {
		name: clean,
		is_private: false
	});
	if (!created.ok || !created.channel) throw new Error(`Could not create #${clean}: ${created.error}`);
	const channel = {
		id: created.channel.id,
		name: created.channel.name,
		is_private: !!created.channel.is_private
	};
	if (topic) {
		await slackPost("conversations.setPurpose", {
			channel: channel.id,
			purpose: topic
		});
		await slackPost("conversations.setTopic", {
			channel: channel.id,
			topic
		});
	}
	return channel;
}
/** Resolves a talent's Slack member id from their email address. */
async function findSlackUserByEmail(email) {
	if (!email) return null;
	const res = await slackGet("users.lookupByEmail", { email });
	if (res.ok) return res.user?.id ?? null;
	if (res.error === "users_not_found") return null;
	throw new Error(`Slack user lookup failed: ${res.error}`);
}
/** Adds a Slack member to a channel. Treats "already there" as success. */
async function inviteToChannel(channelId, slackUserId) {
	let res = await slackPost("conversations.invite", {
		channel: channelId,
		users: slackUserId
	});
	if (!res.ok && res.error === "not_in_channel") {
		if ((await slackPost("conversations.join", { channel: channelId })).ok) res = await slackPost("conversations.invite", {
			channel: channelId,
			users: slackUserId
		});
	}
	if (res.ok) return "invited";
	if (res.error === "already_in_channel") return "already_in_channel";
	if (res.error === "not_in_channel" || res.error === "channel_not_found") throw new Error("Add the Tech Faculty app to that channel in Slack first, then try again.");
	throw new Error(`Slack invite failed: ${res.error}`);
}
/** Best-effort channel announcement; never blocks the main flow. */
async function postChannelMessage(channelId, text) {
	try {
		const res = await slackPost("chat.postMessage", {
			channel: channelId,
			text,
			unfurl_links: false
		});
		if (!res.ok) console.error("slack chat.postMessage failed", res.error);
	} catch (e) {
		console.error("slack chat.postMessage error", e.message);
	}
}
//#endregion
export { SLACK_GENERAL_CHANNEL_ID, ensureChannel, findSlackUserByEmail, inviteToChannel, listChannels, postChannelMessage };
