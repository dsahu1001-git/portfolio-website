import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { createNewsletterBroadcast } from '@/lib/broadcast';
import { getRuntimeValue } from '@/lib/cloudflare';
import { getNewsletterEdition } from '@/lib/newsletter-content';

const broadcastSchema = z.object({
  slug: z.string().min(1),
  send: z.boolean().default(false),
});

export async function POST(req: Request) {
  const rateLimit = await checkRateLimit(req);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } },
    );
  }

  const expectedToken = getRuntimeValue('NEWSLETTER_ADMIN_TOKEN');
  const suppliedToken = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!expectedToken || suppliedToken !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = broadcastSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid broadcast' }, { status: 400 });
  }

  const edition = await getNewsletterEdition(parsed.data.slug);

  if (!edition) {
    return NextResponse.json({ error: 'Edition not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    ...(await createNewsletterBroadcast(edition, parsed.data.send)),
  });
}
