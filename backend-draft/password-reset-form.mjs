// TEST-only password reset request form. Requires an injected Better Auth login controller.
// Never stores passwords or exposes whether an account exists.
export function mountPasswordResetForm({ document, login }) {
  if (!document?.querySelector || typeof login?.requestPasswordReset !== "function") {
    throw new Error("Document and password reset controller required");
  }
  const form = document.querySelector("#reset-form");
  const email = document.querySelector("#reset-email");
  const button = document.querySelector("#reset-submit");
  const status = document.querySelector("#reset-status");
  if (![form, email, button, status].every(Boolean)) throw new Error("Reset form incomplete");
  let busy = false;
  const submit = async event => {
    event.preventDefault();
    if (busy) return;
    busy = true;
    button.disabled = true;
    status.textContent = "Sender forespørsel …";
    try {
      const result = await login.requestPasswordReset(email.value);
      status.textContent = result.message || "Hvis kontoen kan tilbakestilles, mottar du en e-post.";
    } catch {
      status.textContent = "Kunne ikke sende forespørselen. Prøv igjen senere.";
    } finally {
      busy = false;
      button.disabled = false;
    }
  };
  form.addEventListener("submit", submit);
  return () => form.removeEventListener("submit", submit);
}
