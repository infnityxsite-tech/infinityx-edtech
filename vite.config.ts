import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

const copyBundledUploads = {
  name: "copy-bundled-uploads",
  closeBundle() {
    const destination = path.resolve(import.meta.dirname, "dist", "public", "uploads");
    fs.mkdirSync(destination, { recursive: true });
    for (const source of [
      path.resolve(import.meta.dirname, "uploads"),
      path.resolve(import.meta.dirname, "public", "uploads"),
    ]) {
      if (fs.existsSync(source)) fs.cpSync(source, destination, { recursive: true, force: true });
    }
  },
};

const plugins = [react(), tailwindcss(), vitePluginManusRuntime(), copyBundledUploads];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "B": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    assetsDir: "assets", // ✅ required to include JS/CSS
    chunkSizeWarningLimit: 2000,
  },
});
