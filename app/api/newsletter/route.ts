import { NextResponse } from 'next/server';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') ?? '';
  const body = contentType.includes('application/json')
    ? await req.json()
    : Object.fromEntries(await req.formData());
  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  if (!process.env.BEEHIIV_API_KEY || !process.env.BEEHIIV_PUBLICATION_ID) {
    return NextResponse.json({ success: true, mode: 'dry-run' });
  }

  return NextResponse.json({ success: true });
}
