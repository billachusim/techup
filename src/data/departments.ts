import { HYBRID_FEE, PHYSICAL_FEE, naira, planMinimum } from "@/lib/fees";

/** When the department pages were last reviewed. Bump it when you edit their copy. */
export const DEPARTMENTS_UPDATED = "2026-10-08";

export interface DepartmentFaq {
  q: string;
  a: string;
}

export interface Department {
  /** URL slug used at /departments/:slug */
  slug: string;
  /** Pricing plan id in supabase/functions/_shared/pricing.ts, when the department has one */
  planId?: string;
  /** ISO date this department's copy last changed, if later than DEPARTMENTS_UPDATED */
  updated?: string;
  /** Legacy id used by the homepage accordion */
  id: string;
  /** Display name */
  title: string;
  /** Lucide icon name (resolved in the UI) */
  icon: string;
  category: "tech" | "creative" | "security" | "beginner";
  color: string;
  gradient: string;
  /** One-line, keyword-rich blurb for the compact accordion card */
  tagline: string;
  /** Longer description used on the department page */
  description: string;
  /** <title> for the department page (<60 chars) */
  metaTitle: string;
  /** <meta name="description"> (150-160 chars) */
  metaDescription: string;
  keywords: string[];
  /** ~90-word intro answering search intent */
  intro: string;
  /** Curriculum modules */
  courses: string[];
  /** Tools and stacks taught */
  tools: string[];
  /** Who the department is for */
  audience: string[];
  /** Career outcomes with Nigerian salary bands */
  outcomes: { role: string; salary: string }[];
  faqs: DepartmentFaq[];
  enrollment: string;
  duration: string;
  difficulty: string;
  trending: boolean;
}

export const departments: Department[] = [
  {
    slug: "web-development",
    planId: "developer-pro",
    id: "web-dev",
    title: "Web Development",
    icon: "Code",
    category: "tech",
    color: "hsl(var(--primary))",
    gradient: "from-blue-500/10 to-purple-500/10",
    tagline: "Learn front-end and full-stack web development with AI-assisted workflows.",
    description:
      "Master modern web technologies and frameworks to build stunning, responsive, production-ready applications.",
    metaTitle: "Web Development Bootcamp Nigeria",
    metaDescription:
      "Learn web development in Nigeria: HTML, CSS, JavaScript, React, Next.js and Node. Online and on-campus bootcamp with projects, certification and job support.",
    keywords: [
      "web development bootcamp Nigeria",
      "learn React Nigeria",
      "full stack developer training Nigeria",
      "front end development course Nigeria",
      "web design and development Nnewi",
    ],
    intro:
      "Web development is still the fastest route from beginner to paid work in Nigeria, and in 2026 the bar has moved: employers expect you to ship real apps and use AI tools well. Our Web Development department takes you from your first HTML page to deployed full-stack React applications, with weekly code reviews, portfolio projects, and a hiring-focused final capstone. Study online from anywhere or in person at any Tech Faculty centre inside a Technology Incubation Centre.",
    courses: [
      "HTML, CSS & Responsive Layouts",
      "JavaScript & TypeScript Fundamentals",
      "React & Next.js",
      "Node.js, Express & REST APIs",
      "Databases, Auth & Deployment",
      "AI-Assisted Development Workflows",
      "Capstone: Ship a Production App",
    ],
    tools: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", "Git & GitHub", "Supabase", "Vercel"],
    audience: [
      "Complete beginners who want a first tech skill",
      "Students and NYSC members building a portfolio",
      "Designers moving into front-end engineering",
      "Business owners who want to build their own products",
    ],
    outcomes: [
      { role: "Junior Front-End Developer", salary: "₦250,000 – ₦450,000 / month" },
      { role: "Full-Stack Developer", salary: "₦500,000 – ₦1,200,000 / month" },
      { role: "Remote Contract Developer", salary: "$1,500 – $4,000 / month" },
    ],
    faqs: [
      {
        q: "Do I need a laptop to join the Web Development department?",
        a: "Yes. A laptop with at least 8GB RAM is recommended, because you will run a code editor, a browser and a local server together. Our tech store sells tested student laptops with three months of hardware support, and on-campus students can use centre workstations during class hours.",
      },
      {
        q: "Will I get a certificate?",
        a: "Yes. Every Web Development graduate who completes the projects and the capstone receives a Tech Faculty NG certificate. Each certificate carries its own ID that employers, schools and clients can check on our public verification portal, so nobody has to take a PDF on trust.",
      },
    ],
    enrollment: "2,400+",
    duration: "12-16 weeks",
    difficulty: "Beginner to Advanced",
    trending: true,
  },
  {
    slug: "mobile-app-development",
    planId: "mobile-app-developer",
    id: "mobile-dev",
    title: "Mobile App Development",
    icon: "Smartphone",
    category: "tech",
    color: "hsl(221 83% 53%)",
    gradient: "from-indigo-500/10 to-cyan-500/10",
    tagline: "Build and publish Android and iOS apps with React Native and Flutter.",
    description:
      "Create powerful mobile applications for iOS and Android, from first screen to a live listing on the app stores.",
    metaTitle: "Mobile App Development Course Nigeria",
    metaDescription:
      "Learn mobile app development in Nigeria with React Native, Flutter, Swift and Kotlin. Build, test and publish real Android and iOS apps to the app stores.",
    keywords: [
      "mobile app development course Nigeria",
      "learn React Native Nigeria",
      "Flutter training Nigeria",
      "android developer course Nigeria",
      "app development bootcamp Nnewi",
    ],
    intro:
      "Nigeria is a mobile-first market, and the developers who can ship a working app to Google Play or the App Store are the ones who get hired and get clients. This department takes you through cross-platform development with React Native and Flutter, native basics in Swift and Kotlin, offline-first patterns for poor networks, payments, push notifications, and the full store-submission process. You graduate with at least one published app under your own name.",
    courses: [
      "Mobile UI Fundamentals & Design Systems",
      "React Native & Expo",
      "Flutter & Dart",
      "iOS Development with Swift (Foundations)",
      "Android Development with Kotlin (Foundations)",
      "Payments, Push Notifications & Offline Sync",
      "App Store & Google Play Publishing",
    ],
    tools: ["React Native", "Expo", "Flutter", "Dart", "Swift", "Kotlin", "Firebase", "Figma"],
    audience: [
      "Web developers adding mobile to their stack",
      "Founders who want to launch their own app",
      "Students targeting product engineering roles",
      "Freelancers serving Nigerian SMEs",
    ],
    outcomes: [
      { role: "Junior Mobile Developer", salary: "₦300,000 – ₦500,000 / month" },
      { role: "Senior Mobile Engineer", salary: "₦700,000 – ₦1,500,000 / month" },
      { role: "Freelance App Builder", salary: "₦400,000 – ₦2,000,000 per project" },
    ],
    faqs: [
      {
        q: "Can I build iPhone apps without a Mac?",
        a: "Yes, for learning and testing. We use Expo's cloud build service, so students on Windows laptops can produce iOS builds without owning a Mac. A Mac only becomes necessary for advanced native Swift work, which comes late in the 14 to 18 week Mobile App Development programme.",
      },
      {
        q: "Do you help with publishing to the stores?",
        a: "Yes. Publishing is part of the final module. We cover the store listing, screenshots, the Apple and Google review guidelines and the submission itself, so your capstone app goes through the real Google Play and App Store submission process instead of staying on your laptop.",
      },
    ],
    enrollment: "1,800+",
    duration: "14-18 weeks",
    difficulty: "Intermediate",
    trending: false,
  },
  {
    slug: "data-science-analytics",
    planId: "data-wizard",
    id: "data-science",
    title: "Data Science & Analytics",
    icon: "Database",
    category: "tech",
    color: "hsl(142 76% 36%)",
    gradient: "from-green-500/10 to-emerald-500/10",
    tagline: "Turn raw data into dashboards and decisions with Excel, SQL, Power BI and Python.",
    description:
      "Learn to analyse, visualise and derive insights from complex datasets using the tools Nigerian employers actually use.",
    metaTitle: "Data Analytics Bootcamp Nigeria",
    metaDescription:
      "Data analytics and data science training in Nigeria. Master Excel, SQL, Power BI, Tableau and Python, build a dashboard portfolio, and get certified for analyst roles.",
    keywords: [
      "data analytics bootcamp Nigeria",
      "data science course Nigeria",
      "Power BI training Nigeria",
      "SQL course Nigeria",
      "data analyst training Nnewi",
    ],
    intro:
      "Every Nigerian bank, hospital, retailer and government agency now collects more data than it can read. Our Data Science & Analytics department trains you to close that gap: clean messy spreadsheets, query databases with SQL, build executive dashboards in Power BI, and run predictive models in Python. Every module ends with a portfolio deliverable built on real Nigerian data — NBS, CBN, open health and commerce datasets — so your work looks like the job before you have the job.",
    courses: [
      "Excel for Analysts & Data Cleaning",
      "SQL & Database Management",
      "Data Visualisation with Power BI",
      "Tableau & Looker Studio",
      "Python for Data Analysis (pandas, NumPy)",
      "Statistics & Experiment Design",
      "Machine Learning Fundamentals",
      "Capstone: End-to-End Analytics Project",
    ],
    tools: ["Excel", "SQL", "Power BI", "Tableau", "Looker Studio", "Python", "pandas", "scikit-learn"],
    audience: [
      "Graduates switching from non-tech backgrounds",
      "Accountants, auditors and operations staff",
      "Business owners who want data-led decisions",
      "Students targeting analyst and BI roles",
    ],
    outcomes: [
      { role: "Junior Data Analyst", salary: "₦250,000 – ₦450,000 / month" },
      { role: "Business Intelligence Analyst", salary: "₦500,000 – ₦900,000 / month" },
      { role: "Data Scientist", salary: "₦800,000 – ₦2,000,000 / month" },
    ],
    faqs: [
      {
        q: "Do I need to be good at mathematics?",
        a: "No. Secondary-school mathematics is enough to start the Data Science & Analytics programme. We teach the statistics you need module by module over 12 to 16 weeks, applied to real Nigerian datasets rather than as theory, so you learn each method by answering a business question with it.",
      },
      {
        q: "Is Power BI or Tableau better for jobs in Nigeria?",
        a: "Power BI, for most job seekers in Nigeria. It appears in far more Nigerian job adverts because so many companies already run Microsoft 365. We teach Power BI first, then Tableau and Looker Studio, so you can work in whichever tool an employer uses and show a dashboard built in each.",
      },
    ],
    enrollment: "3,200+",
    duration: "12-16 weeks",
    difficulty: "Beginner to Advanced",
    trending: true,
  },
  {
    slug: "cybersecurity",
    planId: "security-shield",
    id: "cybersecurity",
    title: "Cybersecurity",
    icon: "Shield",
    category: "security",
    color: "hsl(0 84% 60%)",
    gradient: "from-red-500/10 to-orange-500/10",
    tagline: "Train for SOC analyst, ethical hacking and compliance roles in Nigeria.",
    description:
      "Protect digital assets and infrastructure with hands-on security operations, offensive security and compliance training.",
    metaTitle: "Cybersecurity Training Nigeria",
    metaDescription:
      "Cybersecurity bootcamp in Nigeria covering network security, ethical hacking, SOC analysis, incident response and NDPR compliance, with CompTIA and CEH exam prep.",
    keywords: [
      "cybersecurity training Nigeria",
      "ethical hacking course Nigeria",
      "SOC analyst training Nigeria",
      "CompTIA Security+ Nigeria",
      "cyber security bootcamp Nnewi",
    ],
    intro:
      "Nigerian fintechs, banks and public agencies are hiring defenders faster than schools can produce them, and NDPR enforcement has made compliance skills billable. This department builds you into a job-ready analyst: networking and operating-system fundamentals first, then hands-on labs in threat detection, ethical hacking, digital forensics and incident response, plus structured preparation for CompTIA Security+ and CEH. You finish with a documented lab portfolio and an incident-response runbook you wrote yourself.",
    courses: [
      "Networking & Operating System Security",
      "Threat Landscape & Security Operations (SOC)",
      "Ethical Hacking & Penetration Testing",
      "Digital Forensics & Incident Response",
      "Cloud & Application Security",
      "NDPR, ISO 27001 & Compliance",
      "Certification Prep (CompTIA Security+, CEH)",
    ],
    tools: ["Kali Linux", "Wireshark", "Burp Suite", "Splunk", "Nmap", "Metasploit", "Microsoft Defender"],
    audience: [
      "IT support staff moving into security",
      "Computer science and engineering graduates",
      "Compliance and risk officers in fintech",
      "Career switchers targeting remote SOC roles",
    ],
    outcomes: [
      { role: "SOC Analyst (Tier 1)", salary: "₦350,000 – ₦600,000 / month" },
      { role: "Penetration Tester", salary: "₦700,000 – ₦1,500,000 / month" },
      { role: "Security / GRC Consultant", salary: "₦900,000 – ₦2,500,000 / month" },
    ],
    faqs: [
      {
        q: "Do I need a computer science degree?",
        a: "No. Most of our cybersecurity graduates come from other disciplines. What matters is completing the hands-on labs in the 16 to 20 week programme and explaining your findings clearly in writing. Employers hiring for security operations roles care more about what you can do and document than about your degree.",
      },
      {
        q: "Are certification exam fees included?",
        a: "No. Training and exam preparation for CompTIA Security+ and CEH are included in your programme fee. The vendor exam fee itself is paid directly to CompTIA or EC-Council when you book and sit the exam, so you only pay it once you are ready to pass.",
      },
    ],
    enrollment: "1,500+",
    duration: "16-20 weeks",
    difficulty: "Intermediate to Advanced",
    trending: true,
  },
  {
    slug: "ai-machine-learning",
    planId: "ai-innovator",
    id: "ai-ml",
    title: "AI & Machine Learning",
    icon: "Brain",
    category: "tech",
    color: "hsl(280 89% 64%)",
    gradient: "from-purple-500/10 to-pink-500/10",
    tagline: "Build AI agents, RAG systems and machine learning models that ship.",
    description:
      "Build intelligent systems and applications using modern machine learning, generative AI and agent frameworks.",
    metaTitle: "AI & Machine Learning Course Nigeria",
    metaDescription:
      "Learn artificial intelligence and machine learning in Nigeria. Python, deep learning, generative AI, RAG and AI agents, with deployment and a job-ready portfolio.",
    keywords: [
      "AI course Nigeria",
      "machine learning training Nigeria",
      "generative AI bootcamp Nigeria",
      "AI agents training Nigeria",
      "artificial intelligence school Nnewi",
    ],
    intro:
      "AI is the centre of gravity for everything we teach. This department moves you from Python foundations to deployed intelligent systems: classical machine learning, deep learning with PyTorch, and the generative stack Nigerian companies are actually buying — retrieval-augmented generation, agent workflows, evaluation and cost control. You build three portfolio systems, including a WhatsApp AI agent for a Nigerian business, and learn to deploy them affordably on modest infrastructure.",
    courses: [
      "Python & Mathematics for AI",
      "Classical Machine Learning",
      "Deep Learning with PyTorch & TensorFlow",
      "Natural Language Processing",
      "Computer Vision",
      "Generative AI, RAG & Vector Databases",
      "AI Agents & Automation",
      "Model Deployment, Evaluation & Cost Control",
    ],
    tools: ["Python", "PyTorch", "TensorFlow", "Hugging Face", "LangChain", "pgvector", "FastAPI", "Docker"],
    audience: [
      "Developers adding AI to their skill set",
      "Data analysts moving into machine learning",
      "Founders building AI products",
      "Researchers and postgraduate students",
    ],
    outcomes: [
      { role: "Machine Learning Engineer", salary: "₦700,000 – ₦1,800,000 / month" },
      { role: "AI Application Developer", salary: "₦500,000 – ₦1,200,000 / month" },
      { role: "Remote AI Trainer / Evaluator", salary: "$15 – $60 / hour" },
    ],
    faqs: [
      {
        q: "Do I need a powerful computer or GPU?",
        a: "No. We run heavy model training in Google Colab and other cloud notebooks, so any laptop with a stable browser and internet connection is enough for the AI & Machine Learning programme. An older laptop or a power cut will not stop your training jobs, because they run in the cloud.",
      },
      {
        q: "Can this lead to remote AI work?",
        a: "Yes. Many AI & Machine Learning graduates start on AI training and evaluation platforms while they build their own projects, then move into engineering roles. Live remote and Nigerian AI roles are listed on our jobs board, and graduates can join the Tech Faculty talent pool that employers hire from.",
      },
    ],
    enrollment: "2,100+",
    duration: "16-20 weeks",
    difficulty: "Advanced",
    trending: true,
  },
  {
    slug: "basic-internet-ai-studies",
    planId: "bootcamp-starter",
    id: "basic-internet-ai",
    title: "Basic Internet & AI Studies",
    icon: "Globe",
    category: "beginner",
    color: "hsl(200 94% 46%)",
    gradient: "from-sky-500/10 to-blue-500/10",
    tagline: "Digital literacy and everyday AI skills for complete beginners.",
    description:
      "Start your digital journey with foundational internet skills, computer confidence and practical AI literacy.",
    metaTitle: "Computer & AI Literacy Classes Nigeria",
    metaDescription:
      "Beginner computer and AI classes in Nigeria. Learn internet basics, email, Microsoft Office, ChatGPT and AI tools for work in a short, practical, guided programme.",
    keywords: [
      "computer training for beginners Nigeria",
      "digital literacy course Nigeria",
      "ChatGPT training Nigeria",
      "AI for beginners Nigeria",
      "basic computer classes Nnewi",
    ],
    intro:
      "You do not need to become a programmer to benefit from AI. This department is for adults, traders, civil servants, teachers and students who want confidence with a computer and real productivity with AI tools. In four to six weeks you learn the internet safely, handle email and documents, use ChatGPT and other assistants for writing, research and business tasks, and protect yourself from the scams that follow every new technology.",
    courses: [
      "Computer & Internet Basics",
      "Email, Documents & Microsoft Office",
      "AI Tools for Everyday Work",
      "ChatGPT & AI Assistants for Business",
      "Online Safety, Privacy & Scam Awareness",
      "Digital Communication & Social Presence",
    ],
    tools: ["Windows", "Google Workspace", "Microsoft Office", "ChatGPT", "Gemini", "Canva"],
    audience: [
      "Adults new to computers",
      "Traders and small business owners",
      "Teachers and civil servants",
      "Parents and retirees getting online",
    ],
    outcomes: [
      { role: "Confident everyday computer user", salary: "Foundation for any tech track" },
      { role: "AI-assisted admin & office support", salary: "₦120,000 – ₦300,000 / month" },
      { role: "Small business owner using AI daily", salary: "Direct time and cost savings" },
    ],
    faqs: [
      {
        q: "I have never used a computer. Can I still join?",
        a: "Yes. Basic Internet & AI Studies is built for people who have never used a computer. We start from switching the machine on, then move through the internet, email, documents and everyday AI tools like ChatGPT. Classes are short, run online or at any of our centres, and the programme is free.",
      },
    ],
    enrollment: "4,500+",
    duration: "4-6 weeks",
    difficulty: "Beginner",
    trending: false,
  },
  {
    slug: "digital-marketing",
    planId: "digital-marketing-pro",
    id: "social-media",
    title: "Social Media & Digital Marketing",
    icon: "Share2",
    category: "creative",
    color: "hsl(330 81% 60%)",
    gradient: "from-pink-500/10 to-rose-500/10",
    tagline: "Grow brands with content, paid ads, SEO and AI-powered marketing.",
    description:
      "Master digital marketing strategy, content creation, paid advertising and analytics across every major platform.",
    metaTitle: "Digital Marketing Course Nigeria",
    metaDescription:
      "Digital marketing and social media training in Nigeria. Learn content strategy, SEO, Meta and Google Ads, analytics and AI marketing tools, with live client projects.",
    keywords: [
      "digital marketing course Nigeria",
      "social media marketing training Nigeria",
      "SEO course Nigeria",
      "Facebook ads training Nigeria",
      "content marketing bootcamp Nnewi",
    ],
    intro:
      "Marketing is the skill that pays for itself fastest, because the first client can be your own business. This department covers the full modern stack: content strategy and short-form video, SEO that survives AI search, Meta and Google advertising with real budgets, email and WhatsApp marketing, analytics, and the AI tools that now do the heavy lifting on copy, design and reporting. Every learner runs a live campaign for a real Nigerian brand before graduating.",
    courses: [
      "Marketing Strategy & Brand Positioning",
      "Content Creation & Short-Form Video",
      "Photography, Editing & Graphic Basics",
      "SEO & AI Search Visibility",
      "Meta, Google & TikTok Advertising",
      "Email & WhatsApp Marketing",
      "AI Tools for Marketers",
      "Analytics, Reporting & Growth",
    ],
    tools: ["Meta Ads Manager", "Google Ads", "Google Analytics", "Canva", "CapCut", "Mailchimp", "ChatGPT"],
    audience: [
      "Business owners marketing their own brand",
      "Aspiring social media managers",
      "Content creators monetising an audience",
      "Corporate staff moving into marketing",
    ],
    outcomes: [
      { role: "Social Media Manager", salary: "₦200,000 – ₦450,000 / month" },
      { role: "Performance Marketer", salary: "₦400,000 – ₦900,000 / month" },
      { role: "Freelance Marketing Consultant", salary: "₦150,000 – ₦600,000 per client" },
    ],
    faqs: [
      {
        q: "Do I need an ad budget to learn paid advertising?",
        a: "No, you can start without one. We run shared classroom campaigns on Meta Ads Manager and Google Ads, so you practise on live data before spending your own money. A small personal test budget helps once you run your own ads, and you learn to keep that spending small and measurable.",
      },
      {
        q: "Is this useful for my existing business?",
        a: "Yes. Many participants join the Social Media & Digital Marketing programme specifically to market their own shop, school or service, and recover the fee from new customers within the 10 to 14 weeks. The campaigns, content and analytics you build in class are ones you can keep running afterwards.",
      },
    ],
    enrollment: "3,800+",
    duration: "10-14 weeks",
    difficulty: "Beginner to Intermediate",
    trending: true,
  },
  {
    slug: "design",
    planId: "design-master",
    id: "design",
    title: "Design",
    icon: "Video",
    category: "creative",
    color: "hsl(280 100% 70%)",
    gradient: "from-violet-500/10 to-purple-500/10",
    tagline: "Graphic design, UI/UX and product design with Figma and Adobe tools.",
    description:
      "Master visual design, user experience and product design principles, from brand identity to shipped interfaces.",
    metaTitle: "Graphic & UI/UX Design Course Nigeria",
    metaDescription:
      "Learn graphic design and UI/UX in Nigeria. Figma, Adobe Photoshop and Illustrator, design systems, prototyping and a portfolio built for hiring and freelance work.",
    keywords: [
      "graphic design course Nigeria",
      "UI UX design training Nigeria",
      "Figma course Nigeria",
      "product design bootcamp Nigeria",
      "design school Nnewi",
    ],
    intro:
      "Good design is why one product gets used and an identical one gets ignored. This department trains both sides of the craft: visual design for brand, print and social, and product design for interfaces people actually complete tasks in. You learn typography, colour and layout properly, then move into Figma, design systems, prototyping and usability testing, finishing with a portfolio of three case studies written the way hiring managers and clients read them.",
    courses: [
      "Design Fundamentals: Typography, Colour & Layout",
      "Graphic Design with Adobe Photoshop & Illustrator",
      "Brand Identity & Print Design",
      "UI Design with Figma",
      "UX Research, Wireframing & Usability Testing",
      "Design Systems & Prototyping",
      "Portfolio & Case Study Writing",
    ],
    tools: ["Figma", "Adobe Photoshop", "Adobe Illustrator", "Canva", "Framer", "Notion"],
    audience: [
      "Creatives turning talent into a career",
      "Developers who want to design their own products",
      "Marketers producing their own assets",
      "Freelancers raising their rates",
    ],
    outcomes: [
      { role: "Junior Graphic Designer", salary: "₦180,000 – ₦400,000 / month" },
      { role: "Product / UI Designer", salary: "₦450,000 – ₦1,100,000 / month" },
      { role: "Freelance Designer", salary: "₦100,000 – ₦800,000 per project" },
    ],
    faqs: [
      {
        q: "Do I need to be good at drawing?",
        a: "No. Digital design is about hierarchy, spacing, colour and clarity, and those are skills you learn by practice rather than talent for drawing. Drawing is a bonus in the Design department, not a requirement. Most of the work happens in Figma and Adobe tools, where layout matters far more than illustration.",
      },
      {
        q: "Which software will I use?",
        a: "Figma for app and website interfaces, Adobe Photoshop and Illustrator for visual and print work, and Canva for fast turnaround on social media graphics. You also meet Framer and Notion, and you finish the 12 to 16 week Design programme with portfolio projects made in these tools.",
      },
    ],
    enrollment: "2,600+",
    duration: "12-16 weeks",
    difficulty: "Beginner to Advanced",
    trending: false,
  },
  {
    slug: "cloud-computing",
    planId: "cloud-architect",
    id: "cloud",
    title: "Cloud Computing",
    icon: "Cloud",
    category: "tech",
    color: "hsl(210 100% 56%)",
    gradient: "from-blue-400/10 to-indigo-400/10",
    tagline: "Deploy, automate and secure infrastructure on AWS, Azure and Google Cloud.",
    description:
      "Deploy and manage scalable applications on leading cloud platforms with modern DevOps practice.",
    metaTitle: "Cloud Computing & DevOps Training Nigeria",
    metaDescription:
      "Cloud computing and DevOps training in Nigeria. Learn AWS, Azure, Google Cloud, Docker, Kubernetes and CI/CD with hands-on labs and certification preparation.",
    keywords: [
      "cloud computing course Nigeria",
      "AWS training Nigeria",
      "DevOps bootcamp Nigeria",
      "Azure certification Nigeria",
      "Kubernetes training Nigeria",
    ],
    intro:
      "Cloud and DevOps skills carry some of the highest salaries in Nigerian tech and travel well into remote contracts. This department is lab-heavy from day one: you provision real infrastructure, containerise applications, build CI/CD pipelines, script with Terraform, and learn the cost discipline that keeps a startup's bill survivable. Certification preparation for AWS and Azure associate-level exams runs alongside the build work.",
    courses: [
      "Linux & Networking for Cloud",
      "AWS Core Services",
      "Microsoft Azure Administration",
      "Google Cloud Platform Essentials",
      "Docker & Kubernetes",
      "CI/CD Pipelines & Infrastructure as Code",
      "Cloud Security, Monitoring & Cost Optimisation",
    ],
    tools: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Linux"],
    audience: [
      "Developers moving into platform engineering",
      "System and network administrators",
      "Graduates targeting high-paying remote roles",
      "Startup engineers owning infrastructure",
    ],
    outcomes: [
      { role: "Cloud Support Engineer", salary: "₦400,000 – ₦700,000 / month" },
      { role: "DevOps Engineer", salary: "₦800,000 – ₦2,000,000 / month" },
      { role: "Cloud Architect", salary: "₦1,500,000+ / month" },
    ],
    faqs: [
      {
        q: "Are cloud lab costs expensive?",
        a: "No. We work inside the free tiers of AWS, Azure and Google Cloud and teach budget alerts, so most learners spend little or nothing on infrastructure during the 14 to 18 week Cloud Computing programme. You learn to set a spending limit on every account before you launch anything on it.",
      },
      {
        q: "Which cloud should I specialise in?",
        a: "Start with AWS, which has the largest cloud job market, then add Azure, because many Nigerian enterprises are Microsoft-first. The Cloud Computing programme covers AWS, Azure and Google Cloud plus Docker, Kubernetes, Terraform and CI/CD pipelines, so you can move between providers once you know one well.",
      },
    ],
    enrollment: "1,900+",
    duration: "14-18 weeks",
    difficulty: "Intermediate to Advanced",
    trending: false,
  },
  {
    slug: "robotics-iot",
    id: "robotics",
    title: "Robotics & IoT",
    icon: "Cpu",
    category: "tech",
    color: "hsl(45 93% 47%)",
    gradient: "from-yellow-500/10 to-orange-500/10",
    tagline: "Build robots, smart devices and embedded systems with Arduino and Raspberry Pi.",
    description:
      "Build and programme intelligent robots and connected devices, from sensors and circuits to automated systems.",
    metaTitle: "Robotics & IoT Training Nigeria",
    metaDescription:
      "Robotics and Internet of Things training in Nigeria. Learn Arduino, Raspberry Pi, sensors, embedded C, automation and edge AI through hands-on hardware projects.",
    keywords: [
      "robotics training Nigeria",
      "IoT course Nigeria",
      "Arduino training Nigeria",
      "embedded systems course Nigeria",
      "robotics classes Nnewi",
    ],
    intro:
      "Hardware skills are scarce in Nigeria and increasingly valuable as manufacturing, agriculture, energy and security all move toward automation. In this department you wire and programme real devices: microcontrollers, sensors, motors, communication modules and cloud dashboards. You progress from blinking an LED to a working automation project — smart irrigation, energy monitoring or a security system — and learn to run small AI models directly on the device.",
    courses: [
      "Electronics & Circuit Fundamentals",
      "Arduino & Embedded C",
      "Raspberry Pi & Python Control",
      "Sensors, Actuators & Motor Control",
      "IoT Systems Design & Cloud Dashboards",
      "Edge AI on Devices",
      "Capstone Automation Project",
    ],
    tools: ["Arduino", "Raspberry Pi", "ESP32", "Python", "C/C++", "MQTT", "Fusion 360"],
    audience: [
      "Engineering students and technicians",
      "Secondary-school science enthusiasts",
      "Agritech and energy innovators",
      "Makers building physical products",
    ],
    outcomes: [
      { role: "IoT / Embedded Developer", salary: "₦400,000 – ₦900,000 / month" },
      { role: "Automation Technician", salary: "₦250,000 – ₦600,000 / month" },
      { role: "Hardware Product Builder", salary: "Project and contract based" },
    ],
    faqs: [
      {
        q: "Do I need to buy my own components?",
        a: "No. Our centres provide shared lab components for classwork, so you can complete the Robotics & IoT programme without buying anything. If you want to keep building at home, starter kits are available at member pricing in the Tech Faculty tech store, which also supplies robotics kits to schools in bulk.",
      },
      {
        q: "Is programming experience required?",
        a: "No. We teach the C, C++ and Python you need for Arduino, ESP32 and Raspberry Pi boards as part of the 16 to 20 week Robotics & IoT programme. You write code for the circuits and sensors you build in class, so programming is learned alongside the hardware rather than before it.",
      },
    ],
    enrollment: "1,200+",
    duration: "16-20 weeks",
    difficulty: "Intermediate to Advanced",
    trending: false,
  },
];

/** "12-16 weeks" -> "12 to 16 weeks" */
const spokenDuration = (d: string) => d.replace(/^(\d+)-(\d+)/, "$1 to $2");

/** The cost-and-duration answer every department page leads its FAQ with. */
function feeFaq(d: Department): DepartmentFaq {
  const q = `How much does the ${d.title} programme cost and how long does it take?`;
  const weeks = spokenDuration(d.duration);
  const min = d.planId ? planMinimum(d.planId) : undefined;
  if (min === 0) {
    return {
      q,
      a: `${d.title} is free. The programme takes ${weeks} of short sessions, online or at any Tech Faculty centre, and there is no fee for the classes, the community or the completion certificate. Most of our students begin here before choosing a paid department such as web development, data analytics or AI.`,
    };
  }
  if (min === undefined) {
    return {
      q,
      a: `The ${d.title} programme takes ${weeks}. Fees depend on the modules and study mode you choose, so message us on WhatsApp with the modules you want and we confirm the exact amount in naira before you pay. Shared lab components are provided at our centres, and graduates receive a verifiable Tech Faculty certificate.`,
    };
  }
  return {
    q,
    a: `The ${d.title} programme takes ${weeks} and costs from ${naira(min)} for online study. Hybrid study with monthly meetups adds ${naira(HYBRID_FEE)}, and weekly on-site classes add ${naira(PHYSICAL_FEE)}. You pick the modules you need when you enrol, and graduates receive a Tech Faculty certificate that employers can verify online.`,
  };
}

/** A department's FAQ as shown on its page and in its FAQPage markup. */
export const departmentFaqs = (d: Department): DepartmentFaq[] => [feeFaq(d), ...d.faqs];

/** ISO date the department page last changed. */
export const departmentUpdated = (d: Department) => d.updated ?? DEPARTMENTS_UPDATED;

export const getDepartmentBySlug = (slug: string): Department | undefined =>
  departments.find((d) => d.slug === slug);

export const departmentCategories = [
  { id: "all", label: "All Departments" },
  { id: "tech", label: "Technology" },
  { id: "creative", label: "Creative" },
  { id: "security", label: "Security" },
  { id: "beginner", label: "Beginner Friendly" },
];