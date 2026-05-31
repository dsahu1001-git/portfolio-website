export interface BlogPostFrontmatter {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  category: string;
  heroImage?: string;
  heroImageAlt?: string;
  draft: boolean;
  featured: boolean;
  readingTime?: string;
}

export interface BlogPost extends BlogPostFrontmatter {
  slug: string;
  content: string;
}
