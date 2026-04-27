import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    await client.query(`ALTER TABLE service_pricing_models ADD COLUMN IF NOT EXISTS price_egp VARCHAR(100)`);
    await client.query(`ALTER TABLE service_pricing_models ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'USD'`);
    
    // Set EGP equivalents for existing pricing
    await client.query(`UPDATE service_pricing_models SET price_egp = 
      CASE 
        WHEN starting_price LIKE '%5,000%' THEN 'Starting from 250,000 EGP'
        WHEN starting_price LIKE '%25,000%' THEN 'Starting from 1,250,000 EGP'
        WHEN starting_price LIKE '%3,000%' THEN 'From 150,000 EGP/month'
        ELSE starting_price 
      END 
      WHERE price_egp IS NULL`);
    
    // Also add outcome column to client_case_studies migration sync
    await client.query(`ALTER TABLE client_case_studies ADD COLUMN IF NOT EXISTS outcome TEXT`);
    await client.query(`ALTER TABLE client_case_studies ADD COLUMN IF NOT EXISTS outcome_ar TEXT`);
    
    console.log('✅ Price currency + case study columns added');
  } finally {
    client.release();
    await pool.end();
  }
}
run();
