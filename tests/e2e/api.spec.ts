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

test('/api/contact returns success for valid form data', async ({ request }) => {
  const response = await request.post('/api/contact', {
    data: {
      name: 'Test Reader',
      email: 'reader@example.com',
      subject: 'Portfolio contact test',
      message: 'This is a test message from Playwright.',
    },
  });

  expect(response.status()).toBe(200);
  const json = (await response.json()) as Record<string, unknown>;
  expect(json.success).toBe(true);
});

test('/api/contact returns 400 for missing required fields', async ({
  request,
}) => {
  // Missing name
  let response = await request.post('/api/contact', {
    data: {
      email: 'reader@example.com',
      subject: 'Test',
      message: 'Test message',
    },
  });
  expect(response.status()).toBe(400);

  // Missing email
  response = await request.post('/api/contact', {
    data: {
      name: 'Test',
      subject: 'Test',
      message: 'Test message',
    },
  });
  expect(response.status()).toBe(400);

  // Missing subject
  response = await request.post('/api/contact', {
    data: {
      name: 'Test',
      email: 'reader@example.com',
      message: 'Test message',
    },
  });
  expect(response.status()).toBe(400);

  // Missing message
  response = await request.post('/api/contact', {
    data: {
      name: 'Test',
      email: 'reader@example.com',
      subject: 'Test',
    },
  });
  expect(response.status()).toBe(400);
});


