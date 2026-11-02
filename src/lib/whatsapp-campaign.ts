/**
 * "We've revamped" WhatsApp campaign to every lead (pure rules, tested in
 * tests/whatsapp/campaign.test.ts). Each lead gets one message for their
 * group, with a one-tap link. Sending lives in whatsapp-campaign.server.ts.
 */
export const CAMPAIGN_ID = "revamp-2026-11";
export const SITE = "https://techfaculty.ng";

export type Segment = "student" | "siwes" | "course" | "general";

export const CAMPAIGN_TEMPLATES: Record<Segment, { name: string; body: string; examples: string[] }> = {
  general: {
    name: "tf_revamp_free_bootcamp",
    body:
      "Hi {{1}}, Tech Faculty has had a big upgrade! 🚀\n\n" +
      "✅ Prices slashed by up to 60%, courses from ₦50,000\n" +
      "✅ Campuses across Nigeria, plus live online classes\n" +
      "✅ 6,000+ students trained and a growing community\n\n" +
      "Start with our FREE tech bootcamp. One tap to join: {{2}}\n\n" +
      "Reply STOP to opt out.",
    examples: ["Ada", `${SITE}/?utm_source=whatsapp#free-bootcamp`],
  },
  siwes: {
    name: "tf_revamp_siwes",
    body:
      "Hi {{1}}, Tech Faculty has had a big upgrade! 🚀\n\n" +
      "✅ Online SIWES/IT placement with logbook signing\n" +
      "✅ Prices slashed by up to 60% and campuses across Nigeria\n" +
      "✅ 6,000+ students trained\n\n" +
      "See Virtual SIWES: {{2}}\nOr start our FREE tech bootcamp: {{3}}\n\n" +
      "Reply STOP to opt out.",
    examples: ["Ada", `${SITE}/virtual-siwes`, `${SITE}/#free-bootcamp`],
  },
  course: {
    name: "tf_revamp_course",
    body:
      "Hi {{1}}, good news from Tech Faculty! 🚀\n\n" +
      "{{2}} is now {{3}}, prices slashed by up to 60%. Learn online or at our campuses across Nigeria, with a certificate and job support.\n\n" +
      "See the course and enrol: {{4}}\n\n" +
      "Reply STOP to opt out.",
    examples: ["Ada", "Web Development", "₦50,000", `${SITE}/departments/web-development`],
  },
  student: {
    name: "tf_student_keep_going",
    body:
      "Hi {{1}}, a quick update from Tech Faculty! 🎓\n\n" +
      "We've upgraded the platform: classes twice a week, AI tutor feedback on your work, and your Certificate of Achievement when you finish. Keep going, you're doing great!\n\n" +
      "Open your dashboard: {{2}}",
    examples: ["Ada", `${SITE}/dashboard`],
  },
};

export interface CourseOffer { slug: string; title: string; price: number }

/** Words in a lead's notes/source that point to one department. */
const COURSE_WORDS: Array<[RegExp, string]> = [
  [/web ?dev|website|frontend|backend|full.?stack/i, "web-development"],
  [/mobile|app dev|android|ios|flutter/i, "mobile-app-development"],
  [/data|analytic|excel|power ?bi/i, "data-science-analytics"],
  [/cyber|security|hacking/i, "cybersecurity"],
  [/\bai\b|machine learning|artificial/i, "ai-machine-learning"],
  [/marketing|social media|seo/i, "digital-marketing"],
  [/design|ui|ux|figma|graphics/i, "design"],
  [/cloud|devops|aws/i, "cloud-computing"],
];

const SIWES_INTERESTS = new Set(["virtual_siwes", "logbook_service", "success_kit", "siwes_placement", "free_checklist"]);

export interface CampaignLead {
  id: string;
  name: string | null;
  contact: string;
  interest: string;
  status: string;
  notes: string | null;
  source: string | null;
  whatsapp_opt_out_at: string | null;
}

/** Last 10 digits, so 0803…, 234803… and +234 803… match. */
export const phoneKey = (raw: string) => raw.replace(/\D/g, "").slice(-10);

export function courseFor(lead: CampaignLead): string | null {
  const text = `${lead.notes ?? ""} ${lead.source ?? ""}`;
  return COURSE_WORDS.find(([re]) => re.test(text))?.[1] ?? null;
}

export function segmentFor(lead: CampaignLead, studentPhones: Set<string>): Segment {
  if (lead.status === "enrolled" || studentPhones.has(phoneKey(lead.contact))) return "student";
  if (SIWES_INTERESTS.has(lead.interest)) return "siwes";
  if (courseFor(lead)) return "course";
  return "general";
}

export function firstName(name: string | null): string {
  const n = (name ?? "").trim().split(/\s+/)[0];
  return n && n.length <= 30 ? n : "there";
}

const tag = (segment: Segment) => `utm_source=whatsapp&utm_medium=message&utm_campaign=${CAMPAIGN_ID}-${segment}`;

/** Fills a template's blanks for one lead. */
export function campaignParams(lead: CampaignLead, segment: Segment, courses: Record<string, CourseOffer>): string[] {
  const hi = firstName(lead.name);
  const free = `${SITE}/?${tag(segment)}#free-bootcamp`;
  if (segment === "student") return [hi, `${SITE}/dashboard?${tag(segment)}`];
  if (segment === "siwes") return [hi, `${SITE}/virtual-siwes?${tag(segment)}`, free];
  if (segment === "course") {
    const c = courses[courseFor(lead) ?? ""];
    if (c) return [hi, c.title, `₦${c.price.toLocaleString("en-NG")}`, `${SITE}/departments/${c.slug}?${tag(segment)}`];
  }
  return [hi, free];
}

/** Opted-out leads and non-phone contacts are never messaged. */
export function canMessage(lead: CampaignLead): boolean {
  const d = lead.contact.replace(/\D/g, "");
  return !lead.whatsapp_opt_out_at && d.length >= 10 && d.length <= 15;
}
