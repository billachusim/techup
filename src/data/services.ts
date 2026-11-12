/**
 * Pay-per-task services for small businesses (/services) and the matching
 * pay-per-task side hustles for talent (/side-hustles).
 *
 * Every service is one of two task sizes (Bill, 12 Nov 2026):
 * - small: talent earns ₦5,000 per task
 * - big:   talent earns ₦10,000 per task
 * The business price is set per tier below; a service can override it when one
 * order is a bundle of several tasks (e.g. a pen test). Weekly earning caps are
 * internal and deliberately not shown on any page.
 *
 * To change prices, edit PRICE_TIERS or a service's `businessFrom`.
 * To add a service, append to SERVICES with a unique slug and an existing category.
 */

export type TaskSize = "small" | "big";

export const PRICE_TIERS: Record<TaskSize, { businessFrom: number; talentPay: number }> = {
  small: { businessFrom: 7_500, talentPay: 5_000 },
  big: { businessFrom: 15_000, talentPay: 10_000 },
};

/** Openings per side hustle; shown on the talent side. */
export const OPENINGS_PER_SERVICE = 50;

export type ServiceCategory = {
  slug: string;
  name: string;
  /** One line for cards and the hub hero. */
  tagline: string;
  /** ~60 words for the category hub page. */
  intro: string;
  /** Blog post that introduces the category. */
  blogSlug: string;
};

export type Service = {
  slug: string;
  name: string;
  category: string;
  size: TaskSize;
  /** What one task is, e.g. "per video". */
  unit: string;
  /** Overrides the tier price when one order bundles several tasks. */
  businessFrom?: number;
  summary: string;
  /** Who usually orders it. */
  forWho: string;
  deliverables: string[];
  turnaround: string;
  /** Search phrases this page targets (Nigerian intent). */
  keywords: string[];
  faqs: { q: string; a: string }[];
  /** Talent side: the side hustle title and what a worker needs. */
  hustleTitle: string;
  hustleNeeds: string[];
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: "content-creative",
    name: "Content & Creative",
    tagline: "Videos, designs and photos for your business, paid per piece.",
    intro:
      "Get AI videos, short-form edits, flyers, logos and product photos without hiring a designer or video editor full time. Send a brief, we assign a vetted Tech Faculty creator, and you pay per piece delivered. Order one video this week and ten next week: no salary, no contract.",
    blogSlug: "hire-video-editor-nigeria-pay-per-video",
  },
  {
    slug: "marketing-social-media",
    name: "Marketing & Social Media",
    tagline: "Social media, SEO articles and WhatsApp marketing, paid per task.",
    intro:
      "Keep your business visible online without a marketing hire. We run your social pages week by week, write SEO articles, set up your Google Business Profile and WhatsApp catalogue, and audit your search ranking. Every job is a fixed task with a fixed price, done by trained Tech Faculty talent.",
    blogSlug: "social-media-management-small-business-nigeria",
  },
  {
    slug: "field-sales",
    name: "Field Sales & Reps",
    tagline: "Door-to-door marketing, flyers, leads and surveys on the ground.",
    intro:
      "Need people on the street? Our field reps visit shops, share flyers, collect leads and run market surveys in your city, and you pay per batch of visits or responses. It is the same rep network we use for our own products, so every visit is logged and checked.",
    blogSlug: "door-to-door-marketing-reps-nigeria",
  },
  {
    slug: "web-development",
    name: "Web & Development",
    tagline: "Website reviews, fixes, landing pages and data work, per task.",
    intro:
      "Small tech jobs should not need a developer on payroll. We review your website, fix bugs, build landing pages with modern AI tools, update WordPress sites and clean up spreadsheets and data, all priced per task. One-off or every week, you only pay for what is delivered.",
    blogSlug: "hire-developer-one-time-job-nigeria",
  },
  {
    slug: "testing-qa",
    name: "Testing & QA",
    tagline: "Real people test your app, website or service before customers do.",
    intro:
      "Find the problems before your customers do. Tech Faculty testers try your app, website or service on real Nigerian phones and networks, write clear bug reports and tell you what confused them. Pay per test session, per release or per group of testers.",
    blogSlug: "app-testing-services-nigeria",
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    tagline: "Security checks, pen tests and staff training for small businesses.",
    intro:
      "Hackers target small Nigerian businesses because they are easy. Our cybersecurity team scans your website, tests your web app, secures your business email and Wi-Fi, locks down social accounts and trains staff to spot scams. Fixed-price tasks, with a plain-English report every time.",
    blogSlug: "cybersecurity-services-small-business-nigeria",
  },
];

const s = (x: Service) => x;

export const SERVICES: Service[] = [
  // ---------- Content & Creative ----------
  s({
    slug: "ai-video-creation",
    name: "AI Video Creation",
    category: "content-creative",
    size: "small",
    unit: "per video",
    summary:
      "Short AI-generated videos for ads, product launches, WhatsApp status and social media, with voiceover, captions and your logo.",
    forWho: "Shops, brands, schools, churches and online sellers who need regular video content.",
    deliverables: ["One 15 to 60 second video", "AI voiceover or music", "Captions and your logo", "Vertical and square versions", "One round of changes"],
    turnaround: "2 working days",
    keywords: ["AI video creation Nigeria", "AI video ads for business", "AI video maker for small business", "pay per video"],
    faqs: [
      { q: "Do I need to send footage?", a: "No. Send your product photos, logo and what the video should say. The creator builds the video with AI tools and stock footage." },
      { q: "Can I order videos every week?", a: "Yes. Most clients set up a WhatsApp or Slack channel with us and order one or more videos a week, paying per video." },
    ],
    hustleTitle: "AI Video Creator",
    hustleNeeds: ["Comfortable with AI video tools (CapCut, Canva, HeyGen or similar)", "A sample video you made", "A laptop or good smartphone"],
  }),
  s({
    slug: "short-form-video-editing",
    name: "Short-Form Video Editing (Reels & TikTok)",
    category: "content-creative",
    size: "small",
    unit: "per video",
    summary: "Turn your raw clips into scroll-stopping Reels, TikToks and YouTube Shorts with cuts, captions, music and hooks.",
    forWho: "Business owners, creators and brands who film but don't have time to edit.",
    deliverables: ["One edited video up to 90 seconds", "Captions and on-screen text", "Music and transitions", "Cover image", "One round of changes"],
    turnaround: "1 to 2 working days",
    keywords: ["video editor Nigeria", "hire video editor Lagos", "reels editing service", "TikTok video editing Nigeria"],
    faqs: [
      { q: "How do I send my clips?", a: "Share a Google Drive or WhatsApp link after you send your brief. We send the edited video back the same way." },
      { q: "Can you edit long YouTube videos?", a: "Yes, as a big task. Mention the length in your brief and we price it before work starts." },
    ],
    hustleTitle: "Short-Form Video Editor",
    hustleNeeds: ["Experience with CapCut, Premiere Pro or similar", "Two sample edits", "Reliable internet for uploads"],
  }),
  s({
    slug: "flyer-graphic-design",
    name: "Flyer & Social Media Graphic Design",
    category: "content-creative",
    size: "small",
    unit: "per design",
    summary: "Professional flyers, price lists, banners and social media graphics for promos, events and announcements.",
    forWho: "Shops, events, schools and service businesses that post promos every week.",
    deliverables: ["One design in your brand colours", "Print and social sizes", "Editable source on request", "Two rounds of changes"],
    turnaround: "1 working day",
    keywords: ["graphic designer Nigeria", "flyer design Nigeria", "social media design service", "cheap flyer design Lagos"],
    faqs: [
      { q: "Can you print the flyers too?", a: "We deliver print-ready files. Our field team can also share printed flyers for you through the flyer distribution service." },
    ],
    hustleTitle: "Flyer & Social Graphic Designer",
    hustleNeeds: ["Canva, Photoshop or Figma skills", "Three portfolio samples"],
  }),
  s({
    slug: "logo-brand-kit-design",
    name: "Logo & Brand Kit Design",
    category: "content-creative",
    size: "big",
    unit: "per brand kit",
    summary: "A clean logo with colours, fonts and social media profile images so your business looks the same everywhere.",
    forWho: "New businesses, rebrands and side businesses going online for the first time.",
    deliverables: ["Three logo concepts, one final", "Colour and font guide", "Social profile and cover images", "PNG, SVG and PDF files"],
    turnaround: "4 working days",
    keywords: ["logo design Nigeria", "brand identity design Nigeria", "affordable logo designer", "business logo design Lagos"],
    faqs: [{ q: "Do I own the logo?", a: "Yes. Once paid, full rights to the final logo and files are yours." }],
    hustleTitle: "Logo & Brand Designer",
    hustleNeeds: ["Brand or logo portfolio", "Illustrator, Figma or similar"],
  }),
  s({
    slug: "product-photo-editing",
    name: "Product Photo Editing",
    category: "content-creative",
    size: "small",
    unit: "per 10 photos",
    summary: "Clean white or styled backgrounds, colour correction and resizing so your products look ready for Instagram, Jumia or your website.",
    forWho: "Online sellers, boutiques, restaurants and e-commerce stores.",
    deliverables: ["10 edited product photos", "Background removal or replacement", "Colour and light correction", "Sizes for social and marketplaces"],
    turnaround: "1 working day",
    keywords: ["product photo editing Nigeria", "background removal service", "e-commerce photo editing", "Jumia product photos"],
    faqs: [{ q: "Can I take the photos with my phone?", a: "Yes. Good light helps, but our editors work with phone photos every day." }],
    hustleTitle: "Product Photo Editor",
    hustleNeeds: ["Photoshop, Lightroom or AI photo tools", "Before-and-after samples"],
  }),

  // ---------- Marketing & Social Media ----------
  s({
    slug: "social-media-management",
    name: "Social Media Management (Weekly)",
    category: "marketing-social-media",
    size: "big",
    unit: "per week per platform",
    summary: "We plan, design and post your content for the week, reply to comments and send you a short report. You keep full control of your accounts.",
    forWho: "Businesses that know they should post daily but never find the time.",
    deliverables: ["5 posts for the week", "Captions and hashtags", "Comment replies on weekdays", "Weekly results report"],
    turnaround: "Starts within 3 working days",
    keywords: ["social media manager Nigeria", "social media management for small business", "Instagram manager Lagos", "hire social media manager Nigeria"],
    faqs: [
      { q: "Do I have to give you my password?", a: "No. Where the platform allows it (Meta Business Suite, for example) you add our manager as a team member, and you can remove them any time." },
      { q: "Can I stop any week?", a: "Yes. You pay week by week. There is no monthly contract." },
    ],
    hustleTitle: "Social Media Manager (Weekly)",
    hustleNeeds: ["Experience running a business page", "Canva and scheduling tools", "Good written English"],
  }),
  s({
    slug: "social-media-content-pack",
    name: "Social Media Content Pack",
    category: "marketing-social-media",
    size: "small",
    unit: "per pack of 3 posts",
    summary: "Three ready-to-post designs with captions, for when you post yourself but need help with what to post.",
    forWho: "Business owners who manage their own pages.",
    deliverables: ["3 post designs", "Captions and hashtags", "Suggested posting times"],
    turnaround: "1 working day",
    keywords: ["social media content creation Nigeria", "Instagram posts for business", "content creator for small business"],
    faqs: [{ q: "Is this different from social media management?", a: "Yes. Here you get the posts and post them yourself. With management, we post and reply for you." }],
    hustleTitle: "Social Media Content Creator",
    hustleNeeds: ["Canva skills", "Caption writing samples"],
  }),
  s({
    slug: "seo-blog-articles",
    name: "SEO Blog Articles",
    category: "marketing-social-media",
    size: "small",
    unit: "per article (up to 1,000 words)",
    summary: "Well-researched articles written for Google and real readers, aimed at what your customers search for.",
    forWho: "Businesses with a website or blog that want more visitors from Google.",
    deliverables: ["One original article", "Keyword and title research", "Headings, meta description and internal links", "One round of edits"],
    turnaround: "2 working days",
    keywords: ["SEO content writer Nigeria", "blog writing service Nigeria", "article writer for business", "SEO articles Nigeria"],
    faqs: [{ q: "Is the article written by AI?", a: "Writers may use AI for research, but every article is written, fact-checked and edited by a person." }],
    hustleTitle: "SEO Article Writer",
    hustleNeeds: ["Strong written English", "Two published or sample articles", "Basic SEO knowledge"],
  }),
  s({
    slug: "google-business-profile-setup",
    name: "Google Business Profile Setup",
    category: "marketing-social-media",
    size: "big",
    unit: "per business",
    summary: "Get your business on Google Maps and Search with photos, hours, services and the first steps to collecting honest customer reviews.",
    forWho: "Shops, salons, clinics, schools and any business customers search for nearby.",
    deliverables: ["Profile created or fixed and verified", "Photos, hours, services and description", "Review link and QR code for your counter", "Short how-to for posting updates"],
    turnaround: "3 working days (Google verification can take longer)",
    keywords: ["Google Business Profile setup Nigeria", "get my business on Google Maps", "Google My Business Nigeria", "local SEO Nigeria"],
    faqs: [{ q: "Do you post fake reviews?", a: "Never. We give you a review link and QR code so real customers can leave reviews." }],
    hustleTitle: "Google Business Profile Specialist",
    hustleNeeds: ["Has set up a Google Business Profile before", "Smartphone for photos on site visits"],
  }),
  s({
    slug: "whatsapp-business-catalogue-setup",
    name: "WhatsApp Business Catalogue & Broadcast Setup",
    category: "marketing-social-media",
    size: "big",
    unit: "per business",
    summary: "Your products and prices in a WhatsApp catalogue, quick replies, labels and a broadcast list so you can sell where your customers already chat.",
    forWho: "Sellers who take orders on WhatsApp.",
    deliverables: ["Catalogue with up to 30 products", "Greeting, away and quick replies", "Customer labels", "Broadcast list and first message"],
    turnaround: "2 working days",
    keywords: ["WhatsApp Business setup Nigeria", "WhatsApp catalogue setup", "WhatsApp marketing for small business"],
    faqs: [{ q: "Can WhatsApp reply to customers automatically?", a: "Yes. For a full AI assistant that replies, books and takes orders, see our sister service Aboutbot at aboutbot.dev." }],
    hustleTitle: "WhatsApp Business Setup Assistant",
    hustleNeeds: ["Knows WhatsApp Business well", "Neat with product photos and prices"],
  }),
  s({
    slug: "seo-audit",
    name: "SEO Audit & Keyword Plan",
    category: "marketing-social-media",
    size: "big",
    unit: "per website",
    summary: "Find out why your website is not showing on Google, with a fix list in plain English and the keywords your customers actually search.",
    forWho: "Any business with a website that gets few visitors.",
    deliverables: ["Technical and on-page SEO check", "Top 20 keyword opportunities", "Competitor snapshot", "Prioritised fix list"],
    turnaround: "3 working days",
    keywords: ["SEO audit Nigeria", "SEO expert Nigeria", "why is my website not on Google", "SEO services Lagos"],
    faqs: [{ q: "Will you fix the problems too?", a: "We can. Fixes are ordered as separate tasks, so you choose what to do first." }],
    hustleTitle: "SEO Analyst",
    hustleNeeds: ["Search Console and keyword tool experience", "A sample audit"],
  }),

  // ---------- Field Sales & Reps ----------
  s({
    slug: "door-to-door-marketing",
    name: "Door-to-Door Marketing Reps",
    category: "field-sales",
    size: "big",
    unit: "per batch of 20 business visits",
    summary: "Trained reps visit shops and offices in your target area, present your product, share materials and log every contact.",
    forWho: "Product and service businesses selling to shops, offices and SMEs.",
    deliverables: ["20 logged visits with business name and contact", "Interest level for each visit", "Photos as proof of visit", "Short summary of objections heard"],
    turnaround: "3 to 5 working days per batch",
    keywords: ["door to door marketing Nigeria", "field sales reps Nigeria", "hire sales rep Lagos", "marketing reps for small business"],
    faqs: [{ q: "Which cities do you cover?", a: "Anambra (Nnewi, Onitsha, Awka) first, then Lagos, Abuja and other cities where we have reps. Tell us your area in the brief." }],
    hustleTitle: "Field Marketing Rep (Door to Door)",
    hustleNeeds: ["Lives in the target city", "Confident talking to shop owners", "Smartphone with WhatsApp"],
  }),
  s({
    slug: "flyer-distribution",
    name: "Flyer Distribution",
    category: "field-sales",
    size: "small",
    unit: "per 300 flyers",
    summary: "Your flyers handed out by hand in markets, campuses, estates and busy streets, with photo proof from each location.",
    forWho: "Shops, schools, events, churches and new businesses opening nearby.",
    deliverables: ["300 flyers handed out", "Locations and times logged", "Photo proof"],
    turnaround: "2 working days",
    keywords: ["flyer distribution Nigeria", "flyer distribution Lagos", "hand out flyers service"],
    faqs: [{ q: "Do you print the flyers?", a: "You can send printed flyers, or order the design from us and print with your usual printer." }],
    hustleTitle: "Flyer Distributor",
    hustleNeeds: ["Lives in the target area", "Smartphone for photo proof"],
  }),
  s({
    slug: "lead-generation",
    name: "Lead Generation (Verified Contacts)",
    category: "field-sales",
    size: "big",
    unit: "per 50 verified leads",
    summary: "A list of real businesses or people who match your target customer, with checked phone numbers and notes, collected online or on the ground.",
    forWho: "B2B sellers, agencies, schools and anyone who needs prospects to call.",
    deliverables: ["50 leads in a Google Sheet", "Name, business, phone, area and source", "Numbers checked on WhatsApp", "Notes on fit"],
    turnaround: "3 working days",
    keywords: ["lead generation Nigeria", "B2B leads Nigeria", "business contact list Nigeria", "sales leads Lagos"],
    faqs: [{ q: "Do you buy or scrape data?", a: "No bought lists. Leads come from public business listings and on-the-ground visits, and only contacts that consent are messaged." }],
    hustleTitle: "Lead Researcher",
    hustleNeeds: ["Good with Google Maps and spreadsheets", "Careful with details"],
  }),
  s({
    slug: "market-survey",
    name: "Market Survey & Customer Research",
    category: "field-sales",
    size: "big",
    unit: "per 50 responses",
    summary: "Ask real customers what they think. Our reps run your questionnaire in person or by phone and give you clean results.",
    forWho: "Founders testing an idea, brands checking prices, NGOs and schools.",
    deliverables: ["50 completed responses", "Results in a sheet with charts", "Key findings summary"],
    turnaround: "5 working days",
    keywords: ["market research Nigeria", "survey data collection Nigeria", "customer research for startups"],
    faqs: [{ q: "Can you write the questions?", a: "Yes. Tell us what you want to learn and we draft a short questionnaire for your approval." }],
    hustleTitle: "Survey Field Agent",
    hustleNeeds: ["Polite and patient with strangers", "Smartphone for Google Forms"],
  }),
  s({
    slug: "mystery-shopping",
    name: "Mystery Shopping",
    category: "field-sales",
    size: "small",
    unit: "per visit",
    summary: "A trained shopper visits or calls your branch as a normal customer and reports honestly on service, cleanliness, wait time and sales skill.",
    forWho: "Shops, restaurants, hotels, pharmacies, banks and multi-branch businesses.",
    deliverables: ["One visit or call", "Scored checklist", "Photos where allowed", "Written notes within 24 hours"],
    turnaround: "2 working days",
    keywords: ["mystery shopping Nigeria", "customer service check", "mystery shopper Lagos"],
    faqs: [{ q: "Is the report shared publicly?", a: "No. Reports go only to you. This is private feedback, not public reviews." }],
    hustleTitle: "Mystery Shopper",
    hustleNeeds: ["Observant and honest", "Good written English"],
  }),

  // ---------- Web & Development ----------
  s({
    slug: "website-review",
    name: "Quick Website Review",
    category: "web-development",
    size: "small",
    unit: "per website",
    summary: "A plain-English review of your website on phone and laptop: speed, broken links, confusing pages and what stops visitors from buying or calling.",
    forWho: "Any business with a website, especially one built a while ago.",
    deliverables: ["Phone and desktop check", "Speed and broken-link check", "Screenshots of problems", "Top 10 fixes in order"],
    turnaround: "1 working day",
    keywords: ["website review Nigeria", "website audit for small business", "check my website", "website feedback service"],
    faqs: [{ q: "Do I need to give you a login?", a: "No. The review uses your public website only." }],
    hustleTitle: "Website Reviewer",
    hustleNeeds: ["Understands web basics and UX", "Writes clear notes with screenshots"],
  }),
  s({
    slug: "landing-page-build",
    name: "Landing Page Build (AI-Assisted)",
    category: "web-development",
    size: "big",
    unit: "per page",
    businessFrom: 50_000,
    summary: "A fast, mobile-friendly one-page website for a product, event or campaign, built with modern AI coding tools and connected to WhatsApp.",
    forWho: "Businesses launching something and needing a page this week.",
    deliverables: ["One responsive page", "WhatsApp and contact buttons", "Basic SEO and analytics", "Hosting set up on your domain", "One round of changes"],
    turnaround: "3 to 5 working days",
    keywords: ["landing page developer Nigeria", "vibe coder Nigeria", "one page website Nigeria", "hire web developer one time job"],
    faqs: [
      { q: "What is AI-assisted building?", a: "Our developers use AI coding tools (sometimes called vibe coding) to build faster, then check and test everything by hand." },
      { q: "Do I need a domain?", a: "We can use yours or help you buy one. The domain cost is separate." },
    ],
    hustleTitle: "Landing Page Developer (Vibe Coder)",
    hustleNeeds: ["Can ship a responsive page with AI coding tools or code", "Live sample pages"],
  }),
  s({
    slug: "website-bug-fix",
    name: "Website Bug Fix",
    category: "web-development",
    size: "big",
    unit: "per bug",
    summary: "One broken thing on your website fixed: a form that does not send, a page that breaks on phones, a slow image or a payment button that fails.",
    forWho: "Website owners whose developer is no longer around.",
    deliverables: ["Bug found and fixed", "Tested on phone and desktop", "Note of what changed"],
    turnaround: "1 to 3 working days",
    keywords: ["fix my website Nigeria", "website developer for small fixes", "WordPress fix Nigeria", "website maintenance Nigeria"],
    faqs: [{ q: "What if the bug is bigger than one task?", a: "We tell you before starting and quote the extra tasks. You approve before we continue." }],
    hustleTitle: "Website Fixer (Freelance Developer)",
    hustleNeeds: ["HTML, CSS and JavaScript or WordPress experience", "Comfortable debugging other people's code"],
  }),
  s({
    slug: "wordpress-updates",
    name: "WordPress Updates & Content Changes",
    category: "web-development",
    size: "small",
    unit: "per task",
    summary: "Small website changes done for you: new prices, new pages, plugin updates, images, text and menus.",
    forWho: "Businesses on WordPress, Wix or similar who need small changes often.",
    deliverables: ["Requested change made", "Backup before changes", "Check on phone and desktop"],
    turnaround: "1 working day",
    keywords: ["WordPress developer Nigeria", "website content update service", "WordPress maintenance Nigeria"],
    faqs: [{ q: "Is my login safe?", a: "Create a separate account for us and delete it when we finish. We never ask for your hosting password unless the task needs it." }],
    hustleTitle: "WordPress Assistant",
    hustleNeeds: ["Comfortable in WordPress admin", "Careful, follows instructions"],
  }),
  s({
    slug: "data-entry-spreadsheet",
    name: "Data Entry & Spreadsheet Clean-Up",
    category: "web-development",
    size: "small",
    unit: "per 300 rows",
    summary: "Records typed, cleaned and organised in Google Sheets or Excel, ready for reports, invoices or your CRM.",
    forWho: "Schools, clinics, shops and offices with records on paper or messy sheets.",
    deliverables: ["300 rows entered or cleaned", "Consistent formatting", "Duplicates flagged", "Simple summary tab"],
    turnaround: "2 working days",
    keywords: ["data entry services Nigeria", "spreadsheet clean up", "Excel data entry Lagos", "digitise records Nigeria"],
    faqs: [{ q: "Is my data kept private?", a: "Yes. Workers only see the sheet for your task, and access is removed when it is done." }],
    hustleTitle: "Data Entry Assistant",
    hustleNeeds: ["Fast, accurate typing", "Google Sheets or Excel"],
  }),
  s({
    slug: "spreadsheet-automation",
    name: "Spreadsheet Dashboard & Automation",
    category: "web-development",
    size: "big",
    unit: "per sheet",
    summary: "Turn your sales, stock or school records into a sheet that calculates itself, with a simple dashboard you can read at a glance.",
    forWho: "Owners who track the business in spreadsheets.",
    deliverables: ["Formulas and validation", "Dashboard tab with charts", "Short how-to video"],
    turnaround: "3 working days",
    keywords: ["Excel dashboard Nigeria", "Google Sheets automation", "business dashboard for small business", "data analyst for hire Nigeria"],
    faqs: [{ q: "Excel or Google Sheets?", a: "Either. Google Sheets is easier to share with staff." }],
    hustleTitle: "Spreadsheet Analyst",
    hustleNeeds: ["Advanced formulas (XLOOKUP, QUERY, pivot tables)", "A dashboard sample"],
  }),

  // ---------- Testing & QA ----------
  s({
    slug: "mobile-app-testing",
    name: "Mobile App Testing",
    category: "testing-qa",
    size: "small",
    unit: "per test session",
    summary: "A tester uses your Android or iPhone app like a real customer and reports every crash, bug and confusing screen with screenshots.",
    forWho: "Startups and businesses launching or updating an app.",
    deliverables: ["One 60-minute test session", "Bug list with steps and screenshots", "Device and network details", "Top 3 user-experience notes"],
    turnaround: "1 working day",
    keywords: ["app testing services Nigeria", "mobile app tester", "QA tester Nigeria", "test my app"],
    faqs: [{ q: "Can you test on cheap Android phones?", a: "Yes. That is where most Nigerian users are, so we test on low and mid-range phones by default." }],
    hustleTitle: "Mobile App Tester",
    hustleNeeds: ["Android or iPhone", "Patient and detail-minded", "Clear written English"],
  }),
  s({
    slug: "website-usability-testing",
    name: "Website Usability Testing",
    category: "testing-qa",
    size: "big",
    unit: "per round of 3 testers",
    summary: "Three people try to complete real tasks on your website (sign up, buy, book) and tell you where they got stuck.",
    forWho: "Businesses whose visitors leave without buying or calling.",
    deliverables: ["Three tester reports", "Screen recordings where possible", "Summary of the biggest blockers"],
    turnaround: "3 working days",
    keywords: ["usability testing Nigeria", "user testing service", "website UX testing"],
    faqs: [{ q: "Who are the testers?", a: "Trained Tech Faculty testers who match your customer type as closely as we can." }],
    hustleTitle: "Website Usability Tester",
    hustleNeeds: ["Laptop or smartphone", "Can record the screen and talk through it"],
  }),
  s({
    slug: "release-regression-testing",
    name: "Release Regression Testing",
    category: "testing-qa",
    size: "big",
    unit: "per release",
    summary: "Before you ship an update, testers run through your key flows to make sure nothing that worked before is now broken.",
    forWho: "Teams that release apps or websites often.",
    deliverables: ["Checklist of key flows", "Pass or fail for each step", "Bug reports for failures"],
    turnaround: "1 to 2 working days",
    keywords: ["regression testing service", "QA testing for startups Nigeria", "software testing Nigeria"],
    faqs: [{ q: "Do you write the test checklist?", a: "Yes, on the first order. After that we reuse and update it each release." }],
    hustleTitle: "QA Regression Tester",
    hustleNeeds: ["Some software testing experience", "Organised and thorough"],
  }),
  s({
    slug: "user-feedback-interviews",
    name: "User Feedback Interviews",
    category: "testing-qa",
    size: "big",
    unit: "per 3 interviews",
    summary: "Short private interviews with people who match your customer, to hear what they really think of your product, price or idea.",
    forWho: "Founders and product teams before a launch or price change.",
    deliverables: ["Three 20-minute interviews", "Notes and key quotes", "Summary of patterns"],
    turnaround: "4 working days",
    keywords: ["user research Nigeria", "customer interviews service", "product feedback Nigeria"],
    faqs: [{ q: "Are these public reviews?", a: "No. This is private feedback for you only. We never write or pay for public reviews." }],
    hustleTitle: "User Research Interviewer",
    hustleNeeds: ["Good listener", "Clear note taker"],
  }),
  s({
    slug: "online-service-check",
    name: "Online Service Check",
    category: "testing-qa",
    size: "small",
    unit: "per check",
    summary: "We try your online ordering, booking, support chat or payment flow as a customer and report how it went.",
    forWho: "Businesses that sell or book online.",
    deliverables: ["One full customer journey", "Timings and screenshots", "What worked and what did not"],
    turnaround: "1 working day",
    keywords: ["customer experience check", "online service testing", "test my website checkout"],
    faqs: [{ q: "Will you make a real purchase?", a: "Only if you ask and cover the purchase cost. Otherwise we stop before payment." }],
    hustleTitle: "Online Service Checker",
    hustleNeeds: ["Smartphone or laptop", "Honest, clear notes"],
  }),

  // ---------- Cybersecurity ----------
  s({
    slug: "website-security-scan",
    name: "Website Security Scan",
    category: "cybersecurity",
    size: "big",
    unit: "per website",
    summary: "A check of your website for common weaknesses: outdated plugins, missing security headers, exposed files and weak SSL settings.",
    forWho: "Any business with a website, especially WordPress sites.",
    deliverables: ["Automated and manual checks", "Risk rating for each finding", "Plain-English fix list"],
    turnaround: "2 working days",
    keywords: ["website security check Nigeria", "website vulnerability scan", "cybersecurity services Nigeria", "WordPress security Nigeria"],
    faqs: [{ q: "Will the scan break my site?", a: "No. We only run safe checks, and only on sites you own or have permission to test." }],
    hustleTitle: "Web Security Analyst",
    hustleNeeds: ["Knows OWASP Top 10 basics", "Experience with scanners such as OWASP ZAP or Nikto"],
  }),
  s({
    slug: "penetration-testing",
    name: "Penetration Testing for Small Businesses",
    category: "cybersecurity",
    size: "big",
    unit: "per web app",
    businessFrom: 75_000,
    summary: "An ethical hacker tests your web app or portal the way an attacker would, within agreed rules, and shows you how to fix what they find.",
    forWho: "Fintechs, schools, clinics and SaaS businesses with customer logins or payments.",
    deliverables: ["Written scope and permission", "Manual testing of key flows", "Findings report with severity and proof", "Free re-test of fixed issues"],
    turnaround: "5 to 10 working days",
    keywords: ["penetration testing Nigeria", "pen test small business", "ethical hacker Nigeria", "web app security testing Lagos"],
    faqs: [
      { q: "Is this legal?", a: "Yes. Testing only starts after you sign a scope and permission letter for systems you own." },
      { q: "Why is it priced higher?", a: "A pen test is several days of skilled work. The price covers the whole engagement, not one task." },
    ],
    hustleTitle: "Junior Penetration Tester",
    hustleNeeds: ["Hands-on lab or CTF experience", "Burp Suite or similar", "Strict ethics and confidentiality"],
  }),
  s({
    slug: "business-email-security",
    name: "Business Email Security Setup",
    category: "cybersecurity",
    size: "big",
    unit: "per domain",
    summary: "Stop scammers sending email as your business and keep your emails out of spam with SPF, DKIM and DMARC set up correctly.",
    forWho: "Any business using email on its own domain.",
    deliverables: ["SPF, DKIM and DMARC records", "Spam and spoofing test", "Two-step login turned on for key accounts"],
    turnaround: "2 working days",
    keywords: ["email security Nigeria", "DMARC setup", "stop email spoofing", "business email setup Nigeria"],
    faqs: [{ q: "Do you need my domain login?", a: "Either add us to your DNS account or we send you the exact records to paste." }],
    hustleTitle: "Email Security Technician",
    hustleNeeds: ["Understands DNS records", "Has set up DMARC before"],
  }),
  s({
    slug: "social-account-security",
    name: "Social Media Account Security Lock-Down",
    category: "cybersecurity",
    size: "small",
    unit: "per account",
    summary: "Protect your business Instagram, Facebook or WhatsApp from takeover: two-step login, recovery details, admin clean-up and scam awareness.",
    forWho: "Businesses whose page is their shop.",
    deliverables: ["Two-step login on", "Recovery email and phone checked", "Old admins and apps removed", "One-page safety guide"],
    turnaround: "1 working day",
    keywords: ["secure Instagram account", "Facebook page hacked Nigeria", "social media security for business"],
    faqs: [{ q: "Can you recover a hacked account?", a: "We guide you through the official recovery steps, but only the platform can restore an account." }],
    hustleTitle: "Account Security Assistant",
    hustleNeeds: ["Knows Meta and WhatsApp security settings", "Trustworthy and discreet"],
  }),
  s({
    slug: "phishing-awareness-training",
    name: "Staff Phishing & Scam Awareness Session",
    category: "cybersecurity",
    size: "big",
    unit: "per session (up to 20 staff)",
    summary: "A practical one-hour session, online or on site, that teaches staff to spot fake alerts, payment scams and phishing links.",
    forWho: "Offices, schools, shops and any team that handles money or customer data.",
    deliverables: ["One-hour session", "Real Nigerian scam examples", "Quiz and checklist for staff"],
    turnaround: "Booked within 5 working days",
    keywords: ["cybersecurity awareness training Nigeria", "phishing training for staff", "scam awareness training Lagos"],
    faqs: [{ q: "Can you send a test phishing email?", a: "Yes, as an extra task, with written approval from management first." }],
    hustleTitle: "Security Awareness Trainer",
    hustleNeeds: ["Cybersecurity knowledge", "Confident presenter"],
  }),
  s({
    slug: "office-wifi-security-check",
    name: "Office Wi-Fi & Network Security Check",
    category: "cybersecurity",
    size: "big",
    unit: "per office",
    summary: "An on-site check of your router, Wi-Fi passwords, guest network and shared devices, with simple fixes applied on the spot.",
    forWho: "Small offices, schools, clinics and shops with shared Wi-Fi.",
    deliverables: ["Router and Wi-Fi settings check", "Guest network set up", "Default passwords changed", "Short report"],
    turnaround: "Visit within 5 working days",
    keywords: ["network security check Nigeria", "secure office WiFi", "IT support small business Nigeria"],
    faqs: [{ q: "Which cities?", a: "Anambra first, then Lagos and Abuja where we have technicians. Mention your city in the brief." }],
    hustleTitle: "Network Security Technician",
    hustleNeeds: ["Router and Wi-Fi configuration skills", "Lives in a covered city"],
  }),
];

export const businessPrice = (svc: Service) => svc.businessFrom ?? PRICE_TIERS[svc.size].businessFrom;
export const talentPay = (svc: Service) => PRICE_TIERS[svc.size].talentPay;

export const getService = (slug: string) => SERVICES.find((x) => x.slug === slug);
export const getServiceCategory = (slug: string) => SERVICE_CATEGORIES.find((c) => c.slug === slug);
export const servicesInCategory = (slug: string) => SERVICES.filter((x) => x.category === slug);
