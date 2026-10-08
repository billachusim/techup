/**
 * Internal-link map between blog posts, departments, campuses, hubs and SIWES.
 *
 * Blog posts get their department, campus and SIWES links from rules on the
 * post's slug, title, tags and body, so posts generated into the database are
 * covered too. `POST_OVERRIDES` pins the links for posts the rules misread.
 */
import type { BlogPost } from "@/types/blog";
import { campuses, type Campus } from "@/data/campuses";
import { departments, type Department } from "@/data/departments";
import { cityGuideIndex } from "@/data/cityBlogPosts";
import { COURSE_AREA_DEPARTMENT, techHubs, type TechHub } from "@/data/techHubs";

export { COURSE_AREA_DEPARTMENT };

/** Department → two or three blog guides that go deeper on it, with their link text. */
export const DEPARTMENT_GUIDES: Record<string, Array<{ slug: string; label: string }>> = {
  "web-development": [
    { slug: "full-stack-web-development-nigeria-roadmap-2026", label: "Full-stack web development roadmap for Nigeria" },
    { slug: "react-vs-nextjs-nigerian-developers-2026", label: "React vs Next.js: which to learn first" },
    { slug: "react-developer-salary-nigeria-2026", label: "React developer salaries in Nigeria" },
  ],
  "mobile-app-development": [
    { slug: "web-development-vs-mobile-development-which-path", label: "Web vs mobile development: choosing a path" },
    { slug: "how-to-get-remote-tech-job-from-nigeria-2026", label: "How to get a remote tech job from Nigeria" },
    { slug: "tech-salaries-nigeria-2026-junior-mid-senior", label: "Nigerian tech salaries from junior to senior" },
  ],
  "data-science-analytics": [
    { slug: "data-analytics-and-visualization-bootcamp-nigeria-2026-guide", label: "Data analytics and visualisation bootcamp guide" },
    { slug: "data-analyst-portfolio-projects-nigeria-2026", label: "Data analyst portfolio projects with Nigerian data" },
    { slug: "sql-vs-python-data-analysts-nigeria-2026", label: "SQL vs Python for Nigerian data analysts" },
  ],
  cybersecurity: [
    { slug: "cyber-security-bootcamp-nigeria-16-weeks", label: "What a 16-week cybersecurity bootcamp covers" },
    { slug: "become-soc-analyst-nigeria-2026-roadmap", label: "How to become a SOC analyst in Nigeria" },
    { slug: "cybersecurity-salary-nigeria-2026", label: "Cybersecurity salaries in Nigeria" },
  ],
  "ai-machine-learning": [
    { slug: "how-to-learn-ai-in-nigeria-2026-roadmap", label: "How to learn AI in Nigeria: a roadmap" },
    { slug: "remote-ai-jobs-for-nigerians-platforms-that-pay-dollars-2026", label: "Remote AI jobs that pay Nigerians in dollars" },
    { slug: "whatsapp-ai-agents-for-nigerian-smes-2026", label: "Building WhatsApp AI agents for Nigerian SMEs" },
  ],
  "basic-internet-ai-studies": [
    { slug: "how-to-start-tech-career-nigeria-2026", label: "How to start a tech career in Nigeria" },
    { slug: "best-ai-tools-nigerian-businesses-2026", label: "The best AI tools for Nigerian businesses" },
    { slug: "ai-automation-for-nigerian-businesses-2026", label: "AI automation playbook for Nigerian businesses" },
  ],
  "digital-marketing": [
    { slug: "generative-ai-nigerian-smes-playbook-2026", label: "Generative AI playbook for Nigerian SMEs" },
    { slug: "nigerian-business-digitization-roadmap-2026", label: "Digitising a Nigerian business: a roadmap" },
    { slug: "cost-to-build-a-website-in-nigeria-2026", label: "What a website costs to build in Nigeria" },
  ],
  design: [
    { slug: "cost-to-build-a-website-in-nigeria-2026", label: "What a website costs to build in Nigeria" },
    { slug: "best-tech-skills-for-nigerian-teenagers-2026", label: "The best tech skills for Nigerian teenagers" },
    { slug: "how-to-get-remote-tech-job-from-nigeria-2026", label: "How to get a remote tech job from Nigeria" },
  ],
  "cloud-computing": [
    { slug: "full-stack-web-development-nigeria-roadmap-2026", label: "Full-stack web development roadmap for Nigeria" },
    { slug: "remote-tech-jobs-nigeria-2026-complete-guide", label: "Where to find remote tech jobs from Nigeria" },
    { slug: "tech-salaries-nigeria-2026-junior-mid-senior", label: "Nigerian tech salaries from junior to senior" },
  ],
  "robotics-iot": [
    { slug: "best-tech-skills-for-nigerian-teenagers-2026", label: "The best tech skills for Nigerian teenagers" },
    { slug: "ai-and-computer-vision-transforming-entrepreneurs-nigeria-2026", label: "How computer vision is changing Nigerian businesses" },
    { slug: "best-coding-languages-nigerian-teenagers-2026", label: "The best coding languages for Nigerian teenagers" },
  ],
};

/** Ordered rules: the first two that match a post become its department links. */
const DEPARTMENT_RULES: Array<[string, RegExp]> = [
  ["cybersecurity", /cyber|soc analyst|ndpr|data protection|siem|ethical hacking/],
  ["data-science-analytics", /data analy|power bi|tableau|looker|\bsql\b|data science/],
  ["mobile-app-development", /mobile dev|mobile app/],
  ["web-development", /web dev|website|react|next\.?js|full.?stack|frontend|software dev|developer|coding/],
  ["ai-machine-learning", /\bai\b|artificial intelligence|machine learning|computer vision|generative|chatgpt/],
  ["digital-marketing", /marketing|social media/],
  ["design", /ui\/ux|product design|graphic design/],
  ["cloud-computing", /\bcloud\b|devops/],
  ["robotics-iot", /robotic|\biot\b/],
  ["basic-internet-ai-studies", /digiti[sz]ation|skills gap|teen|beginner|start a tech career/],
];

const SIWES_RULE = /siwes|industrial training|\bit placement\b|internship/;

/** Body mentions that point at a campus page. */
const CAMPUS_MENTIONS: Array<[RegExp, string]> = [
  ...campuses.map((c): [RegExp, string] => [new RegExp(`\\b${c.city}\\b`, "g"), c.slug]),
  [/\bAwada\b/g, "onitsha"],
  [/\bYaba(?:Tech)?\b/g, "lagos"],
];

type PostLinkOverride = { departments?: string[]; campuses?: string[]; siwes?: boolean };

const POST_OVERRIDES: Record<string, PostLinkOverride> = {
  "remote-ai-jobs-for-nigerians-platforms-that-pay-dollars-2026": {
    departments: ["ai-machine-learning", "data-science-analytics"],
  },
  "siwes-placement-ai-data-science-nigeria-2026": {
    departments: ["ai-machine-learning", "data-science-analytics"],
  },
  "how-to-get-remote-tech-job-from-nigeria-2026": {
    departments: ["web-development", "data-science-analytics"],
  },
  "remote-tech-jobs-nigeria-2026-complete-guide": {
    departments: ["web-development", "ai-machine-learning"],
  },
  "tech-salaries-nigeria-2026-junior-mid-senior": {
    departments: ["web-development", "data-science-analytics"],
  },
  "how-to-start-tech-career-nigeria-2026": {
    departments: ["basic-internet-ai-studies", "web-development"],
  },
  "python-nigerian-tech-ecosystem-2026": { departments: ["web-development", "ai-machine-learning"] },
  "web-development-vs-mobile-development-which-path": {
    departments: ["web-development", "mobile-app-development"],
  },
  "best-tech-skills-for-nigerian-teenagers-2026": {
    departments: ["basic-internet-ai-studies", "robotics-iot"],
  },
  "best-coding-languages-nigerian-teenagers-2026": {
    departments: ["web-development", "basic-internet-ai-studies"],
  },
  "coding-classes-for-teenagers-nnewi-awada-2026": {
    departments: ["web-development", "basic-internet-ai-studies"],
    campuses: ["nnewi", "onitsha"],
  },
  "jss3-ss3-holiday-tech-bootcamp-2026": {
    departments: ["basic-internet-ai-studies", "web-development"],
  },
  "whatsapp-ai-agents-for-nigerian-smes-2026": {
    departments: ["ai-machine-learning", "digital-marketing"],
  },
  "ai-automation-for-nigerian-businesses-2026": {
    departments: ["ai-machine-learning", "basic-internet-ai-studies"],
  },
  "generative-ai-nigerian-smes-playbook-2026": {
    departments: ["ai-machine-learning", "digital-marketing"],
  },
  "nigerian-business-digitization-roadmap-2026": {
    departments: ["basic-internet-ai-studies", "digital-marketing"],
  },
  "how-to-hire-developers-in-nigeria-2026": { departments: ["web-development", "mobile-app-development"] },
  "how-to-hire-developers-nigerian-startups-2026": { departments: ["web-development", "mobile-app-development"] },
  "building-future-tech-faculty-yabatech-partnership-2026": { campuses: ["lagos"] },
  "tut-5-in-design-tech-bootcamps-yabatech-2026": { campuses: ["lagos"] },
};

export interface PostLinks {
  departments: Department[];
  campuses: Campus[];
  siwes: boolean;
}

const bySlug = <T extends { slug: string }>(items: T[], slugs: string[]) =>
  slugs.map((s) => items.find((i) => i.slug === s)).filter((i): i is T => Boolean(i));

/** Departments, campuses and SIWES pages a blog post should link to. */
export function getPostLinks(post: BlogPost): PostLinks {
  const override = POST_OVERRIDES[post.slug] ?? {};
  const haystack = `${post.slug} ${post.title} ${post.tags.join(" ")}`.toLowerCase();

  const guide = cityGuideIndex.find((g) => g.slug === post.slug);
  const deptSlugs =
    override.departments ??
    guide?.skills.slice(0, 2).map((skill) => COURSE_AREA_DEPARTMENT[skill]) ??
    DEPARTMENT_RULES.filter(([, re]) => re.test(haystack))
      .map(([slug]) => slug)
      .slice(0, 2);

  let campusSlugs = override.campuses;
  if (!campusSlugs) {
    if (guide) {
      campusSlugs = guide.campusSlug ? [guide.campusSlug] : guide.nearestCampusSlug ? [guide.nearestCampusSlug] : [];
    } else {
      const counts = new Map<string, number>();
      for (const [re, slug] of CAMPUS_MENTIONS) {
        const n = post.content.match(re)?.length ?? 0;
        if (n) counts.set(slug, (counts.get(slug) ?? 0) + n);
      }
      campusSlugs = [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([slug]) => slug)
        .slice(0, 3);
    }
  }

  return {
    departments: bySlug(departments, deptSlugs),
    campuses: bySlug(campuses, campusSlugs),
    siwes: override.siwes ?? SIWES_RULE.test(haystack),
  };
}

export const isCityGuide = (slug: string) => cityGuideIndex.some((g) => g.slug === slug);

/** The city guide for a city, if one exists. */
export const getCityGuideForCity = (city: string) => cityGuideIndex.find((g) => g.city === city);

/** Every city guide that should link to a campus (its own, or the nearest one). */
export const getCityGuidesForCampus = (campusSlug: string) =>
  cityGuideIndex.filter((g) => g.campusSlug === campusSlug || g.nearestCampusSlug === campusSlug);

/** Hubs listed in the same city as a campus. */
export const getHubsForCampus = (campus: Campus): TechHub[] =>
  techHubs.filter((h) => h.country === "Nigeria" && (h.campusSlug === campus.slug || h.city === campus.city));
