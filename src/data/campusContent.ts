import type { Campus } from "@/data/campuses";
import { VIRTUAL_SIWES } from "@/data/virtualSiwes";
import { HYBRID_FEE, PHYSICAL_FEE, TEEN_HOLIDAY_FROM, naira } from "@/lib/fees";

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
  const inst = c.nearbyInstitutions.slice(0, 2).join(", ");
  return [
    {
      q: `Where exactly is Tech Faculty in ${c.city}?`,
      a: /incubation/i.test(c.address)
        ? `Tech Faculty ${c.city} operates from ${c.address}, inside the Technology Incubation Centre network of the National Board for Technology Incubation, an agency of the Federal Ministry of Science, Technology and Innovation. You train in a federally-run facility rather than a private shopfront, with labs and mentors on site.`
        : `Tech Faculty ${c.city} operates from ${c.address}. It is a Tech Faculty NG centre, licensed by the Federal Ministry of Science, Technology and Innovation through the National Board for Technology Incubation, with labs and mentors on site. Message us on WhatsApp for directions before your first visit.`,
    },
    {
      q: `Can I study online instead of attending the ${c.city} centre?`,
      a: `Yes. Every Tech Faculty department can be studied online, hybrid or fully in person. Online study is included in the course fee, hybrid study with monthly meetups adds ${naira(HYBRID_FEE)}, and weekly on-site classes add ${naira(PHYSICAL_FEE)}. Many ${c.city} students take lectures online and use the centre for labs and project reviews.`,
    },
    {
      q: `Do you accept SIWES and industrial training students in ${c.city}?`,
      a: `Yes. We take SIWES and IT students each session${inst ? ` from institutions such as ${inst}` : ""}, on our Learn & Pay and Tutor & Earn tracks. Virtual SIWES costs ${naira(VIRTUAL_SIWES.placementPriceNGN)}, and our ${naira(VIRTUAL_SIWES.logbookPriceNGN)} logbook service completes the company sections of your ITF SPE-1 and Form 8 if you cannot attend in person.`,
    },
    {
      q: `Are there holiday tech programmes for children and teenagers in ${c.city}?`,
      a: `Yes. During school holidays we run teen tracks in Digital Creation, Coding, Artificial Intelligence and Cybersecurity for JSS and SSS students in ${c.city}. Classes are project-based and supervised, each student ends by presenting what they built, and fees start from ${naira(TEEN_HOLIDAY_FROM.amount)} for a ${TEEN_HOLIDAY_FROM.weeks}-week track.`,
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