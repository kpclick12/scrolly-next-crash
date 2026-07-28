# scrolly-next-crash

**Nobody saw it coming** — a short, light scrollytelling story about why market
crashes cannot be predicted.

Live: https://kpclick12.github.io/scrolly-next-crash/

## The one thing

Nobody can time a crash. The people who sound most certain are the ones nobody
is scoring.

## The frame: screens

Every crash arrives on the newest screen in the house. The piece is four
beats, and the last screen is a character-select.

| | |
|---|---|
| **Hero (Three.js)** | The reader *operates* each screen instead of flying past it. The 1929 newspaper unfolds as you scroll. The 1987 CRT powers on with a scanline sweep and draws its chart live. The 2008 phone's screen scrolls under your thumb — that one is a texture offset, so the reader's scroll literally is the phone's scroll. |
| **The worst days** | The ten biggest one-day falls, as candles. The finding: they are *not* tied to the famous crashes the way people assume. Black Monday 1987 was the worst day ever recorded and the Dow finished that year **up**. March 2020 was at a new record eight months later. The two 1929 days were the same size and took twenty-five years to undo. |
| **The prediction boom** | How forecasting became a career — against 5 recessions called out of 153. |
| **PLAYER SELECT** | Eight forecasters, stat cards, tap one. Three of the eight have no published record at all, and those are the ones you hear from. |

**Every section is laid out differently on purpose** — a wide sticky figure
with copy running beneath it, a quiet text-forward run, and a full-bleed
interactive screen with no scroll mechanic. Nothing in the piece is an
ordinary bar chart. The one exception is the standalone share image, which
stays bars because in a feed at 400px wide it has to read in a second.

## Type

**Fraunces** for display over **Figtree** for body, both variable and both
self-hosted from `public/fonts/` — no third-party font requests, ever. That is
a GDPR constraint, not a preference.

## Stack

Svelte 5 (runes) + Vite, `d3-scale` for scales only, `three` for the hero. No
chart library — every figure is hand-written SVG.

```
npm install
npm run dev
npm run build
npm run preview
npm run share-chart        # regenerates public/share-chart.png + og-image.png
node scripts/shoot.mjs     # screenshot walk + overflow/console assertions
```

`scripts/shoot.mjs` runs the pre-ship checks against the real build: every
section at desktop, phone and a deliberately short viewport, in both colour
schemes, asserting no horizontal overflow at 320/360/375/390/412px and a clean
console.

`scripts/make-share-chart.mjs` reads the same `src/data/*.json` the essay uses
and **refuses to draw** unless the claims in its own title and subtitle still
hold — that the octopus ranks first among the scored, the economist last, that
exactly three of the eight have no record, and that both layouts fit.

## Colour

Validated with the `dataviz` skill's validator against both surfaces, all
pairs:

```
node scripts/validate_palette.js "#2a78d6,#d93a2b,#0f8f63" --mode light --surface "#f7f4ee" --pairs all
node scripts/validate_palette.js "#3987e5,#e05a45,#14a583" --mode dark  --surface "#191c24" --pairs all
```

Both pass every check. The **dimmed** state does not — flattened at ~48% the
worst pair falls to ΔE ~4 — so every mark carries a printed value rather than
relying on hue.

## Sources

Every figure traces to a line in the piece's own "Methodology & sources"
section. The candles are bodies only (no wicks: reliable intraday ranges back
to 1899 are not available, and the figure says so), and on the player-select
screen only "Record" is a measurement — the other two bars are labelled as
editorial judgement where they appear.
