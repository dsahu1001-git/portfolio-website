import { getCloudflareBindings } from '@/lib/cloudflare';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  '/api/newsletter': { windowMs: 15 * 60 * 1000, maxRequests: 3 },
  '/api/contact': { windowMs: 15 * 60 * 1000, maxRequests: 2 },
  '/api/game/score': { windowMs: 5 * 60 * 1000, maxRequests: 10 },
  '/api/newsletter/broadcast': { windowMs: 60 * 60 * 1000, maxRequests: 10 },
};

async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function checkRateLimit(
  request: Request,
  endpoint?: string,
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const database = getCloudflareBindings().NEWSLETTER_DB;

  if (!database) {
    return { allowed: true };
  }

  const url = new URL(request.url);
  const path = endpoint ?? url.pathname;
  const config = DEFAULT_CONFIGS[path];

  if (!config) {
    return { allowed: true };
  }

  const cfConnectingIp =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for') ??
    'unknown';
  const ipHash = await hashIp(cfConnectingIp);
  const windowStart = new Date(
    Date.now() - config.windowMs,
  ).toISOString();

  await database
    .prepare(
      `DELETE FROM rate_limits WHERE created_at < ? AND endpoint = ?`,
    )
    .bind(windowStart, path)
    .run();

  const countResult = await database
    .prepare(
      `SELECT COUNT(*) as count FROM rate_limits WHERE ip_hash = ? AND endpoint = ? AND created_at >= ?`,
    )
    .bind(ipHash, path, windowStart)
    .first<{ count: number }>();

  const count = countResult?.count ?? 0;

  if (count >= config.maxRequests) {
    const retryAfter = Math.ceil(config.windowMs / 1000);
    return { allowed: false, retryAfter };
  }

  await database
    .prepare(
      `INSERT INTO rate_limits (ip_hash, endpoint, created_at) VALUES (?, ?, ?)`,
    )
    .bind(ipHash, path, new Date().toISOString())
    .run();

  return { allowed: true };
}
