import { chromium } from "@playwright/test";

const BASE = process.env.BASE || "http://localhost:3700";
const errors = [];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
// Skip the one-time preloader so tests are deterministic.
await page.addInitScript(() => {
  try {
    sessionStorage.setItem("granitopia-preloaded", "1");
  } catch {}
});
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`[console] ${page.url()} :: ${m.text()}`);
});
page.on("pageerror", (e) => errors.push(`[pageerror] ${page.url()} :: ${e.message}`));

const checks = {};

// --- Home: hero video + 3D + cinematic showcase ---
await page.goto(`${BASE}/en`, { waitUntil: "load" });
checks.homeH1 = (await page.locator("h1").first().innerText()).replace(/\s+/g, " ");
checks.heroVideo = await page.locator("section#top video").count();
await page.locator("#slab").scrollIntoViewIfNeeded();
await page
  .locator("#slab canvas")
  .first()
  .waitFor({ state: "attached", timeout: 12000 })
  .catch(() => {});
checks.homeCanvas = await page.locator("#slab canvas").count();
await page.locator("#featured").scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
checks.showcaseMarble = await page.locator("#featured svg").count();
checks.showcaseLink = await page.locator('#featured a[href*="/stones/"]').count();

// --- Collections index: category cards render marble ---
await page.goto(`${BASE}/en/collections`, { waitUntil: "load" });
await page.waitForTimeout(600);
checks.categoryCards = await page.locator('a[href*="/collections/"]').count();
checks.collectionMarble = await page.locator("main svg").count();

// --- Stone detail: 3D (procedural texture) ---
await page.goto(`${BASE}/en/stones/absolute-black`, { waitUntil: "load" });
await page
  .locator("canvas")
  .first()
  .waitFor({ state: "attached", timeout: 12000 })
  .catch(() => {});
checks.detailCanvas = await page.locator("canvas").count();
checks.requestLink = await page.locator('a[href*="/contact"]').count();

// --- Contact form ---
await page.goto(`${BASE}/en/contact`, { waitUntil: "load" });
checks.nameInput = await page.locator('input[name="name"]').count();

// --- Arabic RTL ---
await page.goto(`${BASE}/ar/collections`, { waitUntil: "load" });
checks.arDir = await page.getAttribute("html", "dir");

await browser.close();

console.log(JSON.stringify(checks, null, 2));
console.log("client errors:", errors.length);
errors.slice(0, 25).forEach((e) => console.log("  -", e));

const ok =
  checks.heroVideo > 0 &&
  checks.homeCanvas > 0 &&
  checks.showcaseMarble > 0 &&
  checks.showcaseLink > 0 &&
  checks.categoryCards >= 6 &&
  checks.collectionMarble >= 6 &&
  checks.detailCanvas > 0 &&
  checks.requestLink > 0 &&
  checks.nameInput > 0 &&
  checks.arDir === "rtl" &&
  errors.length === 0;

console.log(ok ? "\nSMOKE: PASS" : "\nSMOKE: FAIL");
process.exit(ok ? 0 : 1);
