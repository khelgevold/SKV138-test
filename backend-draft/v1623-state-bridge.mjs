// Pure bridge between approved V16.23 state and the isolated Neon TEST API.
// This module does not modify the approved UI, browser storage or network.
import { validateSharedState, validateLocations } from "./state-contract.mjs";
import { createLegacySaveQueue } from "./legacy-save-queue.mjs";

export function createV1623StateBridge({ client, onStatus = () => {} }) {
  if (!client || typeof client.load !== "function" || typeof client.save !== "function") {
    throw new Error("Authenticated state client required");
  }
  let ready = false;
  let current = null;
  let queue = null;
  const copy = value => JSON.parse(JSON.stringify(value));

  function valid(payload) {
    return validateSharedState(payload) && validateLocations(payload.privateLocations);
  }

  return {
    async initialize() {
      if (ready) throw new Error("State bridge already initialized");
      // No app rendering or editing until the authorized backend GET succeeds.
      const server = await client.load();
      if (!valid(server)) throw new Error("Invalid Neon TEST state");
      current = copy(server);
      queue = createLegacySaveQueue({ client, onStatus });
      ready = true;
      return copy(current);
    },
    commit(next) {
      if (!ready) throw new Error("Load shared state before editing");
      if (queue.isBlocked()) return false;
      if (!valid(next)) throw new Error("Invalid shared state");
      const snapshot = copy(next);
      if (!queue.enqueue(snapshot)) return false;
      current = snapshot;
      return true;
    },
    current() {
      if (!ready) throw new Error("Load shared state before reading");
      return copy(current);
    },
    getStatus() {
      return { ready, blocked: queue?.isBlocked() ?? false, version: client.getVersion?.() ?? null };
    },
    getRecoveryData() {
      if (!queue?.isBlocked()) return null;
      // Preserve latest local edits as well as the failed in-flight snapshot.
      return { latest: copy(current), failed: queue.getFailedSnapshot() };
    },
    whenIdle: () => queue ? queue.whenIdle() : Promise.resolve(),
  };
}
