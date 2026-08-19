import "dotenv/config";
import express from "express";
import uploadRouter from "../routes/upload";
import certificatesRouter from "../routes/certificates";
import submissionsRouter from "../routes/submissions";
import { createServer } from "http";
import net from "net";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { autoInitializeDatabase } from "../auto-init-db";
import { handleSitemap, handleRobots } from "../seo";
import { routeRobots } from "../seoMeta";
import { query } from "../database";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  // Auto-initialize database on startup (no shell access needed!)
  try {
    await autoInitializeDatabase();
  } catch (error) {
    console.error('⚠️  Database initialization failed:', error);
    console.error('⚠️  Server will continue, but database operations may fail');
  }

  const app = express();
  const server = createServer(app);

  // Configure CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cookie');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Keep private application surfaces out of search even before the SPA hydrates.
  app.use((req, res, next) => {
    const robots = routeRobots(req.path);
    if (robots) res.set("X-Robots-Tag", robots);
    next();
  });

  // SEO: Dynamic sitemap.xml and robots.txt
  app.get("/sitemap.xml", handleSitemap);
  app.get("/robots.txt", handleRobots);

  // File upload route
  app.use("/api/upload", uploadRouter);
  app.use("/api/certificates", certificatesRouter);
  app.use("/api/submissions", submissionsRouter);
  app.use("/uploads", express.static("uploads"));
  app.use("/submissions", express.static(path.join("public", "submissions")));

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Preserve the SPA's visual not-found experience while returning an actual
  // 404 status to crawlers for missing public records. Without these guards,
  // Vite's history fallback would serve the app shell with HTTP 200.
  const forwardIfPublicRecordMissing = async (
    table: "programs" | "services" | "industries" | "blog_posts" | "courses",
    column: "id" | "slug",
    value: string,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const result = await query(`SELECT 1 FROM ${table} WHERE ${column} = $1 LIMIT 1`, [value]);
      if (result.rows.length === 0) res.status(404);
    } catch {
      // Keep the application available if a fresh database has not created a
      // content table yet; the client will still render its not-found state.
    }
    next();
  };

  app.get("/program/:id", (req, res, next) => forwardIfPublicRecordMissing("programs", "id", req.params.id, res, next));
  app.get("/solutions/:slug", (req, res, next) => forwardIfPublicRecordMissing("services", "slug", req.params.slug, res, next));
  app.get("/industries/:slug", (req, res, next) => forwardIfPublicRecordMissing("industries", "slug", req.params.slug, res, next));
  app.get("/blog/:id", (req, res, next) => forwardIfPublicRecordMissing("blog_posts", "id", req.params.id, res, next));
  app.get("/courses/recorded/:id/preview", (req, res, next) => forwardIfPublicRecordMissing("courses", "id", req.params.id, res, next));

  const academySchoolSlugs = new Set(["ai-and-data-science", "cybersecurity", "full-stack-solutions", "space-solutions"]);
  const programCategorySlugs = new Set(["space", "ai", "software", "security"]);
  app.get("/academy/:school", (req, res, next) => { if (!academySchoolSlugs.has(req.params.school)) res.status(404); next(); });
  app.get("/programs/:category", (req, res, next) => { if (!programCategorySlugs.has(req.params.category)) res.status(404); next(); });

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
