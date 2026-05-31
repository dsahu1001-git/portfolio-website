import { NextResponse } from 'next/server';
import { z } from 'zod';

const scoreSchema = z.object({
  game: z.string().min(1),
  playerName: z.string().min(1).max(40),
  score: z.number().int().nonnegative(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = scoreSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    saved: false,
    reason: 'Supabase is not configured yet.',
  });
}
