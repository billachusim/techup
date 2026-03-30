export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  keywords: string[];
  featuredImage: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-start-tech-career-nigeria-2026",
    title: "How to Start a Tech Career in Nigeria: A Step-by-Step Guide",
    excerpt: "Breaking into tech in Nigeria has never been more accessible. Here's a step-by-step guide to mapping your tech career from coding the right bootcamp to landing your first job.",
    content: ...,
    category: "Career Guide",
    author: "Tech Future",
    publishedAt: "2026-03-10",
    readTime: "8 min read",
    keywords: ["tech career Nigeria", "start coding Nigeria", "software developer Nigeria", "tech bootcamp Nigeria"],
    featuredImage: "https://images.unsplash.com/photo-1401903940937-397108039127-85c69677127c?ixlib=js-4.0.3&auto=format&fit= crop&w=1920&q=80"
  },
  ... (other existing posts),
  {
    slug: "computer-vision-nigerian-businesses-2026",
    title: "How Nigerian Businesses Can Use Computer Vision to Transform Operations in 2026",
    excerpt: "Computer vision is revolutionizing industries worldwide. Nigerian companies can leverage this AI capability to improve quality control, security, customer experiences, and more. Discover practical applications and implementation strategies.",
    content: "\n",
    category: "AI & Automation",
    author: "Tech Future",
    publishedAt: "2026-03-30",
    readTime: "8 min read",
    keywords: ["computer vision Nigeria", "AI Nigeria", "business automation Nigeria"],
    featuredImage: "https://images.unsplash.com/photo-1620712913247-2068194d0e6c?ixlib=js-4.0.3&auto=format&fit= crop&w=1920&q=80"
  }
]