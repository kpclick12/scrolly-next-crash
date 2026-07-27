<script>
  // 153 recessions. Five of them were seen coming. A waffle, because the
  // point is the ratio between two counts and a bar chart of 3% versus 97%
  // hides exactly how few five is.
  let { data, step = 0 } = $props();

  const COLS = 17;
  const R = 10.2;
  const GAP = 4.2;
  const cell = R * 2 + GAP;
  const total = $derived(data.total);
  const rows = $derived(Math.ceil(total / COLS));
  const W = 620;
  const gridW = $derived(COLS * cell - GAP);
  const OX = $derived((W - gridW) / 2);
  const OY = 46;
  const H = $derived(OY + rows * cell + 44);

  // The five predicted ones are scattered rather than clumped in a corner —
  // they were five separate recessions in five separate countries, and a
  // solid block of five would read as one event.
  const HITS = new Set([9, 38, 71, 104, 137]);
  const cells = $derived(
    Array.from({ length: total }, (_, i) => ({
      i,
      cx: OX + (i % COLS) * cell + R,
      cy: OY + Math.floor(i / COLS) * cell + R,
      hit: HITS.has(i),
    }))
  );

  const revealed = $derived(step >= 1);
</script>

<figure class="chart">
  <figcaption>Recessions, 1992–2014</figcaption>
  <svg
    viewBox="0 0 {W} {H}"
    role="img"
    aria-label="A grid of {total} dots, one per recession in 63 countries between 1992 and 2014. Exactly {data.predicted} of them are marked as having been predicted by the forecasting consensus a year in advance. The other {total - data.predicted} were not."
  >
    <text class="head" x={OX} y="22">Each dot is one recession</text>
    {#each cells as c (c.i)}
      <circle
        class="cell"
        class:hit={c.hit && revealed}
        cx={c.cx}
        cy={c.cy}
        r={c.hit && revealed ? R : R - 0.6}
      />
    {/each}
    {#if revealed}
      <text class="lbl-hit" x={OX} y={H - 22}>
        <tspan class="big">{data.predicted}</tspan><tspan dx="7">called a year ahead</tspan>
      </text>
      <text class="lbl-miss" x={W - OX} y={H - 22} text-anchor="end">
        {total - data.predicted} arrived unannounced
      </text>
    {:else}
      <text class="lbl-miss" x={OX} y={H - 22}>{total} recessions, 63 countries, 22 years</text>
    {/if}
  </svg>
  <p class="note">
    "Predicted" is the paper's own test: did the private-sector forecasting
    consensus have a recession on the books by the April of the year before it
    started?
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
  .cell {
    fill: var(--baseline);
    opacity: 0.5;
    transition: fill 0.5s ease, opacity 0.5s ease, r 0.5s ease;
  }
  .cell.hit {
    fill: var(--series-blue);
    opacity: 1;
  }
  .lbl-hit {
    font-size: 13px;
    fill: var(--ink-blue);
    font-weight: 700;
  }
  .lbl-hit .big {
    font-family: var(--serif);
    font-size: 26px;
    font-variant-numeric: tabular-nums;
  }
  .lbl-miss {
    font-size: 13px;
    fill: var(--text-muted);
    font-variant-numeric: tabular-nums;
  }
</style>
