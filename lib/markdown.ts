import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { BlogPost, BlogPostFrontmatter } from '@/types/blog';
import type { GearGuide } from '@/types/gear';

const contentDirectory = path.join(process.cwd(), 'content');

function readMarkdownFile(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return matter(raw);
}

function getMarkdownFiles(directory: string) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
    .map((file) => path.join(directory, file));
}

function toSlug(filePath: string) {
  return path.basename(filePath).replace(/\.mdx?$/, '');
}

export function getAllPosts({
  includeDrafts = false,
}: { includeDrafts?: boolean } = {}) {
  const blogDirectory = path.join(contentDirectory, 'blog');

  return getMarkdownFiles(blogDirectory)
    .map((filePath): BlogPost => {
      const parsed = readMarkdownFile(filePath);
      const data = parsed.data as BlogPostFrontmatter;

      return {
        ...data,
        slug: toSlug(filePath),
        content: parsed.content,
        readingTime: data.readingTime ?? readingTime(parsed.content).text,
      };
    })
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export function getPostBySlug(slug: string) {
  return (
    getAllPosts({ includeDrafts: true }).find((post) => post.slug === slug) ??
    null
  );
}

export function getFeaturedPosts(limit = 3) {
  return getAllPosts()
    .filter((post) => post.featured)
    .slice(0, limit);
}

export function getPostsByCategory(category: string) {
  return getAllPosts().filter((post) => post.category === category);
}

export function getPostsByTag(tag: string) {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

export function getAllCategories() {
  return Array.from(new Set(getAllPosts().map((post) => post.category))).sort();
}

export function getAllTags() {
  return Array.from(new Set(getAllPosts().flatMap((post) => post.tags))).sort();
}

export function getAllGearGuides() {
  const gearDirectory = path.join(contentDirectory, 'gear');

  if (!fs.existsSync(gearDirectory)) {
    return [];
  }

  return fs
    .readdirSync(gearDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => getMarkdownFiles(path.join(gearDirectory, entry.name)))
    .map((filePath): GearGuide => {
      const parsed = readMarkdownFile(filePath);
      const data = parsed.data as Omit<GearGuide, 'slug' | 'content'>;

      return {
        ...data,
        slug: toSlug(filePath),
        content: parsed.content,
      };
    });
}
