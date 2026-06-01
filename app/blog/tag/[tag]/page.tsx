import type { Metadata } from 'next';
import { BlogList } from '@/components/blog/BlogList';
import { getAllTags, getPostsByTag } from '@/lib/markdown';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `Tag: ${tag}`,
    description: `Blog posts tagged ${tag}.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-sm text-primary">Tag</p>
      <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
        #{tag}
      </h1>
      <div className="mt-10">
        <BlogList posts={posts} />
      </div>
    </section>
  );
}
