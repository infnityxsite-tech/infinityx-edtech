import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const EXPECTED_TAXONOMY = [
  ["operations", ["predictive-analytics", "ai-automation-systems", "intelligent-dashboards", "decision-support-systems"]],
  ["computer-vision", ["computer-vision-systems", "industrial-ai-inspection"]],
  ["product-systems", ["custom-llm-solutions", "rag-knowledge-systems"]],
];

const expectedBySlug = new Map(
  EXPECTED_TAXONOMY.flatMap(([categorySlug, slugs]) =>
    slugs.map((slug) => [slug, categorySlug])
  )
);
const originArgument = process.argv.find((argument) => argument.startsWith("--origin="));
const origin = originArgument?.slice("--origin=".length).replace(/\/$/, "");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to validate solution routes.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function fetchRoute(pathname) {
  if (!origin) return null;
  const response = await fetch(new URL(pathname, `${origin}/`), {
    redirect: "manual",
  });
  return {
    status: response.status,
    robots: response.headers.get("x-robots-tag") || "",
    html: await response.text(),
  };
}

function htmlAttribute(html, expression) {
  return html.match(expression)?.[1]?.replaceAll("&amp;", "&") || "";
}

async function main() {
  const slugs = [...expectedBySlug.keys()];
  const { rows } = await pool.query(
    `SELECT
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
       s.process_methodology_json,
       c.slug AS category_slug,
       (SELECT COUNT(*)::int FROM service_deliverables d WHERE d.service_id = s.id) AS deliverable_count,
       (SELECT COUNT(*)::int FROM service_use_cases u WHERE u.service_id = s.id) AS use_case_count,
       (SELECT COUNT(*)::int FROM service_tech_stack t WHERE t.service_id = s.id) AS tech_stack_count
     FROM services s
     INNER JOIN service_categories c ON c.id = s.category_id
     WHERE s.slug = ANY($1)
     ORDER BY c.order_index, s.sort_order, s.id`,
    [slugs]
  );

  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  const issues = [];
  const report = [];
  const metadataTitles = new Set();
  const metadataDescriptions = new Set();

  for (const [slug, categorySlug] of expectedBySlug) {
    const service = bySlug.get(slug);
    const route = `/solutions/${slug}`;
    if (!service) {
      issues.push(`${slug}: no categorized service record`);
      report.push({ category: categorySlug, slug, route, status: "missing" });
      continue;
    }

    const requiredFields = [
      ["active", service.status === "active"],
      ["category", service.category_slug === categorySlug],
      ["title", Boolean(service.title)],
      ["Arabic title", Boolean(service.title_ar)],
      ["summary", Boolean(service.description)],
      ["Arabic summary", Boolean(service.description_ar)],
      ["hero", Boolean(service.hero_image_url)],
      ["problem", Boolean(service.problem_statement)],
      ["Arabic problem", Boolean(service.problem_statement_ar)],
      ["overview", Boolean(service.overview_long)],
      ["Arabic overview", Boolean(service.overview_long_ar)],
      ["method", Boolean(service.process_methodology_json)],
      ["deliverables", Number(service.deliverable_count) > 0],
      ["use cases", Number(service.use_case_count) > 0],
      ["technology", Number(service.tech_stack_count) > 0],
    ];
    for (const [label, valid] of requiredFields) {
      if (!valid) issues.push(`${slug}: missing or invalid ${label}`);
    }

    const response = await fetchRoute(route);
    if (response && response.status !== 200) {
      issues.push(`${slug}: expected local route 200, received ${response.status}`);
    }
    if (response?.status === 200) {
      const title = htmlAttribute(response.html, /<title>([^<]+)<\/title>/i);
      const description = htmlAttribute(
        response.html,
        /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i
      );
      const canonical = htmlAttribute(
        response.html,
        /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i
      );
      const socialImage = htmlAttribute(
        response.html,
        /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i
      );
      const expectedCanonical = `https://infx.space${route}`;
      if (!title || !title.includes(service.title)) issues.push(`${slug}: missing unique page title`);
      if (!description || description.length < 24) issues.push(`${slug}: missing page description`);
      if (canonical !== expectedCanonical) issues.push(`${slug}: canonical is ${canonical || "missing"}`);
      if (!socialImage) issues.push(`${slug}: missing OG image`);
      if (metadataTitles.has(title)) issues.push(`${slug}: duplicate page title`);
      if (metadataDescriptions.has(description)) issues.push(`${slug}: duplicate page description`);
      metadataTitles.add(title);
      metadataDescriptions.add(description);
    }
    report.push({
      category: categorySlug,
      slug,
      route,
      status: service.status,
      httpStatus: response?.status ?? "not checked",
    });
  }

  if (origin) {
    const invalidRoute = await fetchRoute("/solutions/not-a-real-system");
    if (!invalidRoute || invalidRoute.status !== 404) {
      issues.push(
        `invalid route: expected local 404, received ${invalidRoute?.status ?? "no response"}`
      );
    }
    if (!invalidRoute?.robots.toLowerCase().includes("noindex")) {
      issues.push("invalid route: expected X-Robots-Tag noindex");
    }
    report.push({
      category: "invalid",
      slug: "not-a-real-system",
      route: "/solutions/not-a-real-system",
      status: invalidRoute?.robots || "no robots header",
      httpStatus: invalidRoute?.status ?? "not checked",
    });

    const sitemapResponse = await fetch(new URL("/sitemap.xml", `${origin}/`));
    const sitemap = await sitemapResponse.text();
    if (sitemapResponse.status !== 200) issues.push(`sitemap: expected 200, received ${sitemapResponse.status}`);
    for (const slug of slugs) {
      const canonical = `https://infx.space/solutions/${slug}`;
      const entries = sitemap.split(canonical).length - 1;
      if (entries !== 1) issues.push(`sitemap: expected one entry for ${slug}, found ${entries}`);
    }
    if (sitemap.includes("/industries/")) issues.push("sitemap: contains retired industry detail URLs");

    const robotsResponse = await fetch(new URL("/robots.txt", `${origin}/`));
    const robots = await robotsResponse.text();
    if (robotsResponse.status !== 200 || !robots.includes("Sitemap:")) {
      issues.push("robots.txt: missing sitemap directive");
    }
  }

  console.table(report);
  if (issues.length) {
    console.error("Solution route validation failed:");
    issues.forEach((issue) => console.error(`- ${issue}`));
    process.exitCode = 1;
    return;
  }

  console.log(
    `Solution route validation passed for ${slugs.length} canonical profiles${origin ? " and the invalid-route guard" : ""}.`
  );
}

main()
  .catch((error) => {
    console.error("Solution route validation could not complete:", error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
