import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function migrate() {
    console.log("Starting Destructive DB Migration (Structural Refactor)...");

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log("1. Dropping existing tables cascade...");
        await client.query(`
            DROP TABLE IF EXISTS course_modules CASCADE;
            DROP TABLE IF EXISTS course_lessons CASCADE;
            DROP TABLE IF EXISTS course_quizzes CASCADE;
            DROP TABLE IF EXISTS quiz_submissions CASCADE;
            DROP TABLE IF EXISTS lesson_progress CASCADE;
            DROP TABLE IF EXISTS enrollments CASCADE;
            DROP TABLE IF EXISTS device_sessions CASCADE;
            DROP TABLE IF EXISTS courses CASCADE;
            DROP TABLE IF EXISTS modules CASCADE;
            DROP TABLE IF EXISTS lessons CASCADE;
            DROP TABLE IF EXISTS materials CASCADE;
            DROP TABLE IF EXISTS quizzes CASCADE;
            DROP TABLE IF EXISTS quiz_questions CASCADE;
        `);

        console.log("2. Creating normalized schema...");

        await client.query(`
            CREATE TABLE courses (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                type VARCHAR(50) NOT NULL, -- 'Live' or 'Recorded'
                category VARCHAR(100),
                duration VARCHAR(100),
                level VARCHAR(50),
                instructor VARCHAR(255),
                price_egp DECIMAL(10, 2) DEFAULT 0.00,
                price_usd DECIMAL(10, 2) DEFAULT 0.00,
                cover_image TEXT,
                external_link TEXT,
                syllabus TEXT,
                schedule_details TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE modules (
                id SERIAL PRIMARY KEY,
                course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                order_index INTEGER DEFAULT 0
            );

            CREATE TABLE lessons (
                id SERIAL PRIMARY KEY,
                module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                video_url TEXT,
                is_preview BOOLEAN DEFAULT false,
                order_index INTEGER DEFAULT 0
            );

            CREATE TABLE materials (
                id SERIAL PRIMARY KEY,
                lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
                material_title VARCHAR(255),
                material_url TEXT
            );

            CREATE TABLE quizzes (
                id SERIAL PRIMARY KEY,
                lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
                title VARCHAR(255)
            );

            CREATE TABLE quiz_questions (
                id SERIAL PRIMARY KEY,
                quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
                question TEXT NOT NULL,
                option_a TEXT NOT NULL,
                option_b TEXT NOT NULL,
                option_c TEXT NOT NULL,
                option_d TEXT NOT NULL,
                correct_answer VARCHAR(50) NOT NULL -- 'A', 'B', 'C', or 'D'
            );

            CREATE TABLE enrollments (
                id SERIAL PRIMARY KEY,
                student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(student_id, course_id)
            );

            CREATE TABLE device_sessions (
                id SERIAL PRIMARY KEY,
                student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                device_fingerprint VARCHAR(255) NOT NULL,
                last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(student_id, device_fingerprint)
            );
        `);

        await client.query('COMMIT');
        console.log("Migration successful: Normalized courses schema deployed.");

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Migration failed, rolled back:", err);
    } finally {
        client.release();
        pool.end();
    }
}

migrate();
