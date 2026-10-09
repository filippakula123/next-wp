import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { loadEnvConfig } = require(require.resolve("@next/env", { paths: [require.resolve("next/package.json")] }));
loadEnvConfig(process.cwd(), false);
const issues = [];
function checkUrl(name) {
  try {
    const url = new URL(process.env[name] || "");
    if (url.protocol !== "https:" || /^(localhost|127\.0\.0\.1|\[::1\])$|\.local$/.test(url.hostname)) issues.push(`${name}: ustaw publiczny adres HTTPS.`);
  } catch { issues.push(`${name}: brakuje poprawnego adresu.`); }
}
checkUrl("WORDPRESS_URL"); checkUrl("NEXT_PUBLIC_SITE_URL");
if (process.env.WORDPRESS_CACHE_DISABLED === "true") issues.push("WORDPRESS_CACHE_DISABLED: wyłącz lokalny tryb pobierania bez pamięci podręcznej.");
if (process.env.SITE_INDEXABLE !== "true") issues.push("SITE_INDEXABLE: ustaw true dla publicznej wersji.");
if (process.env.BLOG_INDEXABLE !== "true") issues.push("BLOG_INDEXABLE: ustaw true po ukończeniu migracji artykułów.");
if (!process.env.WORDPRESS_WEBHOOK_SECRET || process.env.WORDPRESS_WEBHOOK_SECRET.length < 32 || process.env.WORDPRESS_WEBHOOK_SECRET === "your-secret-key-here") issues.push("WORDPRESS_WEBHOOK_SECRET: ustaw losowy sekret webhooka (co najmniej 32 znaki).");
if (!process.env.GOOGLE_PLACES_API_KEY?.trim()) issues.push("GOOGLE_PLACES_API_KEY: dodaj serwerowy klucz Places API (New) i sprawdź rzeczywiste opinie — instrukcja w docs/opinie-google.md.");
if (issues.length) { console.error(`Konfiguracja do uzupełnienia przed publikacją:\n${issues.map(issue => `- ${issue}`).join("\n")}`); process.exitCode = 1; }
else console.log("Konfiguracja produkcyjna poprawna. Pozostaje sprawdzić połączenie CMS, webhook i serwis po wdrożeniu.");
