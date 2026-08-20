import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const allowedCategories = new Set(["operations", "computer-vision", "product-systems"]);
const requiredSlugs = [
  "predictive-analytics",
  "ai-automation-systems",
  "intelligent-dashboards",
  "decision-support-systems",
  "computer-vision-systems",
  "industrial-ai-inspection",
  "custom-llm-solutions",
  "rag-knowledge-systems",
];

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const services = await pool.query(`
    SELECT
      s.id,
      s.slug,
      s.title,
      s.title_ar,
      s.description,
      s.description_ar,
      s.status,
      s.hero_image_url,
      s.problem_statement,
      s.problem_statement_ar,
      s.overview_long,
      s.overview_long_ar,
      c.slug AS category_slug,
      COUNT(DISTINCT d.id)::int AS deliverable_count,
      COUNT(DISTINCT u.id)::int AS use_case_count,
      COUNT(DISTINCT t.id)::int AS tech_stack_count
    FROM services s
    LEFT JOIN service_categories c ON c.id = s.category_id
    LEFT JOIN service_deliverables d ON d.service_id = s.id
    LEFT JOIN service_use_cases u ON u.service_id = s.id
    LEFT JOIN service_tech_stack t ON t.service_id = s.id
    WHERE s.status = 'active'
    GROUP BY s.id, c.slug
    ORDER BY s.sort_order ASC, s.id ASC
  `);

  const bySlug = new Map(services.rows.map((service) => [service.slug, service]));
  const duplicateSlugs = await pool.query(`
    SELECT slug, COUNT(*)::int AS count
    FROM services
    WHERE status = 'active'
    GROUP BY slug
    HAVING COUNT(*) > 1
  `);

  const issues = [];
  for (const slug of requiredSlugs) {
    const service = bySlug.get(slug);
    if (!service) {
      issues.push(`${slug}: missing active service record`);
      continue;
    }
    if (!service.category_slug || !allowedCategories.has(service.category_slug)) {
      issues.push(`${slug}: invalid primary category (${service.category_slug || "none"})`);
    }
    if (!service.hero_image_url) issues.push(`${slug}: missing hero image`);
    if (!service.title || !service.title_ar) issues.push(`${slug}: missing bilingual title`);
    if (!service.description || !service.description_ar) issues.push(`${slug}: missing bilingual summary`);
    if (!service.problem_statement) issues.push(`${slug}: missing business problem`);
    if (!service.problem_statement_ar) issues.push(`${slug}: missing Arabic business problem`);
    if (!service.overview_long) issues.push(`${slug}: missing full overview`);
    if (!service.overview_long_ar) issues.push(`${slug}: missing Arabic full overview`);
    if (service.deliverable_count === 0) issues.push(`${slug}: missing deliverables`);
    if (service.use_case_count === 0) issues.push(`${slug}: missing use cases`);
  }

  for (const duplicate of duplicateSlugs.rows) {
    issues.push(`${duplicate.slug}: duplicate active slug (${duplicate.count})`);
  }

  const report = {
    activeServices: services.rows,
    requiredSlugs,
    issues,
  };

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.table(
      services.rows.map((service) => ({
        slug: service.slug,
        category: service.category_slug || "—",
        hero: Boolean(service.hero_image_url),
        bilingualTitle: Boolean(service.title && service.title_ar),
        bilingualSummary: Boolean(service.description && service.description_ar),
        problem: Boolean(service.problem_statement),
        problemAr: Boolean(service.problem_statement_ar),
        overview: Boolean(service.overview_long),
        overviewAr: Boolean(service.overview_long_ar),
        deliverables: service.deliverable_count,
        useCases: service.use_case_count,
        tech: service.tech_stack_count,
      }))
    );
    if (issues.length) {
      console.error("Solutions audit failed:");
      issues.forEach((issue) => console.error(`- ${issue}`));
    } else {
      console.log("Solutions audit passed.");
    }
  }

  if (issues.length) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error("Solutions audit could not complete:", error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
