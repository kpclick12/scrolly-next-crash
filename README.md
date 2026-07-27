# scrolly-next-crash

**How do you predict the next crash?** — a scrollytelling visual essay on
forecasting, told through a fortune teller's parlour.

Live: https://kpclick12.github.io/scrolly-next-crash/

## The one thing

Nobody can time a crash. The people who sound most certain are the least
reliable, and that is a fact about us rather than about the market.

## The conceit

A fortune teller. Crystal ball, prophecy, reading the signs — it supplies the
shape of the argument, not just the hero image. Each act is named for a tarot
card, and the piece walks toward the only forecaster who ever retired
undefeated.

| Act | Card | The visual | Printed on |
|---|---|---|---|
| Prologue (3D) | — | A séance table laid for four. Three places hold the screen each crash arrived on: a 1929 newspaper, a 1987 computer, a 2008 phone. The fourth is empty until a crystal ball appears there, showing static. | — |
| Three times the floor gave way | **The Tower** | The struck tower, with three figures falling off it. Each figure's trail is its real drawdown path; the stone courses are the depth gridlines. | a torn 1929 newsprint clipping |
| Then someone made it a career | **The Magician** | 153 recessions dealt face-down; five turned face up. | a book page, running head and folio |
| The end is always nigh | **Judgement** | A stopped clock, then 96 votive candles — 27 of them snuffed. | a doomsday handbill |
| So it's psychology, then | **The Moon** | Freud's couch under a night sky, replaced on the same ground by a moonlit flock. | a ruled analyst's notepad |
| Choose your oracle | **Wheel of Fortune** | A literal wheel: five oracles riding the rim at their hit rate. | tarot cards |

**Nothing here is an ordinary bar chart, and that is the design brief.** The
encodings are unchanged and honest — the falling figures have real axes, the
candles and the cards are counts — but the marks are the objects the conceit is
already about. The one exception is the standalone share image, which stays a
bar chart on purpose: in a feed at 400px wide it has to be read in a second,
and a wheel does not survive that.

Where the analogy breaks, which is the closing beat: a fortune teller's
prediction doesn't change your future. A crash forecast does.

## Type and materials

**Cinzel** for display — Roman inscriptional capitals, essentially the
lettering on a tarot card — over **EB Garamond** for body. Both variable, both
self-hosted from `public/fonts/` (no third-party font requests, ever; that is a
GDPR constraint, not a preference).

There is deliberately **no single step-card style**. Each act's copy is printed
on the material its subject belongs to, and the act opts in with one class on
its wrapper (`.mat-news`, `.mat-book`, `.mat-bill`, `.mat-pad`, `.mat-card`).
All five share only the structural part: the min-height floor, the
inactive/active opacity, and the full-bleed treatment under 860px.

The card min-heights are **measured, not guessed** — run
`node scripts/measure-cards.mjs` against the preview server after any type or
material change and paste the numbers back into the acts.

## Stack

Svelte 5 (runes) + Vite, `d3-scale` for scales only, `three` for the one 3D
scene. No chart library — every figure is hand-written SVG so each mark can be
driven by the scroll.

```
npm install
npm run dev             # local, base '/'
npm run build           # base '/scrolly-next-crash/'
npm run preview
npm run share-chart     # regenerates public/share-chart.png + og-image.png
node scripts/shoot.mjs        # screenshot walk + overflow/console assertions
node scripts/measure-cards.mjs  # natural card heights, for the min-height floors
```

`scripts/shoot.mjs` runs the pre-ship checks against the real build: every act
at desktop, phone and a deliberately short viewport, in both colour schemes,
asserting no horizontal overflow at 320/360/375/390/412px and a clean console.

`scripts/make-share-chart.mjs` reads the same `src/data/*.json` the essay uses
and **refuses to draw** unless the claims in its own title still hold — that the
octopus ranks first, the economists last, every row has an honest denominator,
and both layouts fit without clipping.

## Colour

The categorical palette was validated with the `dataviz` skill's validator
against both page surfaces, all pairs:

```
node scripts/validate_palette.js "#2a78d6,#d93a2b,#0f8f63" --mode light --surface "#faf5ea" --pairs all
node scripts/validate_palette.js "#3987e5,#e05a45,#14a583" --mode dark  --surface "#1c1533" --pairs all
```

Both pass every check. The **dimmed** state does not — flattened at 48% the
worst pair falls to ΔE 4.1 — so identity in every chart comes from always-on
direct labels, never from hue. See the comment block in `src/app.css`.

## Sources

Every figure traces to a line in the essay's own "Methodology & sources"
section, and anything illustrative is labelled as such where it appears. All
three crashes use one index (the Dow) so the comparison is like for like, and
every vertex on the drawdown chart is a dated closing value.
