import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-4 py-24">
      <p className="font-mono text-sm text-primary">404</p>
      <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
        This page is still being provisioned.
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The route exists in spirit, but the content is not live yet. Head back
        to the homepage or explore the blog.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild href="/">
          Home
        </Button>
        <Button asChild href="/blog" variant="outline">
          Blog
        </Button>
      </div>
    </section>
  );
}
