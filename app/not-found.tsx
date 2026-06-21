import Link from 'next/link';

import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="systems-grid mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-24">
      <div className="liquid-card w-full rounded-2xl border border-border p-8 text-center sm:p-12">
        <p className="liquid-metal-text font-mono text-8xl font-bold tracking-tight sm:text-9xl">
          404
        </p>
        <h1 className="mt-6 font-heading text-2xl font-bold sm:text-3xl">
          This page is still being provisioned.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The route exists in spirit, but the content is not live yet.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild href="/">
            Home
          </Button>
          <Button asChild href="/blog" variant="outline">
            Blog
          </Button>
          <Button asChild href="/newsletter" variant="outline">
            Newsletter
          </Button>
        </div>
        <div className="mt-10">
          <p className="text-sm text-muted-foreground">
            Looking for something specific?
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link
              href="/blog"
              className="text-primary underline-offset-4 hover:text-primary/80 hover:underline"
            >
              Browse articles
            </Link>
            <Link
              href="/work"
              className="text-primary underline-offset-4 hover:text-primary/80 hover:underline"
            >
              View work
            </Link>
            <Link
              href="/newsletter"
              className="text-primary underline-offset-4 hover:text-primary/80 hover:underline"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}