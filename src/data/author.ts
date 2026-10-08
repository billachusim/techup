export const BLOG_AUTHOR = {
  name: "Bill Achusim",
  fullName: "Nnamdi Bill Achusim",
  role: "Founder, Tech Faculty NG",
  /** The founder's page on this site. Bylines and the Person JSON-LD point here. */
  path: "/team/bill-achusim",
  linkedin: "https://www.linkedin.com/in/billachusim",
  x: "https://x.com/billachusim",
  instagram: "https://www.instagram.com/billachusim/",
  degree: "MSc Systems Engineering",
  university: "University of Lagos",
  meetup: "Nnewi Tech Meetup",
};

export const AUTHOR_URL = `https://techfaculty.ng${BLOG_AUTHOR.path}`;

export const authorSchema = {
  "@type": "Person",
  "@id": `${AUTHOR_URL}#person`,
  name: BLOG_AUTHOR.name,
  alternateName: BLOG_AUTHOR.fullName,
  jobTitle: "Founder",
  worksFor: { "@type": "Organization", name: "Tech Faculty NG", url: "https://techfaculty.ng" },
  alumniOf: { "@type": "CollegeOrUniversity", name: BLOG_AUTHOR.university },
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "degree",
    name: `${BLOG_AUTHOR.degree}, ${BLOG_AUTHOR.university}`,
    recognizedBy: { "@type": "CollegeOrUniversity", name: BLOG_AUTHOR.university },
  },
  // Schema.org has no "founderOf", so the founding role goes on memberOf.
  memberOf: {
    "@type": "OrganizationRole",
    roleName: "Founder",
    memberOf: { "@type": "Organization", name: BLOG_AUTHOR.meetup },
  },
  url: AUTHOR_URL,
  sameAs: [BLOG_AUTHOR.linkedin, BLOG_AUTHOR.x, BLOG_AUTHOR.instagram],
};
