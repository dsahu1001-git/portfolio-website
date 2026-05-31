import { NextResponse } from 'next/server';

function getAllowedHosts() {
  return new Set(
    (process.env.ALLOWED_AFFILIATE_HOSTS ?? 'example.com')
      .split(',')
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const affiliateUrl = url.searchParams.get('url');

  if (!affiliateUrl) {
    return NextResponse.json(
      { error: 'Missing affiliate URL' },
      { status: 400 },
    );
  }

  let parsed: URL;

  try {
    parsed = new URL(affiliateUrl);
  } catch {
    return NextResponse.json(
      { error: 'Invalid affiliate URL' },
      { status: 400 },
    );
  }

  if (parsed.protocol !== 'https:') {
    return NextResponse.json(
      { error: 'Invalid affiliate URL' },
      { status: 400 },
    );
  }

  if (!getAllowedHosts().has(parsed.hostname.toLowerCase())) {
    return NextResponse.json(
      { error: 'Affiliate host is not allowed' },
      { status: 400 },
    );
  }

  return NextResponse.redirect(parsed);
}
