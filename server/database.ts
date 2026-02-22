import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is missing!");
  process.exit(1);
}

// Create PostgreSQL connection pool optimized for Neon Serverless
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  maxUses: 7500,
});

pool.on('connect', () => {
  // Silent connected log to avoid spamming unless explicitly debugging
});

pool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL pool error. Connection dropped:', err);
  // Do not exit process. The pg pool will automatically attempt to reconnect.
});

/**
 * Execute a query with automatic retry for transient connection errors (e.g., Neon waking up from scale-to-zero)
 */
export async function query(text: string, params?: any[], retries = 3): Promise<any> {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production' && duration > 500) {
      console.warn(`🐢 Slow Query (${duration}ms):`, text.substring(0, 100));
    }
    return res;
  } catch (error: any) {
    // Retry on specific transient network/connection codes
    // 08000 (connection exception), 08003 (connection does not exist), 08006 (connection failure), 57P01 (admin shutdown - common in serverless sleep)
    const isTransient = error.code && ['08000', '08003', '08006', '57P01'].includes(error.code) || error.message?.includes('ECONNRESET');

    if (isTransient && retries > 0) {
      console.warn(`🔄 Transient database error (${error.code || 'Network'}). Retrying query... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
      return query(text, params, retries - 1);
    }
    console.error('❌ Database query error:', { error: error.message, code: error.code, query: text.substring(0, 50) });
    throw error;
  }
}

// Helper to get a single row
export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const result = await query(text, params);
  return result.rows[0] || null;
}

// Helper to get multiple rows
export async function queryMany<T = any>(text: string, params?: any[]): Promise<T[]> {
  const result = await query(text, params);
  return result.rows;
}

export default pool;
