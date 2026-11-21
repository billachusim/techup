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
import { siwesCourses } from "../src/data/siwesCourses";
import { techHubs } from "../src/data/techHubs";
import {
  VIRTUAL_SIWES,
  logbookIncludes,
  placementIncludes,
  virtualFaqs,
} from "../src/data/virtualSiwes";
import { LEARNING_MODES, PLAN_PRICING } from "../supabase/functions/_shared/pricing";
import { NGN_TO_USD_RATE, SIWES_MAX_DISCOUNT_PCT } from "../src/lib/fees";
import {
  OPENINGS_PER_SERVICE,
  PRICE_TIERS,
  SERVICES,
  SERVICE_CATEGORIES,
  businessPrice,
  talentPay,
  type Service,
} from "../src/data/services";
import { HOW_IT_WORKS, HUSTLE_STEPS, SERVICE_FAQS } from "../src/components/services/serviceCopy";
import { jobPlatforms } from "../src/data/jobPlatforms";
import { BUSINESS_PACKAGES } from "../src/data/businessPackages";
import { apps } from "../src/data/apps";

const BASE_URL = "https://techfaculty.ng";
const BRAND = "Tech Faculty NG";
const CREDENTIAL = "Licensed by the Federal Ministry of Science, Technology and Innovation (FMSTI) through the National Board for Technology Incubation (NBTI)";
const ROUTES_DIR = resolve("src/routes");
const SITEMAP = resolve("public/sitemap.xml");
const LLMS = resolve("public/llms.txt");
const LLMS_FULL = resolve("public/llms-full.txt");
// Public MCP server (Model Context Protocol) that AI assistants can connect to for live data.
const MCP_URL = "https://flxwtwzjslufglpwfjdx.supabase.co/functions/v1/mcp";

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
const SECTION_PAGES = new Set([
  "/departments", "/locations", "/hubs", "/blog", "/virtual-siwes", "/siwes-success-kit", "/siwes/courses",
  "/services", "/side-hustles", "/careers", "/talent", "/talent/pool", "/hire", "/products",
]);

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

// ---------- pay-per-task services and side hustles ----------

const categoryName = (slug: string) => SERVICE_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
const inCategory = (slug: string) => SERVICES.filter((x) => x.category === slug);
const minBusinessPrice = Math.min(...SERVICES.map(businessPrice));
const fromPrice = (list: Service[]) => naira(Math.min(...list.map(businessPrice)));
const payRange = (list: Service[]) => {
  const pays = [...new Set(list.map(talentPay))].sort((a, b) => a - b);
  return pays.map(naira).join(" or ");
};
const SMALL_PAY = PRICE_TIERS.small.talentPay;
const BIG_PAY = PRICE_TIERS.big.talentPay;
const platformNames = jobPlatforms.map((p) => p.name).join(", ");

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
  `On-site SIWES at any campus: no separate placement fee. Learn & Pay students pay the regular course fee for their department, with up to ${SIWES_MAX_DISCOUNT_PCT}% off for SIWES and IT students on request; Tutor & Earn students are paid. Virtual SIWES is charged because it covers courier delivery.`,
  `Virtual SIWES (online industrial training placement): ${naira(VIRTUAL_SIWES.placementPriceNGN)}. Logbook review, signing, stamping and two-way courier delivery: ${naira(VIRTUAL_SIWES.logbookPriceNGN)}.`,
  `${SUCCESS_KIT.name}: ${naira(SUCCESS_KIT.priceNGN)}.`,
  `Pay-per-task services for businesses: ${SERVICES.length} fixed-price tasks in ${SERVICE_CATEGORIES.length} categories (${SERVICE_CATEGORIES.map((c) => c.name).join(", ")}), from ${naira(minBusinessPrice)} per task at ${url("/services")}. Standard orders can be paid online immediately; custom or bulk work gets a quote with a pay link. No salary, no contract.`,
  `Side hustles for talent: the same ${SERVICES.length} tasks are paid work for Nigerians at ${url("/side-hustles")}: ${naira(SMALL_PAY)} per standard task or ${naira(BIG_PAY)} per big task, paid weekly every Friday for approved tasks, ${OPENINGS_PER_SERVICE} openings per side hustle. Joining the talent pool is free.`,
  `Jobs and talent marketplace at ${url("/careers")}: Tech Faculty roles and client projects (apply with one free talent profile), plus curated remote tech and AI-training jobs open to Nigerians from partner platforms (${platformNames}), refreshed twice a month.`,
  `Hiring: businesses can browse the public talent pool at ${url("/talent/pool")} or send a brief at ${url("/hire")}. A Vetted badge means the person passed a Tech Faculty assessment or work trial, or is a Tech Faculty student or graduate.`,
  `Studying from outside Nigeria: every programme can be taken online from any country, with prices shown and charged in US dollars (₦${NGN_TO_USD_RATE.toLocaleString("en-NG")} = $1); details at ${url("/study-online-africa")}.`,
  `Certificates: each graduate gets one Certificate of Achievement, issued from the student dashboard and verifiable by Faculty ID or certificate number at ${url("/verify")}.`,
  `Software products: Tech Faculty also builds and publishes its own apps (${apps.map((a) => a.name).join(", ")}), listed at ${url("/products")}.`,
  `AI assistants can query live programmes, services, side hustles, open roles, jobs and the public talent pool through the public Tech Faculty MCP server (no sign-in needed): ${MCP_URL}`,
  `Google rating for the Nnewi campus: ${GOOGLE_RATING.rating} from ${GOOGLE_RATING.count} reviews (checked ${GOOGLE_RATING.checked}), ${GOOGLE_REVIEWS_URL}.`,
  `Contact: WhatsApp +${VIRTUAL_SIWES.whatsappNumber}, email ${VIRTUAL_SIWES.email}.`,
];

const header = [
  `# ${BRAND}`,
  "",
  `> ${BRAND} trains, certifies and places Nigerians in tech careers: ${departments.length} departments online or at ${campuses.length} campuses across Nigeria, a Free AI Course (Everyday AI & Digital Productivity), SIWES industrial training placements, ${SERVICES.length} pay-per-task services for businesses and the matching ${SERVICES.length} paid side hustles for talent, and a jobs and talent marketplace. ${CREDENTIAL}.`,
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
  `- [SIWES and IT placement](${url("/siwes")}): On site at our campuses with no separate placement fee: Learn & Pay (regular course fee, up to ${SIWES_MAX_DISCOUNT_PCT}% off for SIWES students) or Tutor & Earn (paid).`,
  `- [Virtual SIWES](${url("/virtual-siwes")}): Online IT placement for ${naira(VIRTUAL_SIWES.placementPriceNGN)}, plus logbook review, signing, stamping and two-way delivery for ${naira(VIRTUAL_SIWES.logbookPriceNGN)}.`,
  `- [${SUCCESS_KIT.name}](${url("/siwes-success-kit")}): ${SUCCESS_KIT.tagline} ${naira(SUCCESS_KIT.priceNGN)}, with a free placement checklist.`,
  `- [Build in Public guide](${url("/build-in-public")}): How students turn each class task into a public portfolio on LinkedIn, X and WhatsApp.`,
  `- [SIWES by course of study](${url("/siwes/courses")}): What a tech SIWES placement involves for students outside computer science, with projects, logbook examples and what to confirm with the SIWES coordinator.`,
  ...siwesCourses.map((c) => `- [${c.h1}](${url(`/siwes/courses/${c.slug}`)}): ${c.metaDescription}`),
  "",
  "## Campuses",
  "",
  `- [All campuses](${url("/locations")}): ${campuses.length} Tech Faculty centres across Nigeria.`,
  ...campuses.map((c) => `- [${campusName(c)}](${url(`/locations/${c.slug}`)}): ${c.address}. ${oneLine(c.tagline)}`),
  "",
  "## Pay-per-task services for businesses",
  "",
  `- [All ${SERVICES.length} services](${url("/services")}): Fixed-price tasks done by vetted Tech Faculty talent, from ${naira(minBusinessPrice)} per task. Pay now for standard orders or get a quote for custom work.`,
  ...SERVICE_CATEGORIES.map((c) => `- [${c.name}](${url(`/services/category/${c.slug}`)}): ${oneLine(c.tagline)} ${inCategory(c.slug).length} services from ${fromPrice(inCategory(c.slug))}.`),
  ...SERVICES.map((x) => `- [${x.name}](${url(`/services/${x.slug}`)}): ${categoryName(x.category)}. From ${naira(businessPrice(x))} ${x.unit}, ${x.turnaround}. ${oneLine(x.summary)}`),
  "",
  "## Jobs and side hustles for talent",
  "",
  `- [Jobs & talent marketplace](${url("/careers")}): Tech Faculty roles, client projects and curated remote jobs open to Nigerians. Apply with one free talent profile.`,
  `- [Join the talent pool](${url("/talent")}): Free profile that gets you matched to paid roles, projects and side hustles.`,
  `- [All ${SERVICES.length} side hustles](${url("/side-hustles")}): Pay-per-task work: ${naira(SMALL_PAY)} per standard task or ${naira(BIG_PAY)} per big task, paid weekly every Friday, ${OPENINGS_PER_SERVICE} openings each.`,
  ...jobPlatforms.map((p) => `- [${p.keyword}](${url(`/careers/platforms/${p.slug}`)}): ${oneLine(p.blurb)} Guide for Nigerians and Africans.`),
  ...SERVICES.map((x) => `- [${x.hustleTitle}](${url(`/side-hustles/${x.slug}`)}): ${categoryName(x.category)} side hustle. Earn ${naira(talentPay(x))} per task (${x.unit}), paid weekly.`),
  "",
  "## Hire talent",
  "",
  `- [Hire vetted tech talent](${url("/hire")}): Send a brief for developers, analysts, designers, marketers, testers, field reps or support staff, remote or on-site.`,
  `- [Browse the talent pool](${url("/talent/pool")}): Public profiles of Tech Faculty talent across Nigeria and Africa, with skills, availability and Vetted badges.`,
  "",
  "## Software products",
  "",
  `- [All products](${url("/products")}): Apps built and published by Tech Faculty.`,
  ...apps.map((a) => `- [${a.name}](${url(`/products/${a.slug}`)}): ${oneLine(a.tagline)}. ${oneLine(a.summary)}`),
  "",
  "## For AI assistants",
  "",
  `- [Tech Faculty MCP server](${MCP_URL}): public Model Context Protocol endpoint (no sign-in needed) with read-only tools for departments, campuses, blog guides, the ${SERVICES.length} business services, the ${SERVICES.length} side hustles, open Tech Faculty roles, curated remote jobs, job platform guides and the public talent pool. Students see their own courses, classes and certificates on the website dashboard.`,
  `- [Full detail in plain text](${url("/llms-full.txt")}): Prices, FAQs and the complete services and side hustle catalogue.`,
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
  `- [Tech hubs directory](${url("/hubs")}): Editorial directory of ${techHubs.length} tech hubs and training institutes in Nigeria. Listing a hub does not imply a partnership.`,
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

const servicesFull = [
  "## Pay-per-task services for businesses",
  "",
  `Page: ${url("/services")}`,
  `${SERVICES.length} fixed-price tasks in ${SERVICE_CATEGORIES.length} categories. Standard tasks start at ${naira(PRICE_TIERS.small.businessFrom)} and big tasks at ${naira(PRICE_TIERS.big.businessFrom)}; some services bundle several tasks and are priced per bundle. Ordering: "Standard: pay now" pays online straight away; "Custom: get a quote" sends a brief and we reply with a quote and a pay link.`,
  "",
  "How it works:",
  ...HOW_IT_WORKS.map((step, i) => `${i + 1}. ${step}`),
  "",
  ...faqBlock(SERVICE_FAQS),
  ...SERVICE_CATEGORIES.flatMap((c) => [
    `### ${c.name} (${inCategory(c.slug).length} services)`,
    "",
    `Page: ${url(`/services/category/${c.slug}`)}`,
    oneLine(c.intro),
    "",
    ...inCategory(c.slug).flatMap((x) => [
      `- ${x.name} (${url(`/services/${x.slug}`)}): ${oneLine(x.summary)} For: ${oneLine(x.forWho)} Price: from ${naira(businessPrice(x))} ${x.unit}. Turnaround: ${x.turnaround}. Delivered: ${x.deliverables.join("; ")}.`,
      ...x.faqs.map((f) => `  Q: ${oneLine(f.q)} A: ${oneLine(f.a)}`),
    ]),
    "",
  ]),
];

const hustlesFull = [
  "## Side hustles for talent (pay per task)",
  "",
  `Page: ${url("/side-hustles")}`,
  `Every business service above is also a paid side hustle. Talent earn ${naira(SMALL_PAY)} per standard task or ${naira(BIG_PAY)} per big task; Testing & QA tasks pay ${naira(SMALL_PAY)} each (three days of use, then screenshots and a written report). A Tech Faculty manager checks each task and approved tasks are paid weekly, every Friday. Each side hustle has ${OPENINGS_PER_SERVICE} openings, and remote tasks are open nationwide while field work is in covered cities.`,
  "",
  "How to start:",
  ...HUSTLE_STEPS.map((step, i) => `${i + 1}. ${step}`),
  "",
  ...SERVICE_CATEGORIES.flatMap((c) => [
    `### ${c.name} side hustles (${payRange(inCategory(c.slug))} per task)`,
    "",
    ...inCategory(c.slug).map((x) => `- ${x.hustleTitle} (${url(`/side-hustles/${x.slug}`)}): ${naira(talentPay(x))} per task (${x.unit}). Needs: ${x.hustleNeeds.join("; ")}.`),
    "",
  ]),
];

const jobsFull = [
  "## Jobs and talent marketplace",
  "",
  `Page: ${url("/careers")}`,
  "One free talent profile is used to apply for Tech Faculty roles and approved client projects. Every saved profile is listed straight away; profile detail improves match ranking. Our system scores suitable roles and the team reviews matches before they are shared. Some roles start with a short work trial before selection, and work after selection is coordinated on Slack.",
  `The board also lists curated remote tech and AI-training jobs (including data annotation, AI writing and evaluation roles) open to Nigerian and African talent, refreshed on the 1st and 15th of each month. Apply directly on the partner platform.`,
  "",
  "### Partner job platforms",
  "",
  ...jobPlatforms.flatMap((p) => [
    `#### ${p.name}`,
    "",
    `Page: ${url(`/careers/platforms/${p.slug}`)}`,
    `${oneLine(p.blurb)} ${oneLine(p.about)}`,
    "",
    ...faqBlock(p.faqs),
  ]),
];

const hiringFull = [
  "## Hiring Tech Faculty talent",
  "",
  `Pages: ${url("/hire")} (send a brief) and ${url("/talent/pool")} (browse public profiles).`,
  "Businesses describe the work, budget and timeline; Tech Faculty matches suitable talent and introduces them. Talent profiles show skills, tools, availability, work mode and experience. A Vetted badge means the person passed a Tech Faculty assessment or work trial, or is a Tech Faculty student or graduate. For one-off tasks, the fixed-price services above are usually faster than a hire.",
  "",
];

const trainingFull = [
  "## Staff training for businesses",
  "",
  `Page: ${url("/business-partnerships")}. Every package is quoted to the team within two working days.`,
  "",
  ...BUSINESS_PACKAGES.map((b) => `- ${b.title}: ${oneLine(b.summary)} For: ${oneLine(b.audience)}. Covers: ${b.covers.join("; ")}.`),
  "",
];

const productsFull = [
  "## Software products by Tech Faculty",
  "",
  `Page: ${url("/products")}`,
  "",
  ...apps.flatMap((a) => [
    `### ${a.name}: ${oneLine(a.tagline)}`,
    "",
    `Page: ${url(`/products/${a.slug}`)}`,
    oneLine(a.summary),
    `Features: ${a.features.join("; ")}.`,
    ...Object.entries(a.links).filter(([, v]) => v).map(([k, v]) => `${k === "playstore" ? "Google Play" : k === "appstore" ? "App Store" : "Web"}: ${v}`),
    "",
    ...faqBlock(a.faq),
  ]),
];

const assistantsFull = [
  "## For AI assistants",
  "",
  `MCP server (Model Context Protocol, streamable HTTP): ${MCP_URL}. Public: no sign-in or API key needed. All tools are read-only.`,
  "Tools: list_departments, list_campuses, list_services, list_business_services, list_side_hustles, list_open_roles, search_jobs, list_job_platforms, search_talent_pool (first names only), list_blog_categories, list_blog_posts, get_blog_post, search_blog. Student accounts (courses, classes, certificates) stay on the website dashboard.",
  "",
];

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
  ...servicesFull,
  ...hustlesFull,
  ...jobsFull,
  ...hiringFull,
  ...trainingFull,
  ...productsFull,
  ...assistantsFull,
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
