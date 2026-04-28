// Audit script to check content completeness for all services
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function audit() {
  const client = await pool.connect();
  try {
    const { rows: services } = await client.query(`SELECT id, slug, title, hero_image_url, problem_statement, overview_long, process_methodology_json FROM services WHERE status = 'active' ORDER BY sort_order`);
    
    console.log('=== SERVICE CONTENT AUDIT ===\n');
    for (const svc of services) {
      const { rows: [dc] } = await client.query(`SELECT COUNT(*)::int as c FROM service_deliverables WHERE service_id = $1`, [svc.id]);
      const { rows: [uc] } = await client.query(`SELECT COUNT(*)::int as c FROM service_use_cases WHERE service_id = $1`, [svc.id]);
      const { rows: [pk] } = await client.query(`SELECT COUNT(*)::int as c FROM service_pricing_models WHERE service_id = $1`, [svc.id]);
      const { rows: [fq] } = await client.query(`SELECT COUNT(*)::int as c FROM service_faq WHERE service_id = $1`, [svc.id]);
      const { rows: [gl] } = await client.query(`SELECT COUNT(*)::int as c FROM service_gallery WHERE service_id = $1`, [svc.id]);
      const { rows: [ts] } = await client.query(`SELECT COUNT(*)::int as c FROM service_tech_stack WHERE service_id = $1`, [svc.id]);
      const { rows: [im] } = await client.query(`SELECT COUNT(*)::int as c FROM service_impact_metrics WHERE service_id = $1`, [svc.id]);
      
      const hasHero = !!svc.hero_image_url;
      const hasProblem = !!svc.problem_statement;
      const hasOverview = !!svc.overview_long;
      
      const issues = [];
      if (!hasHero) issues.push('NO_HERO_IMAGE');
      if (!hasProblem) issues.push('NO_PROBLEM_STATEMENT');
      if (!hasOverview) issues.push('NO_OVERVIEW');
      if (dc.c === 0) issues.push('NO_DELIVERABLES');
      if (uc.c === 0) issues.push('NO_USE_CASES');
      if (pk.c === 0) issues.push('NO_PACKAGES');
      if (fq.c === 0) issues.push('NO_FAQ');
      if (gl.c === 0) issues.push('NO_GALLERY');
      if (ts.c === 0) issues.push('NO_TECH_STACK');
      if (im.c === 0) issues.push('NO_IMPACT_METRICS');
      
      const status = issues.length === 0 ? '✅ COMPLETE' : `❌ INCOMPLETE (${issues.length} gaps)`;
      console.log(`[${svc.id}] ${svc.slug}`);
      console.log(`    ${status}`);
      console.log(`    Hero: ${hasHero ? '✓' : '✗'} | Problem: ${hasProblem ? '✓' : '✗'} | Overview: ${hasOverview ? '✓' : '✗'}`);
      console.log(`    Deliverables: ${dc.c} | UseCases: ${uc.c} | Packages: ${pk.c} | FAQ: ${fq.c} | Gallery: ${gl.c} | TechStack: ${ts.c} | ImpactMetrics: ${im.c}`);
      if (issues.length > 0) console.log(`    GAPS: ${issues.join(', ')}`);
      console.log('');
    }
  } finally {
    client.release();
    await pool.end();
  }
}
audit();
