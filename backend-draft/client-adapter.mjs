// SKV138 TEST integration adapter — NOT included in V16.23 or deployed.
// Inject the real Neon Auth client; never put secrets in the browser.
import { createMigrationPreview, validateSharedState, validateLocations } from "./state-contract.mjs";
import { SKV138_TEST_AUTH_URL } from "./neon-test-config.mjs";

export function createSkv138Client({ authClient, fetchImpl, storage, endpoint = "/.netlify/functions/skv138-state" }) {
  if (!authClient || typeof authClient.token !== "function") throw new Error("Neon authClient.token() required");
  if (typeof fetchImpl !== "function") throw new Error("fetch implementation required");
  if (!storage || typeof storage.getItem !== "function") throw new Error("local storage reader required");
  let version = null;
  let saving = false;

  async function request(method, body) {
    // Always acquire a fresh short-lived JWT. Never persist JWT to localStorage.
    let token = null;
    try {
      const result = await authClient.token();
      if (!result?.error && typeof result?.data?.token === "string" && result.data.token) {
        token = result.data.token;
      }
    } catch {
      // Fall through to the documented managed Auth REST endpoint.
    }
    if (!token) {
      let tokenResponse;
      try {
        tokenResponse = await fetchImpl(SKV138_TEST_AUTH_URL.replace(/\/$/, "") + "/token", {
          method: "GET",
          credentials: "include",
        });
      } catch {
        throw new Error("TEST_DIAG_TOKEN_ENDPOINT_FETCH_FAILED");
      }
      if (!tokenResponse.ok) {
        const error = new Error("TEST_DIAG_TOKEN_ENDPOINT_HTTP_" + tokenResponse.status);
        error.status = tokenResponse.status;
        error.stage = "authentication";
        throw error;
      }
      let tokenData;
      try { tokenData = await tokenResponse.json(); }
      catch { throw new Error("TEST_DIAG_TOKEN_ENDPOINT_INVALID_JSON"); }
      token = tokenData?.token;
    }
    if (typeof token !== "string" || !token) throw new Error("TEST_DIAG_TOKEN_MISSING");
    let response;
    try {
      response = await fetchImpl(endpoint, {
        method,
        credentials: "omit",
        headers: {
          Authorization: "Bearer " + token,
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
    } catch { throw new Error("TEST_DIAG_FETCH_FAILED"); }
    let data;
    try { data = await response.json(); }
    catch {
      // TEST-only: reveal HTTP status and content type, never response body or token.
      const code = Number.isInteger(response.status) ? response.status : "unknown";
      const type = response.headers?.get?.("content-type") || "missing";
      const kind = type.includes("text/html") ? "HTML" : type.includes("text/plain") ? "TEXT" : type.includes("application/json") ? "JSON" : "OTHER";
      const error = new Error("TEST_DIAG_RESPONSE_NOT_JSON_HTTP_" + code + "_TYPE_" + kind);
      error.status = response.status;
      throw error;
    }
    if (!response.ok) {
      const error = new Error(response.status === 409 ? "Conflict: reload before saving" : (data.error || "Request failed"));
      error.status = response.status;
      if (response.status === 401 && typeof data.testDiagnostic === "string" && /^[A-Z_]{2,60}$/.test(data.testDiagnostic)) {
        error.testDiagnostic = data.testDiagnostic;
        if (["iss", "aud", "sub", "exp", "nbf", "iat", "jti", "unknown"].includes(data.testClaim)) error.testClaim = data.testClaim;
        if (["check_failed", "missing", "invalid", "unknown"].includes(data.testReason)) error.testReason = data.testReason;
      }
      throw error;
    }
    return data;
  }

  return {
    previewImport: () => createMigrationPreview(storage),
    async load() {
      const data = await request("GET");
      if (!validateSharedState(data.payload) || !validateLocations(data.payload.privateLocations)) {
        throw new Error("Server returned invalid state");
      }
      version = Number(data.version);
      if (!Number.isSafeInteger(version) || version < 1) throw new Error("Invalid server version");
      return data.payload;
    },
    async save(payload) {
      if (saving) throw new Error("Save already in progress");
      if (version === null) throw new Error("Load server state before saving");
      if (!validateSharedState(payload) || !validateLocations(payload.privateLocations)) {
        throw new Error("Invalid state");
      }
      saving = true;
      try {
        const data = await request("PUT", { payload, expectedVersion: version });
        const nextVersion = Number(data.version);
        if (!Number.isSafeInteger(nextVersion) || nextVersion !== version + 1) {
          throw new Error("Invalid server version after save");
        }
        version = nextVersion;
        return data;
      } finally {
        saving = false;
      }
    },
    // The adapter intentionally does not initialize the DB, write localStorage,
    // auto-import sample data, or overwrite local edits after a conflict.
    getVersion: () => version,
  };
}
