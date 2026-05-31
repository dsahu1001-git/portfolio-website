import { Button } from '@/components/ui/Button';

interface UnsubscribedPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function UnsubscribedPage({
  searchParams,
}: UnsubscribedPageProps) {
  const { status } = await searchParams;
  const isInvalid = status === 'invalid';

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="font-mono text-sm text-primary">Deep Signals</p>
      <h1 className="mt-3 font-heading text-4xl font-bold">
        {isInvalid ? 'That unsubscribe link is no longer valid.' : 'You are unsubscribed.'}
      </h1>
      <p className="mt-4 leading-7 text-muted-foreground">
        {isInvalid
          ? 'The link may have expired or already been used.'
          : 'You will no longer receive the weekly newsletter. You can join again at any time.'}
      </p>
      <Button asChild className="mt-7" href="/">
        Back home
      </Button>
    </section>
  );
}
