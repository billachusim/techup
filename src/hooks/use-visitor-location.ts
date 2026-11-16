import { useEffect, useState } from "react";
import { foreignCountry, nigerianState } from "@/lib/visitor-state";

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

/**
 * The host passes the visitor's country (cf-ipcountry) but not their state, so for
 * visitors in Nigeria (or when the country is unknown) the state comes from a
 * browser-side GeoJS lookup (free, no key). It runs from the visitor's own connection, so the
 * free limit applies per visitor, and it is skipped for everyone outside Nigeria.
 */
async function lookupInBrowser(): Promise<{
  country?: string;
  region?: string;
} | null> {
  try {
    const r = await fetch("https://get.geojs.io/v1/ip/geo.json", {
      signal: AbortSignal.timeout(4000),
    });
    if (!r.ok) return null;
    const d = (await r.json()) as { country_code?: string; region?: string };
    return { country: d.country_code, region: d.region };
  } catch {
    return null;
  }
}

async function resolveLocation(): Promise<VisitorLocation> {
  const base: VisitorLocation = await fetch("/api/public/visitor-state")
    .then((r) => (r.ok ? r.json() : EMPTY))
    .then((d: Partial<VisitorLocation>) => ({
      state: d.state ?? null,
      country: d.country ?? null,
      cc: d.cc ?? null,
    }))
    .catch(() => EMPTY);
  if (base.state || (base.cc && base.cc !== "NG")) return base;
  const ext = await lookupInBrowser();
  if (!ext) return base;
  const cc = base.cc ?? ext.country ?? null;
  return {
    state: nigerianState(cc, ext.region),
    country: foreignCountry(cc),
    cc,
  };
}

export function fetchVisitorLocation(): Promise<VisitorLocation> {
  if (typeof window === "undefined") return Promise.resolve(EMPTY);
  pending ??= resolveLocation();
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
