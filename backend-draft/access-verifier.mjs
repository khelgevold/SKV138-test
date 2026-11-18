// Explicit server-side authorization check for the isolated SKV138 TEST login.
// A successful Neon Auth session is not sufficient to open shared cabin data.
import { createSkv138Client } from "./client-adapter.mjs";

export function createTestAccessVerifier({ fetchImpl, storage }) {
  return async function verifyAccess(authClient) {
    const client = createSkv138Client({ authClient, fetchImpl, storage });
    try {
      const payload = await client.load();
      return { status: "ready", payload, client };
    } catch (error) {
      if (error.status === 401) return { status: "login_required" };
      if (error.status === 403) return { status: "not_authorized" };
      if (error.status === 404) return { status: "not_initialized" };
      throw error;
    }
  };
}
