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
    } catch {
      status.dataset.error = "true";
      status.textContent = "Kunne ikke fullføre innloggingen.";
    } finally {
      busy = false;
      button.disabled = false;
    }
  };
  form.addEventListener("submit", onSubmit);
  return () => form.removeEventListener("submit", onSubmit);
}
