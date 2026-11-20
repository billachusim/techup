// Automatic answers for common WhatsApp inbox questions: prices, locations,
// SIWES, finding work and hiring us for a task. Everything else (payments, discounts, complaints, anything unclear) is
// handed to staff. Answers are built from the same data as the site, so a
// price or address change updates them too. Pure functions, no I/O.
import { campuses } from "@/data/campuses";
import { departments } from "@/data/departments";
import { HYBRID_FEE, PHYSICAL_FEE, naira, planMinimum } from "@/lib/fees";
import { CAMPUS_COUNT, CITY_COUNT, VIRTUAL_SIWES } from "@/data/virtualSiwes";
import { INSTALMENTS } from "../../supabase/functions/_shared/pricing.ts";
import { PRICE_TIERS, SERVICE_CATEGORIES } from "@/data/services";
import { SLACK_JOIN_URL } from "@/data/coursePrograms";

export type AutoAnswerIntent = "prices" | "location" | "siwes" | "virtual_siwes" | "jobs" | "services";

export const AUTO_ANSWER_LABEL: Record<AutoAnswerIntent | "other", string> = {
  prices: "Prices",
  location: "Location",
  siwes: "SIWES",
  virtual_siwes: "Virtual SIWES",
  jobs: "Jobs & talent",
  services: "Business services",
  other: "Handed to staff",
};

const SITE = "https://techfaculty.ng";

export const AUTO_ANSWER_FOOTER =
  "This is an automatic answer. Reply here with any other question and our team will get back to you.";

export const HANDOFF_ACK =
  "Thanks for your message. Someone from our team will reply here shortly.\n\n" +
  "If you want prices, campus locations, SIWES details or ways to find work with us, just ask and you'll get an answer straight away.";

/** Messages that always go to a person, even if they also mention a price or SIWES. */
const STAFF_ONLY = [
  /\b(i|we)\s*(have|'ve|ve|just|already)?\s*(paid|transferred|sent (the )?money|made (the )?payment)\b/,
  /\b(receipt|proof of payment|payment proof|debited|refund|reversal|chargeback)\b/,
  /\b(account (number|details)|bank (details|account)|pay by transfer|transfer to)\b/,
  /\b(discount|promo|coupon|code|scholarship|sponsor|free slot)\b/,
  /\b(complain|complaint|not happy|disappointed|scam|fraud|cheat)\w*\b/,
  /\b(call me|speak (to|with)|talk (to|with)|human|real person|agent|manager|founder|mr\.? bill)\b/,
  /\b(certificate|result|transcript|my (account|dashboard|login|password))\b/,
  /\b(partner|partnership|collaborat\w*)\b/,
];

const PRICE = /\b(price|prices|pricing|cost|costs|how much|fee|fees|tuition|charge|charges|amount|naira|instal+ments?|payment plan|afford\w*)\b|₦|\bngn\b/;
const LOCATION = /\b(where (are|is) (you|your|the|una)|location|located|locate|address|direction|directions|campus|campuses|branch|branches|centre|center|office|come (to|over)|visit)\b/;
const SIWES = /\b(siwes|s\.i\.w\.e\.s|industrial (training|attachment)|i\.?t\.? (placement|letter|programme|program|students?)|placement|attachment|logbook|log book|itf|tutor (and|&|n) earn)\b/;
/** People looking for work: jobs, freelance, side hustles, "are you hiring". */
const JOBS = /\b(jobs?|vacanc\w*|freelanc\w*|gigs?|side ?hustles?|employment|are (you|una) hiring|(any|open) (roles?|openings?|positions?)|looking for (work|a role|remote work)|(find|get|need|want|apply for) (some |a )?(work|role|remote work|remote role)|work (opportunit\w*|with you)|talent (pool|profile))\b/;
/** Businesses that want our talent to do a task for them. "Hire me" is a job-seeker. */
const SERVICES = /\b(hire\b(?! me\b)|hiring (a|an|someone|people|talent)\b|recruit (a|an|someone|talent)\b|for my (business|company|brand|shop|store|startup|organi[sz]ation)\b|(build|design|make|create|develop|set ?up) (me|us|my|our)\b|your services\b|services you offer\b|business services\b|get a quote\b|quotation\b)/;
const VIRTUAL = /\b(virtual|online|remote|remotely|from home|waybill|courier|logbook|log book)\b/;

/** Words people use for each department, matched against the message. */
const DEPARTMENT_WORDS: Record<string, RegExp> = {
  "web-development": /\b(web|website|websites|frontend|front end|backend|back end|full ?stack|react|javascript|node)\b/,
  "mobile-app-development": /\b(mobile|app development|apps?|flutter|android|ios)\b/,
  "data-science-analytics": /\b(data|analytics|analysis|analyst|excel|power ?bi|sql)\b/,
  cybersecurity: /\b(cyber ?security|cyber|ethical hack\w*|hacking|security)\b/,
  "ai-machine-learning": /\b(machine learning|artificial intelligence|ml|ai engineer\w*|deep learning)\b/,
  "basic-internet-ai-studies": /\b(basic|beginners?|computer appreciation|internet)\b/,
  "digital-marketing": /\b(digital marketing|marketing|social media)\b/,
  design: /\b(design|designer|ui|ux|graphics?|figma)\b/,
  "cloud-computing": /\b(cloud|aws|azure|devops)\b/,
  "robotics-iot": /\b(robotics?|iot|arduino|embedded|electronics)\b/,
};

const normalize = (text: string) => text.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();

const spokenWeeks = (d: string) => d.replace(/^(\d+)-(\d+)/, "$1 to $2");

function mentionedDepartments(t: string) {
  return departments.filter((d) => DEPARTMENT_WORDS[d.slug]?.test(t));
}

function mentionedCampuses(t: string) {
  return campuses.filter((c) => {
    const city = c.city.toLowerCase();
    const short = city === "port harcourt" ? /\b(port harcourt|ph|portharcourt)\b/ : city === "benin city" ? /\bbenin\b/ : null;
    return short ? short.test(t) : new RegExp(`\\b${city}\\b`).test(t) || new RegExp(`\\b${c.state.toLowerCase()}\\b`).test(t);
  });
}

const instalmentLine = () =>
  INSTALMENTS.enabled
    ? `Fees of ${naira(INSTALMENTS.minimumTotal)} or more can be paid in two parts: ${INSTALMENTS.depositPercent}% to start and the rest within ${INSTALMENTS.balanceDueDays} days.`
    : "";

function departmentPrice(d: (typeof departments)[number]): string | null {
  const min = d.planId ? planMinimum(d.planId) : undefined;
  if (min === undefined) return null; // Fee is quoted by staff (e.g. Robotics & IoT).
  if (min === 0) return `${d.title} is free. It takes ${spokenWeeks(d.duration)}, online or at any of our campuses.`;
  return `${d.title} takes ${spokenWeeks(d.duration)} and costs ${naira(min)} for online study, with every module included.`;
}

function pricesAnswer(t: string): string | null {
  const named = mentionedDepartments(t);
  const modes = `Hybrid study (online plus monthly meetups) adds ${naira(HYBRID_FEE)}, and weekly on-site classes add ${naira(PHYSICAL_FEE)}.`;
  if (named.length) {
    const lines = named.map(departmentPrice);
    if (lines.some((l) => l === null)) return null;
    const link = named.length === 1 ? `${SITE}/departments/${named[0].slug}` : `${SITE}/departments`;
    return [lines.join("\n"), modes, instalmentLine(), `Details and enrolment: ${link}`].filter(Boolean).join("\n\n");
  }
  const paid = departments
    .map((d) => ({ d, min: d.planId ? planMinimum(d.planId) : undefined }))
    .filter((x): x is { d: (typeof departments)[number]; min: number } => typeof x.min === "number" && x.min > 0)
    .sort((a, b) => a.min - b.min);
  const free = departments.filter((d) => d.planId && planMinimum(d.planId) === 0);
  return [
    "Our course fees for online study:",
    paid.map(({ d, min }) => `• ${d.title}: from ${naira(min)}`).join("\n"),
    free.length ? `${free.map((d) => d.title).join(", ")} is free.` : "",
    modes,
    instalmentLine(),
    `Tell us which course you want and we can give you the exact amount. All courses: ${SITE}/departments`,
  ].filter(Boolean).join("\n\n");
}

function locationAnswer(t: string): string {
  const named = mentionedCampuses(t);
  if (named.length) {
    return named
      .map((c) => `Our ${c.city} campus (${c.name}) is at ${c.address}.\nMap and details: ${SITE}/locations/${c.slug}`)
      .join("\n\n");
  }
  const hq = campuses.find((c) => c.isHeadquarters) ?? campuses[0];
  const cities = [...new Set(campuses.map((c) => c.city))].sort((a, b) => a.localeCompare(b));
  return [
    `Our headquarters is at the ${hq.address}.`,
    `We have campuses in these ${CITY_COUNT} cities: ${cities.join(", ")}. You can also study fully online from anywhere.`,
    `Tell us your city and we'll send the nearest campus. All campuses: ${SITE}/locations`,
  ].join("\n\n");
}

function siwesAnswer(): string {
  return [
    `On-site SIWES (IT) at any of our ${CAMPUS_COUNT} campuses has no placement fee. You choose one of two tracks:`,
    "• Learn & Pay: structured mentorship and real client projects. You pay your department's course fee, with a discount for SIWES students.\n• Tutor & Earn: for students already skilled in tech. You teach other learners and get paid during your IT.",
    "Both tracks end with a certificate and a recommendation letter. ITF accepts placements with any registered business.",
    `Can't attend in person? Virtual SIWES is ${naira(VIRTUAL_SIWES.placementPriceNGN)}, and logbook review with courier delivery is ${naira(VIRTUAL_SIWES.logbookPriceNGN)}.`,
    `To apply, send your full name, school, department and preferred track here. Details: ${SITE}/siwes`,
  ].join("\n\n");
}

function virtualSiwesAnswer(): string {
  return [
    `Virtual SIWES costs ${naira(VIRTUAL_SIWES.placementPriceNGN)}. It includes your placement letter for your school, weekly live sessions with a mentor from your department, real project work, supervision records for your school and the ITF, and a completion certificate with a recommendation letter.`,
    `Logbook review, signing and stamping is ${naira(VIRTUAL_SIWES.logbookPriceNGN)}, with courier pickup and return included. It takes ${VIRTUAL_SIWES.turnaround}.`,
    `Apply and pay online: ${SITE}/virtual-siwes`,
  ].join("\n\n");
}

const SITE_TALENT = `${SITE}/talent/profile`;

/** How to find work with us. Shared with the "Find work" quick reply. */
export function jobsAnswer(): string {
  return [
    "Tech Faculty NG connects skilled people with paid remote tech roles and pay-per-task side hustles. Here's how to start:",
    `1. Create your free talent profile (a few minutes): ${SITE_TALENT}\n2. See open roles and apply: ${SITE}/careers\n3. Side hustles paid ${naira(PRICE_TIERS.small.talentPay)} to ${naira(PRICE_TIERS.big.talentPay)} per task: ${SITE}/side-hustles`,
    "Applications are matched to roles automatically. A fuller profile ranks higher, and passing an assessment earns a Vetted badge.",
    `Join our Slack with the same email as your profile. New roles and assessments are posted there: ${SLACK_JOIN_URL}`,
  ].join("\n\n");
}

/** What businesses can hire us for. Shared with the "Hire us" quick reply. */
export function servicesAnswer(): string {
  const names = SERVICE_CATEGORIES.map((c) => c.name).join(", ");
  return [
    `Our vetted talent take on tasks for businesses: ${names}.`,
    `Standard tasks start from ${naira(PRICE_TIERS.small.businessFrom)} and you can pay online when you order: ${SITE}/services`,
    `Need something custom? Send a short brief and we'll reply with a quote: ${SITE}/hire`,
  ].join("\n\n");
}

export type AutoAnswerDecision =
  | { kind: "answer"; intents: AutoAnswerIntent[]; reply: string }
  | { kind: "handoff"; intent: AutoAnswerIntent | "other"; reason: string; canTryAi?: boolean };

/** Decides whether a message gets an automatic answer, and builds it. */
export function decideAutoAnswer(rawText: string): AutoAnswerDecision {
  const t = normalize(rawText);
  if (!t || t.startsWith("[")) return { kind: "handoff", intent: "other", reason: "Not a text message" };
  if (t.length > 400) return { kind: "handoff", intent: "other", reason: "Long message" };
  if (STAFF_ONLY.some((re) => re.test(t))) return { kind: "handoff", intent: "other", reason: "Needs a person (payment, discount, complaint or request for staff)" };

  const intents: AutoAnswerIntent[] = [];
  const siwes = SIWES.test(t);
  const jobs = JOBS.test(t);
  const services = !jobs && SERVICES.test(t);
  if (siwes && VIRTUAL.test(t)) intents.push("virtual_siwes");
  else if (siwes) intents.push("siwes");
  if (jobs) intents.push("jobs");
  if (services) intents.push("services");
  // SIWES answers quote their own fees; "how much do you pay" from a job-seeker is about pay, not fees.
  if (PRICE.test(t) && !siwes && !jobs && !services) intents.push("prices");
  if (LOCATION.test(t) || (mentionedCampuses(t).length && /\b(where|near|nearest|in)\b/.test(t))) intents.push("location");
  if (!intents.length) return { kind: "handoff", intent: "other", reason: "No common question recognised", canTryAi: true };

  const parts: string[] = [];
  for (const intent of intents) {
    const part = intent === "prices" ? pricesAnswer(t)
      : intent === "location" ? locationAnswer(t)
      : intent === "siwes" ? siwesAnswer()
      : intent === "jobs" ? jobsAnswer()
      : intent === "services" ? servicesAnswer()
      : virtualSiwesAnswer();
    if (!part) return { kind: "handoff", intent, reason: "Fee is quoted by staff for this course" };
    parts.push(part);
  }
  return { kind: "answer", intents, reply: [...parts, AUTO_ANSWER_FOOTER].join("\n\n") };
}

/** Limits that keep the auto-answers from talking over staff or repeating themselves. */
export const AUTO_ANSWER_RULES = {
  /** Staff replied to this contact within this many hours: stay quiet and leave it to them. */
  staffActiveHours: 6,
  /** The same answer isn't sent to the same contact twice within this window. */
  repeatHours: 24,
  /** At most this many automatic messages per contact per day. */
  maxPerDay: 4,
  /** The "someone will reply" note is sent at most once in this window. */
  ackHours: 12,
  /** Messages older than this (webhook backlog) are handed off without a reply. */
  staleMinutes: 60,
};
