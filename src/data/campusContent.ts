import type { Campus } from "@/data/campuses";

export interface CampusFaq {
  q: string;
  a: string;
}

/** Programme lines shown on every campus page, city-interpolated. */
export function campusProgrammes(c: Campus) {
  return [
    {
      title: "Free Foundation Bootcamp",
      body: `A no-fee starter programme in ${c.city} covering computer confidence, internet skills and practical AI tools. It is how most of our students begin, and it runs continuously with rolling intakes.`,
      href: "/departments/basic-internet-ai-studies",
    },
    {
      title: "AI & Machine Learning",
      body: `Python, machine learning, generative AI, retrieval systems and AI agents — taught with cloud notebooks so ${c.city} students are not limited by laptop specification or power supply.`,
      href: "/departments/ai-machine-learning",
    },
    {
      title: "Web & Mobile Development",
      body: `Front-end and full-stack engineering with React and Next.js, plus React Native and Flutter for mobile. ${c.city} learners ship and deploy real applications before graduating.`,
      href: "/departments/web-development",
    },
    {
      title: "Data Analytics & Data Science",
      body: `Excel, SQL, Power BI, Tableau and Python, with dashboards built on Nigerian datasets that ${c.city} employers recognise.`,
      href: "/departments/data-science-analytics",
    },
    {
      title: "Cybersecurity",
      body: `Security operations, ethical hacking, digital forensics and Nigeria Data Protection Act compliance, with CompTIA Security+ and CEH preparation.`,
      href: "/departments/cybersecurity",
    },
    {
      title: "Design & Digital Marketing",
      body: `Graphic design, UI/UX with Figma, content production, SEO and paid advertising — the fastest route to income for ${c.city} creatives and business owners.`,
      href: "/departments/design",
    },
  ];
}

export function campusFaqs(c: Campus): CampusFaq[] {
  const inst = c.nearbyInstitutions.slice(0, 3).join(", ");
  return [
    {
      q: `Where exactly is Tech Faculty in ${c.city}?`,
      a: `We operate from ${c.address}. Tech Faculty runs inside the Technology Incubation Centre network of the National Board for Technology Incubation, an agency of the Federal Ministry of Science, Technology and Innovation, so the venue is a federally-run facility rather than a private shopfront.`,
    },
    {
      q: `Can I study online instead of attending the ${c.city} centre?`,
      a: `Yes. Every department is available online, hybrid, or fully in person. Many ${c.city} students take lectures online and use the centre for labs, mentoring and project reviews.`,
    },
    {
      q: `Do you accept SIWES and industrial training students in ${c.city}?`,
      a: `Yes. We take SIWES and IT students each session${inst ? ` from institutions such as ${inst}` : ""}, on our Learn & Pay and Tutor & Earn tracks, with supervised project work and logbook support. Places are limited, so apply early.`,
    },
    {
      q: `Are there holiday tech programmes for children and teenagers in ${c.city}?`,
      a: `Yes. During school holidays we run teen tracks in Digital Creation, Coding, Artificial Intelligence and Cybersecurity for JSS and SSS students in ${c.city}, project-based and supervised, ending with each student presenting what they built.`,
    },
  ];
}

export function campusMetaTitle(c: Campus) {
  return `Tech Training in ${c.city} | Tech Faculty ${c.city}`;
}

export function campusMetaDescription(c: Campus) {
  return `Tech Faculty ${c.city}: AI, web development, data analytics, cybersecurity and design training at ${c.shortVenue}, plus SIWES placement and teen holiday bootcamps in ${c.state}.`;
}

export function campusKeywords(c: Campus) {
  return [
    `tech training in ${c.city}`,
    `coding classes in ${c.city}`,
    `AI course ${c.city}`,
    `data analytics training ${c.city}`,
    `cybersecurity training ${c.city}`,
    `SIWES placement ${c.city}`,
    `holiday tech bootcamp for teenagers ${c.city}`,
    `tech school in ${c.state} State`,
  ];
}