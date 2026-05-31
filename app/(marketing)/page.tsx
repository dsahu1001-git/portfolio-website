import Link from 'next/link';
import {
  ArrowRight,
  BookOpenText,
  BriefcaseBusiness,
  Cpu,
  Gamepad2,
  Newspaper,
  RadioTower,
  ShoppingBag,
  Wrench,
} from 'lucide-react';
import { BlogList } from '@/components/blog/BlogList';
import { Hero } from '@/components/marketing/Hero';
import { NewsletterSignup } from '@/components/marketing/NewsletterSignup';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { getFeaturedPosts } from '@/lib/markdown';

const professionalSignals = [
  {
    icon: BriefcaseBusiness,
    title: 'Career portfolio',
    description:
      'The complete recruiter-facing profile: leadership scope, case studies, impact metrics, technical breadth, and career progression.',
    href: '/work',
    label: 'Review profile',
  },
  {
    icon: Cpu,
    title: 'Platform in a Box',
    description:
      'A practical golden-path reference project spanning Terraform, Kubernetes, GitOps, observability, and an IDP portal.',
    href: '/blog/platform-in-a-box',
    label: 'Read the architecture',
  },
  {
    icon: RadioTower,
    title: 'Deep Signals',
    description:
      'A reviewed weekly briefing on the AI and quantum developments worth keeping in your operating context.',
    href: '/newsletter',
    label: 'Open the briefing',
  },
];

const engagementUtilities = [
  { icon: Gamepad2, label: 'Connections India', href: '/games/connections-india' },
  { icon: ShoppingBag, label: 'Practical gear', href: '/gear' },
  { icon: Wrench, label: 'Free tools', href: '/tools/infra-cost-checklist' },
];

export default function HomePage() {
  const featuredPosts = getFeaturedPosts();

  return (
    <>
      <Hero />
      <section className="systems-grid border-b border-border bg-card/35">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase text-primary">
            Professional signal
          </p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-3xl font-heading text-3xl font-bold sm:text-4xl">
              Systems thinking, from infrastructure to engineering leadership.
            </h2>
            <Link
              className="inline-flex items-center gap-2 font-mono text-xs uppercase text-primary hover:text-teal-200"
              href="/work"
            >
              Full recruiter profile
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-9 grid gap-4 lg:grid-cols-3">
            {professionalSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <Card
                  className="group border-border bg-background/70 hover:border-primary hover:shadow-signal"
                  key={signal.href}
                >
                  <CardHeader>
                    <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                    <h3 className="mt-5 font-heading text-2xl font-bold">
                      {signal.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {signal.description}
                    </p>
                    <Link
                      className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase text-primary group-hover:text-teal-200"
                      href={signal.href}
                    >
                      {signal.label}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="font-mono text-xs uppercase text-primary">
                Field notes
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold">
                Technical writing from the work.
              </h2>
            </div>
            <Link
              className="hidden items-center gap-2 font-mono text-xs uppercase text-primary hover:text-teal-200 sm:inline-flex"
              href="/blog"
            >
              All posts
              <BookOpenText className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <BlogList posts={featuredPosts} />
        </div>
      </section>

      <section className="border-b border-border bg-card/25">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase text-amber-400">
              <Newspaper className="h-4 w-4" aria-hidden="true" />
              Deep Signals
            </div>
            <h2 className="mt-3 font-heading text-3xl font-bold">
              Keep the useful signals. Skip the noise.
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
              A reviewed weekly dispatch on meaningful AI and quantum
              developments, with links back to original sources.
            </p>
          </div>
          <div className="border border-border bg-background/65 p-5 shadow-signal backdrop-blur-sm">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 border border-border bg-card/55 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase text-primary">
              Engagement layer
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Lightweight extras for a useful detour.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {engagementUtilities.map((utility) => {
              const Icon = utility.icon;
              return (
                <Link
                  className="inline-flex items-center gap-2 border border-border bg-background/50 px-3 py-2 text-xs text-muted-foreground transition-all hover:border-primary hover:text-primary"
                  href={utility.href}
                  key={utility.href}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {utility.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
