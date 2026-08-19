import { Pool, type PoolConfig } from "pg";

declare global {
  // Reuse a small pool across warm Netlify invocations and local hot reloads.
  // eslint-disable-next-line no-var
  var __infinityxPostgresPool: Pool | undefined;
}

function poolConfig(): PoolConfig {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL environment variable is required");

  return {
    connectionString,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
    max: 2,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    maxUses: 5_000,
    allowExitOnIdle: true,
  };
}

export function getPool(): Pool {
  if (!globalThis.__infinityxPostgresPool) {
    const pool = new Pool(poolConfig());
    pool.on("error", error => {
      console.error("Unexpected PostgreSQL pool error:", {
        message: error.message,
        code: (error as NodeJS.ErrnoException).code,
      });
    });
    globalThis.__infinityxPostgresPool = pool;
  }
  return globalThis.__infinityxPostgresPool;
}

function isTransientDatabaseError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const code = (error as NodeJS.ErrnoException).code;
  return Boolean(
    code && ["08000", "08003", "08006", "57P01", "ECONNRESET", "ETIMEDOUT"].includes(code)
  );
}

export async function query(text: string, params?: unknown[], retries = 2): Promise<any> {
  const startedAt = Date.now();
  try {
    const result = await getPool().query(text, params);
    const duration = Date.now() - startedAt;
    if (process.env.NODE_ENV !== "production" && duration > 500) {
      console.warn(`Slow database query (${duration}ms)`);
    }
    return result;
  } catch (error) {
    if (isTransientDatabaseError(error) && retries > 0) {
      const attempt = 3 - retries;
      await new Promise(resolve => setTimeout(resolve, 250 * attempt));
      return query(text, params, retries - 1);
    }
    console.error("Database query failed:", {
      message: error instanceof Error ? error.message : "Unknown database error",
      code: error instanceof Error ? (error as NodeJS.ErrnoException).code : undefined,
    });
    throw error;
  }
}

export async function queryOne<T = any>(text: string, params?: unknown[]): Promise<T | null> {
  const result = await query(text, params);
  return result.rows[0] || null;
}

export async function queryMany<T = any>(text: string, params?: unknown[]): Promise<T[]> {
  const result = await query(text, params);
  return result.rows;
}

