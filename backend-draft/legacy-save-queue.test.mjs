import test from "node:test";
import assert from "node:assert/strict";
import { createLegacySaveQueue } from "./legacy-save-queue.mjs";

const tick = () => new Promise(resolve => setImmediate(resolve));

test("serializes saves and coalesces pending edits", async () => {
  let release;
  const calls = [];
  let version = 1;
  const statuses = [];
  const client = {
    save: async value => {
      calls.push(value);
      if (calls.length === 1) await new Promise(resolve => { release = resolve; });
      version++;
    },
    getVersion: () => version,
  };
  const queue = createLegacySaveQueue({ client, onStatus: status => statuses.push(status.type) });
  assert.equal(queue.enqueue({ value: 1 }), true);
  queue.enqueue({ value: 2 });
  queue.enqueue({ value: 3 });
  assert.equal(calls.length, 1);
  release();
  await queue.whenIdle();
  assert.deepEqual(calls, [{ value: 1 }, { value: 3 }]);
  assert.equal(queue.isBlocked(), false);
  assert.equal(statuses.at(-1), "saved");
});

test("snapshots edits so later mutations cannot change in-flight data", async () => {
  const calls = [];
  const queue = createLegacySaveQueue({ client: { save: async x => { calls.push(x); } } });
  const payload = { stock: [{ qty: 1 }] };
  queue.enqueue(payload);
  payload.stock[0].qty = 99;
  await queue.whenIdle();
  assert.equal(calls[0].stock[0].qty, 1);
});

test("409 blocks further writes without retry or overwrite", async () => {
  let count = 0;
  const statuses = [];
  const queue = createLegacySaveQueue({
    client: { save: async () => { count++; throw Object.assign(new Error("Conflict"), { status: 409 }); } },
    onStatus: s => statuses.push(s.type),
  });
  queue.enqueue({ value: 1 });
  await queue.whenIdle();
  assert.equal(queue.isBlocked(), true);
  assert.equal(queue.enqueue({ value: 2 }), false);
  assert.equal(count, 1);
  assert.deepEqual(queue.getFailedSnapshot(), { value: 1 });
  assert.deepEqual(statuses, ["pending", "conflict"]);
});

test("other save errors also block further writes", async () => {
  const statuses = [];
  const queue = createLegacySaveQueue({
    client: { save: async () => { throw Error("Network error"); } },
    onStatus: s => statuses.push(s.type),
  });
  queue.enqueue({ value: 1 });
  await queue.whenIdle();
  assert.equal(queue.isBlocked(), true);
  assert.equal(statuses.at(-1), "error");
});
