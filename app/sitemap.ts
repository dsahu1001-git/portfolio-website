import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/markdown';
import { getNewsletterEditions } from '@/lib/newsletter-content';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deepaksahu.dev';
  const routes = [
    '',
    '/about',
    '/work',
    '/contact',
    '/blog',
    '/newsletter',
    '/games',
    '/gear',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const posts = getAllPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
  }));

  const newsletterEditions = getNewsletterEditions().map((edition) => ({
    url: `${siteUrl}/newsletter/${edition.slug}`,
    lastModified: new Date(edition.publishedAt),
  }));

  return [...routes, ...posts, ...newsletterEditions];
}
