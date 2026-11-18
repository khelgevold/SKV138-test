// Neon TEST auth bootstrap. Not activated in V16.23.
// The Auth URL is public configuration, not a database credential.
// Bundler must resolve @neondatabase/auth; do not load this file directly
// as a raw browser ES module without bundling.
import { createAuthClient } from "@neondatabase/neon-js/auth";
import { createLoginController } from "./login-controller.mjs";

export function createNeonTestLogin(authUrl) {
  if (typeof authUrl !== "string" || !/^https:\/\/[a-z0-9.-]+\//i.test(authUrl)) {
    throw new Error("Valid HTTPS Neon TEST Auth URL required");
  }
  const authClient = createAuthClient(authUrl);
  return { authClient, login: createLoginController(authClient) };
}
