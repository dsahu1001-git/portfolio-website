import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { getCloudflareBindings } from '@/lib/cloudflare';

const scoreSchema = z.object({
  game: z.string().min(1),
  playerName: z.string().min(1).max(40),
  score: z.number().int().nonnegative(),
});

export async function POST(req: Request) {
  const rateLimit = await checkRateLimit(req);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } },
    );
  }

  const body = await req.json();
  const parsed = scoreSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
  }

  const database = getCloudflareBindings().NEWSLETTER_DB;

  if (!database) {
    return NextResponse.json({
      success: true,
      saved: false,
      reason: 'Score storage is not configured in this environment.',
    });
  }

  await database
    .prepare(
      `INSERT INTO game_scores (game, player_name, score, completed_at)
       VALUES (?, ?, ?, ?)`,
    )
    .bind(
      parsed.data.game,
      parsed.data.playerName,
      parsed.data.score,
      new Date().toISOString(),
    )
    .run();

  return NextResponse.json({ success: true, saved: true });
}
