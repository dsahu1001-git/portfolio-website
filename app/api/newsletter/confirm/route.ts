import { NextResponse } from 'next/server';
import { confirmSubscription } from '@/lib/newsletter';

export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const token = requestUrl.searchParams.get('token');
  const redirectUrl = new URL('/newsletter/confirmed', requestUrl);

  if (!token || !(await confirmSubscription({ token }))) {
    redirectUrl.searchParams.set('status', 'invalid');
  }

  return NextResponse.redirect(redirectUrl);
}
