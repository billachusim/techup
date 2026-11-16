import { useCallback, useEffect, useState } from "react";
import { campuses, type Campus } from "@/data/campuses";
import { nigerianState } from "@/lib/visitor-state";
import { getSupabase } from "@/integrations/supabase/lazy";

/**
 * Location the visitor chose to share with "Find my nearest centre".
 *
 * Only asked for when the visitor taps the button (never on page load). The
 * browser's GPS position is turned into a city and state with BigDataCloud's
 * free client-side reverse geocoder, then the nearest campus is picked from the
 * campus coordinates. Only city, state and the centre slug are kept, on the
 * device (localStorage) and, for signed-in users with no saved location, in
 * profiles.location. The raw coordinates are never stored.
 */
export type DeviceLocation = {
  city: string | null;
  state: string;
  centreSlug: string;
  centreKm: number;
};

const KEY = "tf_device_location";
const EVENT = "tf-device-location";

function readSaved(): DeviceLocation | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DeviceLocation) : null;
  } catch {
    return null;
  }
}

const toRad = (d: number) => (d * Math.PI) / 180;
function km(aLat: number, aLng: number, bLat: number, bLng: number) {
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

export function nearestCampus(
  lat: number,
  lng: number,
): { campus: Campus; km: number } {
  let best = { campus: campuses[0], km: Infinity };
  for (const c of campuses) {
    const d = km(lat, lng, c.lat, c.lng);
    if (d < best.km) best = { campus: c, km: d };
  }
  return best;
}

function currentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 600000,
    }),
  );
}

async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<{ city: string | null; state: string | null }> {
  try {
    const r = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!r.ok) return { city: null, state: null };
    const d = (await r.json()) as {
      countryCode?: string;
      principalSubdivision?: string;
      city?: string;
      locality?: string;
    };
    return {
      city: d.city || d.locality || null,
      state: nigerianState(d.countryCode, d.principalSubdivision),
    };
  } catch {
    return { city: null, state: null };
  }
}

/** Save "City, State" to the signed-in user's profile when it has no location yet. */
async function saveToProfile(loc: DeviceLocation) {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("location")
      .eq("id", user.id)
      .maybeSingle();
    if (data && !data.location) {
      await supabase
        .from("profiles")
        .update({ location: [loc.city, loc.state].filter(Boolean).join(", ") })
        .eq("id", user.id);
    }
  } catch {
    /* best effort */
  }
}

export type LocateResult =
  | { ok: true; location: DeviceLocation }
  | { ok: false; reason: "unsupported" | "denied" | "outside" | "failed" };

/** Asks the browser for the position, resolves it, remembers it. Call from a click. */
export async function locateVisitor(): Promise<LocateResult> {
  if (typeof navigator === "undefined" || !navigator.geolocation)
    return { ok: false, reason: "unsupported" };
  let pos: GeolocationPosition;
  try {
    pos = await currentPosition();
  } catch (e) {
    return {
      ok: false,
      reason: (e as GeolocationPositionError)?.code === 1 ? "denied" : "failed",
    };
  }
  const { latitude: lat, longitude: lng } = pos.coords;
  const { city, state } = await reverseGeocode(lat, lng);
  if (!state) return { ok: false, reason: "outside" };
  const near = nearestCampus(lat, lng);
  const location: DeviceLocation = {
    city,
    state,
    centreSlug: near.campus.slug,
    centreKm: Math.round(near.km),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(location));
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new Event(EVENT));
  void saveToProfile(location);
  return { ok: true, location };
}

/** The shared location, or null until the visitor has tapped "Find my nearest centre". */
export function useDeviceLocation(): DeviceLocation | null {
  const [loc, setLoc] = useState<DeviceLocation | null>(null);
  const refresh = useCallback(() => setLoc(readSaved()), []);
  useEffect(() => {
    refresh();
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);
  return loc;
}
