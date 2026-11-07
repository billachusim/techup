// Gives one student access to one class's Drive videos, and nothing else.
// Class videos stay "Restricted" in Google Drive. When a student reaches a
// class (the Slack "next class" post), the server asks our Google Apps Script
// (scripts/drive-share/Code.gs, deployed in the Tech Faculty Google account
// that owns the videos) to add that student's email as a Viewer on just that
// class's Drive files. Students never get a folder, so later classes stay
// closed until they reach them.
//
// Needs two secrets: DRIVE_SHARE_URL (the Apps Script web app URL) and
// DRIVE_SHARE_SECRET (the same value saved in the script's properties).
// Without them this does nothing, so the rest of the class post still goes out.
import { driveFileId } from "../../supabase/functions/_shared/class-videos.ts";

export async function grantClassVideos(opts: {
  email?: string | null;
  urls: string[];
  label?: string;
}): Promise<{ granted: number; skipped?: string }> {
  const endpoint = process.env["DRIVE_SHARE_URL"]?.trim();
  const secret = process.env["DRIVE_SHARE_SECRET"]?.trim();
  const fileIds = [
    ...new Set(opts.urls.map(driveFileId).filter((x): x is string => !!x)),
  ];
  if (!fileIds.length) return { granted: 0, skipped: "no drive videos" };
  if (!opts.email) return { granted: 0, skipped: "no email" };
  if (!endpoint || !secret) return { granted: 0, skipped: "not configured" };
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        secret,
        action: "grant",
        email: opts.email.trim().toLowerCase(),
        fileIds,
        label: opts.label ?? "",
      }),
      redirect: "follow",
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      granted?: number;
      error?: string;
    };
    if (!data.ok) {
      console.error("drive share failed", data.error ?? res.status);
      return { granted: 0, skipped: data.error ?? `http ${res.status}` };
    }
    return { granted: data.granted ?? fileIds.length };
  } catch (e) {
    console.error("drive share failed", (e as Error).message);
    return { granted: 0, skipped: (e as Error).message };
  }
}
