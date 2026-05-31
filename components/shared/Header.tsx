import Link from 'next/link';
import { MobileNavigation } from '@/components/shared/MobileNavigation';
import { Navigation } from '@/components/shared/Navigation';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="signal-line h-px w-full" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          className="flex items-center gap-3 font-heading text-lg font-bold"
          href="/"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/70 bg-primary/10 font-mono text-xs text-primary shadow-[0_0_22px_rgba(45,212,191,0.18)]">
            DS
          </span>
          <span className="hidden sm:inline">
            Deepak <span className="text-primary">Sahu</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Navigation />
          <ThemeToggle />
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
