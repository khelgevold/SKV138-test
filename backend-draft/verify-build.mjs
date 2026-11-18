// Verify the generated browser artifact, not only source-level import names.
// Run after npm run build:auth; no network, Neon secrets, or deployment.
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "test-site");
const html = readFileSync(resolve(root, "index.html"), "utf8");
const bundlePath = resolve(root, "neon-test-entry.js");
const bundle = readFileSync(bundlePath, "utf8");
const match = html.match(/import\s*\{([^}]+)\}\s*from\s*["']\.\/neon-test-entry\.js["']/);
if (!match) throw Error("TEST page must import bundled browser entry");
const required = match[1].split(",").map(x => x.trim()).filter(Boolean);
const exportMatch = bundle.match(/export\s*\{([^}]+)\}/g) || [];
const exportsText = exportMatch.join("\n");
for (const name of required) {
  if (!new RegExp("\\b" + name + "\\b").test(exportsText)) {
    throw Error("Built bundle missing export: " + name);
  }
}
if (statSync(bundlePath).size < 1000) throw Error("Unexpectedly small browser bundle");
if (/\.\.\/\.\.\/index\.html/.test(html)) throw Error("Approved prototype must remain isolated");
console.log("Verified TEST bundle and", required.length, "browser exports");
