import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const c = await pool.connect();
  const svcs = [
    [5, '/uploads/hero_ai_automation.webp', 'AI workflow orchestration'],
    [6, '/uploads/hero_custom_llm.webp', 'LLM architecture visualization'],
    [7, '/uploads/hero_data_engineering.webp', 'Data pipeline flow'],
    [8, '/uploads/hero_dashboards.webp', 'BI dashboard analytics'],
    [9, '/uploads/hero_rag_knowledge.webp', 'Knowledge graph network'],
    [10, '/uploads/hero_industrial_inspect.webp', 'AI inspection overlay'],
    [11, '/uploads/hero_decision_support.webp', 'Decision intelligence center'],
  ];
  for (const [id, img, cap] of svcs) {
    await c.query('INSERT INTO service_gallery (service_id, image_url, caption, order_index) VALUES ($1, $2, $3, 0)', [id, img, cap]);
    console.log('✅ gallery:', id);
  }
  c.release(); await pool.end();
}
run();
