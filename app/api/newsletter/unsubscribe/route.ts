import { NextResponse } from 'next/server';
import { unsubscribe } from '@/lib/newsletter';

export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const token = requestUrl.searchParams.get('token');
  const redirectUrl = new URL('/newsletter/unsubscribed', requestUrl);

  if (!token || !(await unsubscribe({ token }))) {
    redirectUrl.searchParams.set('status', 'invalid');
  }

  return NextResponse.redirect(redirectUrl);
}
