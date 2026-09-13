export interface BlogPost {
  slug: string;
  title: string;
  seoTitle?: string;
  description: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  readTime: number;
}
