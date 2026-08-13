import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";

type Source = { platform: string; url: string };

// Listing pages for popular AI / remote tech work platforms.
const SOURCES: Source[] = [
  { platform: "Mercor", url: "https://work.mercor.com/jobs" },
  { platform: "Micro1", url: "https://www.micro1.ai/jobs" },
  { platform: "Turing", url: "https://www.turing.com/jobs" },
  { platform: "Mindrift", url: "https://www.mindrift.ai/opportunities" },
  { platform: "Alignerr", url: "https://www.alignerr.com/" },
  { platform: "Outlier", url: "https://outlier.ai/expert-jobs" },
  { platform: "Handshake AI", url: "https://joinhandshake.com/ai/" },
  { platform: "Toloka", url: "https://toloka.ai/careers/" },
  { platform: "Remote OK", url: "https://remoteok.com/remote-dev-jobs" },
  { platform: "Wellfound", url: "https://wellfound.com/role/r/software-engineer" },
  { platform: "Scale AI", url: "https://scale.com/careers" },
  { platform: "Jobberman Nigeria", url: "https://www.jobberman.com/jobs/software-data" },
];

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
          tags: { type: "array", items: { type: "string" } },
        },
        required: ["title", "company", "description"],
      },
    },
  },
  required: ["jobs"],
};

const EXTRACT_PROMPT =
  "Extract every distinct job or work opportunity listed on this page. " +
  "Focus on technology, AI, data, engineering, design and related roles. " +
  "For each: title, hiring company (use the platform name if the listing is the platform itself), " +
  "the absolute apply/listing URL, a factual 2-5 sentence description written from the page content, " +
  "employment_type as one of FULL_TIME PART_TIME CONTRACTOR INTERN TEMPORARY, " +
  "is_remote, location text, ISO country code when stated, pay range with currency and unit " +
  "(HOUR, MONTH or YEAR) only when explicitly published, and up to 6 skill tags. " +
  "Never invent pay, locations or companies — omit unknown fields.";

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
      waitFor: 2500,
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
    tags: Array.isArray(raw?.tags) ? raw.tags.map((t: unknown) => String(t).slice(0, 40)).slice(0, 6) : [],
    posted_at: new Date().toISOString().slice(0, 10),
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

    const results = await Promise.allSettled(
      SOURCES.map(async (source) => {
        const raw = await scrapeSource(source, apiKey);
        return { source, raw };
      }),
    );

    const rows: Record<string, any> = {};
    for (let i = 0; i < results.length; i++) {
      const source = SOURCES[i];
      const outcome = results[i];
      if (outcome.status === "rejected") {
        report[source.platform] = `failed: ${String(outcome.reason).slice(0, 200)}`;
        console.error(`scrape-jobs: ${source.platform} failed`, outcome.reason);
        continue;
      }
      let kept = 0;
      for (const raw of outcome.value.raw) {
        const row = normalize(raw, source);
        if (!row) continue;
        rows[row.source_url + "|" + row.title] = row;
        kept++;
      }
      report[source.platform] = `${kept} jobs`;
    }

    // Dedupe by source_url — the table has a unique constraint on it.
    const byUrl: Record<string, any> = {};
    for (const row of Object.values(rows)) {
      if (!byUrl[row.source_url]) byUrl[row.source_url] = row;
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

    // Retire listings not seen in the last 30 days.
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("jobs").update({ is_expired: true }).lt("last_seen_at", cutoff).eq("is_expired", false);

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
