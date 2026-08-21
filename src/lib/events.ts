import { supabase } from "@/integrations/supabase/client";

export type TechEvent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  format: string;
  organizer: string;
  venue_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
  starts_at: string | null;
  ends_at: string | null;
  date_text: string | null;
  timezone: string | null;
  is_free: boolean;
  price_text: string | null;
  currency: string | null;
  source_platform: string;
  source_url: string;
  image_url: string | null;
  tags: string[];
  is_featured: boolean;
  last_seen_at: string;
};

export const EVENT_CATEGORIES = [
  { value: "CONFERENCE", label: "Conferences" },
  { value: "SUMMIT", label: "Summits" },
  { value: "MEETUP", label: "Meetups" },
  { value: "WORKSHOP", label: "Workshops" },
  { value: "HACKATHON", label: "Hackathons" },
  { value: "WEBINAR", label: "Webinars" },
  { value: "BOOTCAMP", label: "Bootcamps" },
  { value: "CAREER_FAIR", label: "Career fairs" },
];

export const EVENT_FORMATS = [
  { value: "IN_PERSON", label: "In person" },
  { value: "VIRTUAL", label: "Online" },
  { value: "HYBRID", label: "Hybrid" },
];

export function categoryLabel(value: string) {
  return EVENT_CATEGORIES.find((c) => c.value === value)?.label.replace(/s$/, "") ?? "Event";
}

export function formatLabel(value: string) {
  return EVENT_FORMATS.find((f) => f.value === value)?.label ?? "In person";
}

export function locationLabel(event: TechEvent) {
  if (event.format === "VIRTUAL") return "Online";
  const parts = [event.city, event.state].filter(Boolean);
  if (parts.length) return parts.join(", ");
  return event.venue_name ?? "Venue announced by organiser";
}

export function dateLabel(event: TechEvent) {
  if (event.starts_at) {
    const start = new Date(event.starts_at);
    const opts: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    const base = start.toLocaleDateString("en-NG", opts);
    const time = start.toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit" });
    return `${base} · ${time} WAT`;
  }
  return event.date_text ?? "Date announced by organiser";
}

export function priceLabel(event: TechEvent) {
  if (event.is_free) return "Free";
  return event.price_text ?? null;
}

/** Nigeria/Africa and online events first, then soonest start date. */
const LOCAL_HINTS = ["nigeria", "ng", "africa", "ghana", "kenya", "rwanda", "za"];

export function localFirst(a: TechEvent, b: TechEvent) {
  const score = (e: TechEvent) => {
    if (e.is_featured) return -1;
    const hay = `${e.country ?? ""} ${e.city ?? ""}`.toLowerCase();
    if (LOCAL_HINTS.some((h) => hay.includes(h))) return 0;
    return e.format === "VIRTUAL" ? 1 : 2;
  };
  const diff = score(a) - score(b);
  if (diff !== 0) return diff;
  const at = a.starts_at ? new Date(a.starts_at).getTime() : Number.MAX_SAFE_INTEGER;
  const bt = b.starts_at ? new Date(b.starts_at).getTime() : Number.MAX_SAFE_INTEGER;
  if (at !== bt) return at - bt;
  return new Date(b.last_seen_at).getTime() - new Date(a.last_seen_at).getTime();
}

export async function fetchEvents(limit = 300): Promise<TechEvent[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_expired", false)
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as unknown as TechEvent[]).sort(localFirst);
}

export async function fetchEventBySlug(slug: string): Promise<TechEvent | null> {
  const { data, error } = await supabase.from("events").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data as unknown as TechEvent) ?? null;
}

export function eventUrl(event: TechEvent) {
  return `https://techfaculty.ng/events/${event.slug}`;
}

/** Try to recover an ISO start date from free-text date labels like "12 September 2026". */
export function resolveStartDate(event: TechEvent): string | null {
  if (event.starts_at) return event.starts_at;
  const text = (event.date_text ?? "").trim();
  if (!text) return null;
  const cleaned = text.replace(/\b(\d{1,2})(st|nd|rd|th)\b/gi, "$1").split(/\s*(?:–|—|-\s|to\s)/)[0];
  const parsed = new Date(cleaned);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function organizerUrl(event: TechEvent) {
  if (event.is_featured) return "https://techfaculty.ng/events";
  try {
    return new URL(event.source_url).origin;
  } catch {
    return "https://techfaculty.ng/events";
  }
}

/** Returns null when no start date can be established — invalid Event markup is never emitted. */
export function eventSchema(event: TechEvent) {
  const start = resolveStartDate(event);
  if (!start) return null;
  const end = event.ends_at ?? new Date(new Date(start).getTime() + 3 * 60 * 60 * 1000).toISOString();
  const virtual = event.format === "VIRTUAL";
  const hybrid = event.format === "HYBRID";

  const place = {
    "@type": "Place",
    name: event.venue_name ?? event.city ?? "Venue announced by organiser",
    address: {
      "@type": "PostalAddress",
      streetAddress: event.address ?? undefined,
      addressLocality: event.city ?? "Lagos",
      addressRegion: event.state ?? undefined,
      addressCountry: event.country ?? "NG",
    },
  };
  const online = {
    "@type": "VirtualLocation",
    url: event.source_url,
  };

  const priceNumber = event.is_free
    ? "0"
    : (event.price_text?.match(/[\d][\d,\.]*/)?.[0]?.replace(/,/g, "") ?? null);

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description.slice(0, 900),
    eventAttendanceMode: virtual
      ? "https://schema.org/OnlineEventAttendanceMode"
      : hybrid
        ? "https://schema.org/MixedEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    startDate: start,
    endDate: end,
    location: virtual ? online : hybrid ? [place, online] : place,
    organizer: { "@type": "Organization", name: event.organizer, url: organizerUrl(event) },
    performer: { "@type": "PerformingGroup", name: event.organizer },
    image: event.image_url ? [event.image_url] : undefined,
    url: eventUrl(event),
    isAccessibleForFree: event.is_free,
    offers: {
      "@type": "Offer",
      url: event.source_url,
      price: priceNumber ?? undefined,
      priceCurrency: event.is_free ? "NGN" : event.currency ?? (priceNumber ? "NGN" : undefined),
      validFrom: new Date(event.last_seen_at).toISOString(),
      availability: "https://schema.org/InStock",
      category: event.is_free ? "Free" : "Paid",
    },
    keywords: event.tags.join(", ") || undefined,
  };
}
