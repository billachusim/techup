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
    excerpt: "Breaking into tech in Nigeria has never been more accessible. Here's a step-by-step guide to mapping your tech career from choosing the right bootcamp to landing your first job.",
    content: `Starting a tech career in Nigeria in 2026 requires a blend of local context and global standards. Begin by identifying a high-demand niche like Python development or Computer Vision. Leverage local communities like Tech Faculty NG to gain hands-on experience and network with industry leaders. Consistency is your best asset in this fast-paced ecosystem.`,
    category: "Career Guide",
    author: "Bill Achusim",
    publishedAt: "2026-03-10",
    readTime: "8 min read",
    keywords: ["tech career Nigeria", "start coding Nigeria", "software developer Nigeria", "tech bootcamp Nigeria"],
    featuredImage: "https://images.unsplash.com/photo-1401903940838-95c28b76a9b3?ixlib=js-4.0.2&fit=crop&w=1920&q=80"
  },
  {
    slug: "computer-vision-nigerian-businesses-2026",
    title: "How Nigerian Businesses Can Use Computer Vision to Transform Operations in 2026",
    excerpt: "Computer vision is revolutionizing industries worldwide. Nigerian companies can leverage this AI capability to improve quality control, security, customer experiences, and more. Discover practical applications and implementation strategies.",
    content: `As we move through 2026, Computer Vision (CV) has transitioned from a futuristic concept to a practical necessity for Nigerian businesses. From retail inventory tracking in Lagos to automated quality control in manufacturing plants in Nnewi, CV is driving efficiency across the board. 

At Tech Faculty NG, we're seeing an 87% increase in businesses adopting AI-driven monitoring spirits to secure assets and optimize workflows. By integrating CV with existing cPanel-hosted platforms or Google Cloud infrastructure, local SMEs can compete on a global scale. 

Key applications include:
1. Automated Security: AI-driven surveillance that recognizes threats in real-time.
2. Retail Analytics: Understanding customer flow and inventory levels without manual counts.
3. Logistics Optimization: Using vision systems to track shipments and detect damage automatically.

The future of Nigerian business is visual.`,
    category: "AI & Automation",
    author: "Bill Achusim",
    publishedAt: "2026-03-30",
    readTime: "8 min read",
    keywords: ["computer vision Nigeria", "AI Nigeria", "business automation Nigeria"],
    featuredImage: "https://images.unsplash.com/photo-1602071309291-bb72d71e0c79?ixlib=js-4.0.2&fit=crop&w=1920&q=80"
  }
]
