import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function runPhase2() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Fix student roles from Phase 1
        await client.query("UPDATE users SET role='student' WHERE role='user' OR role IS NULL;");

        // Phase 2: Add Preview Architecture Database Fields
        await client.query(`
            ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_preview_available BOOLEAN DEFAULT false;
            ALTER TABLE course_lessons ADD COLUMN IF NOT EXISTS is_free_preview BOOLEAN DEFAULT false;
        `);

        await client.query('COMMIT');
        console.log("✅ Phase 2 database fields and role fixes applied successfully!");
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("❌ Failed to apply Phase 2 database updates:", err);
    } finally {
        client.release();
        pool.end();
    }
}

runPhase2();
