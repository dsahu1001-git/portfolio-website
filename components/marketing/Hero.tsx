import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  CloudCog,
  Newspaper,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SocialLinks } from '@/components/marketing/SocialLinks';

const signals = [
  { icon: BriefcaseBusiness, label: 'Platform engineering leadership' },
  { icon: Newspaper, label: 'Technical writing' },
  { icon: CloudCog, label: 'Cloud, reliability, and cost discipline' },
];

export function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-24 lg:px-8">
      <div>
        <p className="font-mono text-sm font-medium text-primary">
          Platform engineering, DevOps leadership, and reliable cloud systems.
        </p>
        <h1 className="mt-5 max-w-4xl font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Building reliable, cost-aware developer platforms at scale.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          I am Deepak Kumar Sahu, a senior engineering manager focused on
          DevOps, platform engineering, observability, cloud migrations, and
          practical technical leadership for teams that ship real products.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild href="/work">
            See my work{' '}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
          <Button asChild href="/blog" variant="outline">
            Read the blog
          </Button>
        </div>
        <div className="mt-8">
          <SocialLinks />
        </div>
      </div>
      <aside className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Impact snapshot
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-5">
          {[
            ['100+', 'Kubernetes clusters'],
            ['1,200+', 'Production workloads'],
            ['20+', 'Products supported'],
            ['150+', 'Engineers trained'],
          ].map(([value, label]) => (
            <div key={label}>
              <dt className="font-heading text-3xl font-bold text-primary">
                {value}
              </dt>
              <dd className="mt-1 text-sm text-muted-foreground">{label}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 space-y-3">
          {signals.map((signal) => {
            const Icon = signal.icon;
            return (
              <Link
                className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm transition-all hover:border-primary hover:bg-muted"
                href="/work"
                key={signal.label}
              >
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                {signal.label}
              </Link>
            );
          })}
        </div>
      </aside>
    </section>
  );
}
