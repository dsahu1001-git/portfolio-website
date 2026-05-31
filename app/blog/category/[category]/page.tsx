import type { Metadata } from 'next';
import { BlogList } from '@/components/blog/BlogList';
import { getAllCategories, getPostsByCategory } from '@/lib/markdown';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `Category: ${category}`,
    description: `Blog posts in the ${category} category.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const posts = getPostsByCategory(category);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-sm text-primary">Category</p>
      <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight">
        {category}
      </h1>
      <div className="mt-10">
        <BlogList posts={posts} />
      </div>
    </section>
  );
}
