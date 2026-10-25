import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { requireCronOrAdmin } from "../_shared/scheduled-auth.ts";
import { countryCode, servesOurAudience } from "../_shared/event-audience.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";

type Source = { platform: string; url: string };

/**
 * Public listing pages for tech / AI / remote-work events in Nigeria and Africa.
 * South-East first (our campuses), then the big Nigerian hubs, then online.
 * Checked 2026-10-11: lu.ma/nigeria had no events and gdg.community.dev/events
 * listed only US chapters, so both were replaced.
 */
const SOURCES: Source[] = [
  { platform: "Meetup", url: "https://www.meetup.com/find/?location=ng--Enugu&source=EVENTS&keywords=tech" },
  { platform: "Meetup", url: "https://www.meetup.com/find/?location=ng--Lagos&source=EVENTS&keywords=tech" },
  { platform: "Meetup", url: "https://www.meetup.com/find/?location=ng--Abuja&source=EVENTS&keywords=tech" },
  { platform: "Eventbrite", url: "https://www.eventbrite.com/d/nigeria/technology--events/" },
  { platform: "Luma", url: "https://luma.com/lagos" },
  { platform: "Microsoft Reactor", url: "https://developer.microsoft.com/en-us/reactor/" },
];

/** Cost controls — one scrape per source per run. */
const MAX_PER_SOURCE = 8;
/** Keep only the best-scoring events from each run. */
const TARGET_TOTAL = 30;
/** Drop events that score below this (see relevanceScore). */
const MIN_SCORE = 3;
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
  "When the page shows a time zone or UTC offset (for example GMT+1, WAT, EDT), include the matching numeric " +
  "offset in starts_at and ends_at (for example 2026-10-17T09:00:00+01:00); otherwise give the time without an offset. " +
  "Resolve relative dates such as 'Tomorrow' or 'Thursday' to a full date including the year. " +
  "Never invent dates, venues, prices or organisers — leave unknown fields out entirely.";

const CATEGORIES = [
  "CONFERENCE", "HACKATHON", "MEETUP", "WEBINAR", "WORKSHOP", "BOOTCAMP", "CAREER_FAIR", "SUMMIT",
];
const FORMATS = ["IN_PERSON", "VIRTUAL", "HYBRID"];

/** Whole-word technology signals. Matched on word boundaries so "ai" never matches "said". */
const TECH_HINTS = [
  "tech", "technology", "ai", "artificial intelligence", "machine learning", "ml", "data", "data science",
  "software", "developer", "developers", "dev", "devs", "code", "coding", "programming", "cyber", "cybersecurity",
  "security", "cloud", "aws", "azure", "gcp", "devops", "kubernetes", "ux", "ui", "product design", "product management",
  "startup", "startups", "founder", "founders", "digital skills", "web3", "blockchain", "hackathon", "python",
  "javascript", "typescript", "react", "flutter", "android", "no code", "automation", "analytics", "gdg", "devfest",
  "robotics", "iot", "agents", "llm", "genai", "fintech", "wordpress", "web development", "open source",
];

/** Topics that slip past the tech filter but do not serve our learners. Matched at word starts. */
const OFF_TOPIC = [
  "visa", "relocat", "immigration", "move to the uk", "settle in the uk", "japa", "real estate", "property",
  "forex", "trading signals", "wealth creation", "asset protection", "church", "prayer", "runway", "fashion",
  "fitness", "gastronomy", "concert", "comedy",
];

/** Where our campuses are: events here rank first. */
const SOUTH_EAST = [
  "nnewi", "awka", "onitsha", "uli", "anambra", "enugu", "nsukka", "owerri", "imo", "aba", "umuahia", "abia",
  "asaba", "ebonyi", "abakaliki",
];

const NIGERIA = ["nigeria", "naija", "lagos", "abuja", "ibadan", "port harcourt", "kano", "kaduna", "benin city", "jos", "ilorin"];

/** Organisers and series with a track record of solid, free community events. */
const TRUSTED_COMMUNITIES = [
  "gdg", "google developer", "devfest", "aws", "microsoft", "women techmakers", "pycon", "python", "flutter",
  "cncf", "kubernetes", "owasp", "hackathon", "she code africa", "andela", "techcabal",
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

function wordHits(text: string, words: string[]): number {
  const t = ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, " ")} `;
  return words.filter((w) => t.includes(` ${w} `)).length;
}

/**
 * How useful an event is to Tech Faculty's audience: learners in South-East Nigeria
 * and anyone who can join online. Null means "not a tech event for us".
 */
function relevanceScore(row: {
  title: string; description: string; tags: string[]; organizer: string; format: string; is_free: boolean;
  city: string | null; state: string | null; country: string | null; address: string | null; venue_name: string | null;
}): number | null {
  const headline = `${row.title} ${row.tags.join(" ")}`;
  const all = `${headline} ${row.description}`;
  const lower = ` ${all.toLowerCase().replace(/[^a-z0-9]+/g, " ")}`;
  if (OFF_TOPIC.some((w) => lower.includes(` ${w}`))) return null;

  const headlineHits = wordHits(headline, TECH_HINTS);
  const bodyHits = wordHits(row.description, TECH_HINTS);
  // A real tech event says so in its title or tags, or leans on it throughout the description.
  if (headlineHits === 0 && bodyHits < 3) return null;

  let score = Math.min(headlineHits, 3) + (bodyHits >= 3 ? 1 : 0);
  const place = `${row.city ?? ""} ${row.state ?? ""} ${row.address ?? ""} ${row.venue_name ?? ""}`;
  if (wordHits(`${place} ${all} ${row.organizer}`, SOUTH_EAST) > 0) score += 4;
  else if (row.country?.startsWith("NG") || wordHits(place, NIGERIA) > 0) score += 2;
  else if (row.format === "VIRTUAL" || row.format === "HYBRID") score += 1;
  if (wordHits(`${row.organizer} ${row.title}`, TRUSTED_COMMUNITIES) > 0) score += 1;
  if (row.is_free) score += 1;
  return score;
}

/** Listing sites add per-visit tracking (?recId=, ?aff=) — strip it so one event is one row. */
function canonicalUrl(raw: string): string | null {
  try {
    const u = new URL(raw);
    u.hash = "";
    u.search = "";
    if (u.hostname === "lu.ma") u.hostname = "luma.com";
    return u.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function toIso(value: unknown): string | null {
  if (!value) return null;
  let text = String(value).trim();
  // A date-time with no offset was written in local time; our listings are Nigerian (WAT, UTC+1).
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(text)) text += "+01:00";
  const d = new Date(text);
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
      location: { country: "NG", languages: ["en-NG"] },
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

// Raw scraped JSON is untrusted and checked field by field below
// deno-lint-ignore no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(raw: any, source: Source) {
  const title = String(raw?.title ?? "").trim();
  if (!title || title.length < 6 || title.length > 180) return null;

  const rawUrl = String(raw?.url ?? "").trim();
  if (!/^https?:\/\//i.test(rawUrl)) return null;
  const sourceUrl = canonicalUrl(rawUrl);
  if (!sourceUrl) return null;
  // Never let a scraped row impersonate one of our own pages.
  if (/techfaculty\.ng/i.test(sourceUrl)) return null;
  if (NON_EVENT_URL.test(sourceUrl)) return null;

  const description = String(raw?.description ?? "").trim();
  if (description.length < 40) return null;

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
    country: countryCode(raw?.country),
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
  const score = relevanceScore(row);
  if (score === null || score < MIN_SCORE) return null;
  return { row, score };
}

type Row = NonNullable<ReturnType<typeof normalize>>["row"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  // Each run spends Firecrawl credits: only the schedule or a signed-in admin may start one.
  const denied = await requireCronOrAdmin(req, supabase, "scrape-events", corsHeaders);
  if (denied) return denied;

  const started = Date.now();
  const report: Record<string, string> = {};
  let upserted = 0;
  let trigger = "manual";
  try {
    trigger = String((await req.json())?.trigger ?? "manual").slice(0, 20);
  } catch {
    // no body
  }
  // Every run is logged so a silent failure (expired key, used-up credits) shows on /admin.
  const logRun = (success: boolean, error: string | null) =>
    supabase.from("event_scrape_runs").insert({
      trigger, success, upserted, report, error, duration_ms: Date.now() - started,
    }).then(({ error: logError }) => logError && console.error("scrape-events: run log failed", logError));

  try {
    const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!apiKey) throw new Error("FIRECRAWL_API_KEY is not configured");

    const byUrl: Record<string, { row: Row; score: number }> = {};

    for (let startIdx = 0; startIdx < SOURCES.length; startIdx += WAVE_SIZE) {
      const wave = SOURCES.slice(startIdx, startIdx + WAVE_SIZE);
      const results = await Promise.allSettled(
        wave.map(async (source) => ({ source, raw: await scrapeSource(source, apiKey) })),
      );

      for (let i = 0; i < results.length; i++) {
        const source = wave[i];
        const outcome = results[i];
        const key = `${source.platform} ${new URL(source.url).pathname}${new URL(source.url).search}`;
        if (outcome.status === "rejected") {
          report[key] = `failed: ${String(outcome.reason).slice(0, 200)}`;
          console.error(`scrape-events: ${key} failed`, outcome.reason);
          continue;
        }
        let kept = 0;
        for (const raw of outcome.value.raw) {
          if (kept >= MAX_PER_SOURCE) break;
          const scored = normalize(raw, source);
          if (!scored) continue;
          const existing = byUrl[scored.row.source_url];
          if (!existing || existing.score < scored.score) {
            byUrl[scored.row.source_url] = scored;
            if (!existing) kept++;
          }
        }
        report[key] = `${outcome.value.raw.length} found, ${kept} kept`;
      }
    }

    // Best events first; soonest breaks ties.
    const upserts = Object.values(byUrl)
      .sort((a, b) => b.score - a.score || String(a.row.starts_at ?? a.row.ends_at).localeCompare(String(b.row.starts_at ?? b.row.ends_at)))
      .slice(0, TARGET_TOTAL)
      .map((e) => e.row);
    if (upserts.length) {
      const { error } = await supabase
        .from("events")
        .upsert(upserts, { onConflict: "source_url", ignoreDuplicates: false });
      if (error) throw new Error(`upsert failed: ${error.message}`);
      upserted = upserts.length;
    }

    // Archive finished events / stale jobs and purge rows older than the retention window.
    await supabase.rpc("archive_stale_listings");

    const failed = Object.values(report).filter((r) => r.startsWith("failed")).length;
    await logRun(failed < SOURCES.length, failed ? `${failed} of ${SOURCES.length} sources failed` : null);

    return new Response(
      JSON.stringify({ success: true, upserted, ms: Date.now() - started, report }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("scrape-events error", error);
    await logRun(false, String(error).slice(0, 500));
    // Graceful degradation: never fail the schedule.
    return new Response(
      JSON.stringify({ success: false, error: String(error), report }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});