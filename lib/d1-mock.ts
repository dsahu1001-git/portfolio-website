import { vi } from 'vitest';

type RunResult = { success: boolean };

interface MockStatement {
  bind: (...values: unknown[]) => MockStatement;
  first: <T = Record<string, unknown>>() => Promise<T | null>;
  run: () => Promise<RunResult>;
}

interface MockDatabase {
  prepare: (query: string) => MockStatement;
}

/**
 * Creates a mock D1 database for testing.
 */
export function createD1Mock(): MockDatabase {
  const statements = new Map<string, MockStatement>();

  const db: MockDatabase = {
    prepare(query: string): MockStatement {
      const existing = statements.get(query);
      if (existing) return existing;

      const boundValues: unknown[][] = [];
      let firstResult: Record<string, unknown> | null = null;

      const statement: MockStatement = {
        bind(...values: unknown[]) {
          boundValues.push(values);
          return statement;
        },
        first<T = Record<string, unknown>>() {
          return Promise.resolve(firstResult as T | null);
        },
        run() {
          return Promise.resolve({ success: true });
        },
      };

      statements.set(query, statement);
      return statement;
    },
  };

  return db;
}

/**
 * Sets up a mock D1 database with predefined query responses.
 */
export function setupD1Mock(
  responses: Array<{
    query: string;
    firstResult?: Record<string, unknown> | null;
    runResult?: RunResult;
  }>,
): MockDatabase {
  const db = createD1Mock();

  for (const { query, firstResult, runResult } of responses) {
    const statement = db.prepare(query);
    if (firstResult !== undefined) {
      vi.spyOn(statement, 'first').mockResolvedValue(firstResult);
    }
    if (runResult !== undefined) {
      vi.spyOn(statement, 'run').mockResolvedValue(runResult);
    }
  }

  return db;
}