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

| Act | Card | What it does |
|---|---|---|
| Prologue (3D) | — | A séance table laid for four. Three places hold the screen each crash arrived on: a 1929 newspaper, a 1987 computer, a 2008 phone. The fourth is empty until a crystal ball appears there, showing static. |
| Three times the floor gave way | **The Tower** | Three crashes, one index, aligned on each peak. A crash is not one shape. |
| Then someone made it a career | **The Magician** | Statistics is three centuries old; forecasting became famous in 2008. The consensus called 5 of 153 recessions. |
| The end is always nigh | **Judgement** | A stopped clock, and the base rate it is quietly collecting: 28% for free. |
| So it's psychology, then | **The Moon** | Freud's couch, shown the door, and replaced by a flock. |
| Choose your oracle | **Wheel of Fortune** | Five records on one axis — and why that chart is rubbish. Ends with Paul. |

Where the analogy breaks, which is the closing beat: a fortune teller's
prediction doesn't change your future. A crash forecast does.

## Stack

Svelte 5 (runes) + Vite, `d3-scale` for scales only, `three` for the one 3D
scene. No chart library — every chart is hand-written SVG so each mark can be
driven by the scroll. Fonts are self-hosted.

```
npm install
npm run dev             # local, base '/'
npm run build           # base '/scrolly-next-crash/'
npm run preview
npm run share-chart     # regenerates public/share-chart.png + og-image.png
node scripts/shoot.mjs  # screenshot walk + overflow/console assertions
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
