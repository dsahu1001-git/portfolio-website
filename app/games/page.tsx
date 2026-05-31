import Link from 'next/link';
import type { Metadata } from 'next';
import { Gamepad2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { createMetadata } from '@/lib/seo';
import type { GameSummary } from '@/types/game';

export const metadata: Metadata = createMetadata({
  title: 'Games',
  description: 'Small browser games that add a little engagement to the site.',
  path: '/games',
});

const games: GameSummary[] = [
  {
    slug: 'connections-india',
    title: 'Connections India',
    description:
      'A daily word grouping game with Indian cultural, tech, sports, and food references.',
    status: 'available',
    audience: 'Indian mobile-first audience',
  },
];

export default function GamesPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-sm text-primary">Games</p>
      <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
        Small interactive extras for visitors who want to play for a minute.
      </h1>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {games.map((game) => (
          <Card className="hover:shadow-md" key={game.slug}>
            <CardHeader>
              <Gamepad2 className="h-8 w-8 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-heading text-2xl font-bold">
                {game.title}
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{game.description}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Status: {game.status}
              </p>
              <Link
                className="mt-5 inline-flex text-sm font-semibold text-primary hover:underline"
                href={`/games/${game.slug}`}
              >
                Play sample
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
