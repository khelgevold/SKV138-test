import test from "node:test";
import assert from "node:assert/strict";
import { createMigrationPreview, validateSharedState } from "./state-contract.mjs";
import { createSkv138Client } from "./client-adapter.mjs";
import { createLoginController } from "./login-controller.mjs";

const state = () => ({
  settings: { checkin: "16:00" },
  bookings: [{ id: 1, name: "Test" }],
  stock: [{ id: 1, name: "Kaffe" }],
  completed: {},
  templates: { before: [{ id: "b1" }], after: [] },
  privateLocations: ["Bod"],
});
const storage = values => ({ getItem: key => Object.hasOwn(values, key) ? values[key] : null });
const authClient = {
  token: async () => ({ data: { token: "test-token" } }),
  signIn: { email: async () => ({ data: { user: { id: "u1" } } }) },
  getSession: async () => ({ data: { session: { id: "s1" } } }),
  signOut: async () => ({ data: {} }),
};

test("migration preview reads original state and separate locations without writing", () => {
  const local = { "hytteokonomi-v3-test": JSON.stringify(state()), "skv138_private_locations": '["Kjøkken","Bod"]' };
  const result = createMigrationPreview(storage(local));
  assert.equal(result.status, "ready");
  assert.deepEqual(result.payload.privateLocations, ["Kjøkken", "Bod"]);
  assert.equal(result.summary.bookings, 1);
});
test("invalid local JSON is rejected, not replaced", () => {
  assert.equal(createMigrationPreview(storage({ "hytteokonomi-v3-test": "{" })).status, "invalid");
});
test("missing local state is not silently seeded", () => {
  assert.equal(createMigrationPreview(storage({})).status, "missing");
});
test("invalid state is rejected", () => {
  assert.equal(validateSharedState({ ...state(), bookings: null }), false);
});
test("client requires load before saving", async () => {
  const client = createSkv138Client({ authClient, fetchImpl: async () => { throw Error("Unexpected request"); }, storage: storage({}) });
  await assert.rejects(client.save(state()), /Load server state/);
});
test("client uses Bearer token and increments version", async () => {
  const calls = [];
  const fetchImpl = async (url, opts) => {
    calls.push({ url, opts });
    return { ok: true, status: 200, json: async () => opts.method === "GET"
      ? { payload: state(), version: 1 } : { version: 2 } };
  };
  const client = createSkv138Client({ authClient, fetchImpl, storage: storage({}) });
  await client.load();
  await client.save(state());
  assert.equal(client.getVersion(), 2);
  assert.equal(calls[0].opts.headers.Authorization, "Bearer test-token");
  assert.equal(JSON.parse(calls[1].opts.body).expectedVersion, 1);
});
test("409 does not advance version", async () => {
  const fetchImpl = async (_url, opts) => opts.method === "GET"
    ? { ok: true, json: async () => ({ payload: state(), version: 7 }) }
    : { ok: false, status: 409, json: async () => ({ error: "Conflict" }) };
  const client = createSkv138Client({ authClient, fetchImpl, storage: storage({}) });
  await client.load();
  await assert.rejects(client.save(state()), error => error.status === 409);
  assert.equal(client.getVersion(), 7);
});
test("login does not equate successful authentication with app access", async () => {
  const login = createLoginController(authClient);
  assert.deepEqual(await login.signIn(" TEST@EXAMPLE.COM ", "pass"), { ok: true });
  assert.ok((await login.session()).session);
});
