import { getCloudflareBindings, getRuntimeValue } from '@/lib/cloudflare';

export const newsletterTopics = ['ai', 'quantum'] as const;

export type NewsletterTopic = (typeof newsletterTopics)[number];

interface SubscriberRow {
  email: string;
  status: 'pending' | 'active' | 'unsubscribed';
}

interface SubscribeInput {
  email: string;
  topics: NewsletterTopic[];
  source: string;
}

interface ConfirmInput {
  token: string;
}

class ResendApiError extends Error {
  constructor(public status: number) {
    super(`Resend request failed with status ${status}.`);
  }
}

export interface NewsletterResult {
  mode: 'live' | 'dry-run';
  message: string;
  previewUrl?: string;
}

function getDatabase() {
  return getCloudflareBindings().NEWSLETTER_DB;
}

function getSiteUrl() {
  return getRuntimeValue('NEXT_PUBLIC_SITE_URL') ?? 'http://localhost:3000';
}

function getNewsletterFrom() {
  return (
    getRuntimeValue('NEWSLETTER_FROM') ??
    'Deep Signals <newsletter@newsletter.deepaksahu.dev>'
  );
}

function getResendApiKey() {
  return getRuntimeValue('RESEND_API_KEY');
}

function getResendTopicId(topic: NewsletterTopic) {
  return getRuntimeValue(`RESEND_TOPIC_${topic.toUpperCase()}_ID`);
}

async function hashToken(token: string) {
  const encoded = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest('SHA-256', encoded);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function createToken() {
  return `${crypto.randomUUID()}${crypto.randomUUID()}`.replaceAll('-', '');
}

function buildActionUrl(path: string, token: string) {
  const url = new URL(path, getSiteUrl());
  url.searchParams.set('token', token);
  return url.toString();
}

function getTopicSubscriptions(topics: NewsletterTopic[]) {
  return newsletterTopics.flatMap((topic) => {
    const id = getResendTopicId(topic);

    return id
      ? [{ id, subscription: topics.includes(topic) ? 'opt_in' : 'opt_out' }]
      : [];
  });
}

async function resendRequest(path: string, init: RequestInit) {
  const apiKey = getResendApiKey();

  if (!apiKey) {
    return null;
  }

  const response = await fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new ResendApiError(response.status);
  }

  return response.json() as Promise<Record<string, unknown>>;
}

async function sendConfirmationEmail(email: string, confirmationUrl: string) {
  return resendRequest('/emails', {
    method: 'POST',
    body: JSON.stringify({
      from: getNewsletterFrom(),
      to: [email],
      subject: 'Confirm your Deep Signals subscription',
      text: `Confirm your weekly AI and quantum newsletter subscription:\n\n${confirmationUrl}\n\nIf you did not request this, ignore this email.`,
      html: `<p>Confirm your weekly AI and quantum newsletter subscription.</p><p><a href="${confirmationUrl}">Confirm subscription</a></p><p>If you did not request this, ignore this email.</p>`,
    }),
  });
}

async function syncResendContact(email: string, topics: NewsletterTopic[]) {
  const segmentId = getRuntimeValue('RESEND_NEWSLETTER_SEGMENT_ID');
  const topicSubscriptions = getTopicSubscriptions(topics);

  try {
    return await resendRequest('/contacts', {
      method: 'POST',
      body: JSON.stringify({
        email,
        unsubscribed: false,
        segments: segmentId ? [{ id: segmentId }] : [],
        topics: topicSubscriptions,
      }),
    });
  } catch (error) {
    if (!(error instanceof ResendApiError) || error.status !== 409) {
      throw error;
    }
  }

  await resendRequest(`/contacts/${encodeURIComponent(email)}`, {
    method: 'PATCH',
    body: JSON.stringify({ unsubscribed: false }),
  });

  if (topicSubscriptions.length > 0) {
    await resendRequest(`/contacts/${encodeURIComponent(email)}/topics`, {
      method: 'PATCH',
      body: JSON.stringify({ topics: topicSubscriptions }),
    });
  }

  if (segmentId) {
    await resendRequest(
      `/contacts/${encodeURIComponent(email)}/segments/${encodeURIComponent(segmentId)}`,
      { method: 'POST' },
    );
  }

  return null;
}

async function unsubscribeResendContact(email: string) {
  return resendRequest(`/contacts/${encodeURIComponent(email)}`, {
    method: 'PATCH',
    body: JSON.stringify({ unsubscribed: true }),
  });
}

export async function subscribe({
  email,
  topics,
  source,
}: SubscribeInput): Promise<NewsletterResult> {
  const database = getDatabase();
  const token = createToken();
  const tokenHash = await hashToken(token);
  const confirmationUrl = buildActionUrl('/api/newsletter/confirm', token);

  if (!database) {
    return {
      mode: 'dry-run',
      message:
        'Newsletter storage is not configured. Use the preview confirmation link while developing locally.',
      previewUrl: confirmationUrl,
    };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const createdAt = new Date().toISOString();

  await database
    .prepare(
      `INSERT INTO subscribers (email, status, confirmation_token_hash, source, consent_version, created_at, updated_at)
       VALUES (?, 'pending', ?, ?, '2026-05-31', ?, ?)
       ON CONFLICT(email) DO UPDATE SET
         status = 'pending',
         confirmation_token_hash = excluded.confirmation_token_hash,
         source = excluded.source,
         updated_at = excluded.updated_at`,
    )
    .bind(normalizedEmail, tokenHash, source, createdAt, createdAt)
    .run();

  await database
    .prepare('DELETE FROM subscriber_topics WHERE subscriber_email = ?')
    .bind(normalizedEmail)
    .run();

  for (const topic of topics) {
    await database
      .prepare(
        `INSERT INTO subscriber_topics (subscriber_email, topic, enabled, updated_at)
         VALUES (?, ?, 1, ?)
         ON CONFLICT(subscriber_email, topic) DO UPDATE SET enabled = 1, updated_at = excluded.updated_at`,
      )
      .bind(normalizedEmail, topic, createdAt)
      .run();
  }

  await database
    .prepare(
      `INSERT INTO consent_events (subscriber_email, event_type, metadata, occurred_at)
       VALUES (?, 'subscription_requested', ?, ?)`,
    )
    .bind(normalizedEmail, JSON.stringify({ topics, source }), createdAt)
    .run();

  await sendConfirmationEmail(normalizedEmail, confirmationUrl);

  return {
    mode: getResendApiKey() ? 'live' : 'dry-run',
    message: getResendApiKey()
      ? 'Check your inbox and confirm your subscription.'
      : 'Subscription saved. Email delivery is not configured yet.',
    previewUrl: getResendApiKey() ? undefined : confirmationUrl,
  };
}

async function getSubscriberByToken(
  token: string,
  purpose: 'confirmation' | 'unsubscribe',
) {
  const database = getDatabase();

  if (!database) {
    return null;
  }

  const tokenColumn =
    purpose === 'confirmation'
      ? 'confirmation_token_hash'
      : 'unsubscribe_token_hash';

  return database
    .prepare(
      `SELECT email, status
       FROM subscribers
       WHERE ${tokenColumn} = ?`,
    )
    .bind(await hashToken(token))
    .first<SubscriberRow>();
}

async function getEnabledTopics(email: string) {
  const database = getDatabase();

  if (!database) {
    return [];
  }

  const rows: NewsletterTopic[] = [];

  for (const topic of newsletterTopics) {
    const row = await database
      .prepare(
        `SELECT topic FROM subscriber_topics
         WHERE subscriber_email = ? AND topic = ? AND enabled = 1`,
      )
      .bind(email, topic)
      .first<{ topic: NewsletterTopic }>();

    if (row) {
      rows.push(row.topic);
    }
  }

  return rows;
}

export async function confirmSubscription({ token }: ConfirmInput) {
  const database = getDatabase();
  const subscriber = await getSubscriberByToken(token, 'confirmation');

  if (!database || !subscriber) {
    return false;
  }

  const now = new Date().toISOString();
  const unsubscribeToken = createToken();

  await database
    .prepare(
      `UPDATE subscribers
       SET status = 'active',
           confirmed_at = ?,
           unsubscribe_token_hash = ?,
           confirmation_token_hash = NULL,
           updated_at = ?
       WHERE email = ?`,
    )
    .bind(now, await hashToken(unsubscribeToken), now, subscriber.email)
    .run();

  await database
    .prepare(
      `INSERT INTO consent_events (subscriber_email, event_type, metadata, occurred_at)
       VALUES (?, 'subscription_confirmed', '{}', ?)`,
    )
    .bind(subscriber.email, now)
    .run();

  await syncResendContact(subscriber.email, await getEnabledTopics(subscriber.email));
  return true;
}

export async function unsubscribe({ token }: ConfirmInput) {
  const database = getDatabase();
  const subscriber = await getSubscriberByToken(token, 'unsubscribe');

  if (!database || !subscriber) {
    return false;
  }

  const now = new Date().toISOString();

  await database
    .prepare(
      `UPDATE subscribers SET status = 'unsubscribed', updated_at = ?
       WHERE email = ?`,
    )
    .bind(now, subscriber.email)
    .run();

  await database
    .prepare(
      `INSERT INTO consent_events (subscriber_email, event_type, metadata, occurred_at)
       VALUES (?, 'unsubscribed', '{}', ?)`,
    )
    .bind(subscriber.email, now)
    .run();

  await unsubscribeResendContact(subscriber.email);
  return true;
}
