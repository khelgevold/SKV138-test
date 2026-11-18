// Extract the Better Auth password-reset token from a callback URL.
// Never send the full URL (which may contain secrets) to logging or analytics.
export function readResetToken(urlString, expectedOrigin) {
  let url;
  try { url = new URL(urlString); } catch { return null; }
  if (url.origin !== expectedOrigin) return null;
  const token = url.searchParams.get("token");
  if (!token || token.length > 4096 || !/^[A-Za-z0-9._~-]+$/.test(token)) return null;
  return token;
}
export function clearResetTokenFromUrl(history, urlString) {
  const url = new URL(urlString);
  url.searchParams.delete("token");
  history.replaceState(null, "", url.pathname + url.search + url.hash);
}
