/**
 * 🚀 InfinityX Project Diagnostic Tool
 * This script scans your project for key files and structures (frontend + backend)
 * and prints a detailed summary to help identify missing or mismatched components.
 */

const fs = require("fs");
const path = require("path");

const root = process.cwd();

const foldersToScan = [
  "src",
  "server",
  "client",
  "pages",
  "routes",
  "trpc",
  "drizzle",
  "prisma",
  "db",
];

const importantKeywords = [
  "createCourse",
  "updateCourse",
  "getCourses",
  "deleteCourse",
  "createJobListing",
  "updateJobListing",
  "getAllJobListings",
  "drizzle",
  "trpc",
  "zod",
  "schema",
  "router",
  "appRouter",
];

function scanDir(dir, level = 0) {
  let result = [];
  if (!fs.existsSync(dir)) return result;

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      result.push({ type: "dir", path: fullPath });
      result = result.concat(scanDir(fullPath, level + 1));
    } else if (stats.isFile()) {
      result.push({ type: "file", path: fullPath });
    }
  }

  return result;
}

console.log("🔍 Scanning project structure...\n");

let allFiles = [];
for (const folder of foldersToScan) {
  const full = path.join(root, folder);
  if (fs.existsSync(full)) {
    console.log(`📁 Found folder: ${folder}`);
    allFiles = allFiles.concat(scanDir(full));
  }
}

console.log("\n📊 Summary of detected files:\n");
allFiles
  .filter((f) => f.type === "file")
  .forEach((f) => console.log("  - " + f.path.replace(root, ".")));

console.log("\n🔎 Searching for important backend keywords...\n");

for (const f of allFiles.filter((f) => f.path.endsWith(".ts") || f.path.endsWith(".tsx") || f.path.endsWith(".js"))) {
  try {
    const content = fs.readFileSync(f.path, "utf8");
    importantKeywords.forEach((word) => {
      if (content.includes(word)) {
        console.log(`✅ ${word} found in ${f.path.replace(root, ".")}`);
      }
    });
  } catch (err) {
    console.log(`⚠️ Could not read ${f.path}: ${err.message}`);
  }
}

console.log("\n✅ Scan complete.\n");
console.log("➡️ Check above for where your TRPC methods and schema files exist.");
console.log("If you see NO lines mentioning createCourse/updateCourse — your backend lacks those routes.");
