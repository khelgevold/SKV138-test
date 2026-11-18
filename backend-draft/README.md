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

## V16.23 storage contract and import preview
- `state-contract.mjs` is an inactive pure helper based on actual V16.23 `index.html`.
- Main state key: `hytteokonomi-v3-test`; separate location key: `skv138_private_locations`. Location values are included in the proposed shared payload as `privateLocations`. Theme remains device-local.
- `createMigrationPreview(storage)` only reads, validates and summarizes data. No writes, database calls or automatic import.
- Backend PUT validation now checks the V16.23 shape and `privateLocations`.
- Initial import, explicit confirmation, backup, authorization and TEST deployment remain unimplemented.

## Client adapter – inactive
`client-adapter.mjs` accepts an injected Neon Better Auth client with `token()`, an injected fetch and a localStorage reader. It acquires a short-lived token per request, uses Bearer authorization, checks returned state, tracks version, and refuses saves before load or after 409. It never stores tokens or modifies the V16.23 prototype. The real auth client configuration, session UX, Netlify wiring and tests remain open.

## Isolated TEST integration branch
Work-in-progress branch: `feature/neon-test-integration`. `login-controller.mjs` wraps Better Auth email/password sign-in, session retrieval and sign-out. Successful sign-in does **not** grant SKV138 access: the backend must still check `skv138_access`. A dashboard-created user with NULL credential password cannot sign in until a supported password setup/reset flow is completed. No passwords are entered into SQL or source code. This is not connected to V16.23 and has not been functionally tested.

## Login screen preview
`login-preview.html` is a standalone responsive Norwegian login form with email/password fields and accessible status messages. Submission is intentionally disabled until a real Neon TEST auth client is configured. It is not linked from `index.html` and does not send or store credentials. Next: verify password setup for the existing dashboard-created user, configure the managed Neon auth client in TEST, then connect the controller and test unauthorized/authorized sessions.

## Focused automated tests (not yet executed)
`integration.test.mjs` uses Node's built-in test runner: `node --test backend-draft/integration.test.mjs`. It covers local preview without writes, invalid/missing data, state validation, token forwarding, version increments, 409 conflict handling, and login-controller shape. These are unit tests with mocks, **not** a live Neon/Auth/Netlify integration test. Do not claim passing results before running them.

## CI result (2026-11-18)
GitHub Actions screenshot supplied by project owner shows `SKV138 backend draft tests #1` on `feature/neon-test-integration` (commit `dc85b98`) with green success status, duration 10 seconds. This confirms the CI job succeeded, not live Neon integration. The next milestone is verified managed Neon Auth client setup and credential-password onboarding, followed by explicit TEST activation approval.

## Neon Auth SDK integration (draft)
`neon-auth-bootstrap.mjs` now uses Neon's documented `createAuthClient` from `@neondatabase/neon-js/auth`, configured with the public TEST branch Auth URL. It is a bundler module, not a directly executable standalone HTML script. It is not connected to `login-preview.html` or `index.html`. Do not add the database connection string to browser code. The previously created Neon dashboard user has a credential account without a password; password enrollment must use supported Neon/Better Auth flows, not direct database updates. Before enabling the login screen, confirm the exact managed Auth endpoint, allowed origins, SDK token method and server-side JWT validation against the actual TEST service. Reference: https://neon.com/blog/handling-auth-in-a-staging-environment .

## Credential onboarding draft (2026-11-18)
`login-controller.mjs` includes `register(email,password,name)` via Better Auth `signUp.email` and a neutral `requestPasswordReset(email)` via Better Auth `requestPasswordReset`. Existing passwordless dashboard-created users must **not** be registered again with the same email; password-reset delivery and supported account enrollment must be confirmed with Neon before enabling. Open signup alone never grants app access: only allowlisted user IDs in `public.skv138_access` may access backend data. Added two mocked tests; execution not confirmed yet. No UI activation or email delivery configured.

## Form event adapter
`login-form.mjs` provides `mountLoginForm({document,login,onSignedIn})` for the TEST login form. It disables repeat submissions while pending, clears the password field after an attempted sign-in, and delegates successful sign-in to a separate backend-access check. It is intentionally not activated in `login-preview.html`: real managed Auth configuration and a verified backend access check are still prerequisites. The module is not yet covered by automated tests.

## Supplied TEST Auth URL (2026-11-18)
The owner supplied the public managed Neon Auth endpoint for SKV138-TEST. It is stored in `neon-test-config.mjs` (not a secret). `neon-test-entry.mjs` connects the config to the isolated login controller and form adapter, requiring an injected `verifyAccess(authClient)` callback. It is not loaded in the current HTML preview, not bundled, not deployed, and not functionally verified. Before any activation, implement a real authenticated backend verifier and confirm the SDK client/token API and existing-user password enrollment. No production URL has been configured.

## Backend authorization verification (2026-11-18)
`access-verifier.mjs` injects the existing client adapter to perform authenticated backend GET after sign-in. It distinguishes 401 login-required, 403 user-not-allowlisted and 404 shared-state-not-initialized. Only a validated successful GET yields `status: ready` with payload. Two mocked tests added. Not yet wired to the live browser entrypoint, deployed, or integration-tested.
