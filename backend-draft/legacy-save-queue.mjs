// Isolated TEST bridge for V16.23's synchronous save() calls.
// Not activated until the authenticated TEST app shell loads server state first.
// Serializes writes; never silently retries a 409 or replaces a failed save.
export function createLegacySaveQueue({ client, onStatus = () => {} }) {
  if (!client || typeof client.save !== "function") throw new Error("Client required");
  let blocked = false;
  let active = false;
  let pending = null;
  let idleWaiters = [];
  let failedSnapshot = null;
  const settle = () => {
    if (!active && pending === null) {
      const waiters = idleWaiters; idleWaiters = [];
      for (const resolve of waiters) resolve();
    }
  };
  async function flush() {
    if (active || blocked) return;
    active = true;
    try {
      while (pending !== null && !blocked) {
        const payload = pending;
        pending = null;
        try {
          await client.save(payload);
          if (pending === null) onStatus({ type: "saved", version: client.getVersion?.() });
        } catch (error) {
          // Stop all further writes until a user explicitly resolves the conflict/error.
          blocked = true;
          failedSnapshot = payload;
          pending = null;
          onStatus({ type: error?.status === 409 ? "conflict" : "error" });
        }
      }
    } finally {
      active = false;
      settle();
    }
  }
  return {
    enqueue(payload) {
      if (blocked) return false;
      // Snapshot at time of edit; avoid later mutations changing an in-flight payload.
      const snapshot = JSON.parse(JSON.stringify(payload));
      pending = snapshot;
      onStatus({ type: "pending" });
      void flush();
      return true;
    },
    isBlocked: () => blocked,
    // The UI can offer a local export when a write fails; never silently discard edits.
    getFailedSnapshot: () => failedSnapshot === null ? null : JSON.parse(JSON.stringify(failedSnapshot)),
    whenIdle: () => (!active && pending === null) ? Promise.resolve() : new Promise(resolve => idleWaiters.push(resolve)),
  };
}
