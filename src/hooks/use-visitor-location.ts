import { useEffect, useState } from "react";

/**
 * Visitor location from Cloudflare's IP lookup, answered by the worker at
 * /api/public/visitor-state (see src/server.ts). Fetched once per page load
 * and shared by every component that asks.
 *
 * - state:   Nigerian state name ("Anambra", "Abuja"…) for visitors in Nigeria
 * - country: ISO code for visitors outside Nigeria
 * - cc:      raw ISO country code, or null when Cloudflare gave none
 */
export type VisitorLocation = {
  state: string | null;
  country: string | null;
  cc: string | null;
};

const EMPTY: VisitorLocation = { state: null, country: null, cc: null };
let pending: Promise<VisitorLocation> | null = null;

export function fetchVisitorLocation(): Promise<VisitorLocation> {
  if (typeof window === "undefined") return Promise.resolve(EMPTY);
  pending ??= fetch("/api/public/visitor-state")
    .then((r) => (r.ok ? r.json() : EMPTY))
    .then((d: Partial<VisitorLocation>) => ({
      state: d.state ?? null,
      country: d.country ?? null,
      cc: d.cc ?? null,
    }))
    .catch(() => EMPTY);
  return pending;
}

export function useVisitorLocation(): VisitorLocation {
  const [loc, setLoc] = useState<VisitorLocation>(EMPTY);
  useEffect(() => {
    let cancelled = false;
    fetchVisitorLocation().then((l) => {
      if (!cancelled) setLoc(l);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return loc;
}
