import Image from 'next/image';
import {
  Activity,
  ArrowRight,
  DatabaseZap,
  Network,
  ShieldCheck,
} from 'lucide-react';
import { SocialLinks } from '@/components/marketing/SocialLinks';
import { Button } from '@/components/ui/Button';

const liveSignals = [
  { icon: Network, label: 'Multi-cloud systems' },
  { icon: ShieldCheck, label: 'Reliability by design' },
  { icon: DatabaseZap, label: 'FinOps-aware platforms' },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10">
      <Image
        alt="Futuristic infrastructure command center with luminous platform pathways"
        className="object-cover object-center opacity-45"
        fill
        priority
        sizes="100vw"
        src="/images/brand/platform-command-center.jpg"
      />
      <div className="absolute inset-0 bg-[#0e0e0e]/75" />
      <div className="systems-grid absolute inset-0 opacity-50" />
      <div className="liquid-membrane -right-32 top-24 hidden lg:block" />
      <div className="absolute inset-x-0 top-1/2 h-px overflow-hidden opacity-70">
        <div className="scan-line h-px w-full" />
      </div>

      <div className="relative mx-auto grid min-h-[690px] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_310px] lg:px-8">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-black/35 px-3 py-1.5 font-mono text-[10px] uppercase text-primary backdrop-blur-2xl">
            <Activity className="h-3.5 w-3.5" aria-hidden="true" />
            Systems online / India
          </div>
          <p className="mt-7 font-mono text-xs uppercase text-cyan-100">
            Senior engineering manager / Platform engineering leader
          </p>
          <h1 className="mt-4 max-w-4xl font-heading text-4xl font-bold leading-[1.12] sm:text-5xl lg:text-[3.55rem]">
            Building reliable, cost-aware{' '}
            <span className="liquid-metal-text">developer platforms</span> at
            scale.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200">
            I am Deepak Kumar Sahu. I build the cloud platforms, operating
            models, and teams that make complex engineering systems feel
            dependable.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild href="/work">
              Explore operational scope
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

        <aside className="liquid-card rounded-lg p-5 backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase text-primary">
              Live systems brief
            </p>
            <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase text-cyan-100">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_#00f5ff]" />
              Active
            </span>
          </div>
          <p className="mt-8 font-heading text-lg font-bold leading-7">
            Quiet infrastructure.
            <br />
            Visible outcomes.
          </p>
          <div className="mt-7 space-y-2">
            {liveSignals.map(({ icon: Icon, label }) => (
              <div
                className="flex items-center gap-3 border-t border-white/10 py-3 text-xs text-slate-300"
                key={label}
              >
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
