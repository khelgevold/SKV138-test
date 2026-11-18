// SKV138 TEST login controller. Draft only, not wired into V16.23.
// Better Auth's documented email/password client methods are injected.
// Authorization remains exclusively server-side via skv138_access.
export function createLoginController(authClient) {
  if (!authClient?.signIn?.email || !authClient?.getSession || !authClient?.signOut) {
    throw new Error("Compatible Better Auth client required");
  }
  return {
    async signIn(email, password) {
      const normalizedEmail = String(email || "").trim().toLowerCase();
      if (!normalizedEmail || typeof password !== "string" || !password) {
        return { ok: false, message: "Skriv inn e-post og passord." };
      }
      try {
        const response = await authClient.signIn.email({ email: normalizedEmail, password });
        if (response?.error) return { ok: false, message: "Innlogging mislyktes. Kontroller opplysningene." };
        // Never infer SKV138 authorization from successful Better Auth sign-in.
        return { ok: true };
      } catch {
        return { ok: false, message: "Kunne ikke kontakte innloggingstjenesten." };
      }
    },
    async register(email, password, name) {
      const normalizedEmail = String(email || "").trim().toLowerCase();
      const displayName = String(name || "").trim();
      if (!normalizedEmail || typeof password !== "string" || password.length < 8 || !displayName) {
        return { ok: false, message: "Oppgi navn, e-post og passord på minst 8 tegn." };
      }
      if (typeof authClient.signUp?.email !== "function") {
        return { ok: false, message: "Registrering er ikke konfigurert." };
      }
      try {
        const response = await authClient.signUp.email({ email: normalizedEmail, password, name: displayName });
        if (response?.error) return { ok: false, message: "Registreringen mislyktes. E-postadressen kan allerede være i bruk." };
        // Registration never adds a user to the SKV138 server-side allowlist.
        return { ok: true };
      } catch {
        return { ok: false, message: "Kunne ikke kontakte registreringstjenesten." };
      }
    },
    async requestPasswordReset(email) {
      const normalizedEmail = String(email || "").trim().toLowerCase();
      if (!normalizedEmail) return { ok: false, message: "Oppgi e-postadresse." };
      if (typeof authClient.requestPasswordReset !== "function") {
        return { ok: false, message: "Passordtilbakestilling er ikke konfigurert." };
      }
      try {
        // Only useful when the managed auth service is configured to deliver reset emails.
        await authClient.requestPasswordReset({ email: normalizedEmail });
      } catch {
        // Avoid disclosing whether an email account exists.
      }
      return { ok: true, message: "Hvis tilbakestilling er tilgjengelig for kontoen, mottar du en e-post." };
    },
    async completePasswordReset(token, newPassword) {
      if (typeof token !== "string" || !token.trim() ||
          typeof newPassword !== "string" || newPassword.length < 8) {
        return { ok: false, message: "Ugyldig lenke eller for kort passord." };
      }
      if (typeof authClient.resetPassword !== "function") {
        return { ok: false, message: "Passordtilbakestilling er ikke konfigurert." };
      }
      try {
        const response = await authClient.resetPassword({ token, newPassword });
        if (response?.error) {
          return { ok: false, message: "Lenken er ugyldig eller utløpt. Be om en ny lenke." };
        }
        return { ok: true, message: "Passordet er oppdatert. Du kan logge inn." };
      } catch {
        return { ok: false, message: "Kunne ikke oppdatere passordet. Prøv igjen." };
      }
    },
    async session() {
      const response = await authClient.getSession();
      return response?.error ? null : (response?.data?.session ? response.data : null);
    },
    async signOut() {
      const response = await authClient.signOut();
      if (response?.error) throw new Error("Utlogging mislyktes");
    },
  };
}
