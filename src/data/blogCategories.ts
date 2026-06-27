import type { BlogPost } from "@/types/blog";

export interface BlogCategory {
  /** URL slug used at /blog/category/:slug */
  slug: string;
  /** Display name — MUST match the `tags[0]` value on posts in this category */
  name: string;
  /** Browser <title> for the category page */
  title: string;
  /** <meta name="description"> for the category page (150–160 chars) */
  description: string;
  /** ~80-word intro shown on the category page (good for SEO + AI search) */
  intro: string;
  /** Long-tail keywords for <meta name="keywords"> + JSON-LD */
  keywords: string[];
}

/**
 * Single source of truth for blog categories.
 * The 7 categories are picked for high search intent (Nigerian + global tech).
 * Order here drives display order on /blog and the category nav.
 */
export const blogCategories: BlogCategory[] = [
  {
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    title: "Artificial Intelligence in Nigeria — AI Articles & Guides | Tech Faculty NG",
    description:
      "Practical AI guides for Nigeria: generative AI, machine learning, computer vision, and how Nigerian businesses and founders use AI to grow.",
    intro:
      "Artificial Intelligence is reshaping how Nigerian businesses, founders, and developers work. This category covers practical AI guides — generative AI, machine learning, computer vision, and AI for productivity — written for the Nigerian market. Whether you're a student exploring AI as a career, an SME owner looking to cut costs with automation, or a developer choosing your first ML library, you'll find roadmaps, comparisons, and case studies grounded in what's actually working on the ground in Lagos, Abuja, and across Africa.",
    keywords: [
      "AI Nigeria",
      "artificial intelligence Nigeria",
      "machine learning Nigeria",
      "generative AI",
      "computer vision Nigeria",
    ],
  },
  {
    slug: "web-software-development",
    name: "Web & Software Development",
    title: "Web & Software Development in Nigeria — Coding Guides | Tech Faculty NG",
    description:
      "Learn web and software development in Nigeria. Roadmaps, framework comparisons, and career guides for React, Node, Python, and mobile developers.",
    intro:
      "Web and software development is one of the highest-paying skill paths in Nigeria. This category brings together coding roadmaps, framework comparisons, and project tutorials — from your first HTML page to deploying full-stack React apps. We focus on the tools Nigerian employers actually hire for (React, Node.js, Python, mobile), and the realistic timelines, salaries, and portfolio projects that get juniors hired.",
    keywords: [
      "web development Nigeria",
      "software developer Nigeria",
      "learn coding Nigeria",
      "React Nigeria",
      "full stack developer",
    ],
  },
  {
    slug: "data-analytics",
    name: "Data & Analytics",
    title: "Data & Analytics in Nigeria — Data Science Guides | Tech Faculty NG",
    description:
      "Data analytics and data science for Nigeria. Power BI, Tableau, Python, SQL, Excel — career paths, tool comparisons, and bootcamp guides.",
    intro:
      "Every Nigerian company that collects data needs people who can read it. This category covers the tools and career paths inside data analytics and data science — Power BI, Tableau, Looker, Excel, SQL, and Python. Expect framework comparisons, salary benchmarks, hands-on dashboard tutorials, and clear-eyed bootcamp guides written for Nigerian and African analysts moving from beginner to hireable.",
    keywords: [
      "data analytics Nigeria",
      "data science Nigeria",
      "Power BI Nigeria",
      "Tableau",
      "data analyst career",
    ],
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    title: "Cybersecurity in Nigeria — Cyber Security Guides | Tech Faculty NG",
    description:
      "Cybersecurity careers and training in Nigeria. Ethical hacking, network security, NDPR compliance, SOC analyst paths, and bootcamp deep-dives.",
    intro:
      "Cybersecurity is one of the fastest-growing tech fields in Nigeria, driven by NDPR compliance, fintech expansion, and rising threat volumes. This category covers practical entry paths into cyber — ethical hacking, network security, SOC analyst roles — plus tooling guides, certifications worth your money (and the ones that aren't), and bootcamp deep-dives written for Nigerians breaking into the field.",
    keywords: [
      "cybersecurity Nigeria",
      "cyber security jobs Nigeria",
      "ethical hacking Nigeria",
      "SOC analyst",
      "NDPR compliance",
    ],
  },
  {
    slug: "tech-careers",
    name: "Tech Careers",
    title: "Tech Careers in Nigeria — Jobs, Salaries & Career Guides | Tech Faculty NG",
    description:
      "Tech careers in Nigeria: salaries, how to get hired, remote-work routes, switching from non-tech, and step-by-step roadmaps for Nigerian professionals.",
    intro:
      "How do you actually get a tech job in Nigeria — and once you do, how do you grow into a senior salary? This category covers the career side of tech: salary benchmarks, hiring trends, remote-work routes, CV and portfolio tactics, and switching into tech from non-tech backgrounds. Honest, Nigeria-specific advice for students, jobseekers, and mid-career professionals planning the next move.",
    keywords: [
      "tech jobs Nigeria",
      "tech career Nigeria",
      "tech salary Nigeria",
      "remote tech jobs",
      "switch to tech Nigeria",
    ],
  },
  {
    slug: "siwes-internships",
    name: "SIWES & Internships",
    title: "SIWES & Tech Internships in Nigeria — Complete Guides | Tech Faculty NG",
    description:
      "Complete SIWES and tech internship guides for Nigerian students. Placement tips, logbook help, ITF rules, allowance info, and finding the right IT host.",
    intro:
      "SIWES is the single biggest career launchpad most Nigerian undergraduates ever get — and most students waste it. This category covers the full Student Industrial Work Experience Scheme journey: choosing the right IT placement, writing a strong logbook, ITF rules, allowances, supervisor expectations, and how to convert your SIWES into a full-time tech job offer after NYSC.",
    keywords: [
      "SIWES Nigeria",
      "IT placement Nigeria",
      "industrial training Nigeria",
      "tech internship Nigeria",
      "SIWES logbook",
    ],
  },
  {
    slug: "startups-business",
    name: "Startups & Business",
    title: "Startups & Tech for Business in Nigeria | Tech Faculty NG",
    description:
      "How Nigerian startups and SMEs grow with technology. Digital transformation, founder playbooks, hiring developers, and winning enterprise contracts.",
    intro:
      "Technology decides which Nigerian businesses scale and which stall. This category is for founders, SME owners, and operators — covering digital transformation, how to hire and manage developers, winning government and enterprise contracts, automation playbooks, and case studies of Nigerian businesses that used tech as a real moat instead of a buzzword.",
    keywords: [
      "Nigerian startup",
      "tech for business Nigeria",
      "SME digital transformation",
      "founder Nigeria",
      "enterprise contracts Nigeria",
    ],
  },
  {
    slug: "tech-training-for-teens",
    name: "Tech Training for Teens",
    title: "Tech Training for Teens Nigeria — Coding & Digital Skills | Tech Faculty NG",
    description:
      "Holiday tech bootcamps and coding classes for teenagers in Nigeria. JSS3 & SS3 vacation programs in Nnewi, Onitsha, Enugu, Aba, and Owerri.",
    intro:
      "The best time to learn tech is during the long holiday. This category covers holiday coding bootcamps, digital-skills programs, and vacation tech classes for Nigerian teenagers — from JSS3 students who just finished Junior WAEC to SS3 graduates waiting for university. We publish schedules, parent guides, course outlines, and registration details for our centres in Nnewi, Onitsha/Awada, Enugu, Aba, and Owerri.",
    keywords: [
      "coding classes for teenagers Nigeria",
      "holiday tech bootcamp Nigeria",
      "JSS3 SS3 vacation program",
      "tech summer camp Nigeria",
      "youth coding Nigeria",
    ],
  },
];

export const getCategoryBySlug = (slug: string): BlogCategory | undefined =>
  blogCategories.find((c) => c.slug === slug);

export const getCategoryByName = (name: string): BlogCategory | undefined =>
  blogCategories.find((c) => c.name === name);

export const getCategorySlugForPost = (post: BlogPost): string | undefined =>
  getCategoryByName(post.tags[0])?.slug;
