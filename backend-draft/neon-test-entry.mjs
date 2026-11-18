// SKV138 TEST login entrypoint for a bundler, not directly loaded by login-preview.html.
// The public Auth URL is the only environment-specific value in this file.
// Actual access is checked by the server via skv138_access; sign-in alone is insufficient.
import { createNeonTestLogin } from "./neon-auth-bootstrap.mjs";
import { SKV138_TEST_AUTH_URL } from "./neon-test-config.mjs";
import { mountLoginForm } from "./login-form.mjs";

export function startSkv138TestLogin({ document, verifyAccess, onAuthorized }) {
  if (typeof verifyAccess !== "function") throw new Error("Backend access verifier required");
  if (typeof onAuthorized !== "function") throw new Error("Authorized state handler required");
  const { login, authClient } = createNeonTestLogin(SKV138_TEST_AUTH_URL);
  const unmount = mountLoginForm({
    document,
    login,
    onSignedIn: async () => {
      // Must make an authenticated GET to the SKV138 backend before showing app data.
      const result = await verifyAccess(authClient);
      if (result?.status !== "ready") {
        throw new Error("SKV138 backend access not granted: " + (result?.status || "unknown"));
      }
      await onAuthorized(result.payload, result.client);
    },
  });
  return { unmount, authClient, login };
}
