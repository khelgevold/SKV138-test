import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const authPath = "/neondb/auth";
const appOrigin = httpsUrl("SKV138_APP_ORIGIN");
const neonAuth = httpsUrl("SKV138_NEON_AUTH_UPSTREAM");

if (appOrigin.href !== appOrigin.origin + "/" ||
    process.env.SKV138_APP_ORIGIN !== appOrigin.origin ||
    appOrigin.hostname === "skv138-neon-test.netlify.app") {
  throw new Error("SKV138_APP_ORIGIN must be the exact PROD HTTPS origin");
}
if (neonAuth.pathname.replace(/\/$/, "") !== authPath ||
    !neonAuth.hostname.endsWith(".neon.tech") ||
    neonAuth.hostname === "ep-twilight-sea-b979zblt.neonauth.c-7.eu-central-1.aws.neon.tech") {
  throw new Error("SKV138_NEON_AUTH_UPSTREAM must be the PROD Neon Auth URL");
}

const publish = new URL("./test-site/", import.meta.url);
const publicAuthUrl = appOrigin.origin + authPath;
await build({
  entryPoints: [fileURLToPath(new URL("./neon-test-entry.mjs", import.meta.url))],
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  outfile: fileURLToPath(new URL("neon-test-entry.js", publish)),
  plugins: [{
    name: "skv138-prod-auth-config",
    setup(builder) {
      builder.onLoad({ filter: /[/\\]neon-test-config\.mjs$/ }, () => ({
        contents: "export const SKV138_TEST_AUTH_URL = " + JSON.stringify(publicAuthUrl)
      }));
    }
  }]
});

await writeFile(
  new URL("_redirects", publish),
  `${authPath}/* ${neonAuth.origin}${authPath}/:splat 200\n`
);

function httpsUrl(name) {
  const value = process.env[name] ?? "";
  const url = URL.canParse(value) ? new URL(value) : null;
  if (!url || url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
    throw new Error(name + " must be a public HTTPS URL");
  }
  return url;
}
