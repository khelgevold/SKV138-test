import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("./test-site/app.html", import.meta.url), "utf8");
const shell = readFileSync(new URL("./test-site/index.html", import.meta.url), "utf8");

test("isolated app requires authorized parent bridge", () => {
  assert.match(app, /window\.parent\.__SKV138_TEST_BRIDGE__/);
  assert.match(app, /skv138TestBridge\.current\(\)/);
  assert.match(app, /skv138TestBridge\.commit\(/);
});
test("shared app never uses local prototype state or reset button", () => {
  assert.doesNotMatch(app, /state=JSON\.parse\(hytteStorage\.getItem\(KEY\)/);
  assert.doesNotMatch(app, /hytteStorage\.setItem\(KEY/);
  assert.doesNotMatch(app, /localStorage\.removeItem\(KEY\)/);
  assert.match(app, /Ugyldig Neon TEST-data/);
});
test("authenticated shell mounts TEST app and guards unsaved edits", () => {
  assert.match(shell, /bridge\.initialize\(payload\)/);
  assert.match(shell, /createV1623StateBridge/);
  assert.match(shell, /getRecoveryData\(\)/);
  assert.match(shell, /beforeunload/);
  assert.match(shell, /app-frame/);
});
