import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";

type Source = { platform: string; url: string };

/**
 * Public listing pages for tech / AI / remote-work events in Nigeria and Africa.
 * Trimmed to the six sources that consistently return dated, upcoming events.
 */
const SOURCES: Source[] = [
  { platform: "Eventbrite", url: "https://www.eventbrite.com/d/nigeria/technology--events/" },
  { platform: "Meetup", url: "https://www.meetup.com/find/?location=ng--Lagos&source=EVENTS&keywords=tech" },
  { platform: "GDG Community", url: "https://gdg.community.dev/events/" },
  { platform: "Luma", url: "https://lu.ma/nigeria" },
  { platform: "Luma", url: "https://lu.ma/ai" },
  { platform: "Microsoft Reactor", url: "https://developer.microsoft.com/en-us/reactor/" },
];

/** Cost controls — keep each weekly run small. */
const MAX_PER_SOURCE = 5;
/** Stop scraping once we have this many upcoming events. */
const TARGET_TOTAL = 30;
/** Sources scraped concurrently per wave. */
const WAVE_SIZE = 3;
/** Ignore anything scheduled further out than this. */
const MAX_LEAD_DAYS = 120;

const eventsSchema = {
  type: "object",
  properties: {
    events: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          url: { type: "string" },
          organizer: { type: "string" },
          category: { type: "string" },
          format: { type: "string" },
          venue_name: { type: "string" },
          address: { type: "string" },
          city: { type: "string" },
          state: { type: "string" },
          country: { type: "string" },
          starts_at: { type: "string" },
          ends_at: { type: "string" },
          date_text: { type: "string" },
          is_free: { type: "boolean" },
          price_text: { type: "string" },
          image_url: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
        },
        required: ["title", "url"],
      },
    },
  },
  required: ["events"],
};

const EXTRACT_PROMPT =
  `Extract at most ${MAX_PER_SOURCE} of the soonest upcoming events listed on this page that relate to technology, software, AI, data, ` +
  "cybersecurity, design, startups, remote work or digital skills. For each event return: title; a factual " +
  "2-5 sentence description written only from the page content; the absolute URL of the event's own page where " +
  "someone registers; the organiser name; category as one of CONFERENCE HACKATHON MEETUP WEBINAR WORKSHOP " +
  "BOOTCAMP CAREER_FAIR SUMMIT; format as one of IN_PERSON VIRTUAL HYBRID; venue name, street address, city, " +
  "state and ISO country code when the page states them; starts_at and ends_at as ISO 8601 date-times when a " +
  "date is published; date_text as the human-readable date exactly as written; is_free and price_text when " +
  "pricing is shown; a cover image URL when present; and up to 6 topic tags. " +
  "Never invent dates, venues, prices or organisers — leave unknown fields out entirely.";

const CATEGORIES = [
  "CONFERENCE", "HACKATHON", "MEETUP", "WEBINAR", "WORKSHOP", "BOOTCAMP", "CAREER_FAIR", "SUMMIT",
];
const FORMATS = ["IN_PERSON", "VIRTUAL", "HYBRID"];

const TECH_HINTS = [
  "tech", "ai", "artificial intelligence", "machine learning", "data", "software", "developer", "dev",
  "code", "coding", "cyber", "security", "cloud", "devops", "design", "ux", "ui", "product", "startup",
  "digital", "web3", "blockchain", "hackathon", "python", "javascript", "react", "no-code", "automation",
  "remote work", "freelance", "founder", "innovation", "robotics", "iot", "analytics", "gdg", "devfest",
];

/** Events we surface must plausibly serve an African / Nigerian or online audience. */
const AUDIENCE_HINTS = [
  "nigeria", "lagos", "abuja", "nnewi", "onitsha", "enugu", "owerri", "aba", "ibadan", "kano", "port harcourt",
  "africa", "ghana", "accra", "kenya", "nairobi", "rwanda", "kigali", "south africa", "cape town",
  "online", "virtual", "remote", "worldwide", "global",
];

/** URL shapes that are articles or news rather than an event registration page. */
const NON_EVENT_URL = /\/(brandpress|news|blog|press-release|articles?)\//i;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function hash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

function isRelevant(text: string): boolean {
  const t = text.toLowerCase();
  return TECH_HINTS.some((h) => t.includes(h));
}

function servesOurAudience(row: { format: string; city?: string | null; country?: string | null; address?: string | null; venue_name?: string | null }): boolean {
  if (row.format === "VIRTUAL") return true;
  const hay = `${row.city ?? ""} ${row.country ?? ""} ${row.address ?? ""} ${row.venue_name ?? ""}`.toLowerCase();
  if (!hay.trim()) return true; // unknown venue, keep — the listing page decides
  return AUDIENCE_HINTS.some((h) => hay.includes(h));
}

function toIso(value: unknown): string | null {
  if (!value) return null;
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

async function scrapeSource(source: Source, apiKey: string) {
  const res = await fetch(`${FIRECRAWL_V2}/scrape`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      url: source.url,
      onlyMainContent: true,
      waitFor: 1500,
      formats: [{ type: "json", schema: eventsSchema, prompt: EXTRACT_PROMPT }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[${res.status}] ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const payload = data?.json ?? data?.data?.json ?? {};
  return Array.isArray(payload?.events) ? payload.events : [];
}

// deno-lint-ignore no-explicit-any
function normalize(raw: any, source: Source) {
  const title = String(raw?.title ?? "").trim();
  if (!title || title.length < 6 || title.length > 180) return null;

  let sourceUrl = String(raw?.url ?? "").trim();
  if (!/^https?:\/\//i.test(sourceUrl)) return null;
  // Never let a scraped row impersonate one of our own pages.
  if (/techfaculty\.ng/i.test(sourceUrl)) return null;
  if (NON_EVENT_URL.test(sourceUrl)) return null;

  const description = String(raw?.description ?? "").trim();
  if (description.length < 40) return null;

  const tagText = Array.isArray(raw?.tags) ? raw.tags.join(" ") : "";
  if (!isRelevant(`${title} ${description} ${tagText}`)) return null;

  const category = CATEGORIES.includes(String(raw?.category ?? "").toUpperCase())
    ? String(raw.category).toUpperCase()
    : "CONFERENCE";
  const rawFormat = String(raw?.format ?? "").toUpperCase().replace(/[\s-]/g, "_");
  let format = FORMATS.includes(rawFormat) ? rawFormat : "IN_PERSON";
  // Online-only signals in the copy beat a wrongly-guessed in-person format.
  const hasVenue = Boolean(raw?.venue_name || raw?.address || raw?.city);
  if (
    format === "IN_PERSON" &&
    !hasVenue &&
    /\b(online|virtual|webinar|livestream|live stream|remote|zoom)\b/i.test(`${title} ${description}`)
  ) {
    format = "VIRTUAL";
  }

  const startsAt = toIso(raw?.starts_at);
  const endsAt = toIso(raw?.ends_at);
  // Upcoming events only: we need a readable date, it must not have passed,
  // and it must not be further out than MAX_LEAD_DAYS.
  if (!startsAt && !endsAt) return null;
  const end = endsAt ?? startsAt!;
  if (new Date(end).getTime() < Date.now() - 12 * 3600e3) return null;
  const start = startsAt ?? endsAt!;
  if (new Date(start).getTime() > Date.now() + MAX_LEAD_DAYS * 864e5) return null;

  const row = {
    slug: `${slugify(title)}-${hash(sourceUrl)}`,
    title,
    description: description.slice(0, 6000),
    category,
    format,
    organizer: String(raw?.organizer ?? source.platform).trim().slice(0, 160) || source.platform,
    venue_name: raw?.venue_name ? String(raw.venue_name).slice(0, 200) : null,
    address: raw?.address ? String(raw.address).slice(0, 300) : null,
    city: raw?.city ? String(raw.city).slice(0, 100) : null,
    state: raw?.state ? String(raw.state).slice(0, 100) : null,
    country: raw?.country ? String(raw.country).toUpperCase().slice(0, 3) : null,
    starts_at: startsAt,
    ends_at: endsAt,
    date_text: raw?.date_text ? String(raw.date_text).slice(0, 120) : null,
    timezone: "Africa/Lagos",
    is_free: raw?.is_free === true,
    price_text: raw?.price_text ? String(raw.price_text).slice(0, 80) : null,
    currency: null as string | null,
    source_platform: source.platform,
    source_url: sourceUrl,
    image_url: raw?.image_url && /^https?:\/\//i.test(String(raw.image_url)) ? String(raw.image_url) : null,
    tags: Array.isArray(raw?.tags) ? raw.tags.map((t: unknown) => String(t).slice(0, 40)).slice(0, 6) : [],
    is_featured: false,
    is_expired: false,
    last_seen_at: new Date().toISOString(),
  };

  if (!servesOurAudience(row)) return null;
  return row;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const started = Date.now();
  const report: Record<string, string> = {};

  try {
    const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!apiKey) throw new Error("FIRECRAWL_API_KEY is not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // deno-lint-ignore no-explicit-any
    const byUrl: Record<string, any> = {};

    // Scrape in waves so we can stop as soon as we have enough upcoming events.
    for (let startIdx = 0; startIdx < SOURCES.length; startIdx += WAVE_SIZE) {
      if (Object.keys(byUrl).length >= TARGET_TOTAL) {
        for (const skipped of SOURCES.slice(startIdx)) {
          report[`${skipped.platform} ${new URL(skipped.url).pathname}`] = "skipped (quota reached)";
        }
        break;
      }

      const wave = SOURCES.slice(startIdx, startIdx + WAVE_SIZE);
      const results = await Promise.allSettled(
        wave.map(async (source) => ({ source, raw: await scrapeSource(source, apiKey) })),
      );

      for (let i = 0; i < results.length; i++) {
        const source = wave[i];
        const outcome = results[i];
        const key = `${source.platform} ${new URL(source.url).pathname}`;
        if (outcome.status === "rejected") {
          report[key] = `failed: ${String(outcome.reason).slice(0, 200)}`;
          console.error(`scrape-events: ${key} failed`, outcome.reason);
          continue;
        }
        let kept = 0;
        for (const raw of outcome.value.raw) {
          if (kept >= MAX_PER_SOURCE) break;
          const row = normalize(raw, source);
          if (!row) continue;
          if (!byUrl[row.source_url]) {
            byUrl[row.source_url] = row;
            kept++;
          }
        }
        report[key] = `${kept} events`;
      }
    }

    const upserts = Object.values(byUrl);
    let upserted = 0;
    if (upserts.length) {
      const { error } = await supabase
        .from("events")
        .upsert(upserts, { onConflict: "source_url", ignoreDuplicates: false });
      if (error) throw new Error(`upsert failed: ${error.message}`);
      upserted = upserts.length;
    }

    // Archive finished events / stale jobs and purge rows older than the retention window.
    await supabase.rpc("archive_stale_listings");

    return new Response(
      JSON.stringify({ success: true, upserted, ms: Date.now() - started, report }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("scrape-events error", error);
    // Graceful degradation: never fail the schedule.
    return new Response(
      JSON.stringify({ success: false, error: String(error), report }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});