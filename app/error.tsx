'use client';

import { Button } from '@/components/ui/Button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-4 py-24">
      <p className="font-mono text-sm text-primary">Something broke</p>
      <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight">
        The page could not render.
      </h1>
      <p className="mt-4 text-muted-foreground">{error.message}</p>
      <Button className="mt-8" onClick={reset} type="button">
        Try again
      </Button>
    </section>
  );
}
