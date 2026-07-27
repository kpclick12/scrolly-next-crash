<script>
  // 96 squares, one per year since 1928. 27 of them contained the start of a
  // 20%-plus fall. Shade those in and you have drawn the perma-bear's entire
  // forecasting method, plus his hit rate, in one picture.
  let { data, step = 0 } = $props();

  const COLS = 12;
  const S = 40;
  const GAP = 6;
  const W = 620;
  const rows = $derived(Math.ceil(data.years / COLS));
  const gridW = COLS * (S + GAP) - GAP;
  const OX = (W - gridW) / 2;
  const OY = 40;
  const H = $derived(OY + rows * (S + GAP) + 62);

  // 27 hits spread across 96 years at roughly the real cadence — clustered a
  // little, because bear markets cluster a little. Indices are year offsets
  // from 1928; this is a schematic of the RATE, not a dated list, and the
  // caption says so.
  const HITS = new Set([
    1, 2, 9, 10, 12, 18, 20, 34, 38, 41, 45, 46, 52, 54, 59, 62, 65, 69, 72,
    73, 79, 80, 81, 87, 92, 94, 95,
  ]);

  const cells = $derived(
    Array.from({ length: data.years }, (_, i) => ({
      i,
      year: data.from + i,
      x: OX + (i % COLS) * (S + GAP),
      y: OY + Math.floor(i / COLS) * (S + GAP),
      hit: HITS.has(i),
    }))
  );
  const revealed = $derived(step >= 1);
</script>

<figure class="chart">
  <figcaption>Every year from {data.from} to {data.to}</figcaption>
  <svg
    viewBox="0 0 {W} {H}"
    role="img"
    aria-label="A grid of {data.years} squares, one per year from {data.from} to {data.to}. {data.bearMarkets} of them are shaded to show a year containing a fall of 20 percent or more — about {data.oddsPerYear} percent of all years."
  >
    <text class="head" x={OX} y="22">Each square is one year</text>
    {#each cells as c (c.i)}
      <rect
        class="yr"
        class:hit={c.hit && revealed}
        x={c.x}
        y={c.y}
        width={S}
        height={S}
        rx="3"
      >
        <title>{c.year}{c.hit ? " — a 20% fall" : ""}</title>
      </rect>
    {/each}
    {#if revealed}
      <text class="lbl" x={OX} y={H - 26}>
        <tspan class="big">{data.bearMarkets}</tspan><tspan dx="7">years with a fall of 20% or more</tspan>
      </text>
      <text class="lbl-muted" x={W - OX} y={H - 26} text-anchor="end">
        ≈ {data.oddsPerYear}% of all years
      </text>
    {/if}
  </svg>
  <p class="note">
    Schematic: the count of bear markets is real, the placement of the shaded
    squares is spread to show the rate, not to date each one.
  </p>
</figure>

<style>
  .head {
    font-size: 12px;
    font-weight: 700;
    fill: var(--text-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .yr {
    fill: var(--gridline);
    transition: fill 0.5s ease;
  }
  .yr.hit {
    fill: var(--series-red);
  }
  .lbl {
    font-size: 13px;
    fill: var(--ink-red);
    font-weight: 700;
  }
  .lbl .big {
    font-family: var(--serif);
    font-size: 26px;
    font-variant-numeric: tabular-nums;
  }
  .lbl-muted {
    font-size: 13px;
    fill: var(--text-muted);
    font-variant-numeric: tabular-nums;
  }
</style>
