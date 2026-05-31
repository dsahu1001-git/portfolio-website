import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    game: 'connections-india',
    date: new Date().toISOString().slice(0, 10),
    status: 'planned',
    groups: [],
  });
}
