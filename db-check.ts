import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
    for (const t of ['device_sessions', 'lesson_progress', 'quiz_submissions', 'enrollments']) {
        const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = $1", [t]);
        console.log(t.toUpperCase() + ':', res.rows.map(r => r.column_name).join(", "));
    }
    process.exit(0);
}
check();
