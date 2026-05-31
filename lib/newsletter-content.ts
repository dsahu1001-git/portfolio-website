import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { markdownToHtml } from '@/lib/mdx';

export interface NewsletterEdition {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  subject: string;
  html: string;
}

const newsletterDirectory = path.join(process.cwd(), 'content', 'newsletter');

function readEdition(slug: string) {
  const filePath = path.join(newsletterDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: String(data.title),
    description: String(data.description),
    publishedAt: String(data.publishedAt),
    subject: String(data.subject ?? data.title),
    content,
  };
}

export function getNewsletterSlugs() {
  if (!fs.existsSync(newsletterDirectory)) {
    return [];
  }

  return fs
    .readdirSync(newsletterDirectory)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

export function getNewsletterEditions() {
  return getNewsletterSlugs()
    .map(readEdition)
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export async function getNewsletterEdition(
  slug: string,
): Promise<NewsletterEdition | null> {
  if (!getNewsletterSlugs().includes(slug)) {
    return null;
  }

  const edition = readEdition(slug);

  return {
    ...edition,
    html: await markdownToHtml(edition.content),
  };
}
