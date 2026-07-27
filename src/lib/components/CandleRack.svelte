<script>
  // A votive rack: 96 candles, one per year since 1928. Twenty-seven of them
  // have been snuffed — the years that contained a fall of 20% or more.
  //
  // Same count encoding as a shaded year-grid, but the mark is a candle, and
  // the thing the reader takes away is how MANY are still burning. That is the
  // doomer's problem in one picture: he is betting on the dark ones, and most
  // of the rack is lit.
  let { data, step = 0 } = $props();

  const COLS = 12;
  const CW = 19; // candle width
  const CH = 32; // wax height
  const GX = 36; // horizontal pitch
  const GY = 50; // vertical pitch
  const W = 640;
  const rows = $derived(Math.ceil(data.years / COLS));
  const gridW = COLS * GX - (GX - CW);
  const OX = (W - gridW) / 2;
  const OY = 46;
  const H = $derived(OY + rows * GY + 52);

  // 27 snuffed across 96 years at roughly the real cadence — bear markets do
  // cluster a little. Indices are year offsets from 1928; this is a schematic
  // of the RATE, not a dated list, and the note says so.
  const OUT = new Set([
    1, 2, 9, 10, 12, 18, 20, 34, 38, 41, 45, 46, 52, 54, 59, 62, 65, 69, 72,
    73, 79, 80, 81, 87, 92, 94, 95,
  ]);

  const candles = $derived(
    Array.from({ length: data.years }, (_, i) => ({
      i,
      year: data.from + i,
      x: OX + (i % COLS) * GX,
      y: OY + Math.floor(i / COLS) * GY,
      out: OUT.has(i),
      // Candles burn down unevenly; deterministic so it never reshuffles.
      burn: 3 + Math.abs(Math.sin(i * 41.7)) * 7,
      flicker: (Math.abs(Math.sin(i * 12.9898)) * 1.4).toFixed(2),
    }))
  );
  const revealed = $derived(step >= 1);
</script>

<figure class="chart">
  <figcaption>Every year from {data.from} to {data.to}</figcaption>
  <svg
    viewBox="0 0 {W} {H}"
    role="img"
    aria-label="A rack of {data.years} votive candles, one per year from {data.from} to {data.to}. {data.bearMarkets} of them have been snuffed out — the years that contained a fall of 20 percent or more, about {data.oddsPerYear} percent of all years. The rest are still burning."
  >
    <text class="head" x={OX} y="22">Each candle is one year</text>

    {#each candles as c (c.i)}
      {@const snuffed = c.out && revealed}
      {@const top = c.y + c.burn}
      <g class="candle" class:out={snuffed} style="--f: {c.flicker}s">
        <title>{c.year}{c.out ? " — a 20% fall" : ""}</title>
        <!-- The shelf this row stands on -->
        <!-- wax -->
        <rect class="wax" x={c.x} y={top} width={CW} height={CH + (c.y + 10 - top)} rx="2" />
        <ellipse class="wax-top" cx={c.x + CW / 2} cy={top} rx={CW / 2} ry="2.6" />
        <!-- wick -->
        <line class="wick" x1={c.x + CW / 2} y1={top} x2={c.x + CW / 2} y2={top - 5} />
        {#if snuffed}
          <!-- a thread of smoke instead of a flame -->
          <path
            class="smoke"
            d="M{c.x + CW / 2} {top - 5} q -5 -6 0 -11 q 5 -6 -1 -12"
          />
        {:else}
          <ellipse class="flame" cx={c.x + CW / 2} cy={top - 14} rx="5.4" ry="9.6" />
          <ellipse class="flame-core" cx={c.x + CW / 2} cy={top - 12} rx="2.1" ry="4.2" />
        {/if}
      </g>
    {/each}
    {#each Array(rows) as _, r}
      <rect class="shelf" x={OX - 8} y={OY + r * GY + CH + 10} width={gridW + 16} height="4" rx="2" />
    {/each}

    {#if revealed}
      <text class="lbl-out" x={OX} y={H - 18}>
        <tspan class="big">{data.bearMarkets}</tspan><tspan dx="9">years went dark</tspan>
      </text>
      <text class="lbl-lit" x={W - OX} y={H - 18} text-anchor="end">
        {data.years - data.bearMarkets} still lit
      </text>
    {/if}
  </svg>
  <p class="note">
    Schematic: the count of bear markets is real, the placement of the snuffed
    candles is spread to show the rate, not to date each one.
  </p>
</figure>

<style>
  .head {
    font-family: var(--display);
    font-size: 10.5px;
    font-weight: 700;
    fill: var(--text-muted);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  .shelf { fill: var(--baseline); opacity: 0.6; }
  .wax { fill: var(--parlour-cream); stroke: var(--baseline); stroke-width: 1; }
  .wax-top { fill: var(--surface-1); stroke: var(--baseline); stroke-width: 1; }
  .wick { stroke: var(--text-primary); stroke-width: 1.4; }
  .flame {
    fill: var(--brass);
    /* A candle that is alight should look alight; reduced motion freezes it
       via the global rule, and the 0%/100% keyframe IS the resting state so a
       single iteration still looks deliberate. */
    animation: flicker 1.9s ease-in-out infinite;
    animation-delay: var(--f);
    transform-box: fill-box;
    transform-origin: 50% 100%;
  }
  .flame-core { fill: var(--parlour-cream); }
  @keyframes flicker {
    0%, 100% { transform: scaleY(1) scaleX(1); opacity: 1; }
    50% { transform: scaleY(1.13) scaleX(0.94); opacity: 0.88; }
  }
  /* A snuffed candle has to read as snuffed from across the room — this is
     the whole encoding. Grey-on-cream was far too polite, so the dead ones go
     to the page's darkest ink and lose their highlight. */
  .candle.out .wax { fill: var(--velvet); stroke: var(--velvet-deep); }
  .candle.out .wax-top { fill: var(--velvet-deep); stroke: var(--velvet-deep); }
  .candle.out .wick { stroke: var(--velvet-deep); }
  .smoke {
    fill: none;
    stroke: var(--text-secondary);
    stroke-width: 1.6;
    stroke-linecap: round;
    opacity: 0.8;
  }
  .lbl-out {
    font-family: var(--body);
    font-size: 16px;
    fill: var(--text-primary);
    font-weight: 700;
  }
  .lbl-out .big {
    font-family: var(--display);
    font-size: 30px;
    font-variant-numeric: tabular-nums;
  }
  .lbl-lit {
    font-family: var(--body);
    font-size: 16px;
    font-style: italic;
    fill: var(--ink-brass);
    font-variant-numeric: tabular-nums;
  }
</style>
