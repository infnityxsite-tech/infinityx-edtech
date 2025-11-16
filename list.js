import fs from "fs";
import path from "path";

function listFiles(dir, prefix = "") {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  let output = "";

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    output += prefix + (item.isDirectory() ? "📁 " : "📄 ") + item.name + "\n";

    if (item.isDirectory()) {
      output += listFiles(fullPath, prefix + "   ");
    }
  }

  return output;
}

const result = listFiles("./");

fs.writeFileSync("project_structure.txt", result, "utf-8");

console.log("✅ File saved: project_structure.txt");
