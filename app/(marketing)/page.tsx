import Link from 'next/link';
import { BlogList } from '@/components/blog/BlogList';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Hero } from '@/components/marketing/Hero';
import { NewsletterSignup } from '@/components/marketing/NewsletterSignup';
import { getFeaturedPosts } from '@/lib/markdown';

const growthAreas = [
  {
    title: 'Technical blog',
    description:
      'Platform engineering, Kubernetes, observability, AI workflows, and leadership lessons.',
    href: '/blog',
  },
  {
    title: 'Games for India',
    description:
      'Lightweight, mobile-first games with Indian cultural references. Phase 2 starts here.',
    href: '/games',
  },
  {
    title: 'Gear recommendations',
    description:
      'Honest work-from-home, badminton, cricket, and networking gear guides.',
    href: '/gear',
  },
];

export default function HomePage() {
  const featuredPosts = getFeaturedPosts();

  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-sm text-primary">
              Static-first growth platform
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
              Built to grow in modules
            </h2>
          </div>
          <Link
            className="text-sm font-semibold text-primary hover:underline"
            href="/work"
          >
            View career portfolio
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {growthAreas.map((area) => (
            <Card className="hover:shadow-md" key={area.href}>
              <CardHeader>
                <h3 className="font-heading text-xl font-bold">{area.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {area.description}
                </p>
                <Link
                  className="mt-5 inline-flex text-sm font-semibold text-primary hover:underline"
                  href={area.href}
                >
                  Explore
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-mono text-sm text-primary">Latest writing</p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
              Featured posts
            </h2>
          </div>
          <Link
            className="hidden text-sm font-semibold text-primary hover:underline sm:inline-flex"
            href="/blog"
          >
            All posts
          </Link>
        </div>
        <BlogList posts={featuredPosts} />
      </section>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-heading text-2xl font-bold">
            Get the practical notes
          </h2>
          <p className="mt-2 text-muted-foreground">
            Short notes on platform engineering, leadership, and tools that save
            time or money.
          </p>
          <div className="mt-5">
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </>
  );
}
