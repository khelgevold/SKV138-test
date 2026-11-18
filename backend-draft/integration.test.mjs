import test from "node:test";
import assert from "node:assert/strict";
import { createMigrationPreview, validateSharedState } from "./state-contract.mjs";
import { createSkv138Client } from "./client-adapter.mjs";
import { createLoginController } from "./login-controller.mjs";
import { mountLoginForm } from "./login-form.mjs";
import { createTestAccessVerifier } from "./access-verifier.mjs";
import { readResetToken, clearResetTokenFromUrl } from "./reset-link.mjs";

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

test("parallel saves are rejected before issuing a second PUT", async () => {
  let resolveSave;
  let putCount = 0;
  const fetchImpl = async (_url, opts) => {
    if (opts.method === "GET") return { ok: true, json: async () => ({ payload: state(), version: 3 }) };
    putCount++;
    await new Promise(resolve => { resolveSave = resolve; });
    return { ok: true, json: async () => ({ version: 4 }) };
  };
  const client = createSkv138Client({ authClient, fetchImpl, storage: storage({}) });
  await client.load();
  const first = client.save(state());
  await assert.rejects(client.save(state()), /already in progress/);
  for (let i = 0; i < 10 && !resolveSave; i++) await Promise.resolve();
  assert.equal(typeof resolveSave, "function");
  resolveSave();
  await first;
  assert.equal(putCount, 1);
});
test("unexpected server version never advances local version", async () => {
  const fetchImpl = async (_url, opts) => opts.method === "GET"
    ? { ok: true, json: async () => ({ payload: state(), version: 3 }) }
    : { ok: true, json: async () => ({ version: 99 }) };
  const client = createSkv138Client({ authClient, fetchImpl, storage: storage({}) });
  await client.load();
  await assert.rejects(client.save(state()), /Invalid server version/);
  assert.equal(client.getVersion(), 3);
});

test("registration cannot grant SKV138 app access", async () => {
  let submitted;
  const client = { ...authClient, signUp: { email: async input => { submitted = input; return { data: { user: { id: "unapproved" } } }; } } };
  const login = createLoginController(client);
  assert.deepEqual(await login.register(" NEW@EXAMPLE.COM ", "long-enough-password", "Test"), { ok: true });
  assert.equal(submitted.email, "new@example.com");
  assert.equal(submitted.name, "Test");
  assert.equal("access" in (await login.register("another@example.com", "long-enough-password", "Test")), false);
});
test("password reset request never reveals account existence", async () => {
  const client = { ...authClient, requestPasswordReset: async () => { throw Error("unknown email"); } };
  const result = await createLoginController(client).requestPasswordReset("missing@example.com");
  assert.equal(result.ok, true);
  assert.match(result.message, /Hvis tilbakestilling/);
});

test("login form blocks double submission and clears password", async () => {
  let listener;
  let resolveLogin;
  let attempts = 0;
  const nodes = {
    "#login": { addEventListener: (_name, fn) => { listener = fn; }, removeEventListener: () => {} },
    "#email": { value: "user@example.com" },
    "#password": { value: "secret-password" },
    "#submit": { disabled: false },
    "#status": { dataset: {}, textContent: "" },
  };
  let accessChecks = 0;
  mountLoginForm({
    document: { querySelector: selector => nodes[selector] },
    login: { signIn: async () => {
      attempts++;
      return new Promise(resolve => { resolveLogin = resolve; });
    } },
    onSignedIn: async () => { accessChecks++; },
  });
  const event = { preventDefault() {} };
  const first = listener(event);
  await listener(event);
  assert.equal(attempts, 1);
  assert.equal(nodes["#submit"].disabled, true);
  resolveLogin({ ok: true });
  await first;
  assert.equal(nodes["#password"].value, "");
  assert.equal(nodes["#submit"].disabled, false);
  assert.equal(accessChecks, 1);
});
test("login form handles rejected sign-in without checking app access", async () => {
  let listener;
  const nodes = {
    "#login": { addEventListener: (_name, fn) => { listener = fn; }, removeEventListener: () => {} },
    "#email": { value: "user@example.com" },
    "#password": { value: "wrong-password" },
    "#submit": { disabled: false },
    "#status": { dataset: {}, textContent: "" },
  };
  let accessChecks = 0;
  mountLoginForm({
    document: { querySelector: selector => nodes[selector] },
    login: { signIn: async () => ({ ok: false, message: "Feil innlogging" }) },
    onSignedIn: async () => { accessChecks++; },
  });
  await listener({ preventDefault() {} });
  assert.equal(nodes["#status"].dataset.error, "true");
  assert.equal(nodes["#password"].value, "");
  assert.equal(accessChecks, 0);
});

test("backend 403 prevents opening cabin data after successful sign-in", async () => {
  const verify = createTestAccessVerifier({
    storage: storage({}),
    fetchImpl: async () => ({ ok: false, status: 403, json: async () => ({ error: "Access denied" }) }),
  });
  assert.deepEqual(await verify(authClient), { status: "not_authorized" });
});
test("backend 404 is distinguished from missing authorization", async () => {
  const verify = createTestAccessVerifier({
    storage: storage({}),
    fetchImpl: async () => ({ ok: false, status: 404, json: async () => ({ error: "Not initialized" }) }),
  });
  assert.deepEqual(await verify(authClient), { status: "not_initialized" });
});

test("password reset completion sends token and new password to auth client", async () => {
  let submitted;
  const client = { ...authClient, resetPassword: async args => { submitted = args; return { data: { status: true } }; } };
  const result = await createLoginController(client).completePasswordReset("reset-token", "new-password-123");
  assert.equal(result.ok, true);
  assert.deepEqual(submitted, { token: "reset-token", newPassword: "new-password-123" });
});
test("password reset completion rejects short passwords and invalid links", async () => {
  const login = createLoginController({ ...authClient, resetPassword: async () => { throw Error("must not call"); } });
  assert.equal((await login.completePasswordReset("", "new-password-123")).ok, false);
  assert.equal((await login.completePasswordReset("token", "short")).ok, false);
});

test("reset link accepts a token only from the expected app origin", () => {
  assert.equal(readResetToken("https://test.example/reset?token=abc_123", "https://test.example"), "abc_123");
  assert.equal(readResetToken("https://evil.example/reset?token=abc_123", "https://test.example"), null);
  assert.equal(readResetToken("https://test.example/reset?token=%3Cscript%3E", "https://test.example"), null);
});
test("reset link cleanup removes token without changing other query parameters", () => {
  let target;
  clearResetTokenFromUrl({ replaceState: (_a, _b, url) => { target = url; } }, "https://test.example/reset?token=abc&view=compact#top");
  assert.equal(target, "/reset?view=compact#top");
});
