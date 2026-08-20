import { queryOne } from "./database";

const BASE_URL = "https://infx.space";
const DEFAULT_SOCIAL_IMAGE = `${BASE_URL}/uploads/hero_industrial_inspect.webp`;

type RouteMeta = { title: string; description: string; robots: string; image?: string };

const PUBLIC_META: Record<string, RouteMeta> = {
  "/": { title: "Enterprise AI & Software Engineering | Infinity X Solutions", description: "Infinity X engineers production-ready AI, computer vision, automation, and software systems for real operations.", robots: "index, follow" },
  "/about": { title: "Company | Infinity X Solutions", description: "Infinity X Solutions is an AI engineering company that builds, transfers, and supports production systems for real operations.", robots: "index, follow" },
  "/company": { title: "Company | Infinity X Solutions", description: "Infinity X Solutions is an AI engineering company that builds, transfers, and supports production systems for real operations.", robots: "index, follow" },
  "/solutions": { title: "Enterprise AI Systems | Infinity X", description: "Explore production-grade AI systems for automation, computer vision, predictive intelligence, and technical infrastructure.", robots: "index, follow" },
  "/academy": { title: "Academy | Infinity X", description: "Project-based technology programs for people who build practical technical capability.", robots: "index, follow" },
  "/programs": { title: "Programs | Infinity X Academy", description: "Discover practical, project-based technology programs from Infinity X Academy.", robots: "index, follow" },
  "/courses": { title: "Learning Formats | Infinity X Academy", description: "Choose live cohort learning or self-paced recorded courses from Infinity X Academy.", robots: "index, follow" },
  "/courses/live": { title: "Live Courses | Infinity X Academy", description: "Explore instructor-led live technology courses from Infinity X Academy.", robots: "index, follow" },
  "/courses/recorded": { title: "Recorded Courses | Infinity X Academy", description: "Explore self-paced recorded technology courses from Infinity X Academy.", robots: "index, follow" },
  "/blog": { title: "Insights | Infinity X Solutions", description: "Technical insights from Infinity X Solutions on AI engineering and technology education.", robots: "index, follow" },
  "/careers": { title: "Careers | Infinity X Solutions", description: "Explore current opportunities to join the Infinity X engineering and education teams.", robots: "index, follow" },
  "/contact": { title: "Contact Infinity X Solutions", description: "Contact Infinity X Solutions about enterprise AI systems, Academy programs, or a general inquiry.", robots: "index, follow" },
  "/consultation": { title: "Start an AI Project | Infinity X", description: "Tell Infinity X about the operational challenge your team needs to solve.", robots: "noindex, follow" },
  "/apply": { title: "Apply to Infinity X Academy", description: "Apply to an Infinity X Academy program or short course.", robots: "noindex, follow" },
};

const PRIVATE_PREFIXES = ["/admin", "/login", "/dashboard", "/learn/", "/verify", "/certificates/"];

export function routeRobots(pathname: string): string {
  return PRIVATE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix)) ? "noindex, nofollow" : "";
}

async function getSolutionMeta(pathname: string): Promise<RouteMeta | undefined> {
  const match = pathname.match(/^\/solutions\/([^/]+)$/);
  if (!match) return undefined;

  try {
    const service = await queryOne<{
      title: string;
      description: string | null;
      hero_image_url: string | null;
    }>(
      `SELECT s.title, s.description, s.hero_image_url
       FROM services s
       INNER JOIN service_categories c ON c.id = s.category_id
       WHERE s.slug = $1
         AND s.status = 'active'
         AND NULLIF(TRIM(s.slug), '') IS NOT NULL
         AND NULLIF(TRIM(s.problem_statement), '') IS NOT NULL
         AND NULLIF(TRIM(s.overview_long), '') IS NOT NULL`,
      [decodeURIComponent(match[1])]
    );
    if (!service) return undefined;

    const image = service.hero_image_url?.startsWith("/")
      ? `${BASE_URL}${service.hero_image_url}`
      : service.hero_image_url || DEFAULT_SOCIAL_IMAGE;
    return {
      title: `${service.title} | Infinity X Solutions`,
      description: service.description || "Production-grade enterprise AI capability designed around operational constraints.",
      robots: "index, follow",
      image,
    };
  } catch {
    // A temporary database issue should not turn a valid public route into an indexable generic page.
    return undefined;
  }
}

async function dynamicMeta(pathname: string): Promise<RouteMeta | undefined> {
  const solutionMeta = await getSolutionMeta(pathname);
  if (solutionMeta || /^\/solutions\/[^/]+$/.test(pathname)) return solutionMeta;
  if (/^\/program\/[^/]+$/.test(pathname)) return { title: "Academy Program | Infinity X", description: "Explore a practical, project-based technology program from Infinity X Academy.", robots: "index, follow" };
  if (/^\/courses\/recorded\/[^/]+\/preview$/.test(pathname)) return { title: "Course Preview | Infinity X Academy", description: "Preview a practical technology course from Infinity X Academy.", robots: "index, follow" };
  if (/^\/academy\/[^/]+$/.test(pathname)) return { title: "Academy Discipline | Infinity X", description: "Explore a practical discipline area from Infinity X Academy.", robots: "index, follow" };
  if (/^\/programs\/[^/]+$/.test(pathname)) return { title: "Academy Programs | Infinity X", description: "Explore technology programs from Infinity X Academy.", robots: "index, follow" };
  if (/^\/blog\/[^/]+$/.test(pathname)) return { title: "Insight | Infinity X Solutions", description: "Technical insight from Infinity X Solutions.", robots: "index, follow" };
  return undefined;
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Inject crawlable route metadata into the SPA shell before it reaches the client. */
export async function injectRouteMetadata(template: string, requestUrl: string) {
  const url = new URL(requestUrl, BASE_URL);
  const pathname = url.pathname.length > 1 ? url.pathname.replace(/\/$/, "") : "/";
  const privateRobots = routeRobots(pathname);
  const meta = PUBLIC_META[pathname] || await dynamicMeta(pathname) || { title: "Page Not Found | Infinity X Solutions", description: "The requested Infinity X page could not be found.", robots: privateRobots || "noindex, follow" };
  const canonicalPath = pathname === "/company" ? "/about" : pathname;
  const canonical = `${BASE_URL}${canonicalPath === "/" ? "" : canonicalPath}`;
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const robots = escapeHtml(privateRobots || meta.robots);
  const socialImage = escapeHtml(meta.image || DEFAULT_SOCIAL_IMAGE);

  let result = template
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
    .replace(/<meta\s+name="title"[^>]*>/i, `<meta name="title" content="${title}" />`)
    .replace(/<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${description}" />`)
    .replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta\s+property="twitter:url"[^>]*>/i, `<meta property="twitter:url" content="${canonical}" />`)
    .replace(/<meta\s+property="twitter:title"[^>]*>/i, `<meta property="twitter:title" content="${title}" />`)
    .replace(/<meta\s+property="twitter:description"[^>]*>/i, `<meta property="twitter:description" content="${description}" />`)
    .replace(/<meta\s+property="og:image"[^>]*>/i, `<meta property="og:image" content="${socialImage}" />`)
    .replace(/<meta\s+property="twitter:image"[^>]*>/i, `<meta property="twitter:image" content="${socialImage}" />`);

  result = result.replace("</head>", `<meta name="robots" content="${robots}" />\n</head>`);
  return result;
}
