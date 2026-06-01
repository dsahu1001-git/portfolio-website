import type { Metadata } from 'next';
import Link from 'next/link';
import { NewsletterSignup } from '@/components/marketing/NewsletterSignup';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { getNewsletterEditions } from '@/lib/newsletter-content';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Deep Signals Newsletter',
  description:
    'A reviewed weekly briefing on meaningful AI and quantum-computing developments.',
  path: '/newsletter',
});

export default function NewsletterPage() {
  const editions = getNewsletterEditions();

  return (
    <section className="systems-grid border-b border-border">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase text-primary">Newsletter / Intelligence briefing</p>
      <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
        Deep Signals
      </h1>
      <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
        A reviewed weekly briefing on AI and quantum developments that are
        worth your attention, with links to original sources.
      </p>
      <div className="mt-7 max-w-2xl">
        <NewsletterSignup />
      </div>
      <div className="mt-12 grid gap-5">
        {editions.map((edition) => (
          <Card className="hover:border-primary hover:shadow-signal" key={edition.slug}>
            <CardHeader>
              <p className="font-mono text-xs text-primary">
                {edition.publishedAt}
              </p>
              <h2 className="font-heading text-2xl font-bold">
                <Link href={`/newsletter/${edition.slug}`}>{edition.title}</Link>
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                {edition.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
    </section>
  );
}
