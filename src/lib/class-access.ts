// Pure rules for which class videos and handouts a student may open.
// A student may open every class they have reached: past classes (done) and
// their current class (completed + 1). Later classes stay locked.

export function canOpenClass(classNumber: number, classesCompleted: number): boolean {
  return Number.isInteger(classNumber) && classNumber >= 1 && classNumber <= Math.max(0, classesCompleted) + 1;
}

/** An embeddable player URL for a YouTube or Google Drive link, or null. */
export function embedUrl(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.toLowerCase().replace(/^www\.|^m\./, "");
  if (host === "youtu.be") {
    const id = u.pathname.slice(1).split("/")[0];
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "youtube.com") {
    const id = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "drive.google.com") {
    const id = u.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ?? u.searchParams.get("id");
    return id ? `https://drive.google.com/file/d/${id}/preview` : null;
  }
  return null;
}
