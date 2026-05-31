import { expect, test } from '@playwright/test';

test('newsletter rejects invalid email', async ({ request }) => {
  const response = await request.post('/api/newsletter', {
    data: { email: 'not-an-email', topics: ['ai'] },
  });

  expect(response.status()).toBe(400);
});

test('newsletter requires at least one topic', async ({ request }) => {
  const response = await request.post('/api/newsletter', {
    data: { email: 'reader@example.com', topics: [] },
  });

  expect(response.status()).toBe(400);
});

test('broadcast endpoint is protected', async ({ request }) => {
  const response = await request.post('/api/newsletter/broadcast', {
    data: { slug: 'welcome-to-deep-signals', send: false },
  });

  expect(response.status()).toBe(401);
});

test('affiliate redirect rejects unapproved hosts', async ({ request }) => {
  const response = await request.get(
    '/api/affiliate?url=https%3A%2F%2Fevil.example%2Fproduct',
  );

  expect(response.status()).toBe(400);
});

test('game puzzle endpoint returns a stable shape', async ({ request }) => {
  const response = await request.get('/api/game/puzzle');
  const json = (await response.json()) as Record<string, unknown>;

  expect(response.ok()).toBeTruthy();
  expect(json.game).toBe('connections-india');
  expect(json.status).toBe('available');
  expect(json.groups).toHaveLength(4);
});

test('game score validates and accepts a completion', async ({ request }) => {
  const response = await request.post('/api/game/score', {
    data: { game: 'connections-india', playerName: 'Browser Test', score: 4 },
  });
  const json = (await response.json()) as Record<string, unknown>;

  expect(response.ok()).toBeTruthy();
  expect(json.success).toBe(true);
});
