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

## Authorization gate correction
`neon-test-entry.mjs` now requires `verifyAccess()` to return exactly `status: ready` before invoking an explicitly supplied `onAuthorized(payload, client)` callback. The previous entrypoint discarded denied/uninitialized statuses, potentially allowing a caller to assume a successful login was sufficient. This correction is not yet tested in a live environment. Do not activate before verifying the actual Neon Auth token method, password enrollment and backend authorization.

## Password reset request form draft
`password-reset-form.mjs` implements a form adapter for a password reset *request*, with duplicate-submission protection and neutral account-existence messaging. It requires an injected `login.requestPasswordReset` implementation. This does **not** implement the reset-link landing page or the new-password submission; both must be verified against managed Neon Auth before activation. Not wired to V16.23 or a deployed TEST site. No reset email has been sent by this code.

## Reset-link completion draft
`login-controller.mjs` now provides `completePasswordReset(token,newPassword)` using the Better Auth `resetPassword` client method. `new-password-form.mjs` handles confirmation, clears entered password fields and blocks duplicate submission. The token must come from a verified reset-link URL; no URL parser or active reset landing page has been implemented yet. Two mocked tests were added; no live reset request or completion has occurred. Before enabling: verify actual managed Neon reset URL/redirect behavior, configured allowed origin and delivery, and bundle the auth SDK.

## Combined TEST entrypoint
`neon-test-entry.mjs` now exports `startConfiguredSkv138TestLogin({document,fetchImpl,storage,onAuthorized})`, connecting Neon TEST Auth, the login form and backend GET authorization through `createTestAccessVerifier`. The app is exposed to the callback only after `status: ready`; 401/403/404 and other errors do not unlock it. This is still not a deployable browser bundle: SDK dependency installation, actual Auth token API, Netlify function routing, and reset flow require verification. No live credentials or secrets have been committed.

## Build manifest and inactive Netlify template
Root `package.json` provides a first-pass TEST dependency manifest, unit-test command and browser bundling command. Dependency versions are provisional until installation/build validation; no lockfile exists yet. `backend-draft/netlify.template.toml` is **inactive** and deliberately not a root `netlify.toml`. Its functions directory has not been populated and the browser bundle is not a complete website; do not deploy it as-is. This avoids accidental Netlify builds or replacing the approved prototype. Next validate the exact Neon SDK package version/export and create a working TEST entry HTML + function wiring, then seek deployment approval.

## Isolated browser TEST shell (18 Nov)
`backend-draft/test-site/index.html` is now a real browser entry that imports the bundled `neon-test-entry.js` and calls `startConfiguredSkv138TestLogin`. The build script outputs to this directory, and the inactive Netlify template points its publish path there. The page exposes only a confirmation after the backend returns authorized shared state; it does **not** mount V16.23, import user data, or implement password reset yet. This is not a deployable complete TEST app: server function wiring, credential/token compatibility, authorized users, initialized shared state, and end-to-end verification are still blockers. No deployment approval has been requested or granted.

## Draft Netlify backend function
`backend-draft/netlify-functions/skv138-state.mjs` re-exports the existing `handler` as a Netlify function. Database connection failures now return a generic 503 rather than escaping the handler. Both remain inactive because the Netlify configuration is a template. Critical blockers: verify actual JWT token API/issuer/JWKS and reset flow; provision least-privilege runtime role; configure TEST secrets; initialize state with explicit user approval; run real end-to-end access checks. A green bundle build alone is not evidence of live Neon authentication.

## Password reset UI assembled (18 Nov)
The isolated TEST shell now contains password-reset request and new-password forms. Their handlers are exported from the same browser bundle entrypoint, so no extra unbundled browser modules are required. The reset token is removed from the visible URL before the form is used. **Not verified against live Neon Auth**: actual reset callback URL, SDK method support, email delivery, and existing dashboard-created account with null password are still blockers. Do not treat a green build as a completed password reset test or deploy this without checking the real flow.

## Shared Auth client correction (18 Nov)
The TEST shell now creates a single Neon Auth client/controller and passes the same instance to sign-in, backend access verification and password reset, instead of constructing two independent clients. This avoids session inconsistency between forms. New changes await CI verification. Before live TEST deployment, verify SDK token and reset methods and the backend JWT contract with the actual managed Neon Auth service; do not assume passing mocks prove compatibility.

## User-facing access errors
The login form now distinguishes backend authorization denial (`not_authorized`) and uninitialized shared data (`not_initialized`) from generic connection errors. This is a UI-only draft change; it does not bypass authorization or initialize data. No live Neon verification has occurred.

## JWT issuer correction (18 Nov)
The backend no longer guesses the issuer from the Auth URL hostname. It now requires explicit `NEON_AUTH_ISSUER`, and `jwtVerify` checks that exact string. Before TEST activation, confirm the issuer from trusted Neon Auth metadata or a securely inspected real TEST JWT (do not share the JWT itself). Configure `NEON_AUTH_JWKS_URL` consistently. The old `NEON_AUTH_BASE_URL` backend env is no longer used by this handler. This is not live-verified. Do not relax JWT issuer/signature checks to make tests pass.

## Documentation cross-check: token and issuer (18 Nov)
Official Neon Auth SDK docs confirm `createAuthClient(authUrl)` and default-client `token()` returning `data.token`; the adapter's current token retrieval matches that documented path. Neon Functions authentication docs demonstrate deriving the JWT issuer from `new URL(NEON_AUTH_BASE_URL).origin`, while OAuth issuer documentation may use the full Auth URL for OAuth tokens. These are distinct token contexts; **do not claim the correct JWT issuer is established** without checking the actual token type and verified claims. The backend currently requires `NEON_AUTH_ISSUER` explicitly, so set it only after that check. Verify JWKS, signature, issuer and expected algorithm with a real TEST token before any deployment. No live verification performed.

## Automated TEST shell contract (18 Nov)
Added `test-site-contract.test.mjs` and expanded `npm test`/GitHub Actions to run all `backend-draft/*.test.mjs`. This checks the isolated HTML imports only its bundled entry, uses the same Neon Auth session, skips login initialization during a reset callback, and does not reference the approved prototype. These are static contract checks, **not** live Auth tests. No Netlify deploy or Neon mutation. Next inspect the GitHub Actions result, then verify a real Neon TEST token and password enrollment before enabling the isolated TEST site.
