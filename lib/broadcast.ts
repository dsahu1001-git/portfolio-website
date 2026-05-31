import { getRuntimeValue } from '@/lib/cloudflare';
import type { NewsletterEdition } from '@/lib/newsletter-content';

function getResendApiKey() {
  return getRuntimeValue('RESEND_API_KEY');
}

export async function createNewsletterBroadcast(
  edition: NewsletterEdition,
  send: boolean,
) {
  const apiKey = getResendApiKey();
  const segmentId = getRuntimeValue('RESEND_NEWSLETTER_SEGMENT_ID');

  if (!apiKey || !segmentId) {
    return {
      mode: 'dry-run' as const,
      message: 'Resend API key or newsletter segment is not configured.',
    };
  }

  const archiveUrl = new URL(
    `/newsletter/${edition.slug}`,
    getRuntimeValue('NEXT_PUBLIC_SITE_URL') ?? 'https://deepaksahu.dev',
  ).toString();
  const html = `${edition.html}
    <hr />
    <p><a href="${archiveUrl}">Read this edition on the web</a></p>
    <p><a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a></p>`;
  const response = await fetch('https://api.resend.com/broadcasts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      segmentId,
      from:
        getRuntimeValue('NEWSLETTER_FROM') ??
        'Deep Signals <newsletter@newsletter.deepaksahu.dev>',
      name: edition.title,
      subject: edition.subject,
      html,
      send,
    }),
  });

  if (!response.ok) {
    throw new Error(`Unable to create broadcast: ${response.status}`);
  }

  return {
    mode: 'live' as const,
    broadcast: (await response.json()) as Record<string, unknown>,
  };
}
