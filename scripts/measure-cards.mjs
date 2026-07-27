// The step-card min-height floors keep the column from drifting as you
// scroll. They have to come from the MEASURED tallest card in each act, not a
// guess — and every type or material change invalidates the old numbers.
// Run this after any such change and paste the results into the acts.
import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
for (const vp of [{ n: "desktop", w: 1280, h: 900, key: "--step-min" },
                  { n: "phone", w: 360, h: 740, key: "--step-min-mobile" }]) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h } });
  const p = await ctx.newPage();
  await p.goto("http://localhost:4173/scrolly-next-crash/", { waitUntil: "networkidle" });
  await p.waitForTimeout(700);
  const acts = await p.evaluate(() =>
    [...document.querySelectorAll(".act")].map((a) => {
      const hs = [...a.querySelectorAll(".scrolly-step")].map((s) => {
        // Measure the card's NATURAL height with the floor removed, otherwise
        // the old floor is what gets reported back.
        const prev = s.style.minHeight;
        s.style.minHeight = "0px";
        const h = Math.ceil(s.getBoundingClientRect().height);
        s.style.minHeight = prev;
        return h;
      });
      return { act: a.getAttribute("aria-label"), max: Math.max(...hs), min: Math.min(...hs), n: hs.length };
    })
  );
  console.log(`\n${vp.n} (${vp.key}):`);
  for (const a of acts) {
    // A little headroom so a font swap or a reflow can't reintroduce drift.
    console.log(`  ${String(a.max + 12).padStart(4)}px  (natural ${a.min}–${a.max} over ${a.n} cards)  ${a.act}`);
  }
  await ctx.close();
}
await b.close();
