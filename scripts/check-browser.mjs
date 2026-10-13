import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: [process.env.BROWSER_TOOLS_PATH || process.cwd()] }));
const base = process.argv[2] || 'http://localhost:3104';
await mkdir('deployment/performance', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true });
const errors = [];
try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  desktop.on('pageerror', error => errors.push(error.message));
  await desktop.goto(base);
  await desktop.evaluate(() => document.fonts.ready);
  await desktop.screenshot({ path: 'deployment/performance/desktop-home.png' });
  const school = desktop.getByRole('button', { name: 'Szkoła', exact: true });
  const courses = desktop.getByRole('button', { name: 'Kursy prawa jazdy', exact: true });
  await school.click();
  assert.equal(await school.getAttribute('aria-expanded'), 'true');
  await courses.click();
  assert.equal(await school.getAttribute('aria-expanded'), 'false');
  assert.equal(await courses.getAttribute('aria-expanded'), 'true');
  await desktop.keyboard.press('Escape');
  assert.equal(await courses.getAttribute('aria-expanded'), 'false');
  await desktop.goto(`${base}/galeria`);
  await desktop.locator('.luzik-gallery-card button').first().click();
  await desktop.getByRole('dialog').waitFor();
  await desktop.keyboard.press('ArrowRight');
  await desktop.keyboard.press('Escape');
  assert.equal(await desktop.getByRole('dialog').count(), 0);

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1 });
  mobile.on('pageerror', error => errors.push(error.message));
  await mobile.goto(base);
  await mobile.evaluate(() => document.fonts.ready);
  await mobile.screenshot({ path: 'deployment/performance/mobile-home.png' });
  await mobile.getByRole('button', { name: 'Otwórz menu', exact: true }).click();
  await mobile.getByRole('dialog').waitFor();
  await mobile.getByRole('button', { name: 'Rozwiń Szkoła', exact: true }).click();
  await mobile.getByRole('dialog').getByRole('link', { name: 'Instruktorzy', exact: true }).click();
  await mobile.waitForURL('**/szkola-jazdy-luzik-instruktorzy');
  assert.equal(await mobile.getByRole('dialog').count(), 0);
  await mobile.locator('.luzik-header .luzik-language-trigger').click();
  const languages = await mobile.locator('.luzik-header .luzik-language-options').boundingBox();
  assert(languages && languages.x >= 0 && languages.x + languages.width <= 390, 'Language menu must stay inside the mobile viewport');
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'No horizontal page overflow');
  assert.deepEqual(errors, [], 'No client errors');
  console.log('Desktop dropdowns, mobile navigation, language menu and gallery passed.');
} finally {
  await browser.close();
}
