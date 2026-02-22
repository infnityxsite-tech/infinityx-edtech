import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function createIndexes() {
    console.log("Creating database indexes...");

    try {
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_id ON users (id);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments (student_id);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments (course_id);`);
        console.log("✅ Indexes created successfully.");
    } catch (err) {
        console.error("❌ Failed to create indexes:", err);
    } finally {
        process.exit(0);
    }
}
createIndexes();
