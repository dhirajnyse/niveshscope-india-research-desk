import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const failures = [];

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function listFiles(dir) {
  return readdirSync(join(root, dir)).flatMap((entry) => {
    const path = join(dir, entry);
    const fullPath = join(root, path);
    return statSync(fullPath).isDirectory() ? listFiles(path) : [path];
  });
}

const index = read("index.html");
const app = read("app.js");

assert(index.includes("Content-Security-Policy"), "index.html is missing the CSP meta tag.");
assert(index.includes("Collection assistant v24"), "index.html does not show the v24 status marker.");
assert(!/\son[a-z]+\s*=/i.test(index), "index.html contains an inline event handler.");
assert(app.includes('const DATA_VERSION = "20260508-21";'), "app.js DATA_VERSION is not aligned with v24.");
assert(app.includes("normalizeExternalUrl"), "app.js is missing source URL normalization.");
assert(app.includes("MAX_IMPORT_FILE_BYTES"), "app.js is missing import size limits.");
assert(app.includes("STARTER_PACK_TICKERS"), "app.js is missing the real-source starter pack list.");
assert(app.includes("makeInvestmentReadinessNotice"), "app.js is missing investment-use readiness warnings.");
assert(app.includes("makeSourceCollectionSteps"), "app.js is missing source collection assistant steps.");
assert(app.includes("Open source site"), "app.js is missing explicit source-opening labels.");
assert(app.includes("Fill URL"), "app.js is missing explicit URL-fill labels.");

for (const file of listFiles("data").filter((name) => name.endsWith(".json"))) {
  try {
    JSON.parse(read(file));
  } catch (error) {
    failures.push(`${file} is not valid JSON: ${error.message}`);
  }
}

for (const required of [
  "README.md",
  "SECURITY.md",
  "docs/ARCHITECTURE.md",
  "docs/DATA_PROVENANCE.md",
  "docs/REAL_SOURCE_STARTER_PACK.md",
  "docs/SOURCE_COLLECTION_ASSISTANT.md",
  "docs/LAUNCH_ROADMAP.md",
  "docs/REPO_OPERATIONS.md"
]) {
  assert(read(required).trim().length > 200, `${required} is missing or too short.`);
}

if (failures.length) {
  console.error("NiveshScope static checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("NiveshScope static checks passed.");
