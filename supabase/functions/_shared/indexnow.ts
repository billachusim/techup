// IndexNow tells Bing, Yandex, Seznam, Naver and others that pages changed, so
// new posts are crawled within hours instead of waiting for the next sitemap read.
// The key is public by design: it must match public/<key>.txt on the site.
export const SITE_HOST = "techfaculty.ng";
export const SITE_ORIGIN = `https://${SITE_HOST}`;
export const INDEXNOW_KEY = "edd1c3dc92d28e9245350eaa0017f29d";

const MAX_URLS = 10_000;

/** Ping IndexNow with absolute techfaculty.ng URLs or site paths. Never throws. */
export async function pingIndexNow(urlsOrPaths: string[]): Promise<{ ok: boolean; status?: number; sent: number; error?: string }> {
  const urls = [...new Set(
    urlsOrPaths
      .map((u) => (u.startsWith("/") ? `${SITE_ORIGIN}${u}` : u))
      .filter((u) => {
        try {
          return new URL(u).host === SITE_HOST;
        } catch {
          return false;
        }
      }),
  )].slice(0, MAX_URLS);
  if (urls.length === 0) return { ok: true, sent: 0 };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: SITE_HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });
    // 200 and 202 both mean accepted.
    return { ok: res.ok, status: res.status, sent: urls.length };
  } catch (error) {
    console.error("IndexNow ping failed", error);
    return { ok: false, sent: urls.length, error: String(error) };
  }
}
