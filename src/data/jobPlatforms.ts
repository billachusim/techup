export type JobPlatform = {
  /** URL-safe identifier */
  slug: string;
  /** Display name */
  name: string;
  /** Search-led page title keyword, e.g. "Outlier AI Jobs" */
  keyword: string;
  /** source_platform values in the jobs table that map to this platform */
  match: string[];
  /** Signup / get-started URL (swap for a referral link when available) */
  signupUrl: string;
  /** One-line description of the work offered */
  blurb: string;
  /** Longer explanation: work, pay, who it suits */
  about: string;
  faqs: { q: string; a: string }[];
};

const nigeriaFaq = (name: string) => ({
  q: `Can Nigerians apply to ${name}?`,
  a: `Yes. ${name} accepts remote contributors from many countries, including Nigeria. Availability varies by project, so create your account and check which roles are open to your country.`,
});

export const jobPlatforms: JobPlatform[] = [
  {
    slug: "micro1",
    name: "Micro1",
    keyword: "Micro1 Jobs",
    match: ["Micro1"],
    signupUrl:
      "https://refer.micro1.ai/referral/jobs?referralCode=5df297a6-4ec0-45fa-b144-1ace3ec277ef&utm_source=referral&utm_medium=share&utm_campaign=job_referral",
    blurb: "Vetted remote engineering roles with US and global companies.",
    about: "Micro1 uses an AI interviewer to vet engineers and experts, then matches them to remote contracts and AI training projects. Pay is typically hourly in USD and depends on skill and seniority.",
    faqs: [
      { q: "Is Micro1 legit?", a: "Yes. Micro1 is an established AI recruiting company that places vetted talent on remote contracts and AI data projects." },
      { q: "How much does Micro1 pay?", a: "Rates vary by role. Engineering and expert roles are usually paid hourly in USD, often well above local market rates." },
      nigeriaFaq("Micro1"),
    ],
  },
  {
    slug: "ask-ethos",
    name: "Ask Ethos",
    keyword: "Ask Ethos Jobs",
    match: ["Ask Ethos", "AskEthos", "Askitos", "Ask Etos"],
    signupUrl: "https://agent.askethos.com/refer/copbdvcud51e",
    blurb: "AI agent work and expert tasks you can take on remotely.",
    about: "Ask Ethos offers expert and AI agent tasks you can complete remotely. Work is project-based and paid per task or per hour.",
    faqs: [
      { q: "Is Ask Ethos legit?", a: "Ask Ethos is an AI work platform that pays contributors for expert tasks. As with any platform, read the project terms before starting." },
      nigeriaFaq("Ask Ethos"),
    ],
  },
  {
    slug: "atlas-capture",
    name: "Atlas Capture",
    keyword: "Atlas Capture Jobs",
    match: ["Atlas Capture", "Atlas Audit", "AtlasCapture"],
    signupUrl: "https://audit.atlascapture.io/?ref_id=6a7e58a8de1a75582251a347",
    blurb: "Paid data capture and audit projects, done from your phone or laptop.",
    about: "Atlas Capture pays contributors to capture and audit data for AI systems. Tasks can be done from a phone or laptop and suit beginners.",
    faqs: [
      { q: "Is Atlas Capture legit?", a: "Atlas Capture runs paid data capture and audit projects for AI. Pay is per task and project terms are shown before you start." },
      nigeriaFaq("Atlas Capture"),
    ],
  },
  {
    slug: "mercor",
    name: "Mercor",
    keyword: "Mercor Jobs",
    match: ["Mercor"],
    signupUrl: "https://work.mercor.com/",
    blurb: "Expert AI training and remote contract roles with top AI labs.",
    about: "Mercor hires domain experts, engineers and professionals to train and evaluate frontier AI models. Roles are remote, mostly contract, and paid hourly in USD. Applicants complete a short AI interview.",
    faqs: [
      { q: "Is Mercor legit?", a: "Yes. Mercor is a well-funded AI hiring platform that works with leading AI labs on model training and evaluation." },
      { q: "How much does Mercor pay?", a: "Most Mercor roles pay hourly in USD. Expert roles in law, medicine, finance and engineering often pay more than general roles." },
      nigeriaFaq("Mercor"),
    ],
  },
  {
    slug: "outlier",
    name: "Outlier",
    keyword: "Outlier AI Jobs",
    match: ["Outlier", "Outlier AI"],
    signupUrl: "https://outlier.ai/",
    blurb: "Flexible AI training tasks for writers, coders and subject experts.",
    about: "Outlier pays people to improve AI models by writing, reviewing and rating responses. There are generalist projects and expert tracks in coding, maths, biology, chemistry and other subjects. Work is flexible and paid per hour.",
    faqs: [
      { q: "Is Outlier AI legit?", a: "Yes. Outlier is run by Scale AI and pays contributors to train AI models. Projects come and go, so availability changes." },
      { q: "How much does Outlier pay?", a: "Pay is hourly and depends on the project and your location. Expert tracks such as coding, maths and biology usually pay more." },
      { q: "What are Outlier expert jobs?", a: "Expert jobs need a degree or strong experience in a field such as biology, chemistry, physics, law or software. You help AI answer hard questions in that field." },
      nigeriaFaq("Outlier"),
    ],
  },
  {
    slug: "handshake-ai",
    name: "Handshake AI",
    keyword: "Handshake AI Jobs",
    match: ["Handshake AI", "Handshake"],
    signupUrl: "https://joinhandshake.com/fellowship-program/",
    blurb: "AI training fellowships for students, graduates and PhD experts.",
    about: "Handshake AI connects students, graduates and subject experts with paid AI training projects. Work is remote and flexible, and expert fellowships pay hourly in USD.",
    faqs: [
      { q: "Is Handshake AI legit?", a: "Yes. Handshake is a large careers network for students, and Handshake AI is its paid AI training programme." },
      { q: "How much does Handshake AI pay?", a: "Pay is hourly and depends on your field and level of study. Graduate and PhD experts usually earn the most." },
      nigeriaFaq("Handshake AI"),
    ],
  },
  {
    slug: "alignerr",
    name: "Alignerr",
    keyword: "Alignerr Jobs",
    match: ["Alignerr"],
    signupUrl: "https://www.alignerr.com/",
    blurb: "Remote AI training work for experts across many subjects.",
    about: "Alignerr, run by Labelbox, hires experts to train and evaluate AI models. Projects cover coding, writing, maths, science and languages, and pay hourly.",
    faqs: [
      { q: "Is Alignerr legit?", a: "Yes. Alignerr is operated by Labelbox, an established AI data company." },
      nigeriaFaq("Alignerr"),
    ],
  },
  {
    slug: "toloka",
    name: "Toloka",
    keyword: "Toloka Jobs",
    match: ["Toloka"],
    signupUrl: "https://toloka.ai/",
    blurb: "Data labelling and AI tasks, from simple micro-tasks to expert projects.",
    about: "Toloka offers data labelling and AI evaluation tasks. Beginners can start with simple tasks, while experts can join higher-paying projects.",
    faqs: [
      { q: "Is Toloka legit?", a: "Yes. Toloka is a long-running data labelling platform used by AI companies worldwide." },
      nigeriaFaq("Toloka"),
    ],
  },
  {
    slug: "turing",
    name: "Turing",
    keyword: "Turing Remote Jobs",
    match: ["Turing"],
    signupUrl: "https://www.turing.com/jobs",
    blurb: "Remote software engineering and AI training roles with US companies.",
    about: "Turing vets software engineers and matches them to long-term remote roles with US companies. It also runs AI coding and training projects for frontier labs.",
    faqs: [
      { q: "Is Turing legit?", a: "Yes. Turing is a well-known platform that places remote developers with US companies." },
      nigeriaFaq("Turing"),
    ],
  },
];

export function platformFor(sourcePlatform: string | null | undefined): JobPlatform | undefined {
  if (!sourcePlatform) return undefined;
  const needle = sourcePlatform.trim().toLowerCase();
  return jobPlatforms.find((p) => p.match.some((m) => m.toLowerCase() === needle));
}

export function platformBySlug(slug: string | null | undefined): JobPlatform | undefined {
  return jobPlatforms.find((platform) => platform.slug === slug);
}
