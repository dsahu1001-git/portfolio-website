import { expect, test } from '@playwright/test';

const publicPages = [
  ['/', 'Building reliable, cost-aware developer platforms at scale.'],
  [
    '/about',
    'I build teams and platforms that make delivery boring in the best way.',
  ],
  [
    '/work',
    'Platform engineering leadership from production operations to global-scale enablement.',
  ],
  ['/blog', 'Practical notes from platform engineering work'],
  [
    '/blog/platform-in-a-box',
    'Platform in a Box: What Really Happens After You Click Deploy?',
  ],
  [
    '/blog/modernizing-cicd-github-actions-argocd-helm',
    'Your CI/CD Platform Is Not a Museum: A Practical Modernization Playbook',
  ],
  [
    '/games',
    'Small interactive extras for visitors who want to play for a minute.',
  ],
  ['/games/connections-india', 'Connections India'],
  [
    '/gear',
    'Useful recommendations, with affiliate links only where they make sense.',
  ],
  ['/newsletter', 'Deep Signals'],
  ['/newsletter/welcome-to-deep-signals', 'Welcome to Deep Signals'],
] as const;

for (const [path, heading] of publicPages) {
  test(`${path} renders`, async ({ page }) => {
    await page.goto(path);
    await expect(
      page.getByRole('heading', { name: heading }).first(),
    ).toBeVisible();
  });
}

test('newsletter form validates and submits in development mode', async ({
  page,
}) => {
  await page.goto('/newsletter');
  await page.getByLabel('Email address').fill('reader@example.com');
  await page.getByRole('button', { name: 'Join newsletter' }).click();
  await expect(
    page.getByText('Newsletter storage is not configured.'),
  ).toBeVisible();
});

test('contact form validates and submits in development mode', async ({
  page,
}) => {
  await page.goto('/contact');
  await page.getByPlaceholder('Your name').fill('Test Reader');
  await page.getByPlaceholder('you@example.com').fill('reader@example.com');
  await page.getByPlaceholder('Subject').fill('Portfolio contact test');
  await page
    .getByPlaceholder('What should we talk about?')
    .fill('This is a browser regression test message.');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByText('Message validated.')).toBeVisible();
});

test('connections india solves a group', async ({ page }) => {
  await page.goto('/games/connections-india');

  for (const tile of ['MI', 'CSK', 'RCB', 'KKR']) {
    await page.getByRole('button', { name: tile, exact: true }).click();
  }

  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('heading', { name: 'IPL Teams' })).toBeVisible();
});

test('featured articles carousel advances', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('01 / 03')).toBeVisible();
  await expect(page.locator('.featured-stack-card[data-active="true"]')).toHaveCount(
    1,
  );
  await expect(page.locator('.featured-stack-card[data-active="false"]')).toHaveCount(
    2,
  );
  await page.getByRole('button', { name: 'Next featured article' }).click();
  await expect(page.getByText('02 / 03')).toBeVisible();
});

test('hero scroll cue advances past the first viewport', async ({ page }) => {
  await page.goto('/');
  const cue = page.getByRole('button', { name: 'Scroll to explore' });

  await expect(cue).toBeVisible();
  await cue.click();
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(400);
  await expect(cue).toHaveClass(/opacity-0/);
});

test('/contact renders the contact form', async ({ page }) => {
  await page.goto('/contact');
  await expect(
    page.getByRole('heading', { name: /Let's talk platform engineering/i }),
  ).toBeVisible();
  await expect(page.getByPlaceholder('Your name')).toBeVisible();
  await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
  await expect(page.getByPlaceholder('Subject')).toBeVisible();
  await expect(page.getByPlaceholder('What should we talk about?')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible();
});

test('cicd modernization article contains responsive technical content', async ({
  page,
}) => {
  await page.goto('/blog/modernizing-cicd-github-actions-argocd-helm');

  await expect(
    page.getByText('Developer pull request', { exact: false }),
  ).toBeVisible();
  await expect(page.locator('.prose-brand table')).toHaveCount(4);
  await expect(page.locator('.prose-brand pre')).toHaveCount(8);

  const layout = await page.evaluate(() => ({
    bodyWidth: document.body.scrollWidth,
    viewportWidth: window.innerWidth,
    technicalBlocks: Array.from(
      document.querySelectorAll('.prose-brand table, .prose-brand pre'),
    ).map((element) => getComputedStyle(element).overflowX),
  }));

  expect(layout.bodyWidth).toBeLessThanOrEqual(layout.viewportWidth);
  expect(layout.technicalBlocks.every((overflow) => overflow === 'auto')).toBe(
    true,
  );
});
