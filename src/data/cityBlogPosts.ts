import type { BlogPost } from "@/types/blog";
import { campuses } from "@/data/campuses";
import { COURSE_AREA_DEPARTMENT, type CourseArea } from "@/data/techHubs";

type CityGuide = {
  city: string;
  state: string;
  slug: string;
  description: string;
  scene: string;
  sectors: string[];
  skills: CourseArea[];
  hubs: Array<{ name: string; slug: string; note: string }>;
  campusSlug?: string;
  /** Campus to point to when the city has none of its own. */
  nearestCampusSlug?: string;
  studentRoute: string;
  /** Why each skill fits this city; keyed by the entries in `skills`. */
  skillNotes: Partial<Record<CourseArea, string>>;
  projectIdeas: string[];
  /** Local institutions; defaults to the campus's nearby institutions. */
  institutions?: string[];
};

const WHATSAPP = "2348068597140";

const cityGuides: CityGuide[] = [
  {
    city: "Nnewi",
    state: "Anambra State",
    slug: "tech-scene-hubs-and-training-in-nnewi-2026",
    description: "Explore Nnewi's tech scene, local training hubs and practical courses for manufacturing, commerce and remote work, with guidance from Tech Faculty.",
    scene: "Nnewi is known for manufacturing, vehicle parts and owner-led businesses. That commercial base creates practical technology problems: factories need production dashboards, distributors need inventory systems, and growing businesses need secure online sales and customer support. A learner who builds for these real needs can create a locally relevant portfolio without waiting for a large startup to hire them.",
    sectors: ["manufacturing and industrial automation", "vehicle-parts distribution and inventory", "e-commerce for local brands", "remote software and data work"],
    skills: ["Data Analytics", "Software Engineering", "AI & Machine Learning", "Robotics & IoT"],
    hubs: [{ name: "Tech Faculty — Technology Incubation Centre, Nnewi", slug: "tech-faculty-nnewi", note: "our headquarters, with in-person, hybrid and online study routes across every department" }],
    campusSlug: "nnewi",
    studentRoute: "Start with a local business problem: track stock movement, analyse production waste, build a simple ordering tool or automate repeated WhatsApp questions. That project can become both your portfolio and your introduction to a Nnewi employer.",
    skillNotes: {
      "Data Analytics": "Factories and parts distributors track stock, production runs and credit sales, often on paper. An analyst who turns those records into a weekly dashboard is useful immediately.",
      "Software Engineering": "Parts dealers sell across the country by phone and WhatsApp, so ordering tools, catalogues and simple inventory apps are realistic first builds.",
      "AI & Machine Learning": "Owner-led firms answer the same price and availability questions all day, which makes AI customer agents and document automation an easy sell.",
      "Robotics & IoT": "Machine shops and assembly lines give hardware learners real equipment to monitor, from temperature sensors to production counters.",
    },
    projectIdeas: ["A parts-availability lookup a dealer can share on WhatsApp", "A weekly production-waste report for a small factory", "A stock alert that warns a distributor before a fast-moving part runs out"],
  },
  {
    city: "Onitsha",
    state: "Anambra State",
    slug: "tech-scene-hubs-and-training-in-onitsha-2026",
    description: "Discover Onitsha's growing tech scene, Awada training options and courses for commerce, e-commerce, data and digital careers with Tech Faculty.",
    scene: "Onitsha's commercial engine is its advantage. Traders, distributors, transport operators and importers handle large volumes of stock and customer conversations every day. The strongest local technology opportunities are therefore not abstract: they include online catalogues, inventory reporting, digital marketing, payment workflows and AI-assisted customer service.",
    sectors: ["wholesale and retail commerce", "logistics and distribution", "e-commerce and digital marketing", "business data and automation"],
    skills: ["Digital Marketing", "Data Analytics", "Software Engineering", "Product & UI/UX Design"],
    hubs: [{ name: "Tech Faculty — Onitsha (Awada) Centre", slug: "tech-faculty-onitsha", note: "our standalone Awada centre, with schedules designed around traders, workers and students" }],
    campusSlug: "onitsha",
    studentRoute: "Build around the market: a stock dashboard, WhatsApp product catalogue, dispatch tracker or sales campaign gives you a portfolio that an Onitsha business understands immediately.",
    skillNotes: {
      "Digital Marketing": "Onitsha traders already sell on WhatsApp, Instagram and Facebook. Someone who can run catalogues, ads and follow-ups turns that habit into measurable sales.",
      "Data Analytics": "Wholesale volumes are high and margins are thin, so knowing which lines move and which customers still owe money is worth paying for.",
      "Software Engineering": "Distributors and transport operators need order, dispatch and payment tools that work on low-cost phones and patchy data.",
      "Product & UI/UX Design": "Market brands compete on trust. Clean product photos, packaging and storefront layouts make a visible difference to buyers.",
    },
    projectIdeas: ["A WhatsApp product catalogue for one market line, with prices kept current", "A debtor and credit-sales tracker for a wholesaler", "A delivery-status page a dispatch rider updates from a phone"],
  },
  {
    city: "Enugu",
    state: "Enugu State",
    slug: "tech-scene-hubs-and-training-in-enugu-2026",
    description: "Understand Enugu's tech scene, leading innovation hubs and courses in software, data, AI and cybersecurity, plus Tech Faculty study support.",
    scene: "Enugu combines a large student population, public institutions, professional services and a visible startup community. That mix supports software teams, digital agencies, data work and public-sector digitisation. Students can learn in a structured classroom, join an independent builder community and still compete for remote roles beyond the city.",
    sectors: ["public-sector digitisation", "software products and startups", "professional services", "remote engineering and data work"],
    skills: ["Software Engineering", "Data Analytics", "Cybersecurity", "AI & Machine Learning"],
    hubs: [
      { name: "Tech Faculty — Technology Incubation Centre, Enugu", slug: "tech-faculty-enugu", note: "our Enugu campus with in-person, hybrid and online programmes" },
      { name: "Genesys Tech Hub", slug: "genesys-tech-hub-enugu", note: "an independently operated hub publicly known for engineering training and startup support" },
    ],
    campusSlug: "enugu",
    studentRoute: "Combine structured training with community exposure. Build one public project using a local service or public dataset, attend builder events, and use the finished work when applying for SIWES or junior roles.",
    skillNotes: {
      "Software Engineering": "Enugu's startup community and agencies hire junior developers who have shipped something, and remote teams recruit from the city too.",
      "Data Analytics": "State agencies, hospitals and NGOs report to funders and government, so analysts who can clean records and build reports are in steady demand.",
      "Cybersecurity": "As public services and fintech teams move records online, they need people who understand access control, backups and the Nigeria Data Protection Act.",
      "AI & Machine Learning": "Professional services firms are adopting AI for documents and customer support, and need people who can set it up safely.",
    },
    projectIdeas: ["A public dashboard built from an open Enugu State dataset", "A security checklist and access review for a small clinic or school", "A document-search assistant for a law or consulting office"],
  },
  {
    city: "Owerri",
    state: "Imo State",
    slug: "tech-scene-hubs-and-training-in-owerri-2026",
    description: "Explore Owerri's student-led tech scene, local training choices and courses in design, marketing, software and data with Tech Faculty support.",
    scene: "Owerri's technology pipeline is closely tied to its universities, polytechnics and large youth population. Many learners begin through SIWES, campus communities, freelance design or digital marketing before moving into deeper software and data roles. The city is especially suitable for building practical experience while still in school.",
    sectors: ["student technology communities", "creative and digital services", "hospitality and small-business marketing", "remote freelance work"],
    skills: ["Product & UI/UX Design", "Digital Marketing", "Software Engineering", "Data Analytics"],
    hubs: [{ name: "Tech Faculty — Technology Incubation Centre, Owerri", slug: "tech-faculty-owerri", note: "our Imo State campus with a strong SIWES and undergraduate intake" }],
    campusSlug: "owerri",
    studentRoute: "Choose a skill that produces visible work quickly, then solve a campus or local-business problem. A usable website, campaign report or interface case study is stronger than a folder of course certificates.",
    skillNotes: {
      "Product & UI/UX Design": "Owerri's hotels, event planners and creative businesses need brand assets and booking interfaces, so a design portfolio finds clients quickly.",
      "Digital Marketing": "Hospitality and events run on social media, and campaign skills turn directly into paid freelance work.",
      "Software Engineering": "Students often start with websites for campus groups and local businesses before moving on to larger products.",
      "Data Analytics": "Hotels and retailers record bookings and sales but rarely analyse them, so a simple occupancy or sales report is an easy first win.",
    },
    projectIdeas: ["A booking page for an Owerri hotel or event centre", "A month-long social campaign report for a local business", "A sales or occupancy dashboard built from a business's own records"],
  },
  {
    city: "Aba",
    state: "Abia State",
    slug: "tech-scene-hubs-and-training-in-aba-2026",
    description: "Explore Aba's practical tech scene, local training and courses for manufacturing, fashion, e-commerce, software and analytics with Tech Faculty.",
    scene: "Aba's makers, fashion businesses, wholesalers and manufacturers create an unusually practical environment for learning technology. Local firms need product catalogues, stronger digital brands, stock systems, production records and better customer follow-up. A student can turn one of those needs into a portfolio project with measurable business value.",
    sectors: ["fashion and garment production", "manufacturing and fabrication", "e-commerce and product marketing", "inventory and business analytics"],
    skills: ["Digital Marketing", "Product & UI/UX Design", "Software Engineering", "Data Analytics"],
    hubs: [{ name: "Tech Faculty — Technology Incubation Centre, Aba", slug: "tech-faculty-aba", note: "our Aba campus focused on the digital needs of makers and local businesses" }],
    campusSlug: "aba",
    studentRoute: "Ask a maker or retailer what wastes the most time. Turn the answer into a small digital solution, document the before-and-after process and use it as evidence when seeking paid work.",
    skillNotes: {
      "Digital Marketing": "Aba-made shoes, bags and clothing sell nationwide online, and marketing skills help makers reach buyers outside the city.",
      "Product & UI/UX Design": "Product photography, labels and lookbooks decide whether an Aba brand looks premium or looks like a market copy.",
      "Software Engineering": "Makers need order forms, size guides and online stores that can handle bulk orders from retailers.",
      "Data Analytics": "Production runs and raw-material costs are rarely tracked closely, and costing analysis shows makers where money leaks.",
    },
    projectIdeas: ["An online catalogue and order form for a shoe or garment maker", "A costing sheet that shows profit per product line", "A brand refresh with new product photos and labels"],
  },
  {
    city: "Abuja",
    state: "Federal Capital Territory",
    slug: "tech-scene-hubs-and-training-in-abuja-2026",
    description: "Navigate Abuja's tech scene, innovation hubs and training in data, cybersecurity, cloud, AI and software with practical Tech Faculty guidance.",
    scene: "Abuja's technology market reflects the institutions based there: government agencies, development organisations, consultancies, nonprofits and a growing startup community. Employers often value data reporting, cybersecurity, cloud operations, compliance and the ability to explain technical work clearly to non-technical decision-makers.",
    sectors: ["government and public services", "development and nonprofit programmes", "consulting and compliance", "startups and digital services"],
    skills: ["Data Analytics", "Cybersecurity", "Cloud & DevOps", "AI & Machine Learning"],
    hubs: [
      { name: "Tech Faculty — National Board for Technology Incubation HQ, Abuja", slug: "tech-faculty-abuja", note: "our FCT training base for students and working professionals" },
      { name: "Ventures Platform Hub", slug: "ventures-platform-hub-abuja", note: "an independent startup community and founder-support space" },
    ],
    campusSlug: "abuja",
    studentRoute: "Build a project around a public-service or organisational problem: a reporting dashboard, secure records workflow or cloud deployment. Present it in plain language as well as code.",
    skillNotes: {
      "Data Analytics": "Agencies, NGOs and development programmes report to donors and ministries constantly, which keeps monitoring-and-evaluation analysts busy.",
      "Cybersecurity": "Government and consulting clients handle sensitive records, so security and data-protection compliance skills are valued highly.",
      "Cloud & DevOps": "Organisations moving systems off local servers need people who can deploy, monitor and cost cloud services.",
      "AI & Machine Learning": "Policy and consulting teams want AI that summarises reports and drafts documents, and someone who can explain its limits to managers.",
    },
    projectIdeas: ["A programme-monitoring dashboard built on a public development dataset", "A data-protection gap assessment for a small NGO", "A cloud-hosted reporting app with a short cost and security write-up"],
  },
  {
    city: "Lagos",
    state: "Lagos State",
    slug: "tech-scene-hubs-and-training-in-lagos-2026",
    description: "Explore Lagos's tech ecosystem, Yaba innovation hubs and courses for software, product, data, AI, cloud and cybersecurity with Tech Faculty.",
    scene: "Lagos has Nigeria's deepest concentration of startups, fintech companies, agencies, investors and technology jobs. It also has the most competition. Learners stand out by choosing a clear role, shipping public projects and joining communities where working builders exchange opportunities—not by collecting the largest number of beginner certificates.",
    sectors: ["fintech and digital payments", "software products and startups", "media, commerce and logistics", "product design and growth"],
    skills: ["Software Engineering", "Data Analytics", "Product & UI/UX Design", "AI & Machine Learning"],
    hubs: [
      { name: "Tech Faculty — Technology Incubation Centre, Lagos", slug: "tech-faculty-lagos", note: "our Lagos study route with portfolio and interview preparation" },
      { name: "Co-Creation Hub (CcHUB)", slug: "co-creation-hub-lagos", note: "an independent innovation hub widely associated with Yaba's startup ecosystem" },
    ],
    campusSlug: "lagos",
    studentRoute: "Pick one target role before choosing tools. Build two relevant projects, join a credible community, improve your LinkedIn and GitHub evidence, then apply consistently to local and remote roles.",
    skillNotes: {
      "Software Engineering": "Lagos has the most engineering jobs in the country and the most applicants, so shipped, deployed projects count for more than course lists.",
      "Data Analytics": "Fintechs, banks and logistics firms hire analysts who can write SQL and explain what the numbers mean for the business.",
      "Product & UI/UX Design": "Product teams hire designers whose case studies show research and decisions, not only polished screens.",
      "AI & Machine Learning": "Startups are adding AI features quickly and need engineers who can build them and test where they fail.",
    },
    projectIdeas: ["A transaction-history dashboard using sample fintech data", "A product-design case study that redesigns one Lagos service", "An AI feature added to an existing app, with notes on where it fails"],
  },
  {
    city: "Port Harcourt",
    state: "Rivers State",
    slug: "tech-scene-hubs-and-training-in-port-harcourt-2026",
    description: "Explore Port Harcourt's tech scene, local innovation hubs and courses for energy, data, cybersecurity, cloud and software with Tech Faculty.",
    scene: "Port Harcourt's energy, engineering and service industries shape its technology opportunities. Data reporting, industrial systems, cybersecurity, cloud infrastructure and logistics software are natural routes. The city also has independent communities where students and founders can meet collaborators outside traditional oil and gas careers.",
    sectors: ["energy and engineering services", "industrial data and IoT", "cybersecurity and cloud operations", "logistics and business software"],
    skills: ["Data Analytics", "Cybersecurity", "Cloud & DevOps", "Robotics & IoT"],
    hubs: [
      { name: "Tech Faculty — Technology Incubation Centre, Port Harcourt", slug: "tech-faculty-port-harcourt", note: "our Rivers State campus serving students and working professionals" },
      { name: "Innovation Growth Hub (iGHub)", slug: "innovation-growth-hub-port-harcourt", note: "an independent coworking and innovation community" },
    ],
    campusSlug: "port-harcourt",
    studentRoute: "Translate an engineering or service workflow into a digital project: equipment reporting, operational dashboards, secure access or dispatch tracking all demonstrate locally relevant ability.",
    skillNotes: {
      "Data Analytics": "Energy and servicing companies report on equipment, safety and production every week, and analysts who automate that reporting save real money.",
      "Cybersecurity": "Industrial systems and banks are attractive targets, so security operations skills are in steady demand.",
      "Cloud & DevOps": "Operators moving reporting and maintenance systems to the cloud need people who can run and secure them.",
      "Robotics & IoT": "Sensors on pumps, generators and vessels produce data that someone has to collect and act on.",
    },
    projectIdeas: ["A maintenance-log dashboard for a fleet of generators or pumps", "A security-awareness and access audit for a small servicing firm", "A sensor prototype that alerts a phone when a reading goes out of range"],
  },
  {
    city: "Ibadan",
    state: "Oyo State",
    slug: "tech-scene-hubs-and-training-in-ibadan-2026",
    description: "Explore Ibadan's research-driven tech scene, local hubs and courses in AI, data, software and product design, with Tech Faculty study guidance.",
    scene: "Ibadan's universities, research institutes and large student population make it a strong environment for data, software and applied AI. Learners can use public datasets, academic problems, agriculture and health questions to build work that is more distinctive than another generic tutorial project.",
    sectors: ["universities and research", "agriculture and food systems", "health and public data", "student-led startups"],
    skills: ["Data Analytics", "AI & Machine Learning", "Software Engineering", "Product & UI/UX Design"],
    hubs: [
      { name: "Tech Faculty — Technology Incubation Centre, Ibadan", slug: "tech-faculty-ibadan", note: "our Oyo State campus with student, SIWES and research-adjacent routes" },
      { name: "Wennovation Hub", slug: "wennovation-hub-ibadan", note: "an independently operated early-stage innovation accelerator with an Ibadan presence" },
    ],
    campusSlug: "ibadan",
    studentRoute: "Use the city's research advantage. Choose a credible local dataset or field problem, build a reproducible analysis or product and explain what decision your work improves.",
    skillNotes: {
      "Data Analytics": "Universities and research institutes produce health, farming and population datasets that make strong portfolio material.",
      "AI & Machine Learning": "Research groups and agritech teams experiment with machine learning on crop, health and image data.",
      "Software Engineering": "Student-led startups and university services need web tools built by people who understand campus users.",
      "Product & UI/UX Design": "Research findings and public services often fail on usability, and designers who make them clear stand out.",
    },
    projectIdeas: ["A reproducible analysis of a public health or farming dataset", "A crop or plant image classifier with an honest write-up of its accuracy", "A redesigned student-services page tested with real classmates"],
  },
  {
    city: "Kano",
    state: "Kano State",
    slug: "tech-scene-hubs-and-training-in-kano-2026",
    description: "Explore Kano's commercial tech scene and courses for e-commerce, software, data, digital marketing and AI, with flexible Tech Faculty support.",
    scene: "Kano is a major commercial and manufacturing centre with large markets and regional trade links. Its strongest entry-level technology opportunities sit close to business operations: digitising records, reaching customers online, understanding sales data and building simple tools that work reliably on mobile devices.",
    sectors: ["trade and regional commerce", "light manufacturing", "digital payments and retail", "SME marketing and records"],
    skills: ["Software Engineering", "Data Analytics", "Digital Marketing", "AI & Machine Learning"],
    hubs: [{ name: "Tech Faculty — Technology Incubation Centre, Kano", slug: "tech-faculty-kano", note: "our Kano campus offering practical in-person, hybrid and online routes" }],
    campusSlug: "kano",
    studentRoute: "Build for mobile-first commerce: a simple catalogue, sales tracker, customer follow-up workflow or bilingual information service can become a strong first portfolio project.",
    skillNotes: {
      "Software Engineering": "Kano's markets trade across the North and beyond, and mobile-first ordering and record tools fit how business is already done.",
      "Data Analytics": "Traders and agro-processors handle large volumes, and sales and price tracking help them buy and sell at the right time.",
      "Digital Marketing": "Businesses reaching customers in Hausa and English on WhatsApp and social media need people who can run bilingual campaigns.",
      "AI & Machine Learning": "AI assistants that answer customers in Hausa and English are a practical first AI project for Kano businesses.",
    },
    projectIdeas: ["A bilingual Hausa and English product catalogue", "A daily price tracker for grains or other commodities", "A sales-record app that works on a basic Android phone"],
  },
  {
    city: "Nsukka",
    state: "Enugu State",
    slug: "tech-scene-hubs-and-training-in-nsukka-2026",
    description: "Explore Nsukka's university tech scene, Roar Nigeria Hub and routes into software, AI and robotics through flexible Tech Faculty training.",
    scene: "Nsukka's technology community is anchored by the University of Nigeria and its population of students, researchers and early-stage founders. The city is well suited to experimentation: learners can test ideas with classmates, work on research-related problems and build products before graduation.",
    sectors: ["university innovation", "student entrepreneurship", "research and educational technology", "remote software work"],
    skills: ["Software Engineering", "AI & Machine Learning", "Robotics & IoT", "Data Analytics"],
    hubs: [{ name: "Roar Nigeria Hub, University of Nigeria", slug: "roar-nigeria-hub-nsukka", note: "an independent university-based incubation hub for student builders" }],
    studentRoute: "Pair a Tech Faculty online or hybrid programme with the local builder community. Use a semester problem, research question or campus service as the basis of a working product.",
    skillNotes: {
      "Software Engineering": "University of Nigeria students build apps for classmates, departments and campus businesses long before graduation.",
      "AI & Machine Learning": "University research groups give AI learners real data and real questions to work on.",
      "Robotics & IoT": "Engineering students can turn final-year hardware projects into working prototypes with sensors and controllers.",
      "Data Analytics": "Campus surveys, departmental records and research data are an easy route into analysis work.",
    },
    projectIdeas: ["A campus service app, such as hostel or transport information, used by real students", "A machine-learning project on a lecturer's research data, used with permission", "A sensor prototype that solves a lab or hostel problem"],
    institutions: ["University of Nigeria, Nsukka"],
    nearestCampusSlug: "enugu",
  },
  {
    city: "Jos",
    state: "Plateau State",
    slug: "tech-scene-hubs-and-training-in-jos-2026",
    description: "Explore Jos's developer community, nHub and routes into software, product design and data through online and hybrid Tech Faculty programmes.",
    scene: "Jos has a recognised developer and creative community that gives learners room to build relationships and practise in public. The local ecosystem is smaller than Lagos, but that can make mentorship and collaboration easier to access. Remote work also means students do not need to relocate before starting a serious technology career.",
    sectors: ["developer communities", "creative digital services", "small-business technology", "remote product teams"],
    skills: ["Software Engineering", "Product & UI/UX Design", "Data Analytics", "Digital Marketing"],
    hubs: [{ name: "nHub Nigeria", slug: "nhub-jos", note: "an independent Plateau State hub known for developer training and community programmes" }],
    studentRoute: "Join the local community while following a structured online programme. Ship a small product with another learner, publish the process and use the collaboration as evidence of team experience.",
    skillNotes: {
      "Software Engineering": "Jos has an established developer community, so learners can find peers to review code and pair on projects.",
      "Product & UI/UX Design": "The city's creative scene gives designers clients in media, events and tourism.",
      "Data Analytics": "Mining, farming and public agencies in Plateau State hold records that rarely get analysed.",
      "Digital Marketing": "Local creatives and tourism businesses need people who can grow an audience online.",
    },
    projectIdeas: ["A small product shipped with another learner from the Jos community", "A brand and social media kit for a Jos creative business", "A dashboard of Plateau State farm or market prices"],
    campusSlug: "jos",
  },
  {
    city: "Kaduna",
    state: "Kaduna State",
    slug: "tech-scene-hubs-and-training-in-kaduna-2026",
    description: "Explore Kaduna's innovation community, CoLab and pathways into software, design and digital marketing with Tech Faculty online training support.",
    scene: "Kaduna combines public institutions, education, agriculture, commerce and an active youth community. Technology learners can build for schools, local organisations and small businesses while connecting with independent coworking and meetup spaces. A remote-first career path makes this local experience useful far beyond the city.",
    sectors: ["education and public services", "agriculture and local commerce", "youth entrepreneurship", "remote digital services"],
    skills: ["Software Engineering", "Product & UI/UX Design", "Digital Marketing", "Data Analytics"],
    hubs: [{ name: "CoLab Innovation Hub", slug: "colab-kaduna", note: "an independent coworking and innovation space with a young builder community" }],
    studentRoute: "Learn online with a clear weekly structure and use local meetups for accountability. Build for a school, cooperative or small business so your portfolio shows practical discovery as well as technical execution.",
    skillNotes: {
      "Software Engineering": "Schools, clinics and cooperatives need simple record and booking systems.",
      "Product & UI/UX Design": "A young creative community and a growing number of small brands make design work easy to find locally.",
      "Digital Marketing": "Small businesses and youth enterprises want help reaching customers online on a tight budget.",
      "Data Analytics": "Agriculture and public services generate records that, once analysed, help with planning and funding.",
    },
    projectIdeas: ["A records or booking system for a school or clinic", "A marketing plan and content calendar for a cooperative", "An analysis of a farm cooperative's yield or sales records"],
    campusSlug: "kaduna",
  },
  {
    city: "Ota",
    state: "Ogun State",
    slug: "tech-scene-hubs-and-training-in-ota-2026",
    description: "Explore Ota's university and industrial tech scene, Hebron Startup Lab and routes into software, AI and robotics with Tech Faculty support.",
    scene: "Ota sits at the intersection of universities, industrial activity and the wider Lagos market. Students can work on campus products, manufacturing problems and startup ideas while remaining close to employers across the Lagos–Ogun corridor. That makes software, AI and connected-device projects especially relevant.",
    sectors: ["university entrepreneurship", "manufacturing and industrial services", "education technology", "Lagos–Ogun startup opportunities"],
    skills: ["Software Engineering", "AI & Machine Learning", "Robotics & IoT", "Data Analytics"],
    hubs: [{ name: "Hebron Startup Lab, Covenant University", slug: "hebron-startup-lab-ota", note: "an independent university-based startup lab for student founders" }],
    studentRoute: "Use your access to campus users or industrial businesses. Validate one problem, build a small working solution and document user feedback instead of presenting only a classroom exercise.",
    skillNotes: {
      "Software Engineering": "Covenant University and Bells University students build campus products and can reach employers across the Lagos–Ogun corridor.",
      "AI & Machine Learning": "Industrial firms around Ota want automation for inspection, documents and customer service.",
      "Robotics & IoT": "Factories in the Ota industrial area give hardware learners real machines to monitor and automate.",
      "Data Analytics": "Manufacturers track production, downtime and quality, and analysts who can report on them are useful immediately.",
    },
    projectIdeas: ["A campus app validated with real student users", "A computer-vision prototype that checks product quality on a line", "A production-downtime report for an Ota factory"],
    institutions: ["Covenant University", "Bells University of Technology"],
    nearestCampusSlug: "lagos",
  },
];

function whatsappUrl(city: string) {
  const message = `Hello Tech Faculty, I read your ${city} tech guide. I live in or near ${city} and want help choosing a course and study route. What are my options?`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

function buildContent(guide: CityGuide): string {
  const campus = campuses.find((c) => c.slug === (guide.campusSlug ?? guide.nearestCampusSlug));
  const hubs = guide.hubs
    .map(({ name, slug, note }) => `- [${name}](/hubs/${slug}) — ${note}.`)
    .join("\n");
  const sectors = guide.sectors.map((sector) => `- ${sector}`).join("\n");
  const skills = guide.skills
    .map((skill, index) => {
      const dept = COURSE_AREA_DEPARTMENT[skill];
      return `${index + 1}. **[${skill} training](/departments/${dept}).** ${guide.skillNotes[skill] ?? ""}`.trimEnd();
    })
    .join("\n");
  const campusLink = guide.campusSlug
    ? `Students who want face-to-face support can visit the [Tech Faculty campus in ${guide.city}](/locations/${guide.campusSlug}). `
    : campus
      ? `Tech Faculty has no campus in ${guide.city} itself. The nearest is our [${campus.city} campus](/locations/${campus.slug}), and every programme also runs online. `
      : "";
  const institutions = (guide.institutions ?? campus?.nearbyInstitutions ?? []).filter((i) =>
    /University|Polytechnic|College|Institute/.test(i),
  );
  const institutionLine = institutions.length
    ? `Many ${guide.city} learners come from ${institutions.length > 1 ? `${institutions.slice(0, -1).join(", ")} and ${institutions[institutions.length - 1]}` : institutions[0]}. Students on industrial training can do their [tech SIWES placement with Tech Faculty](/siwes) in person, or through [Virtual SIWES with logbook signing](/virtual-siwes) if they cannot attend.`
    : `University and polytechnic students can do their [tech SIWES placement with Tech Faculty](/siwes), or use [Virtual SIWES with logbook signing](/virtual-siwes) if they cannot attend in person.`;
  const projects = guide.projectIdeas.map((idea) => `- ${idea}`).join("\n");

  return `*By Bill Achusim · Sep 13, 2026*

${guide.scene}

This guide covers the local landscape, the ${guide.city} entries in our editorial [Nigeria and Africa tech hubs directory](/hubs), and how Tech Faculty can help you choose a route. A listing is not a claim of partnership or endorsement; confirm a hub's intake, fees and programmes directly.

## What drives the ${guide.city} tech scene?

In ${guide.city}, the clearest starting points include:

${sectors}

## Tech hubs and training options in ${guide.city}

Our directory currently includes:

${hubs}

${campusLink}You can also compare every listed organisation on the [full hubs directory](/hubs).

## The best tech courses to consider in ${guide.city}

${skills}

Compare course paths across all [Tech Faculty departments](/departments) before committing.

## How Tech Faculty helps ${guide.city} students

${guide.studentRoute}

${institutionLine} Learners who already have portfolio evidence can use the [tech careers board](/careers) to find opportunities and check current role requirements.

## First portfolio projects for ${guide.city}

${projects}

## Frequently asked questions

### Can I learn tech in ${guide.city} without relocating?

Yes. ${guide.campusSlug ? `Tech Faculty lists a local study location in ${guide.city}, and online` : "Online"} and hybrid training can be combined with a local hub community, reliable internet and regular project feedback.

### Which course should a complete beginner choose?

The right starting point depends on your interests, available time and career goal. Data analytics suits people who enjoy patterns and business questions; software suits builders; product design suits visual problem-solvers; digital marketing suits communication and growth. Ask for an assessment if you are unsure.

### Does Tech Faculty own every hub listed here?

No. Only entries clearly marked as Tech Faculty campuses are ours. Other organisations are included as editorial directory listings based on publicly available information.

### Can Tech Faculty help with SIWES or remote work?

Yes. We provide structured training and SIWES routes, while our careers resources help prepared learners understand and pursue local or remote opportunities. Training does not guarantee a job; demonstrable skill and consistent applications still matter.

## Get a study route for ${guide.city}

[Message Tech Faculty on WhatsApp](${whatsappUrl(guide.city)}) with your city, current level and preferred skill. We will help you compare the clearest available route instead of guessing your way through unrelated courses.`;
}

/** Lightweight index for linking campuses, hubs and departments to their city guide. */
export const cityGuideIndex = cityGuides.map(({ city, slug, campusSlug, nearestCampusSlug, hubs, sectors, skills }) => ({
  city,
  slug,
  skills,
  campusSlug,
  nearestCampusSlug,
  sectors,
  hubSlugs: hubs.map((h) => h.slug),
}));

const cityBlogPosts: BlogPost[] = cityGuides.map((guide) => ({
  slug: guide.slug,
  title: `${guide.city} Tech Scene: Hubs, Courses & Training Guide (2026)`,
  seoTitle: `Tech Training in ${guide.city}: Hubs & Courses`,
  description: guide.description,
  content: buildContent(guide),
  date: "2026-09-13",
  author: "Bill Achusim",
  tags: ["Tech Careers", `${guide.city} tech scene`, `tech hubs in ${guide.city}`, `learn tech in ${guide.city}`],
  readTime: 7,
}));

export default cityBlogPosts;