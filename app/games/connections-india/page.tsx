import type { Metadata } from 'next';
import { ConnectionsIndiaGame } from '@/components/games/connections/ConnectionsIndiaGame';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Connections India',
  description:
    'Play a sample Connections-style word grouping game with India-focused clues.',
  path: '/games/connections-india',
});

export default function ConnectionsIndiaPage() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <ConnectionsIndiaGame />
    </section>
  );
}
