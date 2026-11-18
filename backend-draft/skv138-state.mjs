// SKV138 backend draft — NOT deployed. Requires jose + pg dependencies and Netlify configuration.
// Runtime secrets: DATABASE_URL, NEON_AUTH_JWKS_URL, NEON_AUTH_ISSUER.
// Required: SKV138_APP_ORIGIN. Optional: NEON_AUTH_AUDIENCE if issued token has aud. Never commit values.
import { createRemoteJWKSet, jwtVerify } from "jose";
import pg from "pg";\nimport { validateSharedState, validateLocations } from "./state-contract.mjs";

let jwks;
let pool;
const json = (statusCode, data) => ({
  statusCode,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  body: JSON.stringify(data),
});
function configuration() {
  for (const key of ["DATABASE_URL", "NEON_AUTH_JWKS_URL", "NEON_AUTH_BASE_URL", "SKV138_APP_ORIGIN"]) {
    if (!process.env[key]) throw new Error("Missing backend configuration: " + key);
  }
  const jwksUrl = new URL(process.env.NEON_AUTH_JWKS_URL);
  // Managed Neon Auth documents issuer as the origin of NEON_AUTH_BASE_URL.\n  const issuer = new URL(process.env.NEON_AUTH_BASE_URL).origin;\n  if (new URL(process.env.NEON_AUTH_BASE_URL).protocol !== "https:") throw new Error("Auth URL must use HTTPS");
  if (jwksUrl.protocol !== "https:") throw new Error("JWKS must use HTTPS");
  if (!jwks) jwks = createRemoteJWKSet(jwksUrl);
  if (!pool) pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
  return { issuer };
}
async function authenticatedUser(event, issuer) {
  const match = /^Bearer (\S+)$/i.exec(event.headers.authorization || event.headers.Authorization || "");
  if (!match) return null;
  const options = { issuer, algorithms: ["RS256", "ES256", "EdDSA"] };
  if (process.env.NEON_AUTH_AUDIENCE) options.audience = process.env.NEON_AUTH_AUDIENCE;
  const { payload } = await jwtVerify(match[1], jwks, options);
  return typeof payload.sub === "string" && payload.sub ? payload.sub : null;
}
async function permitted(client, userId) {
  const result = await client.query("SELECT 1 FROM public.skv138_access WHERE user_id = $1", [userId]);
  return result.rowCount === 1;
}
export async function handler(event) {
  if (!["GET", "PUT"].includes(event.httpMethod)) return json(405, { error: "Method not allowed" });
  let issuer;
  try { ({ issuer } = configuration()); }
  catch { return json(503, { error: "Backend not configured" }); }

  let userId;
  try { userId = await authenticatedUser(event, issuer); }
  catch { return json(401, { error: "Invalid authentication" }); }
  if (!userId) return json(401, { error: "Authentication required" });

  // Cross-origin writes are intentionally rejected. The app and function must share an origin.
  if (event.httpMethod === "PUT") {
    const origin = event.headers.origin || event.headers.Origin;
    const expectedOrigin = process.env.SKV138_APP_ORIGIN;
    if (!expectedOrigin || origin !== expectedOrigin) return json(403, { error: "Origin denied" });
  }

  const client = await pool.connect();
  try {
    if (!(await permitted(client, userId))) return json(403, { error: "Access denied" });
    if (event.httpMethod === "GET") {
      const result = await client.query(
        "SELECT payload, version, updated_at FROM public.skv138_data WHERE id = $1",
        ["shared"]
      );
      return result.rowCount ? json(200, result.rows[0]) : json(404, { error: "Not initialized" });
    }
    if (Buffer.byteLength(event.body || "", "utf8") > 2_000_000) return json(413, { error: "Payload too large" });
    let request;
    try { request = JSON.parse(event.body || ""); }
    catch { return json(400, { error: "Invalid JSON" }); }
    const { payload, expectedVersion } = request;
    if (!Number.isSafeInteger(expectedVersion) || expectedVersion < 1 ||
        !payload || typeof payload !== "object" || Array.isArray(payload) ||
        !Array.isArray(payload.bookings) || !Array.isArray(payload.stock) ||
        !payload.templates || !payload.completed) {
      return json(400, { error: "Invalid state or version" });
    }
    await client.query("BEGIN");
    // Lock current state so a second writer cannot race history recording.
    const current = await client.query(
      "SELECT payload, version FROM public.skv138_data WHERE id = $1 FOR UPDATE", ["shared"]
    );
    if (!current.rowCount || Number(current.rows[0].version) !== expectedVersion) {
      await client.query("ROLLBACK");
      return json(409, { error: "Version conflict; reload before saving" });
    }
    await client.query(
      "INSERT INTO public.skv138_data_history (data_id, version, payload, saved_by) VALUES ($1,$2,$3::jsonb,$4)",
      ["shared", expectedVersion, JSON.stringify(current.rows[0].payload), userId]
    );
    const saved = await client.query(
      "UPDATE public.skv138_data SET payload = $1::jsonb, version = version + 1, updated_at = now(), updated_by = $2 WHERE id = $3 RETURNING version, updated_at",
      [JSON.stringify(payload), userId, "shared"]
    );
    await client.query("COMMIT");
    return json(200, saved.rows[0]);
  } catch (error) {
    try { await client.query("ROLLBACK"); } catch {}
    // Do not expose SQL errors or configuration details to clients.
    console.error("SKV138 backend error", error);
    return json(500, { error: "Server error" });
  } finally { client.release(); }
}
