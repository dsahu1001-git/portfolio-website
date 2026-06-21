import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BlogPostHeader } from '@/components/blog/BlogPostHeader';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { getAllPosts, getPostBySlug } from '@/lib/markdown';
import { markdownToHtml } from '@/lib/mdx';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.draft) {
    notFound();
  }

  const html = await markdownToHtml(post.content);

  return (
    <article>
      <ReadingProgress />
      <BlogPostHeader post={post} />
      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <div
          className="prose-brand"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt ?? post.publishedAt,
            author: {
              '@type': 'Person',
              name: post.author,
            },
          }),
        }}
      />
    </article>
  );
}