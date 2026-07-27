// Screenshot harness. Walks the built site at several viewports, capturing
// every act at every step, and asserts the two things that are cheap to get
// wrong and invisible in a single screenshot: horizontal overflow, and a
// clean console.
//
//   node scripts/shoot.mjs [outDir]
//
// It runs against `vite preview`, i.e. the real build with the real base
// path, not the dev server.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = process.argv[2] || "/tmp/shots";
const BASE = "http://localhost:4173/scrolly-next-crash/";

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "phone", width: 360, height: 740 },
  { name: "phone-short", width: 375, height: 560 },
];
const WIDTHS = [320, 360, 375, 390, 412];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const problems = [];

async function overflowCheck(page, w) {
  await page.setViewportSize({ width: w, height: 800 });
  await page.waitForTimeout(250);
  const bad = await page.evaluate(() => {
    const vw = window.innerWidth;
    if (document.documentElement.scrollWidth <= vw) return null;
    // Name the offender rather than leaving it to guesswork.
    const out = [];
    for (const el of document.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1 || r.left < -1) {
        out.push(`${el.tagName.toLowerCase()}.${el.className?.toString().slice(0, 40)} right=${Math.round(r.right)} left=${Math.round(r.left)}`);
      }
      if (out.length > 6) break;
    }
    return { scrollWidth: document.documentElement.scrollWidth, vw, out };
  });
  if (bad) problems.push(`OVERFLOW @${w}px: page ${bad.scrollWidth} > ${bad.vw}\n    ${bad.out.join("\n    ")}`);
}

for (const scheme of ["light", "dark"]) {
  for (const vp of VIEWPORTS) {
    // Dark mode only needs the full walk once; light gets all viewports.
    if (scheme === "dark" && vp.name === "phone-short") continue;

    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: scheme,
      deviceScaleFactor: 1,
      reducedMotion: "no-preference",
    });
    const page = await ctx.newPage();
    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") {
        problems.push(`CONSOLE ${m.type()} [${scheme}/${vp.name}]: ${m.text()}`);
      }
    });
    page.on("pageerror", (e) => problems.push(`PAGEERROR [${scheme}/${vp.name}]: ${e.message}`));

    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);

    const height = await page.evaluate(() => document.body.scrollHeight);
    // 26 stops down the page: enough to land inside every act and on most
    // individual steps, at both column widths.
    const STOPS = 26;
    for (let i = 0; i < STOPS; i++) {
      const y = Math.round((height - vp.height) * (i / (STOPS - 1)));
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(360);
      await page.screenshot({
        path: `${OUT}/${scheme}-${vp.name}-${String(i).padStart(2, "0")}.png`,
      });
    }

    if (scheme === "light" && vp.name === "phone") {
      for (const w of WIDTHS) await overflowCheck(page, w);
    }
    await ctx.close();
  }
}

await browser.close();

if (problems.length) {
  console.log("PROBLEMS:\n" + problems.join("\n"));
  process.exitCode = 1;
} else {
  console.log("clean: no overflow at " + WIDTHS.join("/") + "px, no console errors");
}
