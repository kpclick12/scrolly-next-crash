// Standalone share chart for feed-based platforms, where an image outperforms
// a link by roughly an order of magnitude. 2000x1500, light background, the
// piece's own palette and its self-hosted display face, title/subtitle/source
// baked in so it stands alone with zero site context.
//
//   node scripts/make-share-chart.mjs        → public/share-chart.png
//
// It reads the SAME src/data/*.json the essay uses, so it cannot drift from
// the piece — and it ASSERTS THE CLAIM IN ITS OWN TITLE before it will draw
// anything. A title is a claim, and claims deserve a test.
import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));

const oracles = read("src/data/oracles.json");
const forecasts = read("src/data/forecasts.json");

// ---- Assertions. If any of these fail the numbers moved and the title lies.
const by = Object.fromEntries(oracles.oracles.map((o) => [o.id, o]));
const fail = [];

if (by.paul.pct !== Math.round((by.paul.hits / by.paul.attempts) * 100)) {
  fail.push(`paul.pct ${by.paul.pct} does not match ${by.paul.hits}/${by.paul.attempts}`);
}
if (by.economists.pct !== Math.round((by.economists.hits / by.economists.attempts) * 100)) {
  fail.push(`economists.pct does not match its own counts`);
}
// The title says the octopus is top and the economists are bottom. Check it.
const ranked = [...oracles.oracles].sort((a, b) => b.pct - a.pct);
if (ranked[0].id !== "paul") fail.push(`title claims the octopus ranks first; ${ranked[0].id} does`);
if (ranked[ranked.length - 1].id !== "economists") {
  fail.push(`title claims economists rank last; ${ranked[ranked.length - 1].id} does`);
}
// The subtitle quotes the IMF study's counts; they must be the ones on file.
if (forecasts.recessions.total !== by.economists.attempts || forecasts.recessions.predicted !== by.economists.hits) {
  fail.push(`the economists row and forecasts.json disagree about the IMF counts`);
}
// And the claim that every row is a real fraction, not a vibe.
for (const o of oracles.oracles) {
  if (!Number.isInteger(o.hits) || !Number.isInteger(o.attempts) || o.attempts <= 0) {
    fail.push(`${o.id} has no honest denominator`);
  }
}

if (fail.length) {
  console.error("REFUSING TO DRAW — the title's claims no longer hold:\n  " + fail.join("\n  "));
  process.exit(1);
}

// ---- The page. Same tokens as app.css, inlined so this file stands alone.
const font = readFileSync(join(ROOT, "public/fonts/playfair-display-latin.woff2")).toString("base64");

const BAR = { bad: "#d93a2b", mid: "#2a78d6", good: "#0f8f63" };
const rowsHtml = oracles.oracles
  .map(
    (o) => `
    <div class="row">
      <div class="name">${o.name}</div>
      <div class="track">
        <div class="bar" style="width:${o.pct}%;background:${BAR[o.tone]}"></div>
        <div class="val">${o.pct}%</div>
      </div>
      <div class="measures">${o.hits} of ${o.attempts} — ${o.measures}</div>
    </div>`
  )
  .join("");

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Playfair Display";font-weight:400 900;src:url(data:font/woff2;base64,${font}) format("woff2");}
*{box-sizing:border-box;margin:0;}
/* Everything below is sized to fit 2000x1500 EXACTLY once — an earlier
   version overflowed and cut off the octopus, i.e. the subject of the
   headline. The script asserts the fit at the end rather than trusting it. */
body{position:relative;width:2000px;height:1500px;background:#faf5ea;color:#211d2b;overflow:hidden;
  font:400 28px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:64px 90px 0;}
h1{font-family:"Playfair Display",Georgia,serif;font-size:76px;line-height:1.03;font-weight:800;margin-bottom:18px;max-width:1660px;}
.sub{font-size:32px;line-height:1.35;color:#4b445c;max-width:1600px;margin-bottom:36px;}
.row{margin-bottom:26px;}
.name{font-family:"Playfair Display",Georgia,serif;font-size:40px;font-weight:700;margin-bottom:7px;}
.track{position:relative;height:52px;background:#e4dccb;border-radius:5px;}
.bar{height:52px;border-radius:5px;}
.val{position:absolute;top:2px;left:0;width:100%;height:100%;}
.measures{font-size:24px;color:#736c85;margin-top:8px;max-width:1800px;white-space:nowrap;overflow:hidden;}
.warn{margin-top:2px;font-size:30px;font-style:italic;color:#a8291f;}
.src{position:absolute;bottom:44px;left:90px;right:90px;display:flex;justify-content:space-between;gap:40px;
  font-size:24px;color:#736c85;border-top:2px solid #c1b7a4;padding-top:16px;}
</style></head><body>
<h1>An octopus outforecast every economist on this chart</h1>
<p class="sub">Five forecasters, five published records with real denominators — and five completely
different tests. Which is the point: put incomparable things on one axis and the ranking looks
like a finding.</p>
${rowsHtml}
<p class="warn">↑ Do not trust this chart. Trust the denominators.</p>
<div class="src">
  <span>Sources: IMF WP/18/39 (2018) · Ned Davis Research · WSJ Investment Dartboard, 1988–2002 · Sea Life Oberhausen</span>
  <span>kpclick12.github.io/scrolly-next-crash</span>
</div>
</body></html>`;

// The bars need a % that resolves against the track, so measure after layout.
const dir = mkdtempSync(join(tmpdir(), "share-"));
const page404 = join(dir, "share.html");
writeFileSync(page404, html);

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 2000, height: 1500 }, deviceScaleFactor: 1 });
await page.goto("file://" + page404);
await page.waitForTimeout(400);
// Put the value label just past the end of its own bar.
await page.evaluate(() => {
  document.querySelectorAll(".row").forEach((r) => {
    const bar = r.querySelector(".bar");
    const val = r.querySelector(".val");
    val.style.left = bar.getBoundingClientRect().width + 18 + "px";
    val.style.width = "auto";
    val.style.fontWeight = "700";
    val.style.fontSize = "36px";
    val.style.fontFamily = '"Playfair Display", Georgia, serif';
  });
});

// The layout must fit without clipping — the octopus row is the headline's
// subject, and an overflow silently drops it below the fold of the image.
const fit = await page.evaluate(() => {
  const warn = document.querySelector(".warn").getBoundingClientRect();
  const src = document.querySelector(".src").getBoundingClientRect();
  const clipped = [...document.querySelectorAll(".row")]
    .filter((r) => r.getBoundingClientRect().bottom > 1500)
    .map((r) => r.querySelector(".name").textContent);
  return { warnBottom: warn.bottom, srcTop: src.top, clipped };
});
if (fit.clipped.length || fit.warnBottom > fit.srcTop) {
  console.error(
    "REFUSING TO SHIP — the chart does not fit 2000x1500:" +
      (fit.clipped.length ? `\n  rows past the edge: ${fit.clipped.join(", ")}` : "") +
      (fit.warnBottom > fit.srcTop ? `\n  the warning line overlaps the source line` : "")
  );
  await browser.close();
  process.exit(1);
}

await page.screenshot({ path: join(ROOT, "public/share-chart.png") });

// ---- The OG card, 1200x630. Its aspect is nearly twice as wide as the share
// chart's, so it gets its own layout rather than a squashed crop: just the two
// ends of the ranking, which is the whole joke and survives a feed thumbnail.
const top = ranked[0];
const bottom = ranked[ranked.length - 1];
const og = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Playfair Display";font-weight:400 900;src:url(data:font/woff2;base64,${font}) format("woff2");}
*{box-sizing:border-box;margin:0;}
body{position:relative;width:1200px;height:630px;background:#faf5ea;color:#211d2b;overflow:hidden;
  font:400 20px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:54px 64px 0;}
h1{font-family:"Playfair Display",Georgia,serif;font-size:60px;line-height:1.02;font-weight:800;margin-bottom:14px;max-width:1020px;}
.sub{font-size:24px;line-height:1.35;color:#4b445c;max-width:980px;margin-bottom:44px;}
.row{margin-bottom:34px;}
.name{font-family:"Playfair Display",Georgia,serif;font-size:31px;font-weight:700;margin-bottom:6px;}
.track{position:relative;height:40px;background:#e4dccb;border-radius:4px;}
.bar{height:40px;border-radius:4px;}
.val{position:absolute;top:1px;font-family:"Playfair Display",Georgia,serif;font-size:28px;font-weight:700;}
.measures{font-size:18px;color:#736c85;margin-top:7px;white-space:nowrap;overflow:hidden;}
.src{position:absolute;bottom:30px;left:64px;right:64px;display:flex;justify-content:space-between;gap:30px;
  font-size:17px;color:#736c85;border-top:2px solid #c1b7a4;padding-top:12px;}
</style></head><body>
<h1>An octopus outforecast every economist on this chart</h1>
<p class="sub">Five oracles, five published records — and five completely different tests.</p>
${[bottom, top]
  .map(
    (o) => `<div class="row">
      <div class="name">${o.name}</div>
      <div class="track"><div class="bar" style="width:${o.pct}%;background:${BAR[o.tone]}"></div></div>
      <div class="measures">${o.hits} of ${o.attempts} — ${o.measures}</div>
    </div>`
  )
  .join("")}
<div class="src"><span>How do you predict the next crash? — a visual essay on forecasting</span>
<span>kpclick12.github.io/scrolly-next-crash</span></div>
</body></html>`;

const ogFile = join(dir, "og.html");
writeFileSync(ogFile, og);
const ogPage = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await ogPage.goto("file://" + ogFile);
await ogPage.waitForTimeout(300);
await ogPage.evaluate(() => {
  document.querySelectorAll(".row").forEach((r) => {
    const bar = r.querySelector(".bar");
    const val = document.createElement("div");
    val.className = "val";
    // The percentage, not the fraction — the fraction is already spelled out
    // on the line below, and the bar encodes the percentage.
    val.textContent = Math.round((parseFloat(bar.style.width) || 0)) + "%";
    r.querySelector(".track").appendChild(val);
    val.style.left = bar.getBoundingClientRect().width + 14 + "px";
  });
});
const ogFit = await ogPage.evaluate(() => {
  const rows = [...document.querySelectorAll(".row")];
  return {
    bottom: Math.max(...rows.map((r) => r.getBoundingClientRect().bottom)),
    srcTop: document.querySelector(".src").getBoundingClientRect().top,
  };
});
if (ogFit.bottom > ogFit.srcTop) {
  console.error("REFUSING TO SHIP — the OG card overflows into its source line");
  await browser.close();
  process.exit(1);
}
await ogPage.screenshot({ path: join(ROOT, "public/og-image.png") });

await browser.close();
console.log("wrote public/share-chart.png (2000x1500) and public/og-image.png (1200x630) — all title claims verified, both layouts fit");
