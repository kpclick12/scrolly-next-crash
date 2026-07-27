<script>
  import { scaleLinear } from "d3-scale";

  // Three crashes, one index, aligned on the day each one peaked. The x axis
  // is months since that peak, so 1987 is a cliff and 1929 is a landslide —
  // the shape of the thing is the whole point, and it is not the shape most
  // people picture when they say "crash".
  //
  // Every vertex is a dated closing value (see crashes.json); the segments
  // between them are straight lines and the caption says so.
  //
  // `focus` is the id of the crash being talked about, or null for all three.
  // De-emphasis NEVER carries identity here: the dimmed palette measures at
  // ΔE ~4 (see app.css), so every series keeps its direct label lit at all
  // times and dimming only means "not this one right now".
  let { crashes, focus = null } = $props();

  const W = 620;
  const H = 400;
  const M = { top: 26, right: 78, bottom: 42, left: 46 };

  // The time axis is SQUARE-ROOTED, and the caption says so. On a linear
  // 36-month axis 1987's entire crash — peak to floor in under two months —
  // is about four pixels wide, which hides the one thing that crash is famous
  // for. Rooting the axis gives the first weeks room without dropping 1929's
  // three-year slide off the end. The tick labels are placed at real months
  // so the compression is visible rather than smuggled.
  const sq = (m) => Math.sqrt(Math.min(m, 36));
  const xs = $derived(scaleLinear([0, 6], [M.left, W - M.right]));
  const x = $derived((m) => xs(sq(m)));
  const y = $derived(scaleLinear([-100, 0], [H - M.bottom, M.top]));

  const shown = $derived(
    crashes.map((c) => {
      const pts = c.path.map((d) => [x(Math.min(d.m, 36)), y(d.dd)]);
      return {
        ...c,
        d: pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`).join(""),
        end: pts[pts.length - 1],
        low: pts.reduce((a, b) => (b[1] > a[1] ? b : a)),
        dim: focus !== null && focus !== c.id,
      };
    })
  );

  // Label lanes: the three end-labels can land within a few pixels of each
  // other, so nudge them apart in the SVG's own units, in priority order —
  // the focused crash keeps the lane it wants.
  const MIN_GAP = 17;
  const labels = $derived(
    [...shown]
      .sort((a, b) => (a.dim === b.dim ? a.end[1] - b.end[1] : a.dim ? 1 : -1))
      .reduce((placed, c) => {
        let ly = c.end[1];
        let moved = true;
        let guard = 0;
        while (moved && guard++ < 12) {
          moved = false;
          for (const p of placed) {
            if (Math.abs(p.ly - ly) < MIN_GAP) {
              ly = p.ly + (ly >= p.ly ? MIN_GAP : -MIN_GAP);
              moved = true;
            }
          }
        }
        placed.push({ ...c, ly });
        return placed;
      }, [])
  );

  const summary = $derived(
    focus
      ? (() => {
          const c = crashes.find((k) => k.id === focus);
          return `Drawdown chart. ${c.name}, ${c.year}: the Dow fell ${Math.abs(c.drawdown)} percent from its peak of ${c.peakDate}, reaching bottom ${c.monthsToTrough} months later, and did not close back at the old peak until ${c.backToEven}.`;
        })()
      : "Drawdown chart comparing three Dow Jones crashes from the day each one peaked: 1929 fell 89 percent over 34 months, 1987 fell 36 percent in under two, and 2008 fell 54 percent over 17 months."
  );
</script>

<figure class="chart">
  <!-- Kept to one line on purpose. On a phone the sticky panel's top strip is
       the only part not covered by the incoming card, so a three-line caption
       there costs a whole band of chart. The detail it used to carry is on the
       x-axis label and in the note below. -->
  <figcaption>How far below the peak — Dow Jones</figcaption>
  <svg viewBox="0 0 {W} {H}" role="img" aria-label={summary}>
    {#each [0, -20, -40, -60, -80, -100] as tick}
      <line class="grid" x1={M.left} x2={W - M.right} y1={y(tick)} y2={y(tick)} />
      <text class="tick" x={M.left - 8} y={y(tick) + 4} text-anchor="end">{tick}%</text>
    {/each}
    {#each [0, 1, 3, 6, 12, 24, 36] as tick}
      <text class="tick" x={x(tick)} y={H - M.bottom + 20} text-anchor="middle">
        {tick === 0 ? "peak" : tick}
      </text>
    {/each}
    <text class="axis-lbl" x={(M.left + W - M.right) / 2} y={H - 6} text-anchor="middle">
      months after the peak — spaced by √time, so the first weeks are readable
    </text>

    {#each shown as c (c.id)}
      <path class="traj traj-{c.color}" class:dim={c.dim} d={c.d} />
    {/each}
    {#each shown as c (c.id)}
      <circle
        class="dot dot-{c.color}"
        class:dim={c.dim}
        cx={c.low[0]}
        cy={c.low[1]}
        r={c.dim ? 3.5 : 5}
      />
      <title>{c.year} {c.name}: {c.drawdown}% from peak</title>
    {/each}

    <!-- Direct labels, always on. They are the reason the dimmed state is
         allowed to exist at all — identity never rests on hue here. -->
    {#each labels as c (c.id)}
      <text class="end-lbl lbl-{c.color}" x={c.end[0] + 8} y={c.ly + 4}>{c.label}</text>
      <text class="end-sub" x={c.end[0] + 8} y={c.ly + 18}>{c.drawdown}%</text>
    {/each}

    <line class="axis" x1={M.left} x2={W - M.right} y1={y(0)} y2={y(0)} />
  </svg>
  <p class="note">
    Straight lines between dated closing values — the real path wandered
    between them. The 1929 line runs off this chart: it kept falling to −89%
    in July 1932.
  </p>
</figure>

<style>
  .grid {
    stroke: var(--gridline);
  }
  .axis {
    stroke: var(--baseline);
    stroke-width: 1.5;
  }
  .tick {
    font-size: 11.5px;
    fill: var(--text-muted);
    font-variant-numeric: tabular-nums;
  }
  .axis-lbl {
    font-size: 11px;
    fill: var(--text-muted);
  }
  .traj {
    fill: none;
    stroke-width: 2.6;
    stroke-linejoin: round;
    stroke-linecap: round;
    transition: opacity 0.4s ease, stroke-width 0.4s ease;
  }
  .traj.dim {
    opacity: 0.42;
    stroke-width: 1.6;
  }
  .traj-red { stroke: var(--series-red); }
  .traj-blue { stroke: var(--series-blue); }
  .traj-green { stroke: var(--series-green); }
  .dot {
    stroke: var(--surface-1);
    stroke-width: 2;
    transition: opacity 0.4s ease, r 0.4s ease;
  }
  .dot.dim {
    opacity: 0.42;
  }
  .dot-red { fill: var(--series-red); }
  .dot-blue { fill: var(--series-blue); }
  .dot-green { fill: var(--series-green); }
  /* Halo: the end-labels sit on top of whichever line happens to cross there,
     and at phone width the 2008 label lands right on the 1929 slide. Painting
     the stroke under the fill knocks the line back without a box. */
  .end-lbl,
  .end-sub {
    paint-order: stroke fill;
    stroke: var(--surface-1);
    stroke-width: 3px;
    stroke-linejoin: round;
  }
  .end-lbl {
    font-size: 13px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .lbl-red { fill: var(--ink-red); }
  .lbl-blue { fill: var(--ink-blue); }
  .lbl-green { fill: var(--ink-green); }
  .end-sub {
    font-size: 11.5px;
    fill: var(--text-muted);
    font-variant-numeric: tabular-nums;
  }
</style>
