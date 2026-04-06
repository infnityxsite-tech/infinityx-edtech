import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function runPhase3() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Phase 3: Add Career Application Database Fields
        await client.query(`
            ALTER TABLE applications ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'course';
            ALTER TABLE applications ADD COLUMN IF NOT EXISTS cv_link TEXT;
        `);

        await client.query('COMMIT');
        console.log("✅ Phase 3 database fields applied successfully!");
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("❌ Failed to apply Phase 3 database updates:", err);
    } finally {
        client.release();
        pool.end();
    }
}

runPhase3();
