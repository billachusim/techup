
type CityGuide = {
  city: string;
  state: string;
  slug: string;
  description: string;
  scene: string;
  sectors: string[];
  skills: string[];
  hubs: Array<{ name: string; slug: string; note: string }>;
  campusSlug?: string;
  studentRoute: string;
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
  },
];

function whatsappUrl(city: string) {
  const message = `Hello Tech Faculty, I read your ${city} tech guide. I live in or near ${city} and want help choosing a course and study route. What are my options?`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

function buildContent(guide: CityGuide): string {
  const hubs = guide.hubs
    .map(({ name, slug, note }) => `- [${name}](/hubs/${slug}) — ${note}.`)
    .join("\n");
  const sectors = guide.sectors.map((sector) => `- ${sector}`).join("\n");
  const skills = guide.skills
    .map((skill, index) => `${index + 1}. **${skill}.** ${index === 0 ? "A strong first route because it connects directly to the city's visible economy." : "Build a practical project around a real local user or organisation."}`)
    .join("\n");
  const campusLink = guide.campusSlug
    ? `Students who want face-to-face support can review our [${guide.city} campus details](/locations/${guide.campusSlug}). `
    : `Tech Faculty does not currently present a physical ${guide.city} campus in this directory. `;

  return `*By Bill Achusim · Sep 13, 2026*

${guide.scene}

This guide explains the local landscape, the hubs listed in our editorial [Nigeria and Africa tech hubs directory](/hubs), and how Tech Faculty can help you choose a realistic route. An independent listing is not a claim of partnership or endorsement; always confirm a hub's current intake, fees and programme details directly.

## What drives the ${guide.city} tech scene?

Technology grows fastest when it solves problems people already pay to solve. In ${guide.city}, the clearest starting points include:

${sectors}

These sectors need more than programmers. They need analysts who can turn records into decisions, designers who make services usable, marketers who find customers, security practitioners who protect systems and AI builders who automate repetitive work.

## Tech hubs and training options in ${guide.city}

Our directory currently includes:

${hubs}

${campusLink}You can also compare every listed organisation on the [full hubs directory](/hubs). Confirm dates, costs and availability before travelling because independent organisations can change programmes.

## The best tech courses to consider in ${guide.city}

${skills}

Do not choose only by popularity. Start with the work you enjoy doing and the problems available around you. Browse the full [Tech Faculty departments](/departments) to compare course paths before committing.

## How Tech Faculty helps ${guide.city} students

Tech Faculty helps students choose a skill, follow a structured curriculum and turn training into visible work. Depending on your location and programme, support can include in-person, hybrid or online classes, project reviews, verifiable certification, SIWES guidance and preparation for entry-level or remote opportunities.

${guide.studentRoute}

University and polytechnic students who cannot secure a useful local placement can review [Virtual SIWES](/virtual-siwes). Learners who already have portfolio evidence can use the [tech careers board](/careers) to find opportunities and understand current role requirements.

## A practical four-step plan

1. **Choose one role.** Decide whether you are aiming at software, data, design, marketing, cybersecurity, cloud, AI or robotics.
2. **Test the route.** Complete one small beginner project before paying for several unrelated courses.
3. **Train with structure.** Use deadlines, feedback and peer accountability so learning does not stop at videos.
4. **Build local proof.** Solve a real ${guide.city} problem, publish the result and explain the value in plain language.

## Frequently asked questions

### Can I learn tech in ${guide.city} without relocating?

Yes. ${guide.campusSlug ? `Tech Faculty lists a local study location in ${guide.city}, and ` : ""}online and hybrid training can be combined with a local hub community, reliable internet and regular project feedback.

### Which course should a complete beginner choose?

The right starting point depends on your interests, available time and career goal. Data analytics suits people who enjoy patterns and business questions; software suits builders; product design suits visual problem-solvers; digital marketing suits communication and growth. Ask for an assessment if you are unsure.

### Does Tech Faculty own every hub listed here?

No. Only entries clearly marked as Tech Faculty campuses are ours. Other organisations are included as editorial directory listings based on publicly available information.

### Can Tech Faculty help with SIWES or remote work?

Yes. We provide structured training and SIWES routes, while our careers resources help prepared learners understand and pursue local or remote opportunities. Training does not guarantee a job; demonstrable skill and consistent applications still matter.

## Get a study route for ${guide.city}

[Message Tech Faculty on WhatsApp](${whatsappUrl(guide.city)}) with your city, current level and preferred skill. We will help you compare the clearest available route instead of guessing your way through unrelated courses.`;
}

const cityBlogPosts = cityGuides.map((guide) => ({
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