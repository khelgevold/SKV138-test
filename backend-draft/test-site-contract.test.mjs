import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const read = path => readFileSync(resolve(root, path), "utf8");

test("isolated TEST shell imports only the built browser entry", () => {
  const html = read("test-site/index.html");
  const imports = [...html.matchAll(/from\s+["']([^"']+)["']/g)].map(m => m[1]);
  assert.deepEqual(imports, ["./neon-test-entry.js"]);
  assert.match(html, /createNeonTestSession\(\)/);
  assert.match(html, /if \(!token\)\s*\{[^}]*startConfiguredSkv138TestLogin\(/);
});

test("TEST browser bundle exports every helper imported by the shell", () => {
  const html = read("test-site/index.html");
  const match = html.match(/import\s*\{([^}]+)\}\s*from\s*["']\.\/neon-test-entry\.js["']/);
  assert.ok(match, "Expected browser entry import");
  const entry = read("neon-test-entry.mjs");
  const imported = match[1].split(",").map(x => x.trim());
  for (const name of imported) {
    assert.match(entry, new RegExp("\\b" + name + "\\b"), "Missing export: " + name);
  }
});

test("approved prototype is not referenced by isolated TEST shell", () => {
  const html = read("test-site/index.html");
  assert.doesNotMatch(html, /hytteokonomi-v3-test|\.\.\/\.\.\/index\.html/);
});
