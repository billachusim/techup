// Runs before `vite dev` and `vite build`; injects live job URLs into public/sitemap.xml
// between the JOBS markers so job detail pages are indexable.
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://techfaculty.ng";
const SITEMAP = resolve("public/sitemap.xml");
const START = "  <!-- JOBS:START -->";
const END = "  <!-- JOBS:END -->";

function envFromFile(key: string): string | undefined {
  try {
    const line = readFileSync(resolve(".env"), "utf8")
      .split("\n")
      .find((l) => l.trim().startsWith(`${key}=`));
    return line?.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
  } catch {
    return undefined;
  }
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? envFromFile("VITE_SUPABASE_URL");
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? envFromFile("VITE_SUPABASE_PUBLISHABLE_KEY");

async function fetchJobSlugs(): Promise<{ slug: string; last_seen_at: string }[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/jobs?select=slug,last_seen_at&is_expired=eq.false&order=last_seen_at.desc&limit=1000`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
  );
  if (!res.ok) {
    console.warn(`sitemap: could not fetch jobs (${res.status})`);
    return [];
  }
  return res.json();
}

const jobs = await fetchJobSlugs();

const block = jobs
  .map((j) =>
    [
      "  <url>",
      `    <loc>${BASE_URL}/careers/jobs/${j.slug}</loc>`,
      `    <lastmod>${j.last_seen_at.slice(0, 10)}</lastmod>`,
      "    <changefreq>weekly</changefreq>",
      "    <priority>0.6</priority>",
      "  </url>",
    ].join("\n"),
  )
  .join("\n");

let xml = readFileSync(SITEMAP, "utf8");
const section = [START, block, END].filter(Boolean).join("\n");

if (xml.includes(START) && xml.includes(END)) {
  xml = xml.replace(new RegExp(`${START}[\\s\\S]*?${END}`), section);
} else {
  xml = xml.replace("</urlset>", `${section}\n</urlset>`);
}

writeFileSync(SITEMAP, xml);
console.log(`sitemap.xml: ${jobs.length} job entries written`);
