// HTTP integration checks against an already running local or deployed build.
import { writeFile } from "node:fs/promises";
const args = process.argv.slice(2);
const base = new URL(args.find(arg => !arg.startsWith("--")) || "http://localhost:3001");
const crawl = args.includes("--crawl");
const paths = ["/", "/kursy-prawa-jazdy", "/kursy-prawa-jazdy-kategorii-b", "/kursy-prawa-jazdy-kategorii-b-automat", "/kursy-prawa-jazdy-kategorii-a", "/kursy-prawa-jazdy-kategorii-a1", "/kursy-prawa-jazdy-kategorii-a2", "/kursy-prawa-jazdy-kategorii-am", "/jazdy-doszkalajace", "/badania-lekarskie-na-prawo-jazdy-kielce", "/cennik", "/o-nas", "/szkola-jazdy-luzik-instruktorzy", "/kontakt", "/galeria", "/blog", "/polityka-prywatnosci"];
const report = { base: base.origin, checkedAt: new Date().toISOString(), pages: [], failures: [] };
const rendered = new Map();
async function auditPage(path) {
  const response = await fetch(new URL(path, base), { headers: { "User-Agent": "Googlebot" }, signal: AbortSignal.timeout(30000) });
  const html = await response.text();
  rendered.set(path, html);
  const checks = [];
  if (response.status !== 200) checks.push(`HTTP ${response.status}`);
  if ((html.match(/<h1\b/g) || []).length !== 1) checks.push("Brak jednego głównego nagłówka H1");
  if (!/<title>[^<]+<\/title>/.test(html)) checks.push("Brak tytułu");
  if (!/name="description"/.test(html)) checks.push("Brak opisu meta");
  if (!/rel="canonical"/.test(html)) checks.push("Brak canonical");
  if (!/property="og:image"/.test(html)) checks.push("Brak Open Graph image");
  if (/9d8|Hello World, welcome|docelową treść i układ odtworzymy/.test(html)) checks.push("Pozostałość szablonu");
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(match[1]); } catch { checks.push("Błędny JSON-LD"); }
  }
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  report.pages.push({ path, status: response.status, title, failures: checks });
  report.failures.push(...checks.map(check => `${path}: ${check}`));
  return html;
}
// Sequential requests avoid overloading a small local WordPress installation.
for (const path of paths) await auditPage(path);
const blogHtml = await fetch(new URL("/blog", base)).then(response => response.text());
const articleLinks = [...new Set(Array.from(blogHtml.matchAll(/href="(\/[^"?#]+)"/g), match => match[1]).filter(path => !paths.includes(path) && !path.includes(".") && !path.startsWith("/_next") && !path.startsWith("/posts/") && path.split("/").length === 2))].slice(0, 4);
for (const path of articleLinks) {
  await auditPage(path);
  const legacy = await fetch(new URL(`/posts${path}`, base), { redirect: "manual" });
  if (legacy.status !== 308 || !legacy.headers.get("location")?.endsWith(path)) report.failures.push(`${path}: niepoprawne przekierowanie ze starego adresu /posts`);
}
if (crawl) {
  const checked = new Set(rendered.keys());
  const assets = new Set();
  const socialImages = new Set();
  const fragments = [];
  function collect(path, html) {
    for (const match of html.matchAll(/<meta\b[^>]*property="og:image"[^>]*content="([^"]+)"/g)) {
      const image = new URL(match[1], base);
      if (image.origin === base.origin || image.hostname === "luzikkielce.pl") { assets.add(image.pathname); socialImages.add(image.pathname); }
    }
    for (const match of html.matchAll(/<(a|img)\b[^>]*?\b(href|src)="([^"]+)"/g)) {
      let url;
      try { url = new URL(match[3].replaceAll("&amp;", "&"), new URL(path, base)); } catch { continue; }
      if (url.origin === base.origin && url.pathname === "/_next/image") {
        const source = url.searchParams.get("url");
        if (source?.startsWith("/") && !source.startsWith("//")) assets.add(source);
        continue;
      }
      if (!["http:", "https:"].includes(url.protocol)) continue;
      // Check links to the old public domain against the new preview too.
      if (url.origin !== base.origin && !["luzikkielce.pl", "www.luzikkielce.pl"].includes(url.hostname)) continue;
      if (/^\/(?:_next|api|admin|wp-admin|wp-json|wp-content)(?:\/|$)/.test(url.pathname)) continue;
      const target = url.pathname.replace(/\/$/, "") || "/";
      if (/\.[a-z0-9]{2,5}$/i.test(target)) { assets.add(target); continue; }
      // Discover every blog pagination page, without crawling arbitrary search combinations.
      const query = target === "/blog" && url.searchParams.has("page") ? `?page=${url.searchParams.get("page")}` : "";
      const key = target + query;
      if (url.hash) fragments.push({ source: path, target: key, hash: decodeURIComponent(url.hash.slice(1)) });
      if (!checked.has(key)) { checked.add(key); queue.push(key); }
    }
  }
  const queue = [];
  for (const [path, html] of rendered) collect(path, html);
  for (let index = 0; index < queue.length; index++) {
    if (checked.size > 300) throw new Error("Crawl exceeded 300 pages; inspect links before continuing.");
    const path = queue[index];
    const html = await auditPage(path);
    collect(path, html);
  }
  for (const asset of assets) {
    const response = await fetch(new URL(asset, base), { signal: AbortSignal.timeout(30000) });
    if (!response.ok) report.failures.push(`${asset}: missing asset, HTTP ${response.status}`);
    if (socialImages.has(asset) && !response.headers.get("content-type")?.startsWith("image/")) report.failures.push(`${asset}: Open Graph URL does not return an image`);
    await response.arrayBuffer();
  }
  for (const link of fragments) {
    const html = rendered.get(link.target);
    if (html && !html.includes(`id="${link.hash}"`) && !html.includes(`name="${link.hash}"`)) report.failures.push(`${link.source}: missing anchor ${link.target}#${link.hash}`);
  }
  report.crawl = { pages: checked.size, assets: assets.size, fragments: fragments.length };
}
for (const path of ["/favicon.ico", "/icon.svg", "/apple-icon.png", "/opengraph-image.jpeg", "/twitter-image.jpeg", "/manifest.webmanifest", "/robots.txt", "/sitemap.xml", "/feed.xml"]) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  if (response.status !== 200) report.failures.push(`${path}: HTTP ${response.status}`);
  await response.arrayBuffer();
}
const missing = await fetch(new URL("/__audit-nieistniejaca-strona", base), { headers: { "User-Agent": "Googlebot" } });
if (missing.status !== 404) report.failures.push(`Nieistniejąca strona: HTTP ${missing.status} zamiast 404`);
for (const [source, target] of [["/pages", "/"], ["/pages/kontakt", "/kontakt"], ["/posts/categories", "/blog#artykuly"], ["/posts/authors", "/blog#artykuly"], ["/posts/tags", "/blog#artykuly"]]) {
  const response = await fetch(new URL(source, base), { redirect: "manual" });
  if (response.status !== 308 || response.headers.get("location") !== target) report.failures.push(`${source}: niepoprawne przekierowanie pozostałości szablonu`);
}
await writeFile(".site-audit.json", JSON.stringify(report, null, 2));
console.log(`Sprawdzono ${report.pages.length} stron, pliki SEO i przekierowania. Błędy: ${report.failures.length}. Raport: .site-audit.json`);
if (report.failures.length) { console.error(report.failures.join("\n")); process.exitCode = 1; }
