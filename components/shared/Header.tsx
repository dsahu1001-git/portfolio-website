import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { MobileNavigation } from '@/components/shared/MobileNavigation';
import { Navigation } from '@/components/shared/Navigation';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { LiveSystemStatus } from '@/components/shared/LiveSystemStatus';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0e0e0e]/75 backdrop-blur-2xl">
      <div className="signal-line h-px w-full" />
      <div className="bio-trace absolute inset-x-0 bottom-0 h-px opacity-70" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" href="/">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/55 bg-primary/10 font-mono text-xs text-primary shadow-[0_0_22px_rgba(0,245,255,0.18)]">
            DS
          </span>
          <span className="hidden font-heading text-sm font-bold sm:inline">
            DEEPAK_SAHU
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <LiveSystemStatus />
          <Navigation />
          <Link
            className="hidden items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-2 font-mono text-[10px] uppercase text-primary transition-all hover:bg-primary hover:text-primary-foreground sm:inline-flex"
            href="/contact"
          >
            Connect
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <ThemeToggle />
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
