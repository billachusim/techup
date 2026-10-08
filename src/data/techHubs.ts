/**
 * Editorial directory of tech hubs, innovation centres and training institutes
 * across Nigeria.
 *
 * IMPORTANT: This is a curated editorial listing, not a claim of partnership.
 * Entries describe publicly known hubs and the course areas their programmes,
 * partners and communities are commonly associated with. Tech Faculty acts as a
 * free advisory desk: we help a student pick a hub or study route near them and
 * enrol — online, hybrid or in person. Only entries flagged `isTechFaculty`
 * are our own campuses.
 */

export const HUBS_DISCLAIMER =
  "Tech Faculty curates this directory to help students find training near them. Listings describe publicly available information about each hub and do not imply affiliation or endorsement. Our own campuses are marked as Tech Faculty campuses.";

export const HUB_WHATSAPP_NUMBER = "2348068597140";

export type HubCountry = "Nigeria";

export type HubType =
  | "Innovation hub"
  | "Incubator"
  | "Training institute"
  | "University-based hub"
  | "Tech Faculty campus";

export type HubFormat = "In-person" | "Hybrid" | "Online";

export const COURSE_AREAS = [
  "AI & Machine Learning",
  "Software Engineering",
  "Data Analytics",
  "Cybersecurity",
  "Product & UI/UX Design",
  "Digital Marketing",
  "Cloud & DevOps",
  "Robotics & IoT",
] as const;

export type CourseArea = (typeof COURSE_AREAS)[number];

/** The department page that teaches each course area. */
export const COURSE_AREA_DEPARTMENT: Record<CourseArea, string> = {
  "AI & Machine Learning": "ai-machine-learning",
  "Software Engineering": "web-development",
  "Data Analytics": "data-science-analytics",
  Cybersecurity: "cybersecurity",
  "Product & UI/UX Design": "design",
  "Digital Marketing": "digital-marketing",
  "Cloud & DevOps": "cloud-computing",
  "Robotics & IoT": "robotics-iot",
};

export interface TechHub {
  slug: string;
  name: string;
  city: string;
  region: string;
  country: HubCountry;
  type: HubType;
  formats: HubFormat[];
  courseAreas: CourseArea[];
  /** One-line summary used on cards. */
  focus: string;
  /** 2–3 sentence editorial paragraph used on the hub page. */
  intro: string;
  website?: string;
  /** Set on our own campuses; links through to /locations/:slug. */
  isTechFaculty?: boolean;
  campusSlug?: string;
}

export const techHubs: TechHub[] = [
  // ---------------- Nigeria — Tech Faculty campuses ----------------
  {
    slug: "tech-faculty-nnewi",
    name: "Tech Faculty — Technology Incubation Centre, Nnewi",
    city: "Nnewi",
    region: "Anambra",
    country: "Nigeria",
    type: "Tech Faculty campus",
    formats: ["In-person", "Hybrid", "Online"],
    courseAreas: [
      "AI & Machine Learning",
      "Software Engineering",
      "Data Analytics",
      "Cybersecurity",
      "Product & UI/UX Design",
      "Digital Marketing",
      "Cloud & DevOps",
      "Robotics & IoT",
    ],
    focus: "Our headquarters and South-East zonal base — every department runs here in person.",
    intro:
      "Tech Faculty's headquarters sits inside the Technology Incubation Centre in Nnewi, which also serves as the South-East zonal base of the Technology Incubation Centre network. Nnewi's manufacturing and auto-parts economy means students build automation, dashboards and online storefronts for real local businesses while they train. Every department runs here in person, alongside SIWES placement and teen holiday bootcamps.",
    isTechFaculty: true,
    campusSlug: "nnewi",
  },
  {
    slug: "tech-faculty-onitsha",
    name: "Tech Faculty — Onitsha (Awada) Centre",
    city: "Onitsha",
    region: "Anambra",
    country: "Nigeria",
    type: "Tech Faculty campus",
    formats: ["In-person", "Hybrid", "Online"],
    courseAreas: [
      "Software Engineering",
      "Data Analytics",
      "AI & Machine Learning",
      "Digital Marketing",
      "Product & UI/UX Design",
    ],
    focus: "Standalone Awada centre built around Onitsha's traders and distributors.",
    intro:
      "Our Onitsha centre is a standalone Tech Faculty facility at Anene Close, off Ezeiweka Road, Awada. It exists because Onitsha's traders and distributors are digitising quickly — WhatsApp storefronts, inventory dashboards and AI customer agents are everyday requests here. Weekend cohorts are built around market schedules.",
    isTechFaculty: true,
    campusSlug: "onitsha",
  },
  {
    slug: "tech-faculty-enugu",
    name: "Tech Faculty — Technology Incubation Centre, Enugu",
    city: "Enugu",
    region: "Enugu",
    country: "Nigeria",
    type: "Tech Faculty campus",
    formats: ["In-person", "Hybrid", "Online"],
    courseAreas: [
      "Data Analytics",
      "Cybersecurity",
      "Software Engineering",
      "AI & Machine Learning",
      "Cloud & DevOps",
    ],
    focus: "Enugu campus with depth in data analytics and cybersecurity.",
    intro:
      "Enugu is the administrative heart of the South-East and demand splits between public-sector digitisation and a growing startup scene. Our campus inside the Technology Incubation Centre, Enugu runs the full department list with particular depth in data analytics and cybersecurity.",
    isTechFaculty: true,
    campusSlug: "enugu",
  },
  {
    slug: "tech-faculty-owerri",
    name: "Tech Faculty — Technology Incubation Centre, Owerri",
    city: "Owerri",
    region: "Imo",
    country: "Nigeria",
    type: "Tech Faculty campus",
    formats: ["In-person", "Hybrid", "Online"],
    courseAreas: [
      "Product & UI/UX Design",
      "Digital Marketing",
      "Software Engineering",
      "Data Analytics",
      "AI & Machine Learning",
    ],
    focus: "Imo State campus with heavy student and SIWES intake.",
    intro:
      "Owerri has one of the densest student populations in the South-East, and our campus inside the Technology Incubation Centre is built around that: heavy SIWES intake, evening cohorts for undergraduates and remote-work coaching for graduates. Design and digital marketing are especially strong here.",
    isTechFaculty: true,
    campusSlug: "owerri",
  },
  {
    slug: "tech-faculty-aba",
    name: "Tech Faculty — Technology Incubation Centre, Aba",
    city: "Aba",
    region: "Abia",
    country: "Nigeria",
    type: "Tech Faculty campus",
    formats: ["In-person", "Hybrid", "Online"],
    courseAreas: [
      "Digital Marketing",
      "Product & UI/UX Design",
      "Software Engineering",
      "Data Analytics",
      "AI & Machine Learning",
    ],
    focus: "Aba campus serving Nigeria's manufacturing and garment economy.",
    intro:
      "Aba makes things and sells them nationwide, so our campus inside the Technology Incubation Centre, Aba focuses on what that economy needs: e-commerce storefronts, product design and photography, WhatsApp AI agents for orders, and production dashboards.",
    isTechFaculty: true,
    campusSlug: "aba",
  },
  {
    slug: "tech-faculty-abuja",
    name: "Tech Faculty — National Board for Technology Incubation HQ, Abuja",
    city: "Abuja",
    region: "Federal Capital Territory",
    country: "Nigeria",
    type: "Tech Faculty campus",
    formats: ["In-person", "Hybrid", "Online"],
    courseAreas: [
      "Data Analytics",
      "Cybersecurity",
      "AI & Machine Learning",
      "Cloud & DevOps",
      "Software Engineering",
    ],
    focus: "FCT presence tuned to agencies, development partners and consultancies.",
    intro:
      "In the Federal Capital Territory we operate from the National Board for Technology Incubation headquarters in Maitama. Abuja demand is institutional — agencies, development partners and consulting firms hiring for data, cybersecurity, compliance and AI capability — so cohorts skew toward working professionals on evening and weekend schedules.",
    isTechFaculty: true,
    campusSlug: "abuja",
  },
  {
    slug: "tech-faculty-lagos",
    name: "Tech Faculty — Technology Incubation Centre, Lagos",
    city: "Lagos",
    region: "Lagos",
    country: "Nigeria",
    type: "Tech Faculty campus",
    formats: ["In-person", "Hybrid", "Online"],
    courseAreas: [
      "Software Engineering",
      "Data Analytics",
      "Product & UI/UX Design",
      "AI & Machine Learning",
      "Cloud & DevOps",
      "Cybersecurity",
    ],
    focus: "Lagos campus wired into Nigeria's largest tech job market.",
    intro:
      "Lagos is where most Nigerian tech hiring happens, and our Lagos presence is tuned for that: portfolio-first teaching, interview preparation and direct routing into the roles on our jobs board. Engineering, data and product design cohorts are the largest here.",
    isTechFaculty: true,
    campusSlug: "lagos",
  },
  {
    slug: "tech-faculty-port-harcourt",
    name: "Tech Faculty — Technology Incubation Centre, Port Harcourt",
    city: "Port Harcourt",
    region: "Rivers",
    country: "Nigeria",
    type: "Tech Faculty campus",
    formats: ["In-person", "Hybrid", "Online"],
    courseAreas: [
      "Data Analytics",
      "Cybersecurity",
      "Cloud & DevOps",
      "Software Engineering",
      "Robotics & IoT",
    ],
    focus: "Rivers State campus serving oil, gas and services employers.",
    intro:
      "Port Harcourt's energy and services economy hires for data, industrial IoT and security skills, and our campus inside the Technology Incubation Centre reflects that. Cohorts mix undergraduates on SIWES with professionals moving from engineering into data and cloud roles.",
    isTechFaculty: true,
    campusSlug: "port-harcourt",
  },
  {
    slug: "tech-faculty-ibadan",
    name: "Tech Faculty — Technology Incubation Centre, Ibadan",
    city: "Ibadan",
    region: "Oyo",
    country: "Nigeria",
    type: "Tech Faculty campus",
    formats: ["In-person", "Hybrid", "Online"],
    courseAreas: [
      "Data Analytics",
      "AI & Machine Learning",
      "Software Engineering",
      "Product & UI/UX Design",
      "Digital Marketing",
    ],
    focus: "Oyo State campus with deep university and research links.",
    intro:
      "Ibadan has more students and research institutions than almost any Nigerian city, and our campus is built around that pipeline: SIWES cohorts, undergraduate evening classes and research-adjacent machine learning projects.",
    isTechFaculty: true,
    campusSlug: "ibadan",
  },
  {
    slug: "tech-faculty-kano",
    name: "Tech Faculty — Technology Incubation Centre, Kano",
    city: "Kano",
    region: "Kano",
    country: "Nigeria",
    type: "Tech Faculty campus",
    formats: ["In-person", "Hybrid", "Online"],
    courseAreas: [
      "Software Engineering",
      "Data Analytics",
      "Digital Marketing",
      "AI & Machine Learning",
    ],
    focus: "Northern commercial hub with strong trade and SME demand.",
    intro:
      "Kano's trading and light-manufacturing economy is digitising through commerce and payments, and our campus focuses on the practical end of that: storefronts, records digitisation, analytics and AI literacy for business owners and young graduates.",
    isTechFaculty: true,
    campusSlug: "kano",
  },

  // ---------------- Nigeria — independent hubs ----------------
  {
    slug: "co-creation-hub-lagos",
    name: "Co-Creation Hub (CcHUB)",
    city: "Lagos",
    region: "Lagos",
    country: "Nigeria",
    type: "Innovation hub",
    formats: ["In-person", "Hybrid"],
    courseAreas: [
      "Software Engineering",
      "Product & UI/UX Design",
      "AI & Machine Learning",
      "Data Analytics",
    ],
    focus: "One of Africa's best-known innovation hubs, based in Yaba, Lagos.",
    intro:
      "CcHUB is among the most widely recognised innovation centres in Africa, headquartered in the Yaba tech cluster in Lagos with operations elsewhere on the continent. It is publicly known for design-led product work, startup support programmes and education initiatives. Yaba is the natural starting point for anyone in Lagos looking for a hub environment rather than a classroom.",
    website: "https://cchubnigeria.com",
  },
  {
    slug: "ventures-platform-hub-abuja",
    name: "Ventures Platform Hub",
    city: "Abuja",
    region: "Federal Capital Territory",
    country: "Nigeria",
    type: "Innovation hub",
    formats: ["In-person"],
    courseAreas: ["Software Engineering", "Product & UI/UX Design", "Data Analytics"],
    focus: "Abuja hub and community space associated with startup and founder programmes.",
    intro:
      "Ventures Platform's Abuja hub is one of the best-known startup community spaces in the Federal Capital Territory, publicly associated with founder support, events and coworking. For students in Abuja it is a useful place to meet builders and employers while training online or on campus.",
    website: "https://venturesplatform.com",
  },
  {
    slug: "genesys-tech-hub-enugu",
    name: "Genesys Tech Hub",
    city: "Enugu",
    region: "Enugu",
    country: "Nigeria",
    type: "Innovation hub",
    formats: ["In-person", "Hybrid"],
    courseAreas: ["Software Engineering", "Data Analytics", "Cloud & DevOps"],
    focus: "Enugu-based hub widely known for engineering training and talent development.",
    intro:
      "Genesys Tech Hub in Enugu is one of the best-known technology hubs in South-East Nigeria, publicly associated with software engineering training, an academy model and startup support. It is a strong reference point for anyone in Enugu weighing a hub environment against a structured bootcamp.",
    website: "https://genesystechhub.com",
  },
  {
    slug: "roar-nigeria-hub-nsukka",
    name: "Roar Nigeria Hub, University of Nigeria",
    city: "Nsukka",
    region: "Enugu",
    country: "Nigeria",
    type: "University-based hub",
    formats: ["In-person"],
    courseAreas: ["Software Engineering", "Robotics & IoT", "AI & Machine Learning"],
    focus: "University of Nigeria incubation hub for student founders and builders.",
    intro:
      "Roar Nigeria Hub sits on the University of Nigeria campus in Nsukka and is publicly known as one of the country's earliest university-based technology incubators. It is a natural home for undergraduate builders — and a good pairing with an online or hybrid Tech Faculty track during the semester.",
  },
  {
    slug: "nhub-jos",
    name: "nHub Nigeria",
    city: "Jos",
    region: "Plateau",
    country: "Nigeria",
    type: "Innovation hub",
    formats: ["In-person", "Hybrid"],
    courseAreas: ["Software Engineering", "Product & UI/UX Design", "Data Analytics"],
    focus: "Plateau State hub known for developer training and community programmes.",
    intro:
      "nHub in Jos is the best-known technology hub in Plateau State, publicly associated with software training, community events and startup support. Jos students often combine a hub community with an online course structure.",
    website: "https://nhubnigeria.com",
  },
  {
    slug: "colab-kaduna",
    name: "CoLab Innovation Hub",
    city: "Kaduna",
    region: "Kaduna",
    country: "Nigeria",
    type: "Innovation hub",
    formats: ["In-person"],
    courseAreas: ["Software Engineering", "Product & UI/UX Design", "Digital Marketing"],
    focus: "Kaduna coworking and innovation space with a young builder community.",
    intro:
      "CoLab in Kaduna is a well-known coworking and innovation space in Northern Nigeria, publicly associated with developer meetups, coworking and youth technology programmes. It is a good base for Kaduna students studying with us online.",
    website: "https://colabinnovationhub.com",
  },
  {
    slug: "wennovation-hub-ibadan",
    name: "Wennovation Hub",
    city: "Ibadan",
    region: "Oyo",
    country: "Nigeria",
    type: "Incubator",
    formats: ["In-person", "Hybrid"],
    courseAreas: ["Software Engineering", "Data Analytics", "Product & UI/UX Design"],
    focus: "Early-stage innovation accelerator with an Ibadan presence.",
    intro:
      "Wennovation Hub is one of Nigeria's longer-running early-stage innovation accelerators, publicly associated with incubation programmes across sectors including agriculture, education and healthcare, with presence in Ibadan and Lagos.",
  },
  {
    slug: "hebron-startup-lab-ota",
    name: "Hebron Startup Lab, Covenant University",
    city: "Ota",
    region: "Ogun",
    country: "Nigeria",
    type: "University-based hub",
    formats: ["In-person"],
    courseAreas: ["Software Engineering", "AI & Machine Learning", "Robotics & IoT"],
    focus: "University-based startup lab for student technology founders.",
    intro:
      "Hebron Startup Lab operates from Covenant University in Ota and is publicly known for incubating student-led technology startups. It suits undergraduates who want a builder community alongside their degree.",
  },
  {
    slug: "innovation-growth-hub-port-harcourt",
    name: "Innovation Growth Hub (iGHub)",
    city: "Port Harcourt",
    region: "Rivers",
    country: "Nigeria",
    type: "Innovation hub",
    formats: ["In-person"],
    courseAreas: ["Software Engineering", "Data Analytics", "Digital Marketing"],
    focus: "Rivers State innovation and coworking hub for young technologists.",
    intro:
      "iGHub in Port Harcourt is publicly known as a coworking and innovation centre supporting young technologists and startups in Rivers State — a useful community base for students on our online or hybrid tracks.",
  },
];

/**
 * Slugs of the hub pages outside Nigeria that were removed on 2026-10-08.
 * Their URLs redirect to the directory so old links and search results land
 * somewhere useful.
 */
export const REMOVED_HUB_SLUGS = new Set([
  "ihub-nairobi",
  "nailab-nairobi",
  "mest-africa-accra",
  "impact-hub-accra",
  "klab-kigali",
  "norrsken-house-kigali",
  "tshimologong-johannesburg",
  "workshop17-cape-town",
  "greek-campus-cairo",
  "flat6labs-cairo",
  "innovation-village-kampala",
  "outbox-kampala",
  "buni-hub-dar-es-salaam",
  "ctic-dakar",
  "iceaddis-addis-ababa",
]);

export const hubCities = Array.from(new Set(techHubs.map((h) => h.city))).sort();

export const getHub = (slug: string) => techHubs.find((h) => h.slug === slug);

export const hubsInCity = (city: string, excludeSlug?: string) =>
  techHubs.filter((h) => h.city === city && h.slug !== excludeSlug);

/** WhatsApp deep link with a preloaded course + city + hub payload. */
export const hubWhatsAppUrl = (
  hub: Pick<TechHub, "name" | "city" | "country">,
  courseArea?: string,
) => {
  const course = courseArea && courseArea !== "Not sure yet" ? courseArea : "a tech course";
  const message = `Hello Tech Faculty, I want to study ${course} in ${hub.city}, ${hub.country}. I found ${hub.name} on your tech hubs directory — what are my options (online, hybrid or in person)?`;
  return `https://wa.me/${HUB_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

/** Generic directory CTA when no specific hub is selected. */
export const directoryWhatsAppUrl = (city?: string, courseArea?: string) => {
  const where = city ? ` in ${city}` : " near me";
  const course = courseArea ? courseArea : "a tech course";
  const message = `Hello Tech Faculty, I want to study ${course}${where}. I found your tech hubs directory — can you help me choose a hub or study route?`;
  return `https://wa.me/${HUB_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
