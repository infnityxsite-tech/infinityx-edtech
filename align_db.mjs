import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function runAlignment() {
    console.log("🚀 Starting DB Alignment & Stabilization Script...");
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log("1. Aligning Enrollments Table...");
        // Handle enrollments columns
        // student_id -> user_id
        await client.query(`
            DO $$
            BEGIN
              IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='enrollments' AND column_name='student_id') THEN
                  ALTER TABLE enrollments RENAME COLUMN student_id TO user_id;
              END IF;
              IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='enrollments' AND column_name='created_at') THEN
                  ALTER TABLE enrollments RENAME COLUMN created_at TO enrolled_at;
              END IF;
              IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='enrollments' AND column_name='status') THEN
                  ALTER TABLE enrollments ADD COLUMN status VARCHAR(50) DEFAULT 'active';
              END IF;
            END $$;
        `);

        console.log("2. Aligning Device Sessions Table...");
        await client.query(`
            DO $$
            BEGIN
              IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='device_sessions' AND column_name='student_id') THEN
                  ALTER TABLE device_sessions RENAME COLUMN student_id TO user_id;
              END IF;
              IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='device_sessions' AND column_name='device_fingerprint') THEN
                  ALTER TABLE device_sessions RENAME COLUMN device_fingerprint TO device_id;
              END IF;
              IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='device_sessions' AND column_name='device_name') THEN
                  ALTER TABLE device_sessions ADD COLUMN device_name VARCHAR(255);
              END IF;
            END $$;
        `);

        console.log("3. Aligning Courses Table...");
        await client.query(`
            DO $$
            BEGIN
              IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='courses' AND column_name='type') THEN
                  ALTER TABLE courses RENAME COLUMN type TO course_type;
              END IF;
              IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='courses' AND column_name='cover_image') THEN
                  ALTER TABLE courses RENAME COLUMN cover_image TO image_url;
              END IF;
              IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='courses' AND column_name='external_link') THEN
                  ALTER TABLE courses RENAME COLUMN external_link TO course_link;
              END IF;
            END $$;
        `);

        console.log("4. Adding Performance Indexes...");
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
            CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
        `);
        // Note: For modules, ensure module course_id is indexed
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
        `);

        await client.query('COMMIT');
        console.log("✅ Database aligned successfully!");
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("❌ Alignment failed, rolled back:", err);
    } finally {
        client.release();
        pool.end();
    }
}

runAlignment();
