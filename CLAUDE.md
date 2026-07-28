# scrolly-next-crash

A scrollytelling visual essay: **"Nobody saw it coming"** — a short, light
story about why market crashes cannot be predicted. English, deployed to
GitHub Pages from `main`.

## Load the house style first

The scrollytelling house style lives in **`kpclick12/skills`** →
`scrollytelling.md`. **Read it before changing anything structural.** If it is
not already in this session: `add_repo` → `kpclick12/skills`, then
`git clone --depth 1`.

**Do not copy that file into this repo.** The skills repo is the source of
truth and it is edited after every piece. `scrolly-monopoly` has a committed
copy that is ~100 lines behind and is missing the whole "plan before writing
any code" section — that is the failure mode.

## The shape

The frame is **screens**: every crash arrives on the newest screen in the
house, and the last screen is a character-select. Four beats, deliberately
short — an earlier version had five acts and was too long.

Each beat is a different MEDIUM, and that is the spine:

1. **Hero (Three.js)** — newspaper, computer, phone. The reader OPERATES each
   one rather than flying past it: the 1929 paper unfolds as you scroll, the
   1987 CRT powers on with a scanline sweep and draws its chart live, and the
   2008 iPhone's screen scrolls under your thumb (a texture offset, so the
   reader's scroll *is* the phone's scroll).
2. **The worst days** — the ten biggest one-day falls as candles, and the
   finding that they are not tied to the famous crashes the way people assume.
3. **The bookshelf** — 174 years of books saying the same thing, pickable.
   This replaced three paragraphs of prose; keep it that way.
4. **The cinema** — a click-to-load clip from *The Big Short*, Michael Burry's
   great call and his later wrong one, and the herd. The video is a FACADE:
   the poster is our own drawing and nothing is requested from YouTube until
   the reader presses play, and then only via youtube-nocookie.com.
5. **PLAYER SELECT** — eight forecasters, Mario Kart 64 stat cards, tap to see
   a record. No scroll mechanic at all in this one.

## Rules for this repo

- **Do not make every section the same shape.** The three sections are laid
  out differently on purpose: a wide sticky figure with the copy running
  beneath it, a quiet text-forward run, and a full-bleed interactive screen.
  The two-column sticky-panel-plus-cards template is explicitly not the house
  default here.
- **No plain bar charts in the piece.** The share image is the one exception
  and the README says why.
- **Scene dressing with numbers on it is still a figure.** The phone ticker
  originally printed invented percentages; it now shows names and bars that
  claim nothing. Never put a number on screen you cannot source.
- **The candles are bodies only** — no wicks, because we do not have reliable
  intraday ranges back to 1899, and the figure says so on itself.
- **Only one of the three player-select stat bars is measured.** Confidence
  and "changes their mind" are editorial judgements and the screen says so.
  An editorial judgement drawn as a bar chart is exactly what this piece warns
  about, so it does not get to pretend otherwise.
- **The dimmed palette does not survive** — flattened at ~48% the worst pair
  falls to ΔE ~4, so every mark carries a printed value rather than relying on
  hue. Re-run the `dataviz` validator with `--pairs all` in BOTH modes if the
  palette changes.
- **Pages deploys from `main` only, and that is not a preference.** Enabling
  Pages creates a `github-pages` environment whose deployment-branch policy
  allows the default branch and nothing else, so adding a feature branch to
  `deploy.yml` does not work — the deploy job is rejected before a runner is
  assigned and fails in ~2s with no steps at all. To preview a branch without
  merging, widen that policy in Settings → Environments → github-pages first.
- Sourcing is non-negotiable: every figure traces to a line in the
  "Methodology & sources" section.

## Commands

```
npm run dev                # local, base '/'
npm run build              # base '/scrolly-next-crash/'
npm run preview            # serves the real build at :4173
npm run share-chart        # share-chart.png + og-image.png; refuses to draw
                           # if its own title's claims stop holding
node scripts/shoot.mjs     # screenshot walk, both schemes, 3 viewports;
                           # asserts no overflow at 320-412px + clean console
```

`shoot.mjs` needs `npm run preview` running first.

## Working across phone and computer

The session does not travel; the branch does. Commit and push often — the
remote container is ephemeral. On the other device, pull and carry on. Do not
start a new repo to change machines.
