import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { newsletterTopics, subscribe } from '@/lib/newsletter';

const newsletterSchema = z.object({
  email: z.string().email(),
  topics: z
    .array(z.enum(newsletterTopics))
    .min(1, 'Choose at least one topic.')
    .default(['ai', 'quantum']),
});

export async function POST(req: Request) {
  const rateLimit = await checkRateLimit(req);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } },
    );
  }

  const contentType = req.headers.get('content-type') ?? '';
  const rawBody = contentType.includes('application/json')
    ? await req.json()
    : Object.fromEntries(await req.formData());
  const body = {
    ...rawBody,
    topics: Array.isArray(rawBody.topics)
      ? rawBody.topics
      : typeof rawBody.topics === 'string'
        ? rawBody.topics.split(',')
        : ['ai', 'quantum'],
  };
  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid subscription' },
      { status: 400 },
    );
  }

  const result = await subscribe({
    ...parsed.data,
    source: 'portfolio',
  });

  return NextResponse.json({ success: true, ...result });
}
