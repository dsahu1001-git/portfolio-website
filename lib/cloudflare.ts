import { getCloudflareContext } from '@opennextjs/cloudflare';

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<{ success: boolean }>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface CloudflareBindings {
  NEWSLETTER_DB?: D1Database;
  [key: string]: unknown;
}

export function getCloudflareBindings(): CloudflareBindings {
  try {
    return getCloudflareContext().env as CloudflareBindings;
  } catch {
    return {};
  }
}

export function getRuntimeValue(name: string) {
  const binding = getCloudflareBindings()[name];

  if (typeof binding === 'string' && binding.length > 0) {
    return binding;
  }

  return process.env[name];
}
