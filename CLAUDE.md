# scrolly-next-crash

A scrollytelling visual essay: **"How do you predict the next crash?"** — told
through a fortune teller's parlour. English, deployed to GitHub Pages.

## Load the house style first

This piece follows my scrollytelling house style, which lives in
**`kpclick12/skills`** → `scrollytelling.md`. **Read it before changing
anything structural.**

If it is not already loaded in this session, fetch it:
`add_repo` → `kpclick12/skills`, then `git clone --depth 1`.

**Do not copy that file into this repo.** The skills repo is the single source
of truth and it gets edited after every piece. `scrolly-monopoly` has a
committed copy that is 100 lines behind and is missing the entire
"plan before writing any code" section — that is the failure mode.

Reference implementations, worth reading before building: `scrolly-monopoly`
(cleanest structure), `scrolly-wealth` (mobile + sourcing discipline).

## What is specific to THIS repo

The skill owns structure and mechanics. These are the local decisions it does
not know about:

- **The conceit is a fortune teller.** Each act is named for a tarot card —
  The Tower, The Magician, Judgement, The Moon, Wheel of Fortune. It ends on
  Octopus Paul. Where the analogy breaks is the closing beat: a fortune
  teller's prediction doesn't change your future; a crash forecast does.
- **Type is Cinzel + EB Garamond**, both variable, both self-hosted in
  `public/fonts/`. Never add a third-party font request — that is a GDPR
  constraint, not a preference.
- **There is no single step-card style.** Each act's copy is printed on the
  material its subject belongs to, opted into with one class on the act
  wrapper: `.mat-news` (torn 1929 newsprint, monochrome), `.mat-book` (book
  page, running head + drop cap + folio), `.mat-bill` (doomsday handbill),
  `.mat-pad` (ruled notepad), `.mat-card` (tarot). All five live in `app.css`
  and share only the min-height floor, the active/inactive opacity, and the
  full-bleed treatment under 860px.
- **No ordinary bar charts.** Every figure is the object the conceit is about
  — falling figures off a struck tower, cards dealt face-down, votive candles,
  a fairground wheel. The encodings stay honest and the axes stay real; only
  the marks change. The one exception is the standalone share image, which
  stays a bar chart because it has to read in a feed at 400px wide.

## Rules that have already cost a round trip here

- **Card min-heights are measured, never guessed.** Any type or material
  change invalidates them. Run `node scripts/measure-cards.mjs` against the
  preview server and paste the numbers back into the act wrappers.
- **The dimmed palette does not survive.** Flattened at 48% the worst pair
  falls to ΔE 4.1, so identity in every figure comes from always-on direct
  labels, never from hue. See the comment block in `app.css`; re-run the
  `dataviz` validator with `--pairs all` in BOTH modes if the palette changes.
- **Pages deploys from `main` only, and that is not just a preference.**
  Enabling Pages creates a `github-pages` environment whose deployment-branch
  policy allows the default branch and nothing else, so adding a feature branch
  to `deploy.yml` does not work — the deploy job is rejected before a runner is
  assigned and fails in about two seconds with no steps at all. To preview a
  branch without merging, widen that policy in
  Settings → Environments → github-pages first.
- Sourcing is non-negotiable: every figure traces to a line in the
  "Methodology & sources" section, and anything illustrative says so where it
  appears, not only down there.

## Commands

```
npm run dev                     # local, base '/'
npm run build                   # base '/scrolly-next-crash/'
npm run preview                 # serves the real build at :4173
npm run share-chart             # share-chart.png + og-image.png; refuses to
                                # draw if its own title's claims stop holding
node scripts/shoot.mjs          # screenshot walk, both schemes, 3 viewports;
                                # asserts no overflow at 320-412px + clean console
node scripts/measure-cards.mjs  # natural card heights per act
```

`shoot.mjs` and `measure-cards.mjs` both need `npm run preview` running first.

## Working across phone and computer

The session does not travel; the branch does. Commit and push often — the
remote container is ephemeral, and anything uncommitted is gone. On the other
device, pull the same branch and carry on. Do not start a new repo to change
machines.
