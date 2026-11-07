import { createFileRoute } from "@tanstack/react-router";

function sameKey(a: string, b: string) {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

// Called by our Google Apps Script (scripts/drive-share/Code.gs, watchFolders)
// when a tutor uploads a new lesson video, e.g. month1week3day2_topic.mp4, to a
// watched class folder. It attaches the video to the right class in
// class_videos, judged from the folder's videos already attached. Students then
// get it when they reach that class (openClassVideos). Same secret as the
// Drive share script; anyone else is refused.
export const Route = createFileRoute("/api/class-videos/ingest")({
  server: {
    handlers: {
      // Safe setup check: says whether the server can see the secrets, and the
      // secret's length, never its value.
      GET: async () => {
        const secret = (process.env["DRIVE_SHARE_SECRET"] ?? "").trim();
        return Response.json({
          secret_set: secret.length > 0,
          secret_length: secret.length,
          share_url_set: !!process.env["DRIVE_SHARE_URL"],
        });
      },
      POST: async ({ request }) => {
        const secret = (process.env["DRIVE_SHARE_SECRET"] ?? "").trim();
        const given = (request.headers.get("x-drive-share-secret") ?? "").trim();
        if (!secret || !given || !sameKey(given, secret)) {
          return Response.json({ error: "Not allowed" }, { status: 401 });
        }
        const body = (await request.json().catch(() => null)) as {
          fileId?: string;
          name?: string;
          course?: string;
          siblings?: { fileId?: string; name?: string }[];
        } | null;
        const { ingestLessonVideo } = await import("@/lib/class-videos.server");
        try {
          return Response.json(await ingestLessonVideo(body ?? {}));
        } catch (e) {
          console.error("class video ingest error", (e as Error).message);
          return Response.json({ ok: false, error: "Could not attach video" }, { status: 500 });
        }
      },
    },
  },
});
