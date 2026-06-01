import Link from 'next/link';
import type { Metadata } from 'next';
import { BlogList } from '@/components/blog/BlogList';
import { Badge } from '@/components/ui/Badge';
import { getAllCategories, getAllPosts, getAllTags } from '@/lib/markdown';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Blog',
  description:
    'Technical writing on platform engineering, Kubernetes, cloud, observability, and leadership.',
  path: '/blog',
});

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <section className="systems-grid border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
        <div>
          <p className="font-mono text-xs uppercase text-primary">Field notes / Blog</p>
          <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
            Practical notes from platform engineering work.
          </h1>
          <div className="mt-10">
            <BlogList posts={posts} />
          </div>
        </div>
        <aside className="space-y-8 border-l border-border pl-6">
          <div>
            <h2 className="font-semibold">Categories</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link href={`/blog/category/${category}`} key={category}>
                  <Badge>{category}</Badge>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-semibold">Tags</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  className="text-sm text-primary hover:underline"
                  href={`/blog/tag/${tag}`}
                  key={tag}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
      </div>
    </section>
  );
}
