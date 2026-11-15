import type { BlogPost } from "../types/blog";
import {
  OPENINGS_PER_SERVICE,
  PRICE_TIERS,
  SERVICES,
  SERVICE_CATEGORIES,
  businessPrice,
  servicesInCategory,
} from "./services";

/**
 * One guide per service category, plus a side-hustle guide. The opening and the
 * "when it makes sense" section are written per category; the price table, links
 * and FAQ come from src/data/services.ts so they never drift from the service pages.
 */

const PUBLISHED = "2026-11-15";

// Local formatter so the MCP bundle that includes blog posts does not pull in the pricing tables.
const naira = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

type Guide = {
  title: string;
  seoTitle: string;
  description: string;
  tag: string;
  opening: string;
  whenItFits: string[];
  extraFaq: [string, string];
};

const GUIDES: Record<string, Guide> = {
  "content-creative": {
    title:
      "How to Hire a Video Editor or Designer in Nigeria Without Hiring Anyone",
    seoTitle: "Hire a Video Editor in Nigeria, Pay per Video",
    description:
      "Get AI videos, Reels edits, flyers and logos for your Nigerian business and pay per piece, not a salary. Prices, how it works and what to send.",
    tag: "Startups & Business",
    opening:
      "Most small businesses in Nigeria need fresh videos and designs every week, but a full-time video editor or graphic designer is a salary many cannot carry. The fix is simple: pay per piece. You send a brief, a vetted creator makes the video or design, and you pay only for what is delivered.",
    whenItFits: [
      "You post on Instagram, TikTok or WhatsApp Status every week",
      "You run promos and need flyers fast",
      "You have product photos but no time to make them look good",
      "You need a logo or brand kit once, not a designer forever",
    ],
    extraFaq: [
      "Can I get AI videos without filming anything?",
      "Yes. Send your photos, logo and message, and the creator builds the video with AI tools.",
    ],
  },
  "marketing-social-media": {
    title:
      "Social Media Management for Small Businesses in Nigeria: Pay Weekly, Not Monthly",
    seoTitle: "Social Media Manager in Nigeria, Pay Weekly",
    description:
      "Weekly social media management, SEO articles, Google Business Profile and WhatsApp marketing for Nigerian small businesses, with fixed prices per task.",
    tag: "Startups & Business",
    opening:
      "Posting every day, replying to comments and showing up on Google is real work. Many Nigerian business owners try to do it at night and give up within a month. Pay-per-task marketing lets you hand it off week by week, so you only pay while it is working for you.",
    whenItFits: [
      "Your pages go quiet for weeks at a time",
      "Customers can't find you on Google Maps",
      "You sell on WhatsApp but have no catalogue",
      "You want blog traffic but have no writer",
    ],
    extraFaq: [
      "Do I lose control of my accounts?",
      "No. Managers are added as team members where the platform allows, and you can remove them any time.",
    ],
  },
  "field-sales": {
    title:
      "Door-to-Door Marketing Reps in Nigeria: Pay per Visit, Not per Month",
    seoTitle: "Door-to-Door Marketing Reps in Nigeria",
    description:
      "Hire field reps for door-to-door marketing, flyer distribution, lead generation, surveys and product sampling in Nigeria. Pay per batch, with photo proof.",
    tag: "Startups & Business",
    opening:
      "In Nigeria, many sales still happen face to face: in shops, markets, offices and campuses. Hiring a sales team is expensive and slow. Pay-per-task field reps give you people on the ground for a batch of visits, with every contact logged and photographed.",
    whenItFits: [
      "You sell to shops, schools or offices",
      "You are launching in a new city",
      "You need real customer feedback before a launch",
      "You want flyers handed out where your customers are",
    ],
    extraFaq: [
      "How do I know the visits happened?",
      "Every visit is logged with the business name, contact and a photo, and our managers spot-check them.",
    ],
  },
  "web-development": {
    title:
      "Hire a Developer for a One-Time Job in Nigeria: Websites, Fixes and Data Work",
    seoTitle: "Hire a Developer for a One-Time Job in Nigeria",
    description:
      "Website reviews, bug fixes, landing pages, online stores and spreadsheet automation for Nigerian businesses, priced per task with no retainer.",
    tag: "Web & Software Development",
    opening:
      "Your website form stopped sending, or you need a landing page by Friday, or your records are a mess of spreadsheets. None of these needs a full-time developer. Pay-per-task development gets one job done properly, by a vetted developer, at a fixed starting price.",
    whenItFits: [
      "Your old developer is no longer around",
      "You need a page or store live this week",
      "Small website changes pile up",
      "You track the business in messy spreadsheets",
    ],
    extraFaq: [
      "What is vibe coding?",
      "Building software with AI coding tools. Our developers use them to work faster, then test everything by hand.",
    ],
  },
  "testing-qa": {
    title: "App Testing Services in Nigeria: Real Testers on Real Phones",
    seoTitle: "App Testing Services in Nigeria, Pay per Test",
    description:
      "Mobile app testing, website usability tests, payment flow checks and beta tester groups on real Nigerian phones and networks. Pay per test session.",
    tag: "Web & Software Development",
    opening:
      "An app that works on your iPhone in Lekki can crash on a Tecno phone in Nnewi. Real users on real devices and networks find problems your team misses. Pay-per-test QA lets you test before every launch without hiring a QA team.",
    whenItFits: [
      "You are about to launch or update an app",
      "Customers drop off at sign-up or checkout",
      "You release often and things break",
      "You want honest feedback before spending on ads",
    ],
    extraFaq: [
      "Do testers post public reviews?",
      "No. Testing is private feedback for you. We never write or pay for public reviews.",
    ],
  },
  cybersecurity: {
    title:
      "Cybersecurity Services for Small Businesses in Nigeria: Pen Tests, Scans and Training",
    seoTitle: "Cybersecurity Services for Small Businesses in Nigeria",
    description:
      "Website security scans, penetration testing, email security, Wi-Fi checks and staff scam training for Nigerian small businesses, at fixed task prices.",
    tag: "Cybersecurity",
    opening:
      "Hackers and scammers go after small Nigerian businesses because they are easy targets: shared passwords, outdated websites and staff who have never seen a phishing test. You do not need a security department to fix the basics. You need a few fixed-price tasks done well.",
    whenItFits: [
      "You take payments or customer data online",
      "Your website runs on WordPress",
      "Staff share passwords on WhatsApp",
      "Someone has tried to send fake invoices in your name",
    ],
    extraFaq: [
      "Is penetration testing legal?",
      "Yes, with written permission. We only test systems you own, after you sign a scope and permission letter.",
    ],
  },
  "ai-automation": {
    title: "AI and Automation Services for Small Businesses in Nigeria",
    seoTitle: "AI Automation Services for Small Businesses in Nigeria",
    description:
      "AI chatbots, WhatsApp AI agents, workflow automation and AI staff training for Nigerian small businesses, set up per task by Tech Faculty talent.",
    tag: "Artificial Intelligence",
    opening:
      "AI can answer your customers, read your invoices and connect your apps, but most small businesses never get past trying ChatGPT. Pay-per-task AI setup gets one working automation into your business at a time, built and tested by people trained in these tools.",
    whenItFits: [
      "You answer the same customer questions all day",
      "Staff copy data between apps by hand",
      "Receipts and invoices pile up",
      "Your team wants to use AI but doesn't know how",
    ],
    extraFaq: [
      "Will AI replace my staff?",
      "The goal is to take repetitive work off your staff so they can focus on customers and sales.",
    ],
  },
  "admin-support": {
    title:
      "Virtual Assistant Services in Nigeria: Pay per Task or per 3-Hour Block",
    seoTitle: "Virtual Assistant in Nigeria, Pay per Task",
    description:
      "Virtual assistants, customer support, transcription, bookkeeping entries, CV screening and translation for Nigerian businesses, priced per task.",
    tag: "Startups & Business",
    opening:
      "Owners lose hours every week to admin: emails, customer messages, typing, research and records. A full-time assistant is not always affordable. A pay-per-task virtual assistant takes those jobs off your desk only when you need it.",
    whenItFits: [
      "Customer messages go unanswered",
      "You are hiring and have a pile of CVs",
      "Meetings and interviews need typing up",
      "Receipts need recording before tax time",
    ],
    extraFaq: [
      "Can I use the same assistant every time?",
      "Yes. Tell us in your brief and we will keep the same person on your work where possible.",
    ],
  },
};

const tableFor = (catSlug: string) =>
  [
    "| Service | Starts from | What you get |",
    "|---|---|---|",
    ...servicesInCategory(catSlug).map(
      (s) =>
        `| [${s.name}](/services/${s.slug}) | ${naira(businessPrice(s))} ${s.unit} | ${s.deliverables[0]} |`,
    ),
  ].join("\n");

const categoryPost = (catSlug: string, g: Guide): BlogPost => {
  const cat = SERVICE_CATEGORIES.find((c) => c.slug === catSlug)!;
  const svcs = servicesInCategory(catSlug);
  const content = `# ${g.title}

*By Bill Achusim · Published Nov 15, 2026*

**Short answer:** ${cat.intro}

${g.opening}

## When pay-per-task makes sense

${g.whenItFits.map((x) => `- ${x}`).join("\n")}

## ${cat.name} services and prices

${tableFor(catSlug)}

Prices are where a standard task starts. Bigger or rush jobs are quoted before work begins, and you approve first. See all ${svcs.length} on the [${cat.name} services page](/services/category/${cat.slug}).

## How it works

1. [Send a brief](/services/category/${cat.slug}) with what you need and how many.
2. We confirm the price and assign a vetted Tech Faculty talent, usually within one working day.
3. Work arrives on WhatsApp, email or a shared channel, and you ask for changes there.
4. You pay per task delivered. Order more next week, or stop.

## Want to earn doing this work?

Every service on this page is also a [pay-per-task side hustle](/side-hustles). Talent earns ${naira(PRICE_TIERS.small.talentPay)} to ${naira(PRICE_TIERS.big.talentPay)} per task, paid weekly, with ${OPENINGS_PER_SERVICE} openings for each role.

## Frequently asked questions

### Do I need to sign a contract?
No. You pay per task. There is no salary, retainer or monthly contract.

### Who does the work?
Trained and vetted Tech Faculty talent, checked by a Tech Faculty manager before anything reaches you.

### ${g.extraFaq[0]}
${g.extraFaq[1]}

### How fast can you start?
Most tasks start within one working day of confirming your brief.
`;
  return {
    slug: cat.blogSlug,
    title: g.title,
    seoTitle: g.seoTitle,
    description: g.description,
    content,
    date: PUBLISHED,
    author: "Bill Achusim",
    tags: [
      g.tag,
      `${cat.name} services Nigeria`,
      "pay per task",
      "small business Nigeria",
    ],
    readTime: 6,
  };
};

const sideHustlePost = (): BlogPost => {
  const examples = SERVICE_CATEGORIES.map((c) => {
    const items = servicesInCategory(c.slug).slice(0, 4);
    return `**${c.name}:** ${items.map((s) => `[${s.hustleTitle}](/side-hustles/${s.slug})`).join(", ")}`;
  }).join("\n\n");
  return {
    slug: "pay-per-task-side-hustles-nigeria",
    title: `${SERVICES.length} Pay-per-Task Side Hustles in Nigeria That Pay Weekly`,
    seoTitle: "Pay-per-Task Side Hustles in Nigeria, Paid Weekly",
    description: `Earn ${naira(PRICE_TIERS.small.talentPay)} to ${naira(PRICE_TIERS.big.talentPay)} per task doing small jobs for real Nigerian businesses: video editing, flyers, app testing, data entry and more. Paid weekly.`,
    content: `# ${SERVICES.length} Pay-per-Task Side Hustles in Nigeria That Pay Weekly

*By Bill Achusim · Published Nov 15, 2026*

**Short answer:** Tech Faculty pays ${naira(PRICE_TIERS.small.talentPay)} per small task and ${naira(PRICE_TIERS.big.talentPay)} per big task for work ordered by real small businesses, paid every week. There are ${SERVICES.length} side hustles with ${OPENINGS_PER_SERVICE} openings each, and you can start by joining the free [talent pool](/talent).

Learning a skill is the easy part now. Getting paid for it is harder: salaried jobs are scarce, and freelancing platforms are crowded. Small businesses, meanwhile, need small jobs done every week and would rather pay per task than hire. We sit in the middle: businesses order [services](/services), and trained talent does the work.

## How it works

1. Join the [Tech Faculty talent pool](/talent) (free) and say which side hustle you want.
2. Pass a short skills check or sample task.
3. Pick up tasks as businesses order them, around school, work or your own business.
4. Get paid every Friday for each approved task.

## Side hustles you can start

${examples}

See the full list on the [side hustles page](/side-hustles).

## Don't have the skill yet?

Learn it first. Tech Faculty [courses](/departments) cover video, design, marketing, web development, data and cybersecurity, starting with a free bootcamp.

## Frequently asked questions

### How much can I earn?
${naira(PRICE_TIERS.small.talentPay)} for each small task and ${naira(PRICE_TIERS.big.talentPay)} for each big task, paid weekly for approved work.

### Do I need a laptop?
Not for every side hustle. Field reps, flyer distribution, testing and many social media tasks only need a smartphone.

### Is there a fee to join?
No. Joining the talent pool is free.

### When do I get paid?
Every Friday, for tasks approved that week.
`,
    date: PUBLISHED,
    author: "Bill Achusim",
    tags: [
      "Tech Careers",
      "side hustle Nigeria",
      "pay per task jobs",
      "make money online Nigeria",
      "weekly pay jobs Nigeria",
    ],
    readTime: 6,
  };
};

const servicesBlogPosts: BlogPost[] = [
  sideHustlePost(),
  ...SERVICE_CATEGORIES.filter((c) => GUIDES[c.slug]).map((c) =>
    categoryPost(c.slug, GUIDES[c.slug]),
  ),
];

export default servicesBlogPosts;
