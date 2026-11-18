// SKV138 V16.23 storage contract. Pure helpers: no browser, DB or network access.
// This file is NOT connected to the approved prototype.
export const STATE_KEY = "hytteokonomi-v3-test";
export const LOCATIONS_KEY = "skv138_private_locations";
export const THEME_KEY = "hytteokonomi-theme";

const record = x => x !== null && typeof x === "object" && !Array.isArray(x);
export function validateSharedState(state) {
  if (!record(state) || !record(state.settings) ||
      !Array.isArray(state.bookings) || !Array.isArray(state.stock) ||
      !record(state.completed) || !record(state.templates) ||
      !Array.isArray(state.templates.before) || !Array.isArray(state.templates.after)) {
    return false;
  }
  // The prototype can add fields; do not reject unknown keys or rewrite them.
  return state.bookings.every(record) && state.stock.every(record) &&
    state.templates.before.every(record) && state.templates.after.every(record);
}
export function validateLocations(locations) {
  return Array.isArray(locations) && locations.every(x => typeof x === "string");
}
export function createMigrationPreview(storage) {
  // No writes. Caller must explicitly confirm before importing anything.
  const raw = storage.getItem(STATE_KEY);
  const locationsRaw = storage.getItem(LOCATIONS_KEY);
  if (raw === null) return { status: "missing", message: "No local SKV138 state found" };
  let state, locations;
  try {
    state = JSON.parse(raw);
    locations = locationsRaw === null ? ["Kjøleskap", "Kjøkkenskap", "Bod"] : JSON.parse(locationsRaw);
  } catch {
    return { status: "invalid", message: "Local JSON cannot be parsed" };
  }
  if (!validateSharedState(state) || !validateLocations(locations)) {
    return { status: "invalid", message: "Local SKV138 data does not match V16.23 shape" };
  }
  // Explicitly preserve locations, which are outside the main state key in V16.23.
  return {
    status: "ready",
    payload: { ...state, privateLocations: locations },
    summary: {
      bookings: state.bookings.length,
      stockItems: state.stock.length,
      locations: locations.length,
      templateTasks: state.templates.before.length + state.templates.after.length,
    },
    // Theme is intentionally local-only.
  };
}
