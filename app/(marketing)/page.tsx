import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  BookOpenText,
  Boxes,
  BriefcaseBusiness,
  CloudCog,
  CodeXml,
  Gamepad2,
  GitBranch,
  Newspaper,
  RadioTower,
  ShoppingBag,
  TerminalSquare,
  Wrench,
} from 'lucide-react';
import { BlogCarousel } from '@/components/blog/BlogCarousel';
import { Hero } from '@/components/marketing/Hero';
import { NewsletterSignup } from '@/components/marketing/NewsletterSignup';
import { getFeaturedPosts } from '@/lib/markdown';

const scopeMetrics = [
  ['100+', 'Kubernetes clusters'],
  ['1,200+', 'Production workloads'],
  ['30%+', 'Monthly cost reduction'],
];

const engagementUtilities = [
  {
    icon: Gamepad2,
    label: 'Connections India',
    href: '/games/connections-india',
  },
  { icon: ShoppingBag, label: 'Practical gear', href: '/gear' },
  { icon: Wrench, label: 'Free tools', href: '/tools/infra-cost-checklist' },
];

export default function HomePage() {
  const featuredPosts = getFeaturedPosts();

  return (
    <>
      <Hero />

      <section className="systems-grid border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase text-primary">
                Operational_scope
              </p>
              <h2 className="mt-3 max-w-3xl font-heading text-2xl font-bold leading-tight sm:text-3xl">
                Platform leadership, rendered as evidence.
              </h2>
            </div>
            <Link
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase text-primary hover:text-cyan-100"
              href="/work"
            >
              Open recruiter console
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid auto-rows-[minmax(168px,auto)] gap-4 md:grid-cols-6">
            <article className="liquid-card rounded-lg p-6 sm:p-8 md:col-span-4 md:row-span-2">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase text-primary">
                  Production surface area
                </p>
                <Activity className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <h3 className="mt-10 max-w-2xl font-heading text-2xl font-bold leading-tight sm:text-3xl">
                Operational complexity turned into calm, repeatable systems.
              </h3>
              <div className="mt-10 grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-3">
                {scopeMetrics.map(([value, label]) => (
                  <div className="bg-black/35 p-4 backdrop-blur-xl" key={label}>
                    <p className="liquid-metal-text font-heading text-2xl font-bold">
                      {value}
                    </p>
                    <p className="mt-2 font-mono text-[9px] uppercase leading-4 text-slate-400">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <Link
              className="liquid-card group rounded-lg p-5 md:col-span-2"
              href="/work"
            >
              <BriefcaseBusiness
                className="h-6 w-6 text-primary"
                aria-hidden="true"
              />
              <p className="mt-6 font-mono text-[9px] uppercase text-muted-foreground">
                Recruiter signal
              </p>
              <h3 className="mt-2 font-heading text-lg font-bold">
                Full career profile
              </h3>
              <span className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase text-primary">
                Explore impact
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>

            <Link
              className="liquid-card group rounded-lg p-5 md:col-span-2"
              href="/blog/platform-in-a-box"
            >
              <CloudCog className="h-6 w-6 text-primary" aria-hidden="true" />
              <p className="mt-6 font-mono text-[9px] uppercase text-muted-foreground">
                Featured architecture
              </p>
              <h3 className="mt-2 font-heading text-lg font-bold">
                Platform in a Box
              </h3>
              <span className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase text-primary">
                Inspect build
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>

            <article className="liquid-card rounded-lg p-5 md:col-span-3">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase text-amber-300">
                  Proof_of_human
                </p>
                <TerminalSquare
                  className="h-5 w-5 text-amber-300"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold">
                The messy middle is part of the work.
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Architecture notes, migration trade-offs, telemetry, and the
                failed iterations that shaped the final platform.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[GitBranch, CodeXml, Boxes].map((Icon, index) => (
                  <div
                    className="flex h-10 items-center justify-center rounded border border-white/10 bg-black/20"
                    key={index}
                  >
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </article>

            <article className="liquid-card rounded-lg p-5 md:col-span-3">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase text-primary">
                  Signal_vs_noise
                </p>
                <RadioTower
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold">
                Deep Signals
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                A reviewed weekly briefing on meaningful AI and quantum
                developments, grounded in original sources.
              </p>
              <Link
                className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase text-primary"
                href="/newsletter"
              >
                Open briefing
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="font-mono text-[10px] uppercase text-primary">
                Field_notes
              </p>
              <h2 className="mt-3 font-heading text-2xl font-bold sm:text-3xl">
                Technical writing from the work.
              </h2>
            </div>
            <Link
              className="hidden items-center gap-2 font-mono text-[10px] uppercase text-primary hover:text-cyan-100 sm:inline-flex"
              href="/blog"
            >
              All posts
              <BookOpenText className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <BlogCarousel posts={featuredPosts} />
        </div>
      </section>

      <section className="systems-grid border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="liquid-card rounded-lg p-6">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase text-amber-300">
              <Newspaper className="h-4 w-4" aria-hidden="true" />
              Weekly transmission
            </div>
            <h2 className="mt-5 font-heading text-2xl font-bold sm:text-3xl">
              Keep the useful signals.
              <br />
              Skip the noise.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              An intentionally small newsletter for AI and quantum developments
              worth carrying into the next week.
            </p>
          </div>
          <div className="liquid-card rounded-lg p-6">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase text-primary">
              Engagement_layer
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Lightweight extras. Useful detours, never the main event.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {engagementUtilities.map(({ href, icon: Icon, label }) => (
              <Link
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-muted-foreground backdrop-blur-xl transition-all hover:border-primary/60 hover:text-primary"
                href={href}
                key={href}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
