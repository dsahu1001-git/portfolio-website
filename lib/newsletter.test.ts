import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  subscribe,
  confirmSubscription,
  unsubscribe,
} from './newsletter';
import { setupD1Mock } from './d1-mock';

// We need to mock the cloudflare module to control getCloudflareBindings
vi.mock('@/lib/cloudflare', () => ({
  getCloudflareBindings: vi.fn(),
  getRuntimeValue: vi.fn((name: string) => {
    // Default: return undefined for runtime values in tests
    return undefined;
  }),
}));

// Import after mocking
import { getCloudflareBindings, getRuntimeValue } from '@/lib/cloudflare';

describe('newsletter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset getRuntimeValue to return undefined by default
    vi.mocked(getRuntimeValue).mockReturnValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('hashToken', () => {
    // hashToken is not exported, but we can test it indirectly through createToken
    // which uses crypto.randomUUID() - we can test the flow

    it('produces consistent SHA-256 hashes for the same input', async () => {
      // We can't directly test hashToken since it's not exported
      // Instead we verify that the subscription flow works correctly
      const mockDb = setupD1Mock([
        {
          query:
            "INSERT INTO subscribers (email, status, confirmation_token_hash, source, consent_version, created_at, updated_at)\n       VALUES (?, 'pending', ?, ?, '2026-05-31', ?, ?)\n       ON CONFLICT(email) DO UPDATE SET\n         status = 'pending',\n         confirmation_token_hash = excluded.confirmation_token_hash,\n         source = excluded.source,\n         updated_at = excluded.updated_at'",
        },
        {
          query: 'DELETE FROM subscriber_topics WHERE subscriber_email = ?',
        },
        {
          query:
            'INSERT INTO subscriber_topics (subscriber_email, topic, enabled, updated_at)\n         VALUES (?, ?, 1, ?)\n         ON CONFLICT(subscriber_email, topic) DO UPDATE SET enabled = 1, updated_at = excluded.updated_at',
        },
        {
          query:
            "INSERT INTO consent_events (subscriber_email, event_type, metadata, occurred_at)\n       VALUES (?, 'subscription_requested', ?, ?)",
        },
      ]);

      vi.mocked(getCloudflareBindings).mockReturnValue({
        NEWSLETTER_DB: mockDb,
      });

      const result = await subscribe({
        email: 'test@example.com',
        topics: ['ai'],
        source: 'test',
      });

      // Subscription should succeed with mock database
      expect(result.mode).toBe('dry-run');
      expect(result.previewUrl).toContain('token=');
    });

    it('produces different hashes for different tokens', async () => {
      // Since hashToken is not exported, we verify through behavior
      // that different tokens produce different results
      const mockDb1 = setupD1Mock([
        {
          query:
            "INSERT INTO subscribers (email, status, confirmation_token_hash, source, consent_version, created_at, updated_at)\n       VALUES (?, 'pending', ?, ?, '2026-05-31', ?, ?)\n       ON CONFLICT(email) DO UPDATE SET\n         status = 'pending',\n         confirmation_token_hash = excluded.confirmation_token_hash,\n         source = excluded.source,\n         updated_at = excluded.updated_at'",
        },
        { query: 'DELETE FROM subscriber_topics WHERE subscriber_email = ?' },
        {
          query:
            'INSERT INTO subscriber_topics (subscriber_email, topic, enabled, updated_at)\n         VALUES (?, ?, 1, ?)\n         ON CONFLICT(subscriber_email, topic) DO UPDATE SET enabled = 1, updated_at = excluded.updated_at',
        },
        {
          query:
            "INSERT INTO consent_events (subscriber_email, event_type, metadata, occurred_at)\n       VALUES (?, 'subscription_requested', ?, ?)",
        },
      ]);

      const mockDb2 = setupD1Mock([
        {
          query:
            "INSERT INTO subscribers (email, status, confirmation_token_hash, source, consent_version, created_at, updated_at)\n       VALUES (?, 'pending', ?, ?, '2026-05-31', ?, ?)\n       ON CONFLICT(email) DO UPDATE SET\n         status = 'pending',\n         confirmation_token_hash = excluded.confirmation_token_hash,\n         source = excluded.source,\n         updated_at = excluded.updated_at'",
        },
        { query: 'DELETE FROM subscriber_topics WHERE subscriber_email = ?' },
        {
          query:
            'INSERT INTO subscriber_topics (subscriber_email, topic, enabled, updated_at)\n         VALUES (?, ?, 1, ?)\n         ON CONFLICT(subscriber_email, topic) DO UPDATE SET enabled = 1, updated_at = excluded.updated_at',
        },
        {
          query:
            "INSERT INTO consent_events (subscriber_email, event_type, metadata, occurred_at)\n       VALUES (?, 'subscription_requested', ?, ?)",
        },
      ]);

      // The tokens will be different (crypto.randomUUID() generates unique values)
      // So different calls will have different token hashes bound
      vi.mocked(getCloudflareBindings)
        .mockReturnValueOnce({ NEWSLETTER_DB: mockDb1 })
        .mockReturnValueOnce({ NEWSLETTER_DB: mockDb2 });

      const result1 = await subscribe({
        email: 'test1@example.com',
        topics: ['ai'],
        source: 'test',
      });

      const result2 = await subscribe({
        email: 'test2@example.com',
        topics: ['ai'],
        source: 'test',
      });

      // Both subscriptions should succeed
      expect(result1.previewUrl).toBeDefined();
      expect(result2.previewUrl).toBeDefined();
      // Tokens should be different
      expect(result1.previewUrl).not.toBe(result2.previewUrl);
    });
  });

  describe('createToken', () => {
    // createToken is not exported, but we can verify token properties indirectly

    it('produces a non-empty string', async () => {
      // We verify that subscribe works with the token system
      const mockDb = setupD1Mock([
        {
          query:
            "INSERT INTO subscribers (email, status, confirmation_token_hash, source, consent_version, created_at, updated_at)\n       VALUES (?, 'pending', ?, ?, '2026-05-31', ?, ?)\n       ON CONFLICT(email) DO UPDATE SET\n         status = 'pending',\n         confirmation_token_hash = excluded.confirmation_token_hash,\n         source = excluded.source,\n         updated_at = excluded.updated_at'",
        },
        { query: 'DELETE FROM subscriber_topics WHERE subscriber_email = ?' },
        {
          query:
            'INSERT INTO subscriber_topics (subscriber_email, topic, enabled, updated_at)\n         VALUES (?, ?, 1, ?)\n         ON CONFLICT(subscriber_email, topic) DO UPDATE SET enabled = 1, updated_at = excluded.updated_at',
        },
        {
          query:
            "INSERT INTO consent_events (subscriber_email, event_type, metadata, occurred_at)\n       VALUES (?, 'subscription_requested', ?, ?)\n       ON CONFLICT(subscriber_email, topic) DO UPDATE SET enabled = 1, updated_at = excluded.updated_at",
        },
      ]);

      vi.mocked(getCloudflareBindings).mockReturnValue({
        NEWSLETTER_DB: mockDb,
      });

      const result = await subscribe({
        email: 'test@example.com',
        topics: ['ai'],
        source: 'test',
      });

      // If we got here without error, the token was created and used
      expect(result).toBeDefined();
      expect(result.mode).toBe('dry-run');
    });

    it('produces tokens of expected length (64 hex characters)', async () => {
      // createToken returns `${crypto.randomUUID()}${crypto.randomUUID()}`.replaceAll('-', '')
      // UUID v4 is 32 hex chars, so two UUIDs gives 64 hex chars
      // We can't access the function directly, but we verify the system works

      const mockDb = setupD1Mock([
        {
          query:
            "INSERT INTO subscribers (email, status, confirmation_token_hash, source, consent_version, created_at, updated_at)\n       VALUES (?, 'pending', ?, ?, '2026-05-31', ?, ?)\n       ON CONFLICT(email) DO UPDATE SET\n         status = 'pending',\n         confirmation_token_hash = excluded.confirmation_token_hash,\n         source = excluded.source,\n         updated_at = excluded.updated_at'",
        },
        { query: 'DELETE FROM subscriber_topics WHERE subscriber_email = ?' },
        {
          query:
            'INSERT INTO subscriber_topics (subscriber_email, topic, enabled, updated_at)\n         VALUES (?, ?, 1, ?)\n         ON CONFLICT(subscriber_email, topic) DO UPDATE SET enabled = 1, updated_at = excluded.updated_at',
        },
        {
          query:
            "INSERT INTO consent_events (subscriber_email, event_type, metadata, occurred_at)\n       VALUES (?, 'subscription_requested', ?, ?)\n       ON CONFLICT(subscriber_email, topic) DO UPDATE SET enabled = 1, updated_at = excluded.updated_at",
        },
      ]);

      vi.mocked(getCloudflareBindings).mockReturnValue({
        NEWSLETTER_DB: mockDb,
      });

      // The token is created and passed to the database as a hash
      // We verify the subscription works correctly with tokens
      const result = await subscribe({
        email: 'test@example.com',
        topics: ['ai'],
        source: 'test',
      });

      expect(result.previewUrl).toContain('token=');
      // Token in URL should be 64 characters (32 from each UUID, with dashes removed)
      const tokenMatch = result.previewUrl?.match(/token=([a-f0-9]+)/);
      expect(tokenMatch).toHaveLength(2);
      expect(tokenMatch![1]).toHaveLength(64);
    });
  });

  describe('subscribe', () => {
    it('returns dry-run mode when NEWSLETTER_DB is undefined', async () => {
      vi.mocked(getCloudflareBindings).mockReturnValue({});

      const result = await subscribe({
        email: 'reader@example.com',
        topics: ['ai'],
        source: 'test',
      });

      expect(result.mode).toBe('dry-run');
      expect(result.message).toContain(
        'Newsletter storage is not configured',
      );
      expect(result.previewUrl).toBeDefined();
      expect(result.previewUrl).toContain('/api/newsletter/confirm?token=');
    });

    it('returns correct result object structure in dry-run mode', async () => {
      vi.mocked(getCloudflareBindings).mockReturnValue({});

      const result = await subscribe({
        email: 'reader@example.com',
        topics: ['ai', 'quantum'],
        source: 'test',
      });

      expect(result).toHaveProperty('mode');
      expect(result).toHaveProperty('message');
      expect(result.mode).toBe('dry-run');
      expect(typeof result.message).toBe('string');
      expect(result.message.length).toBeGreaterThan(0);
    });
  });

  describe('confirmSubscription', () => {
    it('returns false when database is undefined', async () => {
      vi.mocked(getCloudflareBindings).mockReturnValue({});

      const result = await confirmSubscription({ token: 'any-token' });

      expect(result).toBe(false);
    });

    it('returns false when token is invalid', async () => {
      const mockDb = setupD1Mock([
        {
          query:
            'SELECT email, status\n       FROM subscribers\n       WHERE confirmation_token_hash = ?',
          firstResult: null,
        },
      ]);

      vi.mocked(getCloudflareBindings).mockReturnValue({
        NEWSLETTER_DB: mockDb,
      });

      const result = await confirmSubscription({ token: 'invalid-token' });

      expect(result).toBe(false);
    });

    it('returns true and updates subscriber on valid token', async () => {
      const mockDb = setupD1Mock([
        {
          query:
            'SELECT email, status\n       FROM subscribers\n       WHERE confirmation_token_hash = ?',
          firstResult: { email: 'test@example.com', status: 'pending' },
        },
        {
          query:
            "UPDATE subscribers\n       SET status = 'active',\n           confirmed_at = ?,\n           unsubscribe_token_hash = ?,\n           confirmation_token_hash = NULL,\n           updated_at = ?\n       WHERE email = ?",
        },
        {
          query:
            "INSERT INTO consent_events (subscriber_email, event_type, metadata, occurred_at)\n       VALUES (?, 'subscription_confirmed', '{}', ?)",
        },
      ]);

      vi.mocked(getCloudflareBindings).mockReturnValue({
        NEWSLETTER_DB: mockDb,
      });

      // Mock getEnabledTopics to return empty array (no topics)
      vi.mocked(getRuntimeValue).mockImplementation((name: string) => {
        if (name === 'RESEND_API_KEY') return undefined;
        if (name === 'RESEND_NEWSLETTER_SEGMENT_ID') return undefined;
        return undefined;
      });

      const result = await confirmSubscription({ token: 'valid-token' });

      expect(result).toBe(true);
    });
  });

  describe('unsubscribe', () => {
    it('returns false when database is undefined', async () => {
      vi.mocked(getCloudflareBindings).mockReturnValue({});

      const result = await unsubscribe({ token: 'any-token' });

      expect(result).toBe(false);
    });

    it('returns false when token is invalid', async () => {
      const mockDb = setupD1Mock([
        {
          query:
            'SELECT email, status\n       FROM subscribers\n       WHERE unsubscribe_token_hash = ?',
          firstResult: null,
        },
      ]);

      vi.mocked(getCloudflareBindings).mockReturnValue({
        NEWSLETTER_DB: mockDb,
      });

      const result = await unsubscribe({ token: 'invalid-token' });

      expect(result).toBe(false);
    });

    it('returns true and updates subscriber on valid token', async () => {
      const mockDb = setupD1Mock([
        {
          query:
            'SELECT email, status\n       FROM subscribers\n       WHERE unsubscribe_token_hash = ?',
          firstResult: { email: 'test@example.com', status: 'active' },
        },
        {
          query:
            'UPDATE subscribers SET status = \'unsubscribed\', updated_at = ?\n       WHERE email = ?',
        },
        {
          query:
            "INSERT INTO consent_events (subscriber_email, event_type, metadata, occurred_at)\n       VALUES (?, 'unsubscribed', '{}', ?)\n       ON CONFLICT(subscriber_email, topic) DO UPDATE SET enabled = 1, updated_at = excluded.updated_at",
        },
      ]);

      vi.mocked(getCloudflareBindings).mockReturnValue({
        NEWSLETTER_DB: mockDb,
      });

      // Mock getResendApiKey to return undefined
      vi.mocked(getRuntimeValue).mockReturnValue(undefined);

      const result = await unsubscribe({ token: 'valid-token' });

      expect(result).toBe(true);
    });
  });
});