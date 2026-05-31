import { NextResponse } from 'next/server';
import { connectionsIndiaGroups } from '@/lib/connections-india';

export async function GET() {
  return NextResponse.json({
    game: 'connections-india',
    date: new Date().toISOString().slice(0, 10),
    status: 'available',
    groups: connectionsIndiaGroups.map(({ name, description, words }) => ({
      name,
      description,
      words,
    })),
  });
}
