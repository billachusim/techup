import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";

type Source = { platform: string; url: string };

// Listing pages for the AI / remote tech work platforms that reliably return
// Nigeria- and Africa-friendly roles. Kept deliberately short to limit spend.
const SOURCES: Source[] = [
  { platform: "Mercor", url: "https://work.mercor.com/jobs" },
  { platform: "Micro1", url: "https://www.micro1.ai/jobs" },
  { platform: "Turing", url: "https://www.turing.com/jobs" },
  { platform: "Mindrift", url: "https://www.mindrift.ai/opportunities" },
  { platform: "Outlier", url: "https://outlier.ai/expert-jobs" },
  { platform: "Alignerr", url: "https://www.alignerr.com/" },
  { platform: "Remote OK", url: "https://remoteok.com/remote-dev-jobs" },
  { platform: "Jobberman Nigeria", url: "https://www.jobberman.com/jobs/software-data" },
];

/** Cost controls — one weekly run must stay small and predictable. */
const MAX_PER_PLATFORM = 6;
/** Once we have this many fresh jobs, remaining sources are skipped this week. */
const TARGET_TOTAL = 60;
/** Sources scraped concurrently per wave (lets us stop early). */
const WAVE_SIZE = 4;
/** Only listings published within this window are imported. */
const MAX_AGE_DAYS = 14;

const jobsSchema = {
  type: "object",
  properties: {
    jobs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          company: { type: "string" },
          url: { type: "string" },
          description: { type: "string" },
          employment_type: { type: "string" },
          is_remote: { type: "boolean" },
          location: { type: "string" },
          country: { type: "string" },
          salary_min: { type: "number" },
          salary_max: { type: "number" },
          salary_currency: { type: "string" },
          salary_unit: { type: "string" },
          posted_date: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
        },
        required: ["title", "company", "description"],
      },
    },
  },
  required: ["jobs"],
};

const EXTRACT_PROMPT =
  `Extract at most ${MAX_PER_PLATFORM} of the newest technology, AI, data, engineering or design ` +
  "job listings on this page. For each: title, hiring company (use the platform name if the listing " +
  "is the platform itself), the absolute apply URL, a factual 2-4 sentence description from the page " +
  "content, employment_type (FULL_TIME PART_TIME CONTRACTOR INTERN TEMPORARY), is_remote, location, " +
  "ISO country code, pay range with currency and unit (HOUR, MONTH, YEAR) only when published, " +
  "posted_date as an ISO date when the page shows when it was posted, and up to 4 skill tags. " +
  "Never invent pay, dates, locations or companies — omit unknown fields.";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function hash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

const TECH_HINTS = [
  "engineer", "developer", "data", "ai", "machine learning", "ml", "software", "cyber",
  "security", "analyst", "designer", "product", "devops", "cloud", "qa", "python",
  "frontend", "backend", "full stack", "fullstack", "annotat", "tutor", "expert",
  "prompt", "researcher", "trainer", "writer", "reviewer", "linguist", "mobile", "it ",
];

function isRelevant(title: string): boolean {
  const t = title.toLowerCase();
  return TECH_HINTS.some((h) => t.includes(h));
}

async function scrapeSource(source: Source, apiKey: string) {
  const res = await fetch(`${FIRECRAWL_V2}/scrape`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      url: source.url,
      onlyMainContent: true,
      waitFor: 1200,
      formats: [{ type: "json", schema: jobsSchema, prompt: EXTRACT_PROMPT }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[${res.status}] ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const payload = data?.json ?? data?.data?.json ?? {};
  const jobs = Array.isArray(payload?.jobs) ? payload.jobs : [];
  return jobs;
}

const ALLOWED_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACTOR", "INTERN", "TEMPORARY"];

/** Parses a scraped posted date. Returns null when unreadable. */
function parsePostedAt(value: unknown): string | null {
  if (!value) return null;
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return null;
  if (d.getTime() > Date.now() + 864e5) return null;
  return d.toISOString().slice(0, 10);
}

function normalize(raw: any, source: Source) {
  const title = String(raw?.title ?? "").trim();
  if (!title || title.length > 160) return null;
  if (!isRelevant(title)) return null;

  const description = String(raw?.description ?? "").trim();
  if (description.length < 40) return null;

  const company = String(raw?.company ?? source.platform).trim() || source.platform;
  let sourceUrl = String(raw?.url ?? "").trim();
  if (!/^https?:\/\//i.test(sourceUrl)) sourceUrl = source.url;

  const type = String(raw?.employment_type ?? "").toUpperCase().replace(/[\s-]/g, "_");
  const employment_type = ALLOWED_TYPES.includes(type) ? type : "FULL_TIME";

  // Recency gate: drop anything published more than MAX_AGE_DAYS ago.
  const postedAt = parsePostedAt(raw?.posted_date);
  if (postedAt) {
    const age = Date.now() - new Date(postedAt).getTime();
    if (age > MAX_AGE_DAYS * 864e5) return null;
  }

  const slug = `${slugify(`${company}-${title}`)}-${hash(`${source.platform}|${sourceUrl}|${title}`)}`;

  return {
    slug,
    title,
    company,
    source_platform: source.platform,
    source_url: sourceUrl,
    description: description.slice(0, 6000),
    employment_type,
    is_remote: raw?.is_remote !== false,
    location: raw?.location ? String(raw.location).slice(0, 160) : null,
    country: raw?.country ? String(raw.country).toUpperCase().slice(0, 3) : null,
    salary_min: Number.isFinite(raw?.salary_min) ? raw.salary_min : null,
    salary_max: Number.isFinite(raw?.salary_max) ? raw.salary_max : null,
    salary_currency: raw?.salary_currency ? String(raw.salary_currency).toUpperCase().slice(0, 3) : null,
    salary_unit: raw?.salary_unit ? String(raw.salary_unit).toUpperCase().slice(0, 8) : null,
    tags: Array.isArray(raw?.tags) ? raw.tags.map((t: unknown) => String(t).slice(0, 40)).slice(0, 4) : [],
    posted_at: postedAt ?? new Date().toISOString().slice(0, 10),
    last_seen_at: new Date().toISOString(),
    is_expired: false,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const started = Date.now();
  const report: Record<string, string> = {};

  try {
    const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!apiKey) throw new Error("FIRECRAWL_API_KEY is not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Dedupe by source_url — the table has a unique constraint on it.
    const byUrl: Record<string, any> = {};

    // Scrape in small waves so we can stop as soon as we have enough fresh jobs.
    for (let start = 0; start < SOURCES.length; start += WAVE_SIZE) {
      if (Object.keys(byUrl).length >= TARGET_TOTAL) {
        for (const skipped of SOURCES.slice(start)) report[skipped.platform] = "skipped (quota reached)";
        break;
      }

      const wave = SOURCES.slice(start, start + WAVE_SIZE);
      const results = await Promise.allSettled(
        wave.map(async (source) => ({ source, raw: await scrapeSource(source, apiKey) })),
      );

      for (let i = 0; i < results.length; i++) {
        const source = wave[i];
        const outcome = results[i];
        if (outcome.status === "rejected") {
          report[source.platform] = `failed: ${String(outcome.reason).slice(0, 200)}`;
          console.error(`scrape-jobs: ${source.platform} failed`, outcome.reason);
          continue;
        }
        let kept = 0;
        for (const raw of outcome.value.raw) {
          if (kept >= MAX_PER_PLATFORM) break;
          const row = normalize(raw, source);
          if (!row) continue;
          if (byUrl[row.source_url]) continue;
          byUrl[row.source_url] = row;
          kept++;
        }
        report[source.platform] = `${kept} jobs`;
      }
    }

    const upserts = Object.values(byUrl);

    let inserted = 0;
    if (upserts.length) {
      const { error } = await supabase
        .from("jobs")
        .upsert(upserts, { onConflict: "source_url", ignoreDuplicates: false });
      if (error) throw new Error(`upsert failed: ${error.message}`);
      inserted = upserts.length;
    }

    // Archive stale jobs / finished events and purge very old rows.
    await supabase.rpc("archive_stale_listings");

    return new Response(
      JSON.stringify({ success: true, upserted: inserted, ms: Date.now() - started, report }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("scrape-jobs error", error);
    // Graceful degradation: never fail the schedule, report what happened.
    return new Response(
      JSON.stringify({ success: false, error: String(error), report }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
