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
  // Prevent a refresh restore and manual sign-in from initializing two state bridges.
  let authorized = false;
  let authorizationPending = null;
  const authorize = async () => {
    if (authorized) return true;
    if (authorizationPending) return authorizationPending;
    authorizationPending = (async () => {
      const result = await verifyAccess(authClient);
      if (result?.status !== "ready") {
        throw new Error("SKV138 backend access not granted: " + (result?.status || "unknown") + (result?.testDiagnostic ? " TEST_JWT_" + result.testDiagnostic : "") + (result?.testClaim ? " TEST_CLAIM_" + result.testClaim : "") + (result?.testReason ? " TEST_REASON_" + result.testReason : ""));
      }
      await onAuthorized(result.payload, result.client);
      authorized = true;
      return true;
    })();
    try { return await authorizationPending; }
    finally { authorizationPending = null; }
  };
  const unmount = mountLoginForm({
    document,
    login,
    onSignedIn: async () => {
      // Must make an authenticated GET to the SKV138 backend before showing app data.
      await authorize();
    },
  });
  // Recover an existing Neon session on refresh without storing JWTs locally.
  // Access to the app is still gated by the authenticated backend GET.
  let active = true;
  const restoreSession = async () => {
    try {
      const session = await login.session();
      if (!active || !session) return false;
      return await authorize();
    } catch {
      // An expired session or offline backend must leave the normal login available.
      return false;
    }
  };
  // Avoid running session restoration while the password-reset form is displayed.
  const restoring = document.querySelector("#login")?.hidden ? Promise.resolve(false) : restoreSession();
  return { unmount: () => { active = false; unmount(); }, authClient, login, restoring };
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

export { createV1623StateBridge } from './v1623-state-bridge.mjs';

export { initializePushSettings } from './push-client.mjs';
