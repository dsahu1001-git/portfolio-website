import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { GearCard } from '@/components/gear/GearCard';
import { GearComparison } from '@/components/gear/GearComparison';
import { getAllGearGuides } from '@/lib/markdown';
import { markdownToHtml } from '@/lib/mdx';

interface GearProductPageProps {
  params: Promise<{ category: string; product: string }>;
}

export async function generateMetadata({
  params,
}: GearProductPageProps): Promise<Metadata> {
  const { product } = await params;
  return {
    title: product.replaceAll('-', ' '),
    description: 'Gear recommendation guide.',
  };
}

export default async function GearProductPage({
  params,
}: GearProductPageProps) {
  const { category, product } = await params;
  const guide = getAllGearGuides().find(
    (item) => item.category === category && item.slug === product,
  );

  if (!guide) {
    notFound();
  }

  const html = await markdownToHtml(guide.content);

  return (
    <article className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="font-mono text-sm text-primary">Gear guide</p>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight">
          {guide.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {guide.description}
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {guide.products.map((item) => (
          <GearCard category={category} key={item.name} product={item} />
        ))}
      </div>
      <div className="mt-10">
        <GearComparison products={guide.products} />
      </div>
      <div
        className="prose-brand mt-10 max-w-3xl"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
