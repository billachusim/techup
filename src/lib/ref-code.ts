// The ?ref=CODE a visitor arrived with: a field rep's code or a graduate's
// referral code. It is kept in the browser so a later sign-up, lead form or
// enrolment still credits whoever sent them, and the newest link wins.

export const REF_STORAGE_KEY = "tf_referral_code";
const REF_PATTERN = /^[A-Z0-9-]{3,24}$/;

/** The code in its stored form, or null if it can't be one. */
export function normalizeRef(raw: string | null | undefined): string | null {
  const code = (raw ?? "").trim().toUpperCase();
  return REF_PATTERN.test(code) ? code : null;
}

/** Saves ?ref= from the current URL, if there is one, and returns it. */
export function captureRefFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const code = normalizeRef(
    new URLSearchParams(window.location.search).get("ref"),
  );
  if (code) {
    try {
      localStorage.setItem(REF_STORAGE_KEY, code);
    } catch {
      // Storage can be blocked; the code still counts on this page.
    }
  }
  return code;
}

/** The code from this page's link, else the one saved from an earlier visit. */
export function getStoredRef(): string | null {
  if (typeof window === "undefined") return null;
  const fromLink = normalizeRef(
    new URLSearchParams(window.location.search).get("ref"),
  );
  if (fromLink) return fromLink;
  try {
    return normalizeRef(localStorage.getItem(REF_STORAGE_KEY));
  } catch {
    return null;
  }
}
