// SKV138 TEST login form wiring; no network until a controller is explicitly injected.
// This module is separate from V16.23 and does not persist credentials.
export function mountLoginForm({ document, login, onSignedIn = () => {} }) {
  if (!document?.querySelector || typeof login?.signIn !== "function") {
    throw new Error("Document and login controller required");
  }
  const form = document.querySelector("#login");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  const button = document.querySelector("#submit");
  const status = document.querySelector("#status");
  if (![form, email, password, button, status].every(Boolean)) throw new Error("Login form incomplete");
  let busy = false;
  const onSubmit = async event => {
    event.preventDefault();
    if (busy) return;
    busy = true;
    button.disabled = true;
    status.dataset.error = "false";
    status.textContent = "Logger inn …";
    try {
      const result = await login.signIn(email.value, password.value);
      password.value = ""; // Avoid leaving entered password in the form after a request.
      if (!result.ok) {
        status.dataset.error = "true";
        status.textContent = result.message || "Innlogging mislyktes.";
        return;
      }
      status.textContent = "Innlogget. Kontrollerer tilgang …";
      // App access must still be verified by an authenticated backend request.
      await onSignedIn();
    } catch (error) {
      status.dataset.error = "true";
      const reason = String(error?.message || "");
      if (reason.includes("not_authorized")) {
        status.textContent = "Kontoen har ikke tilgang til SKV138.";
      } else if (reason.includes("not_initialized")) {
        status.textContent = "SKV138 TEST er ikke klargjort med data ennå.";
      } else if (reason.includes("login_required")) {
        status.textContent = "Neon-innlogging OK, men backend avviste tokenet (HTTP 401).";
      } else if (reason.includes("TEST_DIAG_")) {
        const match = reason.match(/TEST_DIAG_[A-Z_]+/);
        status.textContent = "TEST-diagnose: " + (match ? match[0] : "ukjent") + ".";
      } else if (Number.isInteger(error?.status) && error.status >= 400 && error.status <= 599) {
        status.textContent = "SKV138-backenden svarte med HTTP " + error.status + ".";
      } else {
        status.textContent = "SKV138-backend kunne ikke fullføre kontrollen (klient- eller nettverksfeil).";
      }
      if (status.dataset.testJwtAlg) {
        status.textContent += " TEST JWT alg: " + status.dataset.testJwtAlg + ".";
      }
      if (status.dataset.testIssuer) {
        status.textContent += " TEST JWT issuer: " + status.dataset.testIssuer;
      }
    } finally {
      busy = false;
      button.disabled = false;
    }
  };
  form.addEventListener("submit", onSubmit);
  return () => form.removeEventListener("submit", onSubmit);
}
