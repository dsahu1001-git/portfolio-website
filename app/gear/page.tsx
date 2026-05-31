import Link from 'next/link';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { getAllGearGuides } from '@/lib/markdown';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Gear',
  description:
    'Affiliate gear recommendations for work-from-home, badminton, cricket, and networking.',
  path: '/gear',
});

const categories = ['work-from-home', 'badminton', 'cricket', 'networking'];

export default function GearPage() {
  const guides = getAllGearGuides();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-sm text-primary">Gear</p>
      <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
        Useful recommendations, with affiliate links only where they make sense.
      </h1>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Card className="hover:shadow-md" key={category}>
            <CardHeader>
              <h2 className="font-heading text-xl font-bold capitalize">
                {category.replaceAll('-', ' ')}
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {guides.filter((guide) => guide.category === category).length}{' '}
                guide(s)
              </p>
              <Link
                className="mt-5 inline-flex text-sm font-semibold text-primary hover:underline"
                href={`/gear/${category}`}
              >
                Open category
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
