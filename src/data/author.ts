export const BLOG_AUTHOR = {
  name: "Bill Achusim",
  fullName: "Nnamdi Bill Achusim",
  role: "Founder, Tech Faculty NG",
  /** The founder's page on this site. Bylines and the Person JSON-LD point here. */
  path: "/team/bill-achusim",
  linkedin: "https://www.linkedin.com/in/billachusim",
  x: "https://x.com/billachusim",
  instagram: "https://www.instagram.com/billachusim/",
};

export const AUTHOR_URL = `https://techfaculty.ng${BLOG_AUTHOR.path}`;

export const authorSchema = {
  "@type": "Person",
  "@id": `${AUTHOR_URL}#person`,
  name: BLOG_AUTHOR.name,
  alternateName: BLOG_AUTHOR.fullName,
  jobTitle: "Founder",
  worksFor: { "@type": "Organization", name: "Tech Faculty NG", url: "https://techfaculty.ng" },
  url: AUTHOR_URL,
  sameAs: [BLOG_AUTHOR.linkedin, BLOG_AUTHOR.x, BLOG_AUTHOR.instagram],
};
