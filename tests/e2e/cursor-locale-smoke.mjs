// GRN-BUG-017 regression guard — custom cursor must survive a locale switch.
//
// The [locale] layout renders the persistent <html>/<body>; CustomCursor lives
// inside it and REMOUNTS on every language change. This drives EN→DE→AR→EN via
// the real LocaleSwitcher and asserts, after each switch, that:
//   1. body.cursor-hidden stays applied  → native cursor never re-appears
//      (double-cursor regression; guarded by the module-level ref-count).
//   2. exactly ONE cursor layer (z-[90]) exists → no duplicate CustomCursor.
//   3. the copper dot stays at the last pointer position, NOT (-100,-100)
//      → zero jump on locale change (guarded by module-level lastPos seeding).
// The switch is fired with an in-page button.click() so NO mousemove occurs —
// that is what proves the new instance seeds its position instead of resetting.
//
// Requires a running server (build + `next start -p 3700`, or `next dev`).
//   BASE=http://localhost:3700 node tests/e2e/cursor-locale-smoke.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE || "http://localhost:3700";
const POINTER = { x: 900, y: 600 }; // fixed reference point; must be preserved
const TOL = 10; // px tolerance for the dot center (subpixel + border box)
const errors = [];
const checks = { steps: [] };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
// Skip the one-time preloader so the nav (and switcher) is interactable at once.
await page.addInitScript(() => {
  try {
    sessionStorage.setItem("granitopia-preloaded", "1");
  } catch {}
});
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`[console] ${page.url()} :: ${m.text()}`);
});
page.on("pageerror", (e) => errors.push(`[pageerror] ${page.url()} :: ${e.message}`));

// Read cursor state, scoped to the unique z-[90] cursor layer.
// Position is read from the dot's TRANSFORM MATRIX (tx/ty), not its bounding
// box: the transform reflects the component's x/y motion value directly and is
// independent of `dir`, whereas the bounding box is dir-sensitive (the dot is
// position:absolute with no left/top, so its static origin flips under RTL —
// see the separately-reported RTL rendering finding). The remount invariant we
// care about here is "did x/y survive the remount", which tx/ty captures exactly.
async function readCursor() {
  return page.evaluate(() => {
    const layers = [...document.querySelectorAll("div")].filter(
      (d) => d.className.includes("z-[90]") && d.className.includes("fixed"),
    );
    const layer = layers[0];
    const dot = layer
      ? [...layer.children].find((c) => c.className.includes("bg-copper"))
      : null;
    const rect = dot ? dot.getBoundingClientRect() : null;
    const m = dot ? new DOMMatrixReadOnly(getComputedStyle(dot).transform) : null;
    return {
      hasClass: document.body.classList.contains("cursor-hidden"),
      layerCount: layers.length,
      dotCount: layer
        ? [...layer.children].filter((c) => c.className.includes("bg-copper"))
            .length
        : 0,
      tx: m ? m.m41 : null, // translateX — equals x minus half the dot width
      ty: m ? m.m42 : null, // translateY
      bboxCenter: rect
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : null, // on-screen position; must match the pointer in LTR *and* RTL
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      path: location.pathname.replace(/\/$/, ""),
    };
  });
}

// Fire the switch through the real UI button, WITHOUT moving the pointer.
async function switchLocale(label) {
  await page.evaluate((lbl) => {
    const group = document.querySelector(
      '[role="group"][aria-label="Language"]',
    );
    const btn = group
      ? [...group.querySelectorAll("button")].find(
          (b) => b.textContent.trim() === lbl,
        )
      : null;
    if (!btn) throw new Error(`locale button "${lbl}" not found`);
    btn.click();
  }, label);
}

// Is the dot's transform translation `v` at the expected coord `ref` (± TOL)?
// The dot's translate = coord − half its 6px width, so allow that + subpixel.
const at = (v, ref) => v !== null && Math.abs(v - ref) <= TOL;
// Did the translation stay put (no jump/reset) vs the captured baseline?
const stable = (v, base) => v !== null && Math.abs(v - base) <= 2;

// --- Load EN, bring the cursor live at a known pointer position ---
await page.goto(`${BASE}/en`, { waitUntil: "load" });
await page
  .waitForFunction(() => document.body.classList.contains("cursor-hidden"), null, {
    timeout: 10000,
  })
  .catch(() => {}); // if this times out, the first assertion records the failure
await page.mouse.move(POINTER.x, POINTER.y);
await page.waitForTimeout(150);

const initial = await readCursor();
const baseTx = initial.tx;
const baseTy = initial.ty;
checks.steps.push({
  step: "en (initial)",
  ...initial,
  classOk: initial.hasClass === true,
  singleLayer: initial.layerCount === 1 && initial.dotCount === 1,
  // Cursor is live AT the pointer (not parked at the -100 init position).
  posOk: at(initial.tx, POINTER.x) && at(initial.ty, POINTER.y),
  // Rendered on-screen at the pointer (dir-independent after the RTL anchor fix).
  onScreenOk:
    at(initial.bboxCenter?.x, POINTER.x) && at(initial.bboxCenter?.y, POINTER.y),
  langOk: initial.lang === "en",
  dirOk: initial.dir === "ltr",
});

// --- Cycle EN → DE → AR → EN, asserting the invariants after each switch ---
const CYCLE = [
  { label: "DE", locale: "de", dir: "ltr" },
  { label: "AR", locale: "ar", dir: "rtl" },
  { label: "EN", locale: "en", dir: "ltr" },
];

for (const t of CYCLE) {
  await switchLocale(t.label);
  // Wait for the client transition to land on the new locale.
  await page
    .waitForFunction((loc) => location.pathname.replace(/\/$/, "") === `/${loc}`, t.locale, {
      timeout: 10000,
    })
    .catch(() => {});
  // Let the remount + passive effects (ref-count re-acquire, position seed) flush.
  await page.waitForTimeout(400);

  const s = await readCursor();
  checks.steps.push({
    step: `→ ${t.label}`,
    ...s,
    classOk: s.hasClass === true, // ref-count kept the class through the remount
    singleLayer: s.layerCount === 1 && s.dotCount === 1, // no duplicate cursor
    // Seeded from module-level lastPos — translation unchanged, no jump/reset.
    posOk: stable(s.tx, baseTx) && stable(s.ty, baseTy),
    // Still rendered on-screen at the pointer, including RTL (/ar).
    onScreenOk:
      at(s.bboxCenter?.x, POINTER.x) && at(s.bboxCenter?.y, POINTER.y),
    langOk: s.lang === t.locale,
    dirOk: s.dir === t.dir, // RTL holds identically
    pathOk: s.path === `/${t.locale}`,
  });
}

await browser.close();

console.log(JSON.stringify(checks, null, 2));
console.log("client errors:", errors.length);
errors.slice(0, 25).forEach((e) => console.log("  -", e));

const stepOk = (s) =>
  s.classOk &&
  s.singleLayer &&
  s.posOk &&
  s.onScreenOk &&
  s.langOk &&
  s.dirOk &&
  (s.pathOk ?? true);

const failed = checks.steps.filter((s) => !stepOk(s));
const ok = failed.length === 0 && errors.length === 0;

if (failed.length) {
  console.log("\nfailed steps:");
  for (const s of failed) {
    const why = Object.entries({
      classOk: s.classOk,
      singleLayer: s.singleLayer,
      posOk: s.posOk,
      onScreenOk: s.onScreenOk,
      langOk: s.langOk,
      dirOk: s.dirOk,
      pathOk: s.pathOk ?? true,
    })
      .filter(([, v]) => !v)
      .map(([k]) => k);
    console.log(`  - ${s.step}: ${why.join(", ")}`);
  }
}

console.log(ok ? "\nCURSOR-LOCALE SMOKE: PASS" : "\nCURSOR-LOCALE SMOKE: FAIL");
process.exit(ok ? 0 : 1);
