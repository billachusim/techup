import { createFileRoute } from "@tanstack/react-router";
import { shouldConsider, type SlackMessageEvent } from "@/lib/slack-community";

// Slack Events API for the Tech Faculty NG app. Verifies Slack's signature, acks fast,
// answers questions in the background.
async function validSignature(secret: string, ts: string, raw: string, sig: string) {
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`v0:${ts}:${raw}`));
  const expected = "v0=" + [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

export const Route = createFileRoute("/api/public/slack/events")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        let body: { type?: string; challenge?: string; event_id?: string; event?: SlackMessageEvent };
        try { body = JSON.parse(raw); } catch { return new Response("Bad request", { status: 400 }); }
        if (body.type === "url_verification") return Response.json({ challenge: body.challenge });
        if (request.headers.get("x-slack-retry-num")) return new Response("ok");

        const secret = process.env["SLACK_SIGNING_SECRET"];
        if (!secret) return new Response("ok");
        const ok = await validSignature(secret, request.headers.get("x-slack-request-timestamp") ?? "0", raw, request.headers.get("x-slack-signature") ?? "");
        if (!ok) return new Response("Unauthorized", { status: 401 });

        const e = body.event;
        const excluded = (process.env["SLACK_ASSISTANT_EXCLUDED_CHANNELS"] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
        if (body.type === "event_callback" && e && body.event_id && shouldConsider(e, { excludedChannelIds: excluded })) {
          const { runAfterResponse } = await import("@/lib/worker-ctx");
          const { handleSlackQuestion } = await import("@/lib/slack-community.server");
          await runAfterResponse(() => handleSlackQuestion(e, body.event_id!));
        }
        return new Response("ok");
      },
    },
  },
});
