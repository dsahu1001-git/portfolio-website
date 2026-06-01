import Image from 'next/image';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  BriefcaseBusiness,
  CloudCog,
  RadioTower,
  ShieldCheck,
} from 'lucide-react';
import { SocialLinks } from '@/components/marketing/SocialLinks';
import { Button } from '@/components/ui/Button';

const metrics = [
  ['100+', 'Kubernetes clusters'],
  ['1,200+', 'Production workloads'],
  ['20+', 'Products supported'],
  ['30%+', 'Monthly cost reduction'],
];

const signals = [
  { icon: CloudCog, label: 'Platform engineering' },
  { icon: ShieldCheck, label: 'Reliability systems' },
  { icon: RadioTower, label: 'Observability at scale' },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border sm:min-h-[720px]">
      <Image
        alt="Futuristic infrastructure command center with luminous platform pathways"
        className="object-cover object-center"
        fill
        priority
        sizes="100vw"
        src="/images/brand/platform-command-center.jpg"
      />
      <div className="absolute inset-0 bg-[#020817]/65" />
      <div className="absolute inset-y-0 left-0 w-full bg-[#020817]/35 lg:w-3/5" />
      <div className="systems-grid absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 py-20 sm:min-h-[720px] sm:px-6 sm:pb-28 lg:px-8">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 border border-primary/40 bg-background/55 px-3 py-2 font-mono text-xs uppercase text-primary backdrop-blur-md">
            <Activity className="h-3.5 w-3.5" aria-hidden="true" />
            Platform systems online
          </div>
          <p className="mt-7 font-mono text-xs uppercase text-cyan-200">
            Senior engineering manager / Platform engineering leader
          </p>
          <h1 className="mt-4 max-w-4xl font-heading text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
            Building reliable, cost-aware{' '}
            <span className="text-primary">developer platforms</span> at scale.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
            I am Deepak Kumar Sahu. I build DevOps, SRE, observability, and
            platform-engineering systems that help teams ship with confidence
            across complex cloud environments.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild href="/work">
              Explore my work{' '}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
            <Button asChild href="/blog/platform-in-a-box" variant="outline">
              Read Platform in a Box
            </Button>
          </div>
          <div className="mt-8">
            <SocialLinks />
          </div>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border/70 shadow-signal sm:absolute sm:inset-x-6 sm:bottom-5 sm:mt-0 sm:grid-cols-4 lg:inset-x-8 xl:mx-auto xl:max-w-7xl">
          {metrics.map(([value, label]) => (
            <div className="bg-background/80 px-4 py-4 backdrop-blur-md" key={label}>
              <p className="font-heading text-2xl font-bold text-primary">
                {value}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase text-slate-300">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
      <aside className="absolute right-8 top-28 hidden w-64 border border-border bg-background/60 p-4 shadow-signal backdrop-blur-md xl:block">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase text-primary">
            Core signal
          </p>
          <BriefcaseBusiness className="h-4 w-4 text-amber-400" aria-hidden="true" />
        </div>
        <div className="mt-4 space-y-2">
          {signals.map((signal) => {
            const Icon = signal.icon;
            return (
              <Link
                className="flex items-center gap-3 border border-border bg-card/60 px-3 py-3 text-xs text-slate-200 transition-all hover:border-primary hover:text-primary"
                href="/work"
                key={signal.label}
              >
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                {signal.label}
              </Link>
            );
          })}
        </div>
      </aside>
    </section>
  );
}
