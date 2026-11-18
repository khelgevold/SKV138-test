import test from "node:test";
import assert from "node:assert/strict";
import { createV1623StateBridge } from "./v1623-state-bridge.mjs";

const initial = () => ({
  settings: { checkin: "16:00", checkout: "12:00" },
  bookings: [], stock: [], completed: {},
  templates: { before: [], after: [] },
  privateLocations: ["Bod"],
});
test("bridge refuses editing before authenticated GET", () => {
  const bridge = createV1623StateBridge({ client: { load: async () => initial(), save: async () => {} } });
  assert.throws(() => bridge.commit(initial()), /before editing/);
  assert.throws(() => bridge.current(), /before reading/);
});
test("bridge loads server data and protects its state from external mutation", async () => {
  const bridge = createV1623StateBridge({ client: { load: async () => initial(), save: async () => {}, getVersion: () => 1 } });
  const loaded = await bridge.initialize();
  loaded.privateLocations.push("Other");
  assert.deepEqual(bridge.current().privateLocations, ["Bod"]);
  assert.equal(bridge.getStatus().version, 1);
  await assert.rejects(bridge.initialize(), /already initialized/);
});
test("bridge saves valid changes and rejects invalid payload", async () => {
  const saved = [];
  const bridge = createV1623StateBridge({ client: { load: async () => initial(), save: async x => { saved.push(x); } } });
  await bridge.initialize();
  assert.throws(() => bridge.commit({ ...initial(), stock: null }), /Invalid shared state/);
  const next = initial(); next.bookings.push({ id: 1 });
  assert.equal(bridge.commit(next), true);
  await bridge.whenIdle();
  assert.equal(saved[0].bookings.length, 1);
});
test("bridge blocks writes on conflict and preserves latest unsaved edit", async () => {
  let fail;
  const statuses = [];
  const bridge = createV1623StateBridge({
    client: {
      load: async () => initial(),
      save: async () => { await new Promise(resolve => { fail = resolve; }); throw Object.assign(new Error("conflict"), { status: 409 }); },
    },
    onStatus: status => statuses.push(status.type),
  });
  await bridge.initialize();
  const first = initial(); first.bookings.push({ id: 1 });
  const second = initial(); second.bookings.push({ id: 2 });
  bridge.commit(first);
  bridge.commit(second);
  fail();
  await bridge.whenIdle();
  assert.equal(bridge.getStatus().blocked, true);
  assert.equal(bridge.commit(initial()), false);
  assert.deepEqual(bridge.getRecoveryData().latest.bookings, [{ id: 2 }]);
  assert.deepEqual(bridge.getRecoveryData().failed.bookings, [{ id: 1 }]);
  assert.equal(statuses.at(-1), "conflict");
});

test("authorized payload is reused without a second database GET", async () => {
  let loads=0;
  const bridge=createV1623StateBridge({
    client:{load:async()=>{loads++;return initial()},save:async()=>{}},
  });
  const server=initial();
  server.privateLocations.push("Kjøkkenskap");
  const result=await bridge.initialize(server);
  assert.equal(loads,0);
  assert.deepEqual(result.privateLocations,["Bod","Kjøkkenskap"]);
});
