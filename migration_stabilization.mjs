import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function migrate() {
    console.log("Starting DB stabilization migration...");
    try {
        await pool.query(`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS syllabus TEXT,
      ADD COLUMN IF NOT EXISTS schedule_details TEXT;
    `);
        console.log("Migration successful: Added syllabus and schedule_details columns (if they didn't exist).");

        const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'courses';
    `);
        console.log("\n--- Verification: Columns in 'courses' table ---");
        res.rows.forEach(row => {
            console.log(`- ${row.column_name} (${row.data_type})`);
        });
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        pool.end();
    }
}

migrate();
