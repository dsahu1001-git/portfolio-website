import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(160),
  message: z.string().min(10).max(5000),
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid contact submission' },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ success: true, mode: 'dry-run' });
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: 'Portfolio <onboarding@resend.dev>',
    to: 'hello@deepaksahu.dev',
    subject: parsed.data.subject,
    reply_to: parsed.data.email,
    text: `${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
  });

  return NextResponse.json({ success: true });
}
