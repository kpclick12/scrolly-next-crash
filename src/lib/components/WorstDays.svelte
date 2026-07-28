<script>
  import { scaleLinear } from "d3-scale";

  // The ten worst days the Dow has ever had, as candles.
  //
  // HONESTY NOTE, and it is on the figure too: these are BODIES ONLY. A real
  // candle's body is the open-to-close move and its wicks are the intraday
  // high and low; dependable intraday ranges going back to 1899 are not
  // something we have, so each mark is the close-to-close move and nothing
  // more. Everything the section argues works from that alone.
  //
  // `reveal` colours the candles by which episode they belong to. `focus` is
  // an era id, which pulls that episode forward.
  let { data, reveal = false, focus = null } = $props();

  const W = 760;
  const H = 340;
  const M = { top: 34, right: 18, bottom: 74, left: 46 };
  const days = $derived(data.days);
  const band = $derived((W - M.left - M.right) / days.length);
  const y = $derived(scaleLinear([-24, 0], [H - M.bottom, M.top]));

  const ERA = { 1929: "red", 1987: "blue", 2020: "green", other: "grey" };
</script>

<figure class="chart wide">
  <svg
    viewBox="0 0 {W} {H}"
    role="img"
    aria-label="Ten candles, one per worst day in Dow Jones history, from Black Monday 1987 at minus 22.6 percent down to 26 October 1987 at minus 8 percent. Four belong to 1929, two to 1987, two to 2020 and two to episodes most people have never heard of."
  >
    {#each [0, -5, -10, -15, -20] as tick}
      <line class="grid" x1={M.left} x2={W - M.right} y1={y(tick)} y2={y(tick)} />
      <text class="tick" x={M.left - 8} y={y(tick) + 4} text-anchor="end">{tick}%</text>
    {/each}

    {#each days as d, i (d.rank)}
      {@const cx = M.left + band * i + band / 2}
      {@const bw = Math.min(band * 0.7, 46)}
      {@const dim = focus !== null && d.era !== focus}
      <g class="candle c-{reveal ? ERA[d.era] : 'grey'}" class:dim>
        <title>{d.date}: {d.pct}%{d.name ? ` — ${d.name}` : ""}</title>
        <!-- The body. No wick: we do not have the intraday range, and the
             caption says so rather than drawing a guess. -->
        <rect x={cx - bw / 2} y={y(0)} width={bw} height={Math.abs(y(d.pct) - y(0))} rx="1.5" />
        <text class="pct" x={cx} y={y(d.pct) - 9} text-anchor="middle">{d.pct.toFixed(1)}</text>
        <text class="date" x={cx} y={H - M.bottom + 18} text-anchor="middle">{d.date.split(" ")[1]}</text>
        <text class="yr" x={cx} y={H - M.bottom + 33} text-anchor="middle">{d.year}</text>
      </g>
    {/each}

    <line class="zero" x1={M.left} x2={W - M.right} y1={y(0)} y2={y(0)} />
    <text class="cap" x={M.left} y={H - 14}>
      One day's close-to-close move. Candle bodies only — intraday highs and lows are not shown.
    </text>
  </svg>
</figure>

<style>
  .chart.wide { width: 100%; }
  .grid { stroke: var(--rule); }
  .zero { stroke: var(--ink-3); stroke-width: 1.6; }
  .tick {
    font-family: var(--sans);
    font-size: 12px;
    fill: var(--ink-3);
    font-variant-numeric: tabular-nums;
  }
  .candle rect {
    fill: var(--ink-3);
    transition: fill 0.6s ease, opacity 0.4s ease;
  }
  .candle { transition: opacity 0.4s ease; }
  .candle.dim { opacity: 0.28; }
  /* Colour arrives only on the reveal, and it encodes WHICH EPISODE a day
     belongs to — never the size of the fall, which the height already says.
     Every candle keeps its own printed value, so hue is never alone. */
  .c-red rect { fill: var(--series-red); }
  .c-blue rect { fill: var(--series-blue); }
  .c-green rect { fill: var(--series-green); }
  .c-grey rect { fill: var(--ink-3); }
  .pct {
    font-family: var(--sans);
    font-size: 13.5px;
    font-weight: 700;
    fill: var(--paper);
    font-variant-numeric: tabular-nums;
  }
  .date,
  .yr {
    font-family: var(--sans);
    font-size: 11px;
    fill: var(--ink-3);
  }
  .yr { font-weight: 700; fill: var(--ink-2); }
  @media (max-width: 760px) {
    /* The strip renders about 160px tall on a phone. Month labels are
       illegible at that size and the year alone places each candle, so they
       go; the values grow to stay readable. The beats below carry the exact
       numbers in text either way. */
    .date { display: none; }
    .pct { font-size: 19px; }
    .yr { font-size: 16px; }
    .tick { font-size: 16px; }
    .cap { font-size: 15px; }
  }
  .cap {
    font-family: var(--sans);
    font-size: 11.5px;
    fill: var(--ink-3);
    font-style: italic;
  }
</style>
