// SKV138 TEST login entrypoint for a bundler, not directly loaded by login-preview.html.
// The public Auth URL is the only environment-specific value in this file.
// Actual access is checked by the server via skv138_access; sign-in alone is insufficient.
import { createNeonTestLogin } from "./neon-auth-bootstrap.mjs";
import { SKV138_TEST_AUTH_URL } from "./neon-test-config.mjs";
import { mountLoginForm } from "./login-form.mjs";
import { createTestAccessVerifier } from "./access-verifier.mjs";

export function startSkv138TestLogin({ document, verifyAccess, onAuthorized, neonLogin }) {
  if (typeof verifyAccess !== "function") throw new Error("Backend access verifier required");
  if (typeof onAuthorized !== "function") throw new Error("Authorized state handler required");
  const { login, authClient } = neonLogin || createNeonTestLogin(SKV138_TEST_AUTH_URL);
  const unmount = mountLoginForm({
    document,
    login,
    onSignedIn: async () => {
      // TEST-only diagnostics: read the unverified issuer claim to assist
      // configuration. Never use decoded claims for authorization.
      try {
        const tokenResult = await authClient.token();
        const jwt = tokenResult?.data?.token;
        if (typeof jwt === "string" && jwt.split(".").length === 3) {
          const encoded = jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
          const headerEncoded = jwt.split(".")[0].replace(/-/g, "+").replace(/_/g, "/");
          const header = JSON.parse(atob(headerEncoded));
          const algorithm = typeof header.alg === "string" && /^[A-Za-z0-9_-]{1,20}$/.test(header.alg) ? header.alg : "unknown";
          const statusElementForAlg = document.querySelector("#status");
          if (statusElementForAlg) statusElementForAlg.dataset.testJwtAlg = algorithm;
          const claims = JSON.parse(atob(encoded));
          if (typeof claims.iss === "string" && claims.iss.startsWith("https://") && claims.iss.length <= 500) {
            const statusElement = document.querySelector("#status");
            if (statusElement) statusElement.dataset.testIssuer = claims.iss;
          }
        }
      } catch { /* Diagnostics must never affect login or access decisions. */ }
      // Must make an authenticated GET to the SKV138 backend before showing app data.
      const result = await verifyAccess(authClient);
      if (result?.status !== "ready") {
        throw new Error("SKV138 backend access not granted: " + (result?.status || "unknown") + (result?.testDiagnostic ? " TEST_JWT_" + result.testDiagnostic : ""));
      }
      await onAuthorized(result.payload, result.client);
    },
  });
  return { unmount, authClient, login };
}

// Use this entrypoint once a bundler and TEST backend have been configured.
// The backend GET checks the allowlist; only then is onAuthorized invoked.
export function startConfiguredSkv138TestLogin({ document, fetchImpl, storage, onAuthorized, neonLogin }) {
  const verifyAccess = createTestAccessVerifier({ fetchImpl, storage });
  return startSkv138TestLogin({ document, verifyAccess, onAuthorized, neonLogin });
}
 
export { mountPasswordResetForm } from "./password-reset-form.mjs";
export { mountNewPasswordForm } from "./new-password-form.mjs";
export { readResetToken, clearResetTokenFromUrl } from "./reset-link.mjs";
export function createNeonTestLoginController() { return createNeonTestLogin(SKV138_TEST_AUTH_URL).login; }
export function createNeonTestSession() { return createNeonTestLogin(SKV138_TEST_AUTH_URL); }
