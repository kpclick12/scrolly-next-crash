<script>
  // 153 recessions, dealt out as a spread. Five get turned face up.
  //
  // Same encoding as a waffle chart — one mark per event, a highlighted
  // subset — but the mark is a playing card, each one laid down at its own
  // slight angle so it reads as a spread on a table rather than a grid in a
  // report. The tilt is deterministic (a hash of the index), so the deal is
  // identical on every load.
  let { data, step = 0 } = $props();

  const COLS = 17;
  const CW = 28;
  const CH = 39;
  const GX = 7;
  const GY = 6;
  const W = 640;
  const total = $derived(data.total);
  const rows = $derived(Math.ceil(total / COLS));
  const gridW = COLS * (CW + GX) - GX;
  const OX = (W - gridW) / 2;
  const OY = 40;
  const H = $derived(OY + rows * (CH + GY) + 54);

  // The five that were called, scattered rather than clumped — they were five
  // separate recessions in five separate countries, and a block of five in one
  // corner would read as a single event.
  const HITS = new Set([9, 38, 71, 104, 137]);

  const cards = $derived(
    Array.from({ length: total }, (_, i) => ({
      i,
      x: OX + (i % COLS) * (CW + GX),
      y: OY + Math.floor(i / COLS) * (CH + GY),
      hit: HITS.has(i),
      // ±5°, deterministic.
      rot: (Math.sin(i * 78.233) * 5).toFixed(2),
    }))
  );

  const revealed = $derived(step >= 1);
</script>

<figure class="chart">
  <figcaption>Recessions dealt, 1992–2014</figcaption>
  <svg
    viewBox="0 0 {W} {H}"
    role="img"
    aria-label="A spread of {total} face-down cards, one per recession in 63 countries between 1992 and 2014. Exactly {data.predicted} are turned face up — the ones the forecasting consensus called a year in advance. The other {total - data.predicted} were never turned over."
  >
    <text class="head" x={OX} y="22">Each card is one recession</text>

    {#each cards as c (c.i)}
      {@const up = c.hit && revealed}
      <g class="card" class:up transform="translate({c.x + CW / 2}, {c.y + CH / 2}) rotate({c.rot})">
        <rect
          class="face"
          x={-CW / 2}
          y={-CH / 2}
          width={CW}
          height={CH}
          rx="3"
        />
        {#if up}
          <!-- Turned over: a small sun, the one card that saw it coming. -->
          <circle class="pip" cx="0" cy="0" r="5.4" />
          {#each [0, 45, 90, 135, 180, 225, 270, 315] as a}
            {@const r = (a * Math.PI) / 180}
            <line
              class="ray"
              x1={Math.cos(r) * 7.6}
              y1={Math.sin(r) * 7.6}
              x2={Math.cos(r) * 11.4}
              y2={Math.sin(r) * 11.4}
            />
          {/each}
        {:else}
          <!-- Face down: the card back, a lattice. -->
          <rect class="back" x={-CW / 2 + 3.5} y={-CH / 2 + 3.5} width={CW - 7} height={CH - 7} rx="1.5" />
          <line class="weave" x1={-CW / 2 + 3.5} y1={-CH / 2 + 3.5} x2={CW / 2 - 3.5} y2={CH / 2 - 3.5} />
          <line class="weave" x1={CW / 2 - 3.5} y1={-CH / 2 + 3.5} x2={-CW / 2 + 3.5} y2={CH / 2 - 3.5} />
        {/if}
      </g>
    {/each}

    {#if revealed}
      <text class="lbl-hit" x={OX} y={H - 20}>
        <tspan class="big">{data.predicted}</tspan><tspan dx="9">turned face up</tspan>
      </text>
      <text class="lbl-miss" x={W - OX} y={H - 20} text-anchor="end">
        {total - data.predicted} arrived unannounced
      </text>
    {:else}
      <text class="lbl-miss" x={OX} y={H - 20}>{total} recessions · 63 countries · 22 years</text>
    {/if}
  </svg>
  <p class="note">
    "Called" is the paper's own test: did the private-sector forecasting
    consensus have a recession on the books by the April of the year before it
    started?
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
  .card .face {
    fill: var(--surface-1);
    stroke: var(--baseline);
    stroke-width: 1.2;
    transition: fill 0.5s ease, stroke 0.5s ease;
  }
  .card.up .face {
    fill: var(--surface-1);
    stroke: var(--ink-blue);
    stroke-width: 2;
  }
  .back {
    fill: var(--velvet);
    opacity: 0.42;
  }
  .weave {
    stroke: var(--surface-1);
    stroke-width: 0.9;
    opacity: 0.35;
  }
  .pip { fill: var(--series-blue); }
  .ray {
    stroke: var(--series-blue);
    stroke-width: 1.8;
    stroke-linecap: round;
  }
  .lbl-hit {
    font-family: var(--body);
    font-size: 16px;
    fill: var(--ink-blue);
    font-weight: 700;
  }
  .lbl-hit .big {
    font-family: var(--display);
    font-size: 30px;
    font-variant-numeric: tabular-nums;
  }
  .lbl-miss {
    font-family: var(--body);
    font-size: 16px;
    fill: var(--text-muted);
    font-variant-numeric: tabular-nums;
  }
</style>
