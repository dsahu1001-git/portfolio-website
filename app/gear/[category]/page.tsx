import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllGearGuides } from '@/lib/markdown';

interface GearCategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({
  params,
}: GearCategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `Gear: ${category.replaceAll('-', ' ')}`,
    description: `Gear guides for ${category.replaceAll('-', ' ')}.`,
  };
}

export default async function GearCategoryPage({
  params,
}: GearCategoryPageProps) {
  const { category } = await params;
  const guides = getAllGearGuides().filter(
    (guide) => guide.category === category,
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-sm text-primary">Gear category</p>
      <h1 className="mt-3 font-heading text-3xl font-bold capitalize sm:text-4xl">
        {category.replaceAll('-', ' ')}
      </h1>
      {guides.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {guides.map((guide) => (
            <Link
              className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
              href={`/gear/${category}/${guide.slug}`}
              key={guide.slug}
            >
              <h2 className="font-heading text-2xl font-bold">{guide.title}</h2>
              <p className="mt-3 text-muted-foreground">{guide.description}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-xl border border-border bg-card p-6">
          <h2 className="font-heading text-2xl font-bold">
            Guides coming soon
          </h2>
          <p className="mt-3 text-muted-foreground">
            This category is part of the planned affiliate structure. Add
            markdown files under `content/gear/{category}` to publish the first
            guide.
          </p>
        </div>
      )}
    </section>
  );
}
