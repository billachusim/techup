export interface BlogPost {
  slug: string;
  title: string;
  seoTitle?: string;
  description: string;
  content: string;
  date: string;
  /** ISO date of the last edit, when later than `date` */
  updated?: string;
  author: string;
  tags: string[];
  readTime: number;
}
