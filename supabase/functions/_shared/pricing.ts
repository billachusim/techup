// Prices for every plan, course, learning mode and benefit. The pricing page
// shows these and create-checkout charges them, so both stay in step.
// Plain data with no imports, so the browser bundle and the Deno edge
// function can both import it.

export interface Course {
  id: string;
  name: string;
  price: number;
  category?: string;
}

export interface Benefit {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface LearningMode {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface PlanPricing {
  minimumAmount: number;
  courses: Course[];
  learningModes: LearningMode[];
  benefits: Benefit[];
}

export const LEARNING_MODES: LearningMode[] = [
  {
    id: "online-only",
    name: "Online Only",
    price: 0,
    description: "Self-paced learning with recorded lectures",
  },
  {
    id: "hybrid",
    name: "Hybrid Mode",
    price: 12000,
    description: "Online + Monthly physical meetups",
  },
  {
    id: "physical",
    name: "Physical Classes",
    price: 22500,
    description: "Weekly on-site classes",
  },
];

// All available courses for custom builder
export const ALL_COURSES: Course[] = [
  {
    id: "html-css",
    name: "HTML/CSS Fundamentals",
    price: 7500,
    category: "Web Development",
  },
  {
    id: "javascript",
    name: "JavaScript Mastery",
    price: 12000,
    category: "Web Development",
  },
  {
    id: "react",
    name: "React Development",
    price: 18000,
    category: "Web Development",
  },
  {
    id: "nodejs",
    name: "Node.js & Backend",
    price: 18000,
    category: "Web Development",
  },
  {
    id: "database",
    name: "Database Management",
    price: 12000,
    category: "Web Development",
  },
  {
    id: "fullstack-projects",
    name: "Full-Stack Projects",
    price: 15000,
    category: "Web Development",
  },
  {
    id: "python",
    name: "Python Programming",
    price: 10500,
    category: "Data Science",
  },
  { id: "sql", name: "SQL & Databases", price: 9000, category: "Data Science" },
  {
    id: "data-viz",
    name: "Data Visualization",
    price: 12000,
    category: "Data Science",
  },
  {
    id: "statistics",
    name: "Statistical Analysis",
    price: 13500,
    category: "Data Science",
  },
  {
    id: "ml-basics",
    name: "Machine Learning Basics",
    price: 22500,
    category: "AI/ML",
  },
  {
    id: "deep-learning",
    name: "Deep Learning",
    price: 27000,
    category: "AI/ML",
  },
  {
    id: "neural-networks",
    name: "Neural Networks",
    price: 22500,
    category: "AI/ML",
  },
  { id: "nlp", name: "NLP Fundamentals", price: 21000, category: "AI/ML" },
  {
    id: "computer-vision",
    name: "Computer Vision",
    price: 21000,
    category: "AI/ML",
  },
  {
    id: "ai-deployment",
    name: "AI Deployment",
    price: 15000,
    category: "AI/ML",
  },
  {
    id: "network-security",
    name: "Network Security",
    price: 15000,
    category: "Cybersecurity",
  },
  {
    id: "ethical-hacking",
    name: "Ethical Hacking",
    price: 22500,
    category: "Cybersecurity",
  },
  {
    id: "soc-ops",
    name: "SOC Operations",
    price: 18000,
    category: "Cybersecurity",
  },
  {
    id: "incident-response",
    name: "Incident Response",
    price: 12000,
    category: "Cybersecurity",
  },
  {
    id: "comptia-prep",
    name: "CompTIA Prep",
    price: 15000,
    category: "Cybersecurity",
  },
  { id: "ceh-prep", name: "CEH Prep", price: 18000, category: "Cybersecurity" },
  {
    id: "aws",
    name: "AWS Fundamentals",
    price: 18000,
    category: "Cloud/DevOps",
  },
  { id: "azure", name: "Azure Basics", price: 18000, category: "Cloud/DevOps" },
  { id: "gcp", name: "GCP Essentials", price: 18000, category: "Cloud/DevOps" },
  {
    id: "kubernetes",
    name: "Kubernetes & Docker",
    price: 22500,
    category: "Cloud/DevOps",
  },
  {
    id: "cicd",
    name: "CI/CD Pipelines",
    price: 15000,
    category: "Cloud/DevOps",
  },
  {
    id: "cloud-cert",
    name: "Cloud Certifications",
    price: 12000,
    category: "Cloud/DevOps",
  },
  { id: "figma", name: "Figma Mastery", price: 12000, category: "Design" },
  { id: "adobe", name: "Adobe Suite", price: 15000, category: "Design" },
  {
    id: "product-design",
    name: "Product Design",
    price: 18000,
    category: "Design",
  },
  {
    id: "design-principles",
    name: "Design Principles",
    price: 9000,
    category: "Design",
  },
  {
    id: "design-systems",
    name: "Design Systems",
    price: 13500,
    category: "Design",
  },
  {
    id: "portfolio-projects",
    name: "Portfolio Projects",
    price: 10500,
    category: "Design",
  },
  {
    id: "social-media",
    name: "Social Media Strategy",
    price: 10500,
    category: "Marketing",
  },
  {
    id: "content-marketing",
    name: "Content Marketing",
    price: 12000,
    category: "Marketing",
  },
  { id: "seo-sem", name: "SEO/SEM", price: 15000, category: "Marketing" },
  {
    id: "video-editing",
    name: "Video Editing",
    price: 13500,
    category: "Marketing",
  },
  {
    id: "photo-editing",
    name: "Photo Editing",
    price: 9000,
    category: "Marketing",
  },
  {
    id: "analytics",
    name: "Analytics & Growth",
    price: 12000,
    category: "Marketing",
  },
  {
    id: "react-native",
    name: "React Native Development",
    price: 18000,
    category: "Mobile Development",
  },
  {
    id: "flutter-dart",
    name: "Flutter & Dart",
    price: 18000,
    category: "Mobile Development",
  },
  {
    id: "ios-swift",
    name: "iOS with Swift",
    price: 21000,
    category: "Mobile Development",
  },
  {
    id: "android-kotlin",
    name: "Android with Kotlin",
    price: 21000,
    category: "Mobile Development",
  },
  {
    id: "mobile-uiux",
    name: "Mobile UI/UX Design",
    price: 12000,
    category: "Mobile Development",
  },
  {
    id: "cross-platform-projects",
    name: "Cross-Platform Projects",
    price: 15000,
    category: "Mobile Development",
  },
];

export const PLAN_PRICING: Record<string, PlanPricing> = {
  "bootcamp-starter": {
    minimumAmount: 0,
    courses: [
      { id: "intro-programming", name: "Intro to Programming", price: 0 },
      { id: "intro-ai-chatgpt", name: "Intro to AI & ChatGPT", price: 0 },
      { id: "git-github", name: "Git & GitHub Basics", price: 0 },
      { id: "tech-career", name: "Tech Career Guidance", price: 0 },
    ],
    learningModes: [
      {
        id: "online-only",
        name: "Online Only",
        price: 0,
        description: "Self-paced learning",
      },
    ],
    benefits: [
      {
        id: "community",
        name: "Community Access",
        price: 0,
        description: "Join our vibrant tech community",
      },
      {
        id: "self-paced",
        name: "Self-Paced Learning",
        price: 0,
        description: "Learn at your own pace",
      },
      {
        id: "basic-certificate",
        name: "Completion Certificate",
        price: 0,
        description: "Get certified on completion",
      },
    ],
  },
  "developer-pro": {
    minimumAmount: 50000,
    courses: [
      { id: "html-css", name: "HTML/CSS Fundamentals", price: 7500 },
      { id: "javascript", name: "JavaScript Mastery", price: 12000 },
      { id: "react", name: "React Development", price: 18000 },
      { id: "nodejs", name: "Node.js & Backend", price: 18000 },
      { id: "database", name: "Database Management", price: 12000 },
      { id: "fullstack-projects", name: "Full-Stack Projects", price: 15000 },
    ],
    learningModes: LEARNING_MODES,
    benefits: [
      {
        id: "job-placement",
        name: "Job Placement Support",
        price: 15000,
        description: "Get help finding your first job",
      },
      {
        id: "internship",
        name: "Internship Access",
        price: 12000,
        description: "Access to partner internships",
      },
      {
        id: "mentor-network",
        name: "Mentor Network Access",
        price: 18000,
        description: "Connect with industry mentors",
      },
      {
        id: "certification-prep",
        name: "Industry Certification Prep",
        price: 22500,
        description: "Prepare for industry certifications",
      },
      {
        id: "tech-certificate",
        name: "Tech Faculty Certificate",
        price: 0,
        description: "Official completion certificate",
      },
    ],
  },
  "data-wizard": {
    minimumAmount: 100000,
    courses: [
      { id: "python", name: "Python Programming", price: 10500 },
      { id: "sql", name: "SQL & Databases", price: 9000 },
      { id: "data-viz", name: "Data Visualization", price: 12000 },
      { id: "statistics", name: "Statistical Analysis", price: 13500 },
      { id: "ml-basics", name: "Machine Learning Basics", price: 22500 },
      { id: "data-projects", name: "Real-world Data Projects", price: 15000 },
    ],
    learningModes: LEARNING_MODES,
    benefits: [
      {
        id: "job-placement",
        name: "Job Placement Support",
        price: 15000,
        description: "Get help finding your first job",
      },
      {
        id: "internship",
        name: "Internship Access",
        price: 12000,
        description: "Access to partner internships",
      },
      {
        id: "mentor-network",
        name: "Mentor Network Access",
        price: 18000,
        description: "Connect with industry mentors",
      },
      {
        id: "one-on-one",
        name: "One-on-One Mentorship (1hr/week)",
        price: 30000,
        description: "Personal guidance from experts",
      },
      {
        id: "tech-certificate",
        name: "Tech Faculty Certificate",
        price: 0,
        description: "Official completion certificate",
      },
    ],
  },
  "ai-innovator": {
    minimumAmount: 150000,
    courses: [
      { id: "deep-learning", name: "Deep Learning", price: 27000 },
      { id: "neural-networks", name: "Neural Networks", price: 22500 },
      { id: "tensorflow-pytorch", name: "TensorFlow/PyTorch", price: 18000 },
      { id: "nlp", name: "NLP Fundamentals", price: 21000 },
      { id: "computer-vision", name: "Computer Vision", price: 21000 },
      { id: "ai-deployment", name: "AI Deployment", price: 15000 },
    ],
    learningModes: LEARNING_MODES,
    benefits: [
      {
        id: "job-placement",
        name: "Job Placement Support",
        price: 15000,
        description: "Get help finding your first job",
      },
      {
        id: "internship",
        name: "Internship Access",
        price: 12000,
        description: "Access to partner internships",
      },
      {
        id: "mentor-network",
        name: "Mentor Network Access",
        price: 18000,
        description: "Connect with industry mentors",
      },
      {
        id: "one-on-one",
        name: "One-on-One Mentorship (1hr/week)",
        price: 30000,
        description: "Personal guidance from experts",
      },
      {
        id: "vip-classes",
        name: "VIP Classes at Chosen Location",
        price: 75000,
        description: "Premium learning experience",
      },
      {
        id: "tech-certificate",
        name: "Tech Faculty Certificate",
        price: 0,
        description: "Official completion certificate",
      },
    ],
  },
  "security-shield": {
    minimumAmount: 120000,
    courses: [
      { id: "network-security", name: "Network Security", price: 15000 },
      { id: "ethical-hacking", name: "Ethical Hacking", price: 22500 },
      { id: "soc-ops", name: "SOC Operations", price: 18000 },
      { id: "incident-response", name: "Incident Response", price: 12000 },
      { id: "comptia-prep", name: "CompTIA Prep", price: 15000 },
      { id: "ceh-prep", name: "CEH Prep", price: 18000 },
    ],
    learningModes: LEARNING_MODES,
    benefits: [
      {
        id: "job-placement",
        name: "Job Placement Support",
        price: 15000,
        description: "Get help finding your first job",
      },
      {
        id: "internship",
        name: "Internship Access",
        price: 12000,
        description: "Access to partner internships",
      },
      {
        id: "mentor-network",
        name: "Mentor Network Access",
        price: 18000,
        description: "Connect with industry mentors",
      },
      {
        id: "certification-prep",
        name: "Industry Certification Prep",
        price: 22500,
        description: "Prepare for industry certifications",
      },
      {
        id: "tech-certificate",
        name: "Tech Faculty Certificate",
        price: 0,
        description: "Official completion certificate",
      },
    ],
  },
  "mobile-app-developer": {
    minimumAmount: 80000,
    courses: [
      { id: "react-native", name: "React Native Development", price: 18000 },
      { id: "flutter-dart", name: "Flutter & Dart", price: 18000 },
      { id: "ios-swift", name: "iOS with Swift", price: 21000 },
      { id: "android-kotlin", name: "Android with Kotlin", price: 21000 },
      { id: "mobile-uiux", name: "Mobile UI/UX Design", price: 12000 },
      {
        id: "cross-platform-projects",
        name: "Cross-Platform Projects",
        price: 15000,
      },
    ],
    learningModes: LEARNING_MODES,
    benefits: [
      {
        id: "job-placement",
        name: "Job Placement Support",
        price: 15000,
        description: "Get help finding your first job",
      },
      {
        id: "internship",
        name: "Internship Access",
        price: 12000,
        description: "Access to partner internships",
      },
      {
        id: "mentor-network",
        name: "Mentor Network Access",
        price: 18000,
        description: "Connect with industry mentors",
      },
      {
        id: "certification-prep",
        name: "Industry Certification Prep",
        price: 22500,
        description: "Prepare for industry certifications",
      },
      {
        id: "tech-certificate",
        name: "Tech Faculty Certificate",
        price: 0,
        description: "Official completion certificate",
      },
    ],
  },
  "cloud-architect": {
    minimumAmount: 130000,
    courses: [
      { id: "aws", name: "AWS Fundamentals", price: 18000 },
      { id: "azure", name: "Azure Basics", price: 18000 },
      { id: "gcp", name: "GCP Essentials", price: 18000 },
      { id: "kubernetes", name: "Kubernetes & Docker", price: 22500 },
      { id: "cicd", name: "CI/CD Pipelines", price: 15000 },
      { id: "cloud-cert", name: "Cloud Certifications", price: 12000 },
    ],
    learningModes: LEARNING_MODES,
    benefits: [
      {
        id: "job-placement",
        name: "Job Placement Support",
        price: 15000,
        description: "Get help finding your first job",
      },
      {
        id: "internship",
        name: "Internship Access",
        price: 12000,
        description: "Access to partner internships",
      },
      {
        id: "mentor-network",
        name: "Mentor Network Access",
        price: 18000,
        description: "Connect with industry mentors",
      },
      {
        id: "certification-prep",
        name: "Industry Certification Prep",
        price: 22500,
        description: "Prepare for industry certifications",
      },
      {
        id: "tech-certificate",
        name: "Tech Faculty Certificate",
        price: 0,
        description: "Official completion certificate",
      },
    ],
  },
  "design-master": {
    minimumAmount: 70000,
    courses: [
      { id: "design-principles", name: "Design Principles", price: 9000 },
      { id: "figma", name: "Figma Mastery", price: 12000 },
      { id: "adobe", name: "Adobe Suite", price: 15000 },
      { id: "product-design", name: "Product Design", price: 18000 },
      { id: "design-systems", name: "Design Systems", price: 13500 },
      { id: "portfolio-projects", name: "Portfolio Projects", price: 10500 },
    ],
    learningModes: LEARNING_MODES,
    benefits: [
      {
        id: "job-placement",
        name: "Job Placement Support",
        price: 15000,
        description: "Get help finding your first job",
      },
      {
        id: "internship",
        name: "Internship Access",
        price: 12000,
        description: "Access to partner internships",
      },
      {
        id: "mentor-network",
        name: "Mentor Network Access",
        price: 18000,
        description: "Connect with industry mentors",
      },
      {
        id: "tech-certificate",
        name: "Tech Faculty Certificate",
        price: 0,
        description: "Official completion certificate",
      },
    ],
  },
  "digital-marketing-pro": {
    minimumAmount: 60000,
    courses: [
      { id: "social-media", name: "Social Media Strategy", price: 10500 },
      { id: "content-marketing", name: "Content Marketing", price: 12000 },
      { id: "seo-sem", name: "SEO/SEM", price: 15000 },
      { id: "video-editing", name: "Video Editing", price: 13500 },
      { id: "photo-editing", name: "Photo Editing", price: 9000 },
      { id: "analytics", name: "Analytics & Growth", price: 12000 },
    ],
    learningModes: LEARNING_MODES,
    benefits: [
      {
        id: "job-placement",
        name: "Job Placement Support",
        price: 15000,
        description: "Get help finding your first job",
      },
      {
        id: "internship",
        name: "Internship Access",
        price: 12000,
        description: "Access to partner internships",
      },
      {
        id: "mentor-network",
        name: "Mentor Network Access",
        price: 18000,
        description: "Connect with industry mentors",
      },
      {
        id: "tech-certificate",
        name: "Tech Faculty Certificate",
        price: 0,
        description: "Official completion certificate",
      },
    ],
  },
  "custom-builder": {
    minimumAmount: 50000,
    courses: [],
    learningModes: LEARNING_MODES,
    benefits: [
      {
        id: "job-placement",
        name: "Job Placement Support",
        price: 15000,
        description: "Get help finding your first job",
      },
      {
        id: "internship",
        name: "Internship Access",
        price: 12000,
        description: "Access to partner internships",
      },
      {
        id: "mentor-network",
        name: "Mentor Network Access",
        price: 18000,
        description: "Connect with industry mentors",
      },
      {
        id: "certification-prep",
        name: "Industry Certification Prep",
        price: 22500,
        description: "Prepare for industry certifications",
      },
    ],
  },
};

export type PricedSelection =
  | {
      ok: true;
      courses: Course[];
      benefits: Benefit[];
      learningMode: LearningMode | null;
      total: number;
    }
  | { ok: false; error: string };

/**
 * Prices a selection from its ids alone. Custom plans may pick from every
 * course; other plans only from their own. Unknown ids are rejected rather
 * than ignored, so a tampered request can't slip through at a lower price.
 */
export function priceSelection(
  planId: string,
  courseIds: string[],
  benefitIds: string[],
  learningModeId: string | null,
): PricedSelection {
  const plan = PLAN_PRICING[planId];
  if (!plan) return { ok: false, error: "Unknown plan" };
  const coursePool = planId === "custom-builder" ? ALL_COURSES : plan.courses;

  const courses: Course[] = [];
  for (const id of new Set(courseIds)) {
    const course = coursePool.find((c) => c.id === id);
    if (!course) return { ok: false, error: `Unknown course: ${id}` };
    courses.push(course);
  }
  const benefits: Benefit[] = [];
  for (const id of new Set(benefitIds)) {
    const benefit = plan.benefits.find((b) => b.id === id);
    if (!benefit) return { ok: false, error: `Unknown benefit: ${id}` };
    benefits.push(benefit);
  }
  let learningMode: LearningMode | null = null;
  if (learningModeId) {
    learningMode =
      plan.learningModes.find((m) => m.id === learningModeId) ?? null;
    if (!learningMode)
      return { ok: false, error: `Unknown learning mode: ${learningModeId}` };
  }

  const total =
    courses.reduce((sum, c) => sum + c.price, 0) +
    benefits.reduce((sum, b) => sum + b.price, 0) +
    (learningMode?.price ?? 0);
  if (total < plan.minimumAmount)
    return { ok: false, error: "Selection is below the plan minimum" };
  return { ok: true, courses, benefits, learningMode, total };
}
