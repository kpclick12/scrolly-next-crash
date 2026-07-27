<script>
  import { scaleLinear } from "d3-scale";

  // Five forecasters, ranked by hit rate. Every number here is a real count
  // with a real denominator — and no two rows are the same test, which is
  // stated on the chart in as many words. That is the point: this is exactly
  // the shape of chart that makes an argument look settled, and it is
  // nonsense, and so are most of the ones that look like it.
  //
  // `step` walks down the rows; -1 shows all of them.
  let { data, step = -1 } = $props();

  const W = 620;
  const ROW = 54;
  const M = { top: 44, right: 58, bottom: 56, left: 152 };
  const H = $derived(M.top + data.oracles.length * ROW + M.bottom);

  const x = $derived(scaleLinear([0, 100], [M.left, W - M.right]));
  const rows = $derived(
    data.oracles.map((o, i) => ({
      ...o,
      y: M.top + i * ROW,
      shown: step < 0 || i <= step,
    }))
  );
  const focusRow = $derived(step >= 0 && step < data.oracles.length ? data.oracles[step] : null);
</script>

<figure class="chart">
  <figcaption>Hit rate — five different tests</figcaption>
  <svg
    viewBox="0 0 {W} {H}"
    role="img"
    aria-label="Bar chart of hit rates: economists 3 percent of recessions called a year ahead, a perma-bear 28 percent, a dartboard beat professionals in 39 percent of rounds, those professionals beat the Dow in 54 percent, and Octopus Paul called 86 percent of his football matches. Each bar measures a different thing."
  >
    {#each [0, 25, 50, 75, 100] as tick}
      <line class="grid" x1={x(tick)} x2={x(tick)} y1={M.top - 12} y2={H - M.bottom} />
      <text class="tick" x={x(tick)} y={M.top - 20} text-anchor="middle">{tick}%</text>
    {/each}

    <!-- Chance, as a reference. Tetlock's experts live on this line. -->
    <line class="chance" x1={x(data.chanceLine)} x2={x(data.chanceLine)} y1={M.top - 12} y2={H - M.bottom + 4} />
    <text class="chance-lbl" x={x(data.chanceLine)} y={H - M.bottom + 20} text-anchor="middle">
      a coin flip
    </text>

    {#each rows as o (o.id)}
      <g class="row" class:on={o.shown} class:focus={focusRow?.id === o.id}>
        <text class="name" x={M.left - 12} y={o.y + ROW / 2 + 5} text-anchor="end">{o.name}</text>
        <rect
          class="bar bar-{o.tone}"
          x={M.left}
          y={o.y + 11}
          width={Math.max(0, x(o.pct) - x(0))}
          height={ROW - 26}
          rx="4"
        >
          <title>{o.name}: {o.hits} of {o.attempts}. {o.measures}.</title>
        </rect>
        <text class="val" x={x(o.pct) + 8} y={o.y + ROW / 2 + 5}>{o.pct}%</text>
      </g>
    {/each}

    <text class="warning" x={M.left} y={H - 14}>
      Five different tests on one axis. Do not trust this chart.
    </text>
  </svg>
  {#if focusRow}
    <p class="note"><strong>{focusRow.name}:</strong> {focusRow.measures} — {focusRow.hits} of {focusRow.attempts}.</p>
  {:else}
    <p class="note">
      Hover any bar for what it actually measured. They are not comparable, and
      that is the finding.
    </p>
  {/if}
</figure>

<style>
  .grid {
    stroke: var(--gridline);
  }
  .tick {
    font-size: 11.5px;
    fill: var(--text-muted);
    font-variant-numeric: tabular-nums;
  }
  .chance {
    stroke: var(--text-muted);
    stroke-width: 1.6;
    stroke-dasharray: 5 4;
  }
  .chance-lbl {
    font-size: 11.5px;
    fill: var(--text-muted);
    font-style: italic;
  }
  .row {
    opacity: 0;
    transition: opacity 0.45s ease;
  }
  .row.on {
    opacity: 1;
  }
  .name {
    font-size: 13.5px;
    font-weight: 600;
    fill: var(--text-secondary);
  }
  .row.focus .name {
    fill: var(--text-primary);
  }
  .bar {
    transition: width 0.6s cubic-bezier(0.3, 0, 0.2, 1);
  }
  /* Tone is a category of finding, not a status token: bad = worse than
     shouting at random, mid = around a coin flip, good = the octopus. Each
     bar carries its own name and value as text, so hue is never alone. */
  .bar-bad { fill: var(--series-red); }
  .bar-mid { fill: var(--series-blue); }
  .bar-good { fill: var(--series-green); }
  .val {
    font-size: 13.5px;
    font-weight: 700;
    fill: var(--text-primary);
    font-variant-numeric: tabular-nums;
  }
  .warning {
    font-size: 12px;
    font-style: italic;
    fill: var(--text-muted);
  }
</style>
