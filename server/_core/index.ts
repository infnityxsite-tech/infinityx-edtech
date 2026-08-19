import "dotenv/config";
import { createServer } from "http";
import net from "net";
import { autoInitializeDatabase } from "../auto-init-db";
import { createApp } from "./app";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const testServer = net.createServer();
    testServer.listen(port, () => testServer.close(() => resolve(true)));
    testServer.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const shouldInitializeDatabase =
    process.env.AUTO_INITIALIZE_DATABASE === "true" ||
    (process.env.NODE_ENV === "development" && process.env.AUTO_INITIALIZE_DATABASE !== "false");

  if (shouldInitializeDatabase) {
    try {
      await autoInitializeDatabase();
    } catch (error) {
      console.error("Database initialization failed; the server will continue:", error);
    }
  }

  const app = createApp();
  const server = createServer(app);

  if (process.env.NODE_ENV === "development") await setupVite(app, server);
  else serveStatic(app);

  const preferredPort = Number.parseInt(process.env.PORT || "3000", 10);
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) console.log(`Port ${preferredPort} is busy, using ${port}`);

  server.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
}

startServer().catch(error => {
  console.error("Server startup failed:", error);
});

