// End-to-end check with an isolated CMS fixture; never edits real WordPress data.
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";

const settings = { course_date: "2026-11-09", course_time: "17:30", phone: "+48 700 000 123", email: "biuro@example.com", address: "Kielce, ul. Testowa 2", floor: "II piętro", price_b: 4111, price_a: 2900, price_a2: 3222, lesson_b: 160, lesson_b_automat: 180, lesson_a: 170, lesson_a2: 180, account: "11 2222 3333 4444 5555 6666 7777" };
const fixture = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(req.url === "/wp-json/luzik/v1/settings" ? settings : []));
});
fixture.listen(0, "127.0.0.1");
await once(fixture, "listening");
const cmsUrl = `http://127.0.0.1:${fixture.address().port}`;
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", "3002"], { env: { ...process.env, WORDPRESS_URL: cmsUrl, WORDPRESS_HOSTNAME: "127.0.0.1", WORDPRESS_CACHE_DISABLED: "true" }, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
let logs = "";
child.stdout.on("data", chunk => { logs += chunk; });
child.stderr.on("data", chunk => { logs += chunk; });
try {
  for (let attempt = 0; !logs.includes("Ready in"); attempt++) {
    if (attempt > 100 || child.exitCode !== null) throw new Error("Isolated preview did not start.");
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  for (const path of ["/kontakt", "/cennik", "/kursy-prawa-jazdy-kategorii-b", "/kursy-prawa-jazdy-kategorii-a", "/jazdy-doszkalajace"]) {
    const response = await fetch(`http://localhost:3002${path}`, { headers: { "User-Agent": "Googlebot" }, signal: AbortSignal.timeout(20000) });
    const html = await response.text();
    if (response.status !== 200 || !html.includes('href="tel:+48700000123"') || !html.includes("09.11 g.17.30") || !html.includes("biuro@example.com")) throw new Error(`${path}: contact/term settings do not propagate`);
    const graphs = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match => JSON.parse(match[1])["@graph"] || []);
    if (["/cennik", "/kursy-prawa-jazdy-kategorii-b"].includes(path) && !graphs.some(node => node["@type"] === "Course" && node.offers?.price === 4111)) throw new Error(`${path}: stale price in SEO data`);
    if (path === "/cennik" && (!html.includes("Kategoria A2") || !html.includes(new Intl.NumberFormat("pl-PL").format(3222)) || !html.includes("170 / 180"))) throw new Error("Independent A2 course/lesson price is missing");
    if (path === "/kursy-prawa-jazdy-kategorii-b" && !html.includes(new Intl.NumberFormat("pl-PL").format(4111))) throw new Error("Course price remains unchanged in visible content");
    if (path === "/kontakt" && !html.includes('name="description" content="Kontakt ze Szkołą Jazdy Luzik: Kielce, ul. Testowa 2, II piętro. Telefon +48 700 000 123, biuro@example.com.')) throw new Error("Contact metadata retains outdated office data");
    if (path === "/kursy-prawa-jazdy-kategorii-a" && !html.includes("jazdy doszkalającej kosztuje 170 zł")) throw new Error("Motorcycle lesson price remains unchanged in prose");
    if (path === "/jazdy-doszkalajace" && (!html.includes("160 zł (manual) i 180 zł (automat)") || !html.includes("Godzina jazdy na automacie kosztuje 180 zł.") || html.includes("140 zł"))) throw new Error("Lesson prices remain unchanged in prose or FAQ");
    if (/\{\{(?:lesson|coursePrice)/.test(html)) throw new Error(`${path}: unresolved price placeholder`);
  }
  console.log("Settings integration passed: header, footer, contact, independent prices, course content and JSON-LD.");
} finally {
  child.kill();
  fixture.close();
}
