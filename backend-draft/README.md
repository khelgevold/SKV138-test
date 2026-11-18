# SKV138 – backend draft (not active)

This is a **non-deployed implementation draft**, deliberately outside the active app and Netlify functions folder. V16.23 is unchanged. Do not move into production before completing the checks below.

- Requires Node dependencies `jose` and `pg`, Netlify Function wiring, same-origin frontend hosting and explicit secret environment variables.
- `DATABASE_URL` must use a **dedicated least-privilege DB role**, not the Neon owner/admin. Table grants and identity-sequence privileges are not yet configured.
- `NEON_AUTH_JWKS_URL`, `NEON_AUTH_BASE_URL` and `SKV138_APP_ORIGIN` must be set server-side. Neon Managed Auth documents the issuer as the origin of NEON_AUTH_BASE_URL, and EdDSA signing; verify these against the actual TEST token. Optional NEON_AUTH_AUDIENCE must match an issued aud claim when present. The code currently uses JWKS-verified JWTs, not opaque Better Auth cookies.
- Browser must use Neon's documented `authClient.token()` flow to obtain JWT. Confirm compatibility before deployment.
- API draft supports GET and PUT of singleton `shared`; PUT uses transaction + row lock + history + optimistic version check, returning 409 on conflict.
- The singleton row must be initialized by a separate approved migration/import flow; draft intentionally does not seed example bookings or user access.
- Full state validation, rate limiting, history retention, session lifecycle, first-import backup, and end-to-end authorization tests remain before TEST deployment.
- Existing localStorage state is not changed or read by this draft. Preserve separately stored `skv138_private_locations` during later migration.

## 18 Nov – documented authentication contract

Official Neon Functions documentation: https://neon.com/docs/compute/functions/authentication (Managed Auth verifies JWT using JWKS and issuer = origin of NEON_AUTH_BASE_URL, EdDSA). Better Auth JWT client: https://better-auth.com/docs/plugins/jwt (authClient.token()). This draft now matches that documented contract. Audience verification is conditional on confirmed token claims; don't invent an audience. Do not deploy until the actual TEST token, permitted-user allowlist, and frontend authentication flow have been verified.
