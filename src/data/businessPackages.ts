/**
 * Training packages for businesses on /business-partnerships.
 *
 * Bill chose quote-only pricing (2026-10-27), so prices and durations stay null. A null field is
 * hidden on the page and the card falls back to "Tailored quote within two working days", so nothing
 * unconfirmed is ever shown to a visitor. To publish a price, set priceFrom
 * (naira, per participant unless priceNote says otherwise).
 */
export type BusinessPackage = {
  id: string;
  title: string;
  summary: string;
  /** What participants cover. Keep to topics Tech Faculty already teaches. */
  covers: string[];
  /** Who the package suits, shown as a short line under the title. */
  audience: string;
  /** e.g. "2 days" or "4 weeks, 2 evenings a week". Hidden while null. */
  duration: string | null;
  /** Starting price in naira. Hidden while null. */
  priceFrom: number | null;
  /** e.g. "per participant" or "per cohort of up to 20". */
  priceNote: string | null;
};

export const BUSINESS_PACKAGES: BusinessPackage[] = [
  {
    id: "ai-for-teams",
    title: "AI for Teams",
    audience: "Managers and staff who want to use AI tools in daily work",
    summary:
      "A hands-on workshop on using AI assistants and automation safely to save time on writing, research, reporting and customer replies.",
    covers: [
      "Using AI assistants for everyday office work",
      "Writing good prompts and checking the answers",
      "Automating repetitive tasks",
      "Data privacy and safe use at work",
    ],
    duration: null,
    priceFrom: null,
    priceNote: null,
  },
  {
    id: "digital-skills",
    title: "Staff Digital Skills",
    audience: "Teams that need a stronger foundation in everyday tech",
    summary:
      "Practical digital literacy for staff: office tools, email and cloud files, online collaboration and working securely.",
    covers: [
      "Office tools, spreadsheets and documents",
      "Email, cloud storage and file sharing",
      "Online meetings and collaboration",
      "Basic cyber hygiene",
    ],
    duration: null,
    priceFrom: null,
    priceNote: null,
  },
  {
    id: "data-analytics",
    title: "Data & Reporting",
    audience: "Finance, sales and operations staff who work with numbers",
    summary:
      "Turn business records into clear reports and dashboards your managers can act on.",
    covers: [
      "Cleaning and organising data in spreadsheets",
      "Formulas, pivot tables and charts",
      "Building simple dashboards",
      "Presenting findings to decision makers",
    ],
    duration: null,
    priceFrom: null,
    priceNote: null,
  },
  {
    id: "cybersecurity-awareness",
    title: "Cybersecurity Awareness",
    audience: "Every staff member who uses a phone or computer at work",
    summary:
      "Help your team spot scams, protect customer data and keep company accounts safe.",
    covers: [
      "Phishing, fraud and social engineering",
      "Passwords and two-step login",
      "Safe use of phones, Wi-Fi and USB drives",
      "What to do when something goes wrong",
    ],
    duration: null,
    priceFrom: null,
    priceNote: null,
  },
  {
    id: "custom",
    title: "Custom Programme",
    audience: "Organisations with a specific skills gap",
    summary:
      "Tell us what your team needs and we design a programme around it, drawing on any of our departments, from software development to design.",
    covers: [
      "Skills assessment of your team",
      "Curriculum built around your goals",
      "On-site, virtual or hybrid delivery",
      "Certificates of completion",
    ],
    duration: null,
    priceFrom: null,
    priceNote: null,
  },
];

export const TEAM_SIZES = ["1–5", "6–15", "16–30", "31–60", "More than 60"] as const;
export const DELIVERY_MODES = ["On-site at our campus", "On-site at our office", "Virtual", "Hybrid", "Not sure yet"] as const;

export const formatNaira = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;
