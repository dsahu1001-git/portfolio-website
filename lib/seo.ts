import type { Metadata } from 'next';

interface SeoInput {
  title: string;
  description: string;
  path?: string;
}

export function createMetadata({
  title,
  description,
  path = '/',
}: SeoInput): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deepaksahu.dev';
  const url = new URL(path, siteUrl).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
