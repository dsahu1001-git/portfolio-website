'use client';

import { Button } from '@/components/ui/Button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="systems-grid mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-4 py-24">
      <div className="liquid-card w-full rounded-2xl border border-border p-8 sm:p-12">
        <p className="font-mono text-sm text-primary">System exception</p>
        <h1 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">
          The page could not render.
        </h1>
        <p className="mt-4 text-muted-foreground">{error.message}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button onClick={reset} type="button">
            Try again
          </Button>
          <a
            href="mailto:hello@deepaksahu.dev?subject=Site%20Issue%20Report"
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-semibold text-muted-foreground backdrop-blur-xl transition-all hover:border-primary/70 hover:bg-white/[0.075] hover:text-foreground"
          >
            Report issue
          </a>
        </div>
      </div>
    </div>
  );
}