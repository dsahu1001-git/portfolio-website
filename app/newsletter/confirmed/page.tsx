import { Button } from '@/components/ui/Button';

interface ConfirmedPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function ConfirmedPage({
  searchParams,
}: ConfirmedPageProps) {
  const { status } = await searchParams;
  const isInvalid = status === 'invalid';

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="font-mono text-sm text-primary">Deep Signals</p>
      <h1 className="mt-3 font-heading text-4xl font-bold">
        {isInvalid ? 'That confirmation link is no longer valid.' : 'You are subscribed.'}
      </h1>
      <p className="mt-4 leading-7 text-muted-foreground">
        {isInvalid
          ? 'Request a fresh link from the newsletter signup form.'
          : 'Your weekly AI and quantum briefing will arrive after each reviewed edition is published.'}
      </p>
      <Button asChild className="mt-7" href="/">
        Back home
      </Button>
    </section>
  );
}
