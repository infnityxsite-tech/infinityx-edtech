/**
 * SEO Handlers — Dynamic Sitemap and Robots.txt
 *
 * Generates /sitemap.xml and /robots.txt dynamically from the database
 * and the known static routes in the Wouter router.
 *
 * Production domain: https://infx.space
 */

import type { Request, Response } from "express";
import { query } from "./database";

const PRODUCTION_URL = "https://infx.space";

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function toW3CDate(date?: Date | string | null): string {
  if (!date) return new Date().toISOString().split("T")[0];
  const d = typeof date === "string" ? new Date(date) : date;
  return isNaN(d.getTime())
    ? new Date().toISOString().split("T")[0]
    : d.toISOString().split("T")[0];
}

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

function buildXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) =>
        `  <url>\n` +
        `    <loc>${escapeXml(e.loc)}</loc>\n` +
        (e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : "") +
        (e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>\n` : "") +
        (e.priority ? `    <priority>${e.priority}</priority>\n` : "") +
        `  </url>`
    )
    .join("\n");

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls +
    `\n</urlset>\n`
  );
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ──────────────────────────────────────────────
// Static routes (from the Wouter Router in App.tsx)
// ──────────────────────────────────────────────

const STATIC_ROUTES: SitemapEntry[] = [
  // Homepage
  { loc: `${PRODUCTION_URL}/`, changefreq: "weekly", priority: "1.0" },

  // Top-level public pages
  { loc: `${PRODUCTION_URL}/about`, changefreq: "monthly", priority: "0.7" },
  { loc: `${PRODUCTION_URL}/solutions`, changefreq: "weekly", priority: "0.9" },
  { loc: `${PRODUCTION_URL}/academy`, changefreq: "weekly", priority: "0.8" },
  { loc: `${PRODUCTION_URL}/courses`, changefreq: "weekly", priority: "0.9" },
  { loc: `${PRODUCTION_URL}/courses/live`, changefreq: "weekly", priority: "0.8" },
  { loc: `${PRODUCTION_URL}/courses/recorded`, changefreq: "weekly", priority: "0.8" },
  { loc: `${PRODUCTION_URL}/programs`, changefreq: "weekly", priority: "0.8" },
  { loc: `${PRODUCTION_URL}/blog`, changefreq: "daily", priority: "0.8" },
  { loc: `${PRODUCTION_URL}/careers`, changefreq: "weekly", priority: "0.7" },
  { loc: `${PRODUCTION_URL}/contact`, changefreq: "monthly", priority: "0.6" },
  { loc: `${PRODUCTION_URL}/consultation`, changefreq: "monthly", priority: "0.6" },
];

// Academy school pages — hardcoded slugs from schoolData.ts
const ACADEMY_SCHOOL_SLUGS = [
  "ai-and-data-science",
  "cybersecurity",
  "full-stack-solutions",
  "space-solutions",
];

// Legacy program category pages from SchoolLanding.tsx schoolMeta
const PROGRAM_CATEGORY_SLUGS = ["space", "ai", "software", "security"];

// ──────────────────────────────────────────────
// Dynamic route fetchers (gracefully handle missing tables)
// ──────────────────────────────────────────────

async function safeQuery<T = any>(sql: string, params?: any[]): Promise<T[]> {
  try {
    const result = await query(sql, params);
    return result.rows as T[];
  } catch {
    // Table might not exist yet in fresh DBs — return empty
    return [];
  }
}

async function getDynamicRoutes(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];

  // 1. Academy school pages (static data, always valid)
  for (const slug of ACADEMY_SCHOOL_SLUGS) {
    entries.push({
      loc: `${PRODUCTION_URL}/academy/${slug}`,
      changefreq: "monthly",
      priority: "0.7",
    });
  }

  // 2. Legacy program category pages
  for (const cat of PROGRAM_CATEGORY_SLUGS) {
    entries.push({
      loc: `${PRODUCTION_URL}/programs/${cat}`,
      changefreq: "weekly",
      priority: "0.7",
    });
  }

  // 3. Solutions/Services (from `services` table)
  const services = await safeQuery<{ slug: string; updated_at?: Date }>(
    `SELECT slug, updated_at FROM services WHERE status = 'active' AND slug IS NOT NULL ORDER BY sort_order ASC`
  );
  for (const svc of services) {
    if (!svc.slug) continue;
    entries.push({
      loc: `${PRODUCTION_URL}/solutions/${svc.slug}`,
      lastmod: toW3CDate(svc.updated_at),
      changefreq: "weekly",
      priority: "0.8",
    });
  }

  // 4. Industries (from `industries` table)
  const industries = await safeQuery<{ slug: string; created_at?: Date }>(
    `SELECT slug, created_at FROM industries ORDER BY order_index ASC`
  );
  for (const ind of industries) {
    if (!ind.slug) continue;
    entries.push({
      loc: `${PRODUCTION_URL}/industries/${ind.slug}`,
      lastmod: toW3CDate(ind.created_at),
      changefreq: "monthly",
      priority: "0.7",
    });
  }

  // 5. Blog posts (from `blog_posts` table)
  const posts = await safeQuery<{ id: number; updated_at?: Date }>(
    `SELECT id, updated_at FROM blog_posts ORDER BY published_at DESC`
  );
  for (const post of posts) {
    entries.push({
      loc: `${PRODUCTION_URL}/blog/${post.id}`,
      lastmod: toW3CDate(post.updated_at),
      changefreq: "monthly",
      priority: "0.6",
    });
  }

  // 6. Courses — recorded course preview pages (from `courses` table)
  const courses = await safeQuery<{ id: number; updated_at?: Date }>(
    `SELECT id, updated_at FROM courses ORDER BY created_at DESC`
  );
  for (const course of courses) {
    entries.push({
      loc: `${PRODUCTION_URL}/courses/recorded/${course.id}/preview`,
      lastmod: toW3CDate(course.updated_at),
      changefreq: "monthly",
      priority: "0.6",
    });
  }

  // 7. Programs — individual program detail pages (from `programs` table)
  const programs = await safeQuery<{ id: number; updated_at?: Date }>(
    `SELECT id, updated_at FROM programs ORDER BY created_at DESC`
  );
  for (const prog of programs) {
    entries.push({
      loc: `${PRODUCTION_URL}/program/${prog.id}`,
      lastmod: toW3CDate(prog.updated_at),
      changefreq: "monthly",
      priority: "0.6",
    });
  }

  return entries;
}

// ──────────────────────────────────────────────
// Express handlers
// ──────────────────────────────────────────────

export async function handleSitemap(_req: Request, res: Response) {
  try {
    const dynamic = await getDynamicRoutes();
    const allEntries = [...STATIC_ROUTES, ...dynamic];

    // Deduplicate by loc
    const seen = new Set<string>();
    const unique = allEntries.filter((e) => {
      if (seen.has(e.loc)) return false;
      seen.add(e.loc);
      return true;
    });

    const xml = buildXml(unique);
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
    res.status(200).send(xml);
  } catch (err) {
    console.error("Sitemap generation error:", err);
    // Fallback — return static-only sitemap so Google doesn't see a 500
    const xml = buildXml(STATIC_ROUTES);
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(xml);
  }
}

export function handleRobots(_req: Request, res: Response) {
  const robots = [
    "User-agent: *",
    "Allow: /",
    "",
    "# Private / auth / admin routes",
    "Disallow: /admin",
    "Disallow: /admin-login",
    "Disallow: /login",
    "Disallow: /dashboard",
    "Disallow: /learn/",
    "Disallow: /verify",
    "Disallow: /certificates/",
    "Disallow: /api/",
    "",
    "# NOTE: /apply is intentionally not disallowed.",
    "# The page contains <meta name='robots' content='noindex, follow'> in its HTML.",
    "# Disallowing would prevent Googlebot from reading the noindex directive.",
    "",
    `Sitemap: ${PRODUCTION_URL}/sitemap.xml`,
    "",
  ].join("\n");

  res.set("Content-Type", "text/plain; charset=utf-8");
  res.set("Cache-Control", "public, max-age=86400, s-maxage=86400");
  res.status(200).send(robots);
}
