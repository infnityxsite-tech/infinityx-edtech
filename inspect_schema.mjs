import pkg from 'pg';
const { Pool } = pkg;
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is missing!");
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
    console.log("Connecting to database...", process.env.DATABASE_URL.split('@')[1] || "Local/Unknown");
    try {
        const client = await pool.connect();

        const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);

        const hasEnrollments = tablesRes.rows.some(r => r.table_name === 'enrollments');

        if (!hasEnrollments) {
            console.log("\n===============================");
            console.log("❌ ENROLLMENTS TABLE NOT FOUND IN DB.");
            console.log("===============================\n");
            return;
        }

        const columnsQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'enrollments';
    `;
        const res = await client.query(columnsQuery);

        console.log("\n===============================");
        console.log("ENROLLMENTS TABLE CONTAINS:");
        console.log("===============================");

        res.rows.forEach(r => {
            console.log(`- ${r.column_name} (${r.data_type})`);
        });

        console.log("===============================\n");

        client.release();
    } catch (err) {
        console.error("Database error:", err.message);
    } finally {
        process.exit(0);
    }
}

checkSchema();
