// Runs before `vite dev` and `vite build`; writes public/sitemap.xml from the route tree.
//
// - Static pages come from src/routes: every route with a component is listed unless it
//   redirects, sets `noindex: true`, or is in EXCLUDE below.
// - Dynamic pages ($param routes) come from the resolvers in DYNAMIC: local data files
//   for blog posts, categories, departments, locations, hubs and job platforms, and
//   Supabase for published blog posts, jobs, events and talent roles (skipped when the env vars are missing).
// - lastmod is the post date for blog content, the row's timestamp for Supabase content,
//   and otherwise the last git commit touching the route file or the page/data it imports.
//   It is left out when git history is unavailable or shallow.
import { execFileSync } from "child_process";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { join, relative, resolve } from "path";
import blogPosts from "../src/data/blogPosts";
import { blogCategories, getCategorySlugForPost } from "../src/data/blogCategories";
import { campuses } from "../src/data/campuses";
import { departments } from "../src/data/departments";
import { jobPlatforms } from "../src/data/jobPlatforms";
import { techHubs } from "../src/data/techHubs";

const BASE_URL = "https://techfaculty.ng";
const ROUTES_DIR = resolve("src/routes");
const SITEMAP = resolve("public/sitemap.xml");

// Pages that render but should not be indexed (private, transactional or third-party flows).
const EXCLUDE = new Set([
  "/login",
  "/dashboard",
  "/payment-success",
  "/talent/dashboard",
  "/talent/profile",
  "/.lovable/oauth/consent",
]);

type Entry = { path: string; lastmod?: string };
type Resolver = (routeFile: string) => Entry[] | Promise<Entry[]>;

// ---------- lastmod helpers ----------

const gitAvailable = (() => {
  try {
    return execFileSync("git", ["rev-parse", "--is-shallow-repository"], { encoding: "utf8" }).trim() === "false";
  } catch {
    return false;
  }
})();

function resolveImport(spec: string): string | undefined {
  const base = resolve("src", spec.slice(2));
  return ["", ".tsx", ".ts", "/index.tsx", "/index.ts"].map((ext) => base + ext).find((p) => existsSync(p) && statSync(p).isFile());
}

// The route file plus the @/pages and @/data modules it imports: the files that decide what the page shows.
function pageFiles(routeFile: string): string[] {
  const src = readFileSync(routeFile, "utf8");
  const imports = [...src.matchAll(/from\s+["'](@\/(?:pages|data)\/[^"']+)["']/g)].map((m) => resolveImport(m[1]));
  return [routeFile, ...imports.filter((p): p is string => Boolean(p))];
}

function gitDate(files: string[]): string | undefined {
  if (!gitAvailable) return undefined;
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...files.map((f) => relative(process.cwd(), f))], {
      encoding: "utf8",
    }).trim();
    return out || undefined;
  } catch {
    return undefined;
  }
}

const day = (value: string | null | undefined) => (value ? String(value).slice(0, 10) : undefined);
const latest = (dates: (string | undefined)[]) => dates.filter(Boolean).sort().at(-1);

// ---------- Supabase ----------

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

async function fetchRows<T>(table: string, query: string): Promise<T[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) {
      console.warn(`sitemap: could not fetch ${table} (${res.status})`);
      return [];
    }
    return await res.json();
  } catch (error) {
    console.warn(`sitemap: could not fetch ${table} (${error})`);
    return [];
  }
}

// ---------- dynamic routes ----------

const postDates = blogPosts.map((p) => p.date);

const DYNAMIC: Record<string, Resolver | null> = {
  "/blog/$slug": async () => [
    ...blogPosts.map((p) => ({ path: `/blog/${p.slug}`, lastmod: day(p.date) })),
    // Posts published from the admin live in Supabase; local posts win on a slug clash (deduped below).
    ...(
      await fetchRows<{ slug: string; published_at: string; updated_at: string | null }>(
        "blog_posts",
        "select=slug,published_at,updated_at&is_published=eq.true&order=published_at.desc&limit=500",
      )
    ).map((p) => ({ path: `/blog/${p.slug}`, lastmod: day(p.updated_at ?? p.published_at) })),
  ],
  "/blog/category/$slug": () =>
    blogCategories.map((c) => ({
      path: `/blog/category/${c.slug}`,
      lastmod: latest(blogPosts.filter((p) => getCategorySlugForPost(p) === c.slug).map((p) => day(p.date))),
    })),
  "/departments/$slug": (file) => {
    const lastmod = gitDate(pageFiles(file));
    return departments.map((d) => ({ path: `/departments/${d.slug}`, lastmod }));
  },
  "/locations/$slug": (file) => {
    const lastmod = gitDate(pageFiles(file));
    return campuses.map((c) => ({ path: `/locations/${c.slug}`, lastmod }));
  },
  "/hubs/$slug": (file) => {
    const lastmod = gitDate(pageFiles(file));
    return techHubs.map((h) => ({ path: `/hubs/${h.slug}`, lastmod }));
  },
  "/careers/platforms/$platformSlug": (file) => {
    const lastmod = gitDate(pageFiles(file));
    return jobPlatforms.map((p) => ({ path: `/careers/platforms/${p.slug}`, lastmod }));
  },
  "/careers/jobs/$slug": async () =>
    (
      await fetchRows<{ slug: string; last_seen_at: string }>(
        "jobs",
        "select=slug,last_seen_at&is_expired=eq.false&order=last_seen_at.desc&limit=1000",
      )
    ).map((j) => ({ path: `/careers/jobs/${j.slug}`, lastmod: day(j.last_seen_at) })),
  "/events/$slug": async () =>
    (
      await fetchRows<{ slug: string; updated_at: string }>(
        "events",
        // Own events only: third-party listings are noindexed on the page.
        "select=slug,updated_at&is_expired=eq.false&source_platform=eq.Tech%20Faculty&order=updated_at.desc&limit=500",
      )
    ).map((e) => ({ path: `/events/${e.slug}`, lastmod: day(e.updated_at) })),
  "/talent/roles/$slug": async () =>
    (
      await fetchRows<{ slug: string; updated_at: string }>(
        "talent_roles",
        "select=slug,updated_at&status=eq.published&order=updated_at.desc&limit=200",
      )
    ).map((r) => ({ path: `/talent/roles/${r.slug}`, lastmod: day(r.updated_at) })),
  "/verify/$": (file) => [{ path: "/verify/", lastmod: gitDate(pageFiles(file)) }],
  // Not indexed: individual talent profiles, and legacy WordPress redirects.
  "/talent/pool/$id": null,
  "/tag/$": null,
  "/category/$": null,
};

// Static pages whose content follows data rather than the page's own code.
const STATIC_LASTMOD: Record<string, () => string | undefined> = {
  "/blog": () => latest(postDates.map(day)),
};

// ---------- route tree ----------

function routeFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return routeFiles(full);
    return /\.tsx?$/.test(name) && !name.startsWith("-") ? [full] : [];
  });
}

const routes = routeFiles(ROUTES_DIR)
  .map((file) => {
    const src = readFileSync(file, "utf8");
    const id = src.match(/createFileRoute\(\s*["'`]([^"'`]+)["'`]\s*\)/)?.[1];
    return id ? { file, src, id } : undefined;
  })
  .filter((r): r is { file: string; src: string; id: string } => Boolean(r))
  .sort((a, b) => a.id.localeCompare(b.id));

const entries: Entry[] = [];

for (const { file, src, id } of routes) {
  // Drop pathless layout segments (_layout) and the trailing slash index routes carry ("/blog/").
  const path = id.replace(/\/_[^/]+/g, "").replace(/(.)\/$/, "$1");

  if (path.includes("$")) {
    if (!(path in DYNAMIC)) {
      console.warn(`sitemap: no resolver for dynamic route ${path}; add one to DYNAMIC in scripts/generate-sitemap.ts`);
      continue;
    }
    const resolver = DYNAMIC[path];
    if (resolver) entries.push(...(await resolver(file)));
    continue;
  }

  const hasComponent = /\bcomponent\s*:/.test(src);
  const redirects = /throw\s+redirect\(/.test(src);
  const noindex = /\bnoindex\s*:\s*true\b/.test(src);
  if (!hasComponent || redirects || noindex || EXCLUDE.has(path)) continue;

  entries.push({ path, lastmod: STATIC_LASTMOD[path]?.() ?? gitDate(pageFiles(file)) });
}

// ---------- write ----------

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const seen = new Set<string>();
const urls = entries
  .filter((e) => (seen.has(e.path) ? false : (seen.add(e.path), true)))
  .map((e) =>
    [
      "  <url>",
      `    <loc>${escapeXml(BASE_URL + e.path)}</loc>`,
      ...(e.lastmod ? [`    <lastmod>${e.lastmod}</lastmod>`] : []),
      "  </url>",
    ].join("\n"),
  );

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  "<!-- Generated by scripts/generate-sitemap.ts on every dev start and build. Do not edit by hand. -->",
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls,
  "</urlset>",
  "",
].join("\n");

writeFileSync(SITEMAP, xml);
console.log(`sitemap.xml: ${urls.length} URLs written`);
