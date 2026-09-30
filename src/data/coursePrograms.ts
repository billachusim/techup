/**
 * AI-first programme catalogue.
 *
 * Departments keep their existing names (Web Development, Design, Data, ...).
 * Each *programme* a student enrols in is now framed as "AI for <discipline>",
 * and each one maps to a single rolling Slack cohort channel that students are
 * added to automatically on enrolment.
 */
export interface CourseProgram {
  /** Plan id used in Pricing */
  planId: string;
  /** enrollments.plan_name / profiles.department value */
  planName: string;
  /** Student-facing AI-first programme title */
  title: string;
  /** Department this programme belongs to (unchanged) */
  department: string;
  /** Rolling Slack cohort channel (no leading #) */
  channel: string;
  /** Channel purpose/topic set when the bot creates it */
  channelTopic: string;
}

export const COURSE_PROGRAMS: CourseProgram[] = [
  {
    planId: "bootcamp-starter",
    planName: "Bootcamp Starter",
    title: "Everyday AI & Digital Productivity",
    department: "General Tech",
    channel: "course-general-tech",
    channelTopic: "Everyday AI & Digital Productivity — free foundation cohort",
  },
  {
    planId: "developer-pro",
    planName: "Developer Pro",
    title: "AI for Full-Stack Web Development",
    department: "Web Development",
    channel: "course-ai-web-dev",
    channelTopic: "AI for Full-Stack Web Development — React, Next.js, Supabase, AI workflows",
  },
  {
    planId: "mobile-app-developer",
    planName: "Mobile App Developer",
    title: "AI for Mobile App Development",
    department: "Mobile Development",
    channel: "course-ai-mobile-dev",
    channelTopic: "AI for Mobile App Development — React Native, Expo, Flutter",
  },
  {
    planId: "data-wizard",
    planName: "Data Wizard",
    title: "AI for Data Analytics & Business Intelligence",
    department: "Data Science",
    channel: "course-ai-data-analytics",
    channelTopic: "AI for Data Analytics & BI — SQL, Power BI, Python, automated dashboards",
  },
  {
    planId: "ai-innovator",
    planName: "AI Innovator",
    title: "AI & Autonomous Agents Engineering",
    department: "Machine Learning",
    channel: "course-ai-agents",
    channelTopic: "AI & Autonomous Agents Engineering — RAG, agents, model deployment",
  },
  {
    planId: "security-shield",
    planName: "Security Shield",
    title: "AI for Cybersecurity & Threat Intelligence",
    department: "Cyber Security",
    channel: "course-ai-cybersecurity",
    channelTopic: "AI for Cybersecurity & Threat Intelligence — SOC, ethical hacking, compliance",
  },
  {
    planId: "cloud-architect",
    planName: "Cloud Architect",
    title: "AI for Cloud & DevOps Engineering",
    department: "Cloud Computing",
    channel: "course-ai-cloud-devops",
    channelTopic: "AI for Cloud & DevOps Engineering — AWS, Azure, Kubernetes, CI/CD",
  },
  {
    planId: "design-master",
    planName: "Design Master",
    title: "AI for UI/UX & Product Design",
    department: "UI/UX Design",
    channel: "course-ai-design",
    channelTopic: "AI for UI/UX & Product Design — Figma, design systems, generative assets",
  },
  {
    planId: "digital-marketing-pro",
    planName: "Digital Marketing Pro",
    title: "AI for Digital Marketing & Growth",
    department: "Digital Marketing",
    channel: "course-ai-marketing",
    channelTopic: "AI for Digital Marketing & Growth — ads, content, SEO for AI search",
  },
  {
    planId: "custom-builder",
    planName: "Custom Program",
    title: "AI-Powered Custom Programme",
    department: "General Tech",
    channel: "course-general-tech",
    channelTopic: "Custom AI-powered learning paths",
  },
];

/** Resolves the programme for a plan name or department, with a safe fallback. */
export function findProgram(planOrDepartment?: string | null): CourseProgram {
  const key = (planOrDepartment ?? "").trim().toLowerCase();
  const fallback = COURSE_PROGRAMS[0]!;
  if (!key) return fallback;
  return (
    COURSE_PROGRAMS.find((p) => p.planName.toLowerCase() === key) ??
    COURSE_PROGRAMS.find((p) => p.department.toLowerCase() === key) ??
    COURSE_PROGRAMS.find((p) => p.title.toLowerCase() === key) ??
    COURSE_PROGRAMS.find((p) => p.planId === key) ??
    fallback
  );
}

/** Public workspace link students use before we know their Slack member id. */
export const SLACK_WORKSPACE_URL = "https://tech-faculty.slack.com";
