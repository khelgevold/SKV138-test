// Public same-origin Neon TEST Auth proxy. Netlify _redirects forwards this path
// to the managed Neon Auth endpoint. Browser session cookies remain first-party.
// Keep the backend JWT issuer/JWKS configuration pointed at Neon itself.
export const SKV138_TEST_AUTH_URL =
  "https://skv138-neon-test.netlify.app/neondb/auth";
