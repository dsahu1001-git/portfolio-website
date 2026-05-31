import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { getRuntimeValue } from '@/lib/cloudflare';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(160),
  message: z.string().min(10).max(5000),
});

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') ?? '';
  const body = contentType.includes('application/json')
    ? await req.json()
    : Object.fromEntries(await req.formData());
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid contact submission' },
      { status: 400 },
    );
  }

  const apiKey = getRuntimeValue('RESEND_API_KEY');

  if (!apiKey) {
    return NextResponse.json({ success: true, mode: 'dry-run' });
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from:
      getRuntimeValue('CONTACT_FROM') ??
      'Portfolio <contact@newsletter.deepaksahu.dev>',
    to: getRuntimeValue('CONTACT_TO') ?? 'hello@deepaksahu.dev',
    subject: parsed.data.subject,
    reply_to: parsed.data.email,
    text: `${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
  });

  return NextResponse.json({ success: true });
}
