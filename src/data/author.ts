export const BLOG_AUTHOR = {
  name: "Bill Achusim",
  role: "Founder, Tech Faculty NG",
  linkedin: "https://www.linkedin.com/in/billachusim",
  x: "https://x.com/billachusim",
};

export const authorSchema = {
  "@type": "Person",
  name: BLOG_AUTHOR.name,
  jobTitle: "Founder",
  worksFor: { "@type": "Organization", name: "Tech Faculty NG", url: "https://techfaculty.ng" },
  url: BLOG_AUTHOR.linkedin,
  sameAs: [BLOG_AUTHOR.linkedin, BLOG_AUTHOR.x],
};
