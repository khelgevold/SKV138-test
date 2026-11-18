// Isolated TEST reset-link completion form; never logs or persists token/password.
// Caller must pass the token parsed from a verified Better Auth reset-link URL.
export function mountNewPasswordForm({ document, login, token }) {
  if (!document?.querySelector || typeof login?.completePasswordReset !== "function") {
    throw new Error("Document and password reset controller required");
  }
  const form = document.querySelector("#new-password-form");
  const password = document.querySelector("#new-password");
  const confirm = document.querySelector("#confirm-password");
  const button = document.querySelector("#new-password-submit");
  const status = document.querySelector("#new-password-status");
  if (![form, password, confirm, button, status].every(Boolean)) throw new Error("New password form incomplete");
  let busy = false;
  const submit = async event => {
    event.preventDefault();
    if (busy) return;
    if (password.value !== confirm.value) {
      status.textContent = "Passordene er ikke like.";
      return;
    }
    busy = true;
    button.disabled = true;
    const newPassword = password.value;
    password.value = "";
    confirm.value = "";
    status.textContent = "Oppdaterer passord …";
    try {
      const result = await login.completePasswordReset(token, newPassword);
      status.textContent = result?.message || (result?.ok ? "Passordet er oppdatert." : "Kunne ikke oppdatere passordet.");
    } catch {
      status.textContent = "Kunne ikke oppdatere passordet. Prøv igjen.";
    } finally {
      busy = false;
      button.disabled = false;
    }
  };
  form.addEventListener("submit", submit);
  return () => form.removeEventListener("submit", submit);
}
