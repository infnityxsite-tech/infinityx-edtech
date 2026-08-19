import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import certificatesRouter from "../routes/certificates";
import submissionsRouter from "../routes/submissions";
import uploadRouter from "../routes/upload";
import { query } from "../database";
import { handleRobots, handleSitemap } from "../seo";
import { routeRobots } from "../seoMeta";
import { createContext } from "./context";

const LOCAL_ORIGINS = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:8888",
  "http://127.0.0.1:8888",
]);

function configuredOrigins(): Set<string> {
  return new Set(
    (process.env.ALLOWED_ORIGINS || "")
      .split(",")
      .map(origin => origin.trim().replace(/\/$/, ""))
      .filter(Boolean)
  );
}

function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = req.get("origin")?.replace(/\/$/, "");
  if (!origin) return next();

  const requestOrigin = `${req.protocol}://${req.get("host")}`.replace(/\/$/, "");
  const allowedOrigins = configuredOrigins();
  const isAllowed =
    origin === requestOrigin ||
    allowedOrigins.has(origin) ||
    (process.env.NODE_ENV !== "production" && LOCAL_ORIGINS.has(origin));

  if (!isAllowed) return res.status(403).json({ error: "Origin is not allowed" });

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Accept,Authorization,Content-Type,X-Requested-With");
  res.append("Vary", "Origin");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  return next();
}

async function markMissingPublicRecord(
  table: "programs" | "services" | "industries" | "blog_posts" | "courses",
  column: "id" | "slug",
  value: string,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await query(`SELECT 1 FROM ${table} WHERE ${column} = $1 LIMIT 1`, [value]);
    if (result.rows.length === 0) res.status(404);
  } catch {
    // The SPA can still render if a content table is temporarily unavailable.
  }
  next();
}

/**
 * Create the shared API application without starting a listener or mutating the
 * database. Local/Render startup and Netlify Functions both use this factory.
 */
export function createApp() {
  const app = express();

  // Netlify and Render terminate TLS before forwarding requests to Express.
  app.set("trust proxy", 1);
  app.use(corsMiddleware);
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  app.use((req, res, next) => {
    const robots = routeRobots(req.path);
    if (robots) res.set("X-Robots-Tag", robots);
    next();
  });

  app.get("/api/health", (_req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      message: "InfinityX EdTech API is running",
    });
  });
  app.get("/sitemap.xml", handleSitemap);
  app.get("/robots.txt", handleRobots);

  app.use("/api/upload", uploadRouter);
  app.use("/api/certificates", certificatesRouter);
  app.use("/api/submissions", submissionsRouter);

  // These are bundled, read-only assets. Runtime uploads never target them.
  app.get("/uploads/:filename.png", (req, res, next) => {
    const webpName = `${req.params.filename}.webp`;
    const exists = [
      path.join(process.cwd(), "uploads", webpName),
      path.join(process.cwd(), "public", "uploads", webpName),
    ].some(candidate => fs.existsSync(candidate));
    if (exists) return res.redirect(301, `/uploads/${encodeURIComponent(webpName)}`);
    return next();
  });
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads"), { fallthrough: true }));
  app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads"), { fallthrough: true }));

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.get("/program/:id", (req, res, next) => markMissingPublicRecord("programs", "id", req.params.id, res, next));
  app.get("/solutions/:slug", (req, res, next) => markMissingPublicRecord("services", "slug", req.params.slug, res, next));
  app.get("/industries/:slug", (req, res, next) => markMissingPublicRecord("industries", "slug", req.params.slug, res, next));
  app.get("/blog/:id", (req, res, next) => markMissingPublicRecord("blog_posts", "id", req.params.id, res, next));
  app.get("/courses/recorded/:id/preview", (req, res, next) => markMissingPublicRecord("courses", "id", req.params.id, res, next));

  const academySchoolSlugs = new Set(["ai-and-data-science", "cybersecurity", "full-stack-solutions", "space-solutions"]);
  const programCategorySlugs = new Set(["space", "ai", "software", "security"]);
  app.get("/academy/:school", (req, res, next) => {
    if (!academySchoolSlugs.has(req.params.school)) res.status(404);
    next();
  });
  app.get("/programs/:category", (req, res, next) => {
    if (!programCategorySlugs.has(req.params.category)) res.status(404);
    next();
  });

  return app;
}
