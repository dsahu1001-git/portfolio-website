import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNewsletterEdition, getNewsletterSlugs } from '@/lib/newsletter-content';
import { createMetadata } from '@/lib/seo';

interface NewsletterEditionPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getNewsletterSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: NewsletterEditionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const edition = await getNewsletterEdition(slug);

  return createMetadata({
    title: edition?.title ?? 'Newsletter',
    description: edition?.description ?? 'Deep Signals newsletter edition.',
    path: `/newsletter/${slug}`,
  });
}

export default async function NewsletterEditionPage({
  params,
}: NewsletterEditionPageProps) {
  const { slug } = await params;
  const edition = await getNewsletterEdition(slug);

  if (!edition) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-sm text-primary">Deep Signals</p>
      <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
        {edition.title}
      </h1>
      <p className="mt-4 text-muted-foreground">{edition.description}</p>
      <p className="mt-5 font-mono text-xs text-muted-foreground">
        {edition.publishedAt}
      </p>
      <div
        className="prose prose-slate mt-10 max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: edition.html }}
      />
    </article>
  );
}
