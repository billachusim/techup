// Runs after generate-sitemap.ts before `vite dev` and `vite build`; writes public/llms.txt
// (a short, linked map of the site for AI assistants, per https://llmstxt.org) and
// public/llms-full.txt (the key facts, prices and FAQ answers in plain text).
//
// Everything comes from the same data the pages render, so neither file is edited by hand:
// - Departments, campuses, hubs, blog guides and FAQs from src/data.
// - Programme prices from supabase/functions/_shared/pricing.ts (what checkout charges).
// - Other pages from the title/description in each route's pageHead(), limited to the URLs
//   in public/sitemap.xml so private and noindexed pages stay out.
import { readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import blogPosts from "../src/data/blogPosts";
import { campuses } from "../src/data/campuses";
import { campusFaqs } from "../src/data/campusContent";
import { departments, type Department } from "../src/data/departments";
import { GOOGLE_RATING, GOOGLE_REVIEWS_URL } from "../src/data/googleReviews";
import { SUCCESS_KIT, kitFaqs } from "../src/data/successKit";
import { techHubs } from "../src/data/techHubs";
import {
  VIRTUAL_SIWES,
  logbookIncludes,
  placementIncludes,
  virtualFaqs,
} from "../src/data/virtualSiwes";
import { LEARNING_MODES, PLAN_PRICING } from "../supabase/functions/_shared/pricing";

const BASE_URL = "https://techfaculty.ng";
const BRAND = "Tech Faculty NG";
const CREDENTIAL = "Licensed by the Federal Ministry of Science, Technology and Innovation (FMSTI) through the National Board for Technology Incubation (NBTI)";
const ROUTES_DIR = resolve("src/routes");
const SITEMAP = resolve("public/sitemap.xml");
const LLMS = resolve("public/llms.txt");
const LLMS_FULL = resolve("public/llms-full.txt");

// The pricing plan each department enrols into. A department without one is taken
// through the Custom Programme, where students pick modules from any department.
const DEPARTMENT_PLAN: Record<string, string> = {
  "basic-internet-ai-studies": "bootcamp-starter",
  "web-development": "developer-pro",
  "mobile-app-development": "mobile-app-developer",
  "data-science-analytics": "data-wizard",
  "ai-machine-learning": "ai-innovator",
  cybersecurity: "security-shield",
  "cloud-computing": "cloud-architect",
  design: "design-master",
  "digital-marketing": "digital-marketing-pro",
};

// Pages covered by their own sections below, so "Pages" doesn't repeat them.
const SECTION_PAGES = new Set(["/departments", "/locations", "/hubs", "/blog", "/virtual-siwes", "/siwes-success-kit"]);

const url = (path: string) => BASE_URL + path;
const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

const hq = campuses.find((c) => c.isHeadquarters) ?? campuses[0];
const campusName = (c: (typeof campuses)[number]) => `Tech Faculty ${c.city}${c.isHeadquarters ? " (headquarters)" : ""}`;
const cities = campuses.map((c) => c.city);
const states = new Set(campuses.map((c) => c.state).filter((s) => s !== "Federal Capital Territory"));
const hasFct = campuses.some((c) => c.state === "Federal Capital Territory");
const inIncubationCentres = campuses.filter((c) => /Technology Incubation|NBTI|National Board for Technology Incubation/.test(c.address + c.shortVenue)).length;
const freeDept = departments.find((d) => DEPARTMENT_PLAN[d.slug] === "bootcamp-starter");
const modeSurcharges = LEARNING_MODES.filter((m) => m.price > 0)
  .map((m) => `${m.name.toLowerCase()} +${naira(m.price)}`)
  .join(", ");

// ---------- prices ----------

type DeptPrice = { free: true } | { free: false; modules: number; total: number; minimum: number; custom: boolean };

function departmentPrice(d: Department): DeptPrice {
  const planId = DEPARTMENT_PLAN[d.slug] ?? "custom-builder";
  const plan = PLAN_PRICING[planId];
  if (planId === "bootcamp-starter") return { free: true };
  const total = plan.courses.reduce((sum, c) => sum + c.price, 0);
  return { free: false, modules: plan.courses.length, total, minimum: plan.minimumAmount, custom: planId === "custom-builder" };
}

function priceLine(d: Department): string {
  const p = departmentPrice(d);
  if (p.free) return "Free.";
  if (p.custom) return `Taken as a Custom Programme: students pick modules from any department, and an order starts at ${naira(p.minimum)}.`;
  return `${p.modules} modules totalling ${naira(p.total)} online. Students pay per module, and an order (modules, learning mode and add-ons) starts at ${naira(p.minimum)}.`;
}

// ---------- static pages from the route tree ----------

function routeFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return routeFiles(full);
    return /\.tsx?$/.test(name) && !name.startsWith("-") ? [full] : [];
  });
}

// A string literal right after `key:` in pageHead(); dynamic values are skipped.
function literal(src: string, key: string): string | undefined {
  const m = src.match(new RegExp(`\\b${key}:\\s*(["'\`])((?:\\\\.|(?!\\1)[^\\\\])*)\\1\\s*,`));
  if (!m || (m[1] === "`" && m[2].includes("${"))) return undefined;
  return m[2].replace(/\\(.)/g, "$1");
}

const sitemapPaths = new Set(
  [...readFileSync(SITEMAP, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(BASE_URL, "") || "/"),
);

const pages = routeFiles(ROUTES_DIR)
  .map((file) => {
    const src = readFileSync(file, "utf8");
    const id = src.match(/createFileRoute\(\s*["'`]([^"'`]+)["'`]\s*\)/)?.[1];
    if (!id) return undefined;
    const path = id.replace(/\/_[^/]+/g, "").replace(/(.)\/$/, "$1");
    const title = literal(src, "title");
    const description = literal(src, "description");
    if (path.includes("$") || !sitemapPaths.has(path) || !title || !description) return undefined;
    // "About Us - Tech Faculty NG | Our Mission & Story" -> "About Us"
    const name = title.split(/\s[|—–-]\s/)[0].trim();
    return { path, name: path === "/" ? "Home" : name, description };
  })
  .filter((p): p is { path: string; name: string; description: string } => Boolean(p))
  .sort((a, b) => (a.path === "/" ? -1 : b.path === "/" ? 1 : a.path.localeCompare(b.path)));

// ---------- shared facts ----------

const facts = [
  `${BRAND} is a Nigerian technology training institute. ${CREDENTIAL}.`,
  `Headquarters: ${hq.address}.`,
  `Campuses: ${campuses.length} centres in ${states.size} states${hasFct ? " and the FCT" : ""} (${cities.join(", ")}). ${inIncubationCentres} of them operate inside NBTI Technology Incubation Centres.`,
  `Departments: ${departments.map((d) => d.title).join(", ")}.`,
  "Every department can be studied online, hybrid or in person.",
  ...(freeDept ? [`Free starting point: ${freeDept.title} (${freeDept.duration}), no fee.`] : []),
  `Paid programmes are priced per module in naira and shown in US dollars outside Nigeria. Learning mode adds to the module total: online only is included, ${modeSurcharges}.`,
  "On-site SIWES at any campus: free (Learn & Pay or Tutor & Earn track). Only Virtual SIWES is charged, because it covers courier delivery.",
  `Virtual SIWES (online industrial training placement): ${naira(VIRTUAL_SIWES.placementPriceNGN)}. Logbook review, signing, stamping and two-way courier delivery: ${naira(VIRTUAL_SIWES.logbookPriceNGN)}.`,
  `${SUCCESS_KIT.name}: ${naira(SUCCESS_KIT.priceNGN)}.`,
  `Certificates are verifiable at ${url("/verify")}.`,
  `Google rating for the Nnewi campus: ${GOOGLE_RATING.rating} from ${GOOGLE_RATING.count} reviews (checked ${GOOGLE_RATING.checked}), ${GOOGLE_REVIEWS_URL}.`,
  `Contact: WhatsApp +${VIRTUAL_SIWES.whatsappNumber}, email ${VIRTUAL_SIWES.email}.`,
];

const header = [
  `# ${BRAND}`,
  "",
  `> ${BRAND} trains, certifies and places Nigerians in tech careers: ${departments.length} departments online or at ${campuses.length} campuses across Nigeria, a free foundation bootcamp, and SIWES industrial training placements. ${CREDENTIAL}.`,
  "",
];

// ---------- llms.txt ----------

const guides = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
const otherHubs = techHubs.filter((h) => !h.isTechFaculty);

const llms = [
  ...header,
  "<!-- Generated by scripts/generate-llms.ts on every dev start and build. Do not edit by hand. -->",
  "",
  "## Key facts",
  "",
  ...facts.map((f) => `- ${f}`),
  `- Full detail in plain text, including programme prices and FAQ answers: ${url("/llms-full.txt")}`,
  "",
  "## Departments",
  "",
  ...departments.map((d) => `- [${d.title}](${url(`/departments/${d.slug}`)}): ${oneLine(d.tagline)} ${d.duration}, ${d.difficulty.toLowerCase()}. ${priceLine(d)}`),
  "",
  "## SIWES and industrial training",
  "",
  `- [SIWES and IT placement](${url("/siwes")}): Free on site at our campuses, on the Learn & Pay or Tutor & Earn track.`,
  `- [Virtual SIWES](${url("/virtual-siwes")}): Online IT placement for ${naira(VIRTUAL_SIWES.placementPriceNGN)}, plus logbook review, signing, stamping and two-way delivery for ${naira(VIRTUAL_SIWES.logbookPriceNGN)}.`,
  `- [${SUCCESS_KIT.name}](${url("/siwes-success-kit")}): ${SUCCESS_KIT.tagline} ${naira(SUCCESS_KIT.priceNGN)}, with a free placement checklist.`,
  "",
  "## Campuses",
  "",
  `- [All campuses](${url("/locations")}): ${campuses.length} Tech Faculty centres across Nigeria.`,
  ...campuses.map((c) => `- [${campusName(c)}](${url(`/locations/${c.slug}`)}): ${c.address}. ${oneLine(c.tagline)}`),
  "",
  "## Pages",
  "",
  ...pages.filter((p) => !SECTION_PAGES.has(p.path)).map((p) => `- [${p.name}](${url(p.path)}): ${oneLine(p.description)}`),
  "",
  "## Guides",
  "",
  `- [Blog](${url("/blog")}): Tech career, bootcamp, SIWES and AI guides for Nigeria.`,
  ...guides.map((p) => `- [${p.title}](${url(`/blog/${p.slug}`)}): ${oneLine(p.description)}`),
  "",
  "## Optional",
  "",
  `- [Tech hubs directory](${url("/hubs")}): Editorial directory of ${techHubs.length} tech hubs and training institutes in Nigeria and Africa. Listing a hub does not imply a partnership.`,
  ...otherHubs.map((h) => `- [${h.name}](${url(`/hubs/${h.slug}`)}): ${h.city}, ${h.country}. ${oneLine(h.focus)}`),
  "",
].join("\n");

// ---------- llms-full.txt ----------

const faqBlock = (faqs: { q: string; a: string }[]) => faqs.flatMap((f) => [`Q: ${oneLine(f.q)}`, `A: ${oneLine(f.a)}`, ""]);

const departmentSection = (d: Department) => {
  const planId = DEPARTMENT_PLAN[d.slug];
  const plan = planId ? PLAN_PRICING[planId] : undefined;
  const paid = plan && planId !== "bootcamp-starter";
  return [
    `### ${d.title}`,
    "",
    `Page: ${url(`/departments/${d.slug}`)}`,
    `Duration: ${d.duration}. Level: ${d.difficulty}.`,
    `Price: ${priceLine(d)}`,
    ...(paid
      ? [
          `Modules: ${plan.courses.map((c) => `${c.name} ${naira(c.price)}`).join("; ")}.`,
          `Optional add-ons: ${plan.benefits.map((b) => `${b.name} ${b.price ? naira(b.price) : "free"}`).join("; ")}.`,
        ]
      : []),
    "",
    oneLine(d.intro),
    "",
    `Curriculum: ${d.courses.join("; ")}.`,
    `Tools: ${d.tools.join(", ")}.`,
    `Who it is for: ${d.audience.join("; ")}.`,
    `Career outcomes (Nigerian salary bands): ${d.outcomes.map((o) => `${o.role} ${o.salary}`).join("; ")}.`,
    "",
    ...faqBlock(d.faqs),
  ];
};

const full = [
  ...header,
  "<!-- Generated by scripts/generate-llms.ts on every dev start and build. Do not edit by hand. -->",
  "",
  `Short version with links: ${url("/llms.txt")}`,
  "",
  "## Key facts",
  "",
  ...facts.map((f) => `- ${f}`),
  "",
  "## Programme prices",
  "",
  "Paid programmes are priced per module. Students choose the modules they want, a learning mode and optional add-ons; the order must reach the plan's minimum.",
  "",
  ...LEARNING_MODES.map((m) => `- ${m.name}: ${m.price ? `+${naira(m.price)}` : "included"} (${m.description}).`),
  "",
  ...departments.map((d) => `- ${d.title}: ${priceLine(d)}`),
  "",
  "## Departments",
  "",
  ...departments.flatMap(departmentSection),
  "## Virtual SIWES",
  "",
  `Page: ${url("/virtual-siwes")}`,
  `Placement: ${naira(VIRTUAL_SIWES.placementPriceNGN)}, paid before onboarding. Includes: ${placementIncludes.join("; ")}.`,
  `Logbook service: ${naira(VIRTUAL_SIWES.logbookPriceNGN)}. Includes: ${logbookIncludes.join("; ")}. Turnaround: ${VIRTUAL_SIWES.turnaround}.`,
  "",
  ...faqBlock(virtualFaqs),
  `## ${SUCCESS_KIT.name}`,
  "",
  `Page: ${url("/siwes-success-kit")}`,
  `${SUCCESS_KIT.tagline} Price: ${naira(SUCCESS_KIT.priceNGN)}.`,
  "",
  ...faqBlock(kitFaqs),
  "## Campuses",
  "",
  ...campuses.flatMap((c) => [
    `### ${campusName(c)}`,
    "",
    `Page: ${url(`/locations/${c.slug}`)}`,
    `Address: ${c.address}. State: ${c.state} (${c.zone}).`,
    "",
    oneLine(c.intro),
    "",
  ]),
  "### Questions asked about every campus",
  "",
  `Answers below are for ${hq.city}; each campus page gives the same answers for its own city and address.`,
  "",
  ...faqBlock(campusFaqs(hq)),
  "## Other pages",
  "",
  ...pages.map((p) => `- ${p.name} (${url(p.path)}): ${oneLine(p.description)}`),
  "",
].join("\n");

writeFileSync(LLMS, llms);
writeFileSync(LLMS_FULL, full);
console.log(`llms.txt: ${llms.length} chars, llms-full.txt: ${full.length} chars written`);
