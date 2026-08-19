// migrate_v2.mjs — additive schema migration; no example content is inserted.
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    const serviceColumns = [
      ['hero_image_url', 'TEXT'],
      ['problem_statement', 'TEXT'],
      ['problem_statement_ar', 'TEXT'],
      ['overview_long', 'TEXT'],
      ['overview_long_ar', 'TEXT'],
    ];
    for (const [column, type] of serviceColumns) {
      await client.query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS ${column} ${type}`);
    }

    const caseStudyColumns = [['outcome', 'TEXT'], ['outcome_ar', 'TEXT'], ['logo_url', 'TEXT']];
    for (const [column, type] of caseStudyColumns) {
      await client.query(`ALTER TABLE client_case_studies ADD COLUMN IF NOT EXISTS ${column} ${type}`);
    }

    await client.query(`
      CREATE TABLE IF NOT EXISTS service_gallery (
        id SERIAL PRIMARY KEY,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        caption VARCHAR(255),
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS service_faq (
        id SERIAL PRIMARY KEY,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        question_ar TEXT,
        answer_ar TEXT,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS service_tech_stack (
        id SERIAL PRIMARY KEY,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Schema migration complete. Add public content through approved editorial workflows.');
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((error) => {
  console.error('Schema migration failed:', error);
  process.exitCode = 1;
});
