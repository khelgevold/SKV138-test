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
