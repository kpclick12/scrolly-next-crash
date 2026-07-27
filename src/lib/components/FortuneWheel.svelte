<script>
  // The Wheel of Fortune, with five oracles riding the rim.
  //
  // On the card, figures rise on one side of the wheel and fall on the other.
  // Here, position on the rim IS the hit rate: 0% at the bottom, 100% at the
  // top, climbing the right-hand side. Every rider carries its own name and
  // number, so the encoding never rests on where you think the top is.
  //
  // Rendering this as a fairground wheel is the act's argument, not decoration.
  // The five records are real and none of them measure the same thing; a wheel
  // is the honest shape for a ranking that should not be trusted, and a tidy
  // bar chart was quietly lending it an authority it has not earned.
  //
  // `step` walks the riders on one at a time; -1 shows all five.
  let { data, step = -1 } = $props();

  // The viewBox is wider than the wheel on purpose: the rider at 54% sits at
  // the far right of the rim and its label needs somewhere to go. Sized so the
  // longest name clears the edge rather than being clipped.
  const W = 700;
  const H = 560;
  const CX = 350;
  const CY = 288;
  const R = 170; // rim radius

  // 0% at the bottom (a = 180°), climbing clockwise-from-top up the right side.
  const ang = (pct) => ((180 - pct * 1.8) * Math.PI) / 180;
  const at = (pct, r = R) => [CX + Math.sin(ang(pct)) * r, CY - Math.cos(ang(pct)) * r];

  const riders = $derived(
    data.oracles.map((o, i) => {
      const [px, py] = at(o.pct);
      const [lx, ly] = at(o.pct, R + 30);
      return { ...o, px, py, lx, ly, right: lx >= CX, shown: step < 0 || i <= step };
    })
  );
  const focusRow = $derived(step >= 0 && step < data.oracles.length ? data.oracles[step] : null);

  const TICKS = [0, 25, 50, 75, 100];
  const [chanceX, chanceY] = $derived(at(data.chanceLine));
</script>

<figure class="chart">
  <figcaption>Wheel of Fortune · hit rate, five different tests</figcaption>
  <svg
    viewBox="0 0 {W} {H}"
    role="img"
    aria-label="A wheel with five figures riding its rim, positioned by hit rate — bottom is zero, top is one hundred percent. Economists 3 percent of recessions called a year ahead; a perma-bear 28 percent; a dartboard beat professionals in 39 percent of rounds; those professionals beat the Dow in 54 percent; and Octopus Paul called 86 percent of his football matches. Each figure measures a different thing."
  >
    <!-- The wheel -->
    <circle class="rim-outer" cx={CX} cy={CY} r={R + 15} />
    <circle class="rim-inner" cx={CX} cy={CY} r={R - 15} />
    <circle class="rim" cx={CX} cy={CY} r={R} />
    {#each Array(16) as _, i}
      {@const a = (i * 22.5 * Math.PI) / 180}
      <line
        class="spoke"
        x1={CX + Math.sin(a) * 28}
        y1={CY - Math.cos(a) * 28}
        x2={CX + Math.sin(a) * (R - 15)}
        y2={CY - Math.cos(a) * (R - 15)}
      />
    {/each}
    <circle class="hub" cx={CX} cy={CY} r="28" />
    <circle class="hub-ring" cx={CX} cy={CY} r="19" />

    <!-- Rim scale -->
    {#each TICKS as t}
      {@const [tx1, ty1] = at(t, R + 15)}
      {@const [tx2, ty2] = at(t, R + 25)}
      {@const [lx, ly] = at(t, R + 40)}
      <line class="tick-mark" x1={tx1} y1={ty1} x2={tx2} y2={ty2} />
      <text class="tick" x={lx} y={ly + 4} text-anchor="middle">{t}%</text>
    {/each}

    <!-- Chance, as a reference. Tetlock's experts live on this mark. The
         label rides inside the rim: out at the rim it collided with the 50%
         tick, which sits on the very same spoke. -->
    <line class="chance" x1={CX} y1={CY} x2={chanceX} y2={chanceY} />
    <text class="chance-lbl" x={CX + R * 0.5} y={CY - 10} text-anchor="middle">a coin flip</text>

    <!-- The riders -->
    {#each riders as o (o.id)}
      <g class="rider" class:on={o.shown} class:focus={focusRow?.id === o.id}>
        <title>{o.name}: {o.hits} of {o.attempts}. {o.measures}.</title>
        <line class="leader" x1={o.px} y1={o.py} x2={o.lx} y2={o.ly} />
        <circle class="seat seat-{o.tone}" cx={o.px} cy={o.py} r="11" />
        <!-- A small figure clinging on, the way the card draws them. -->
        <g class="figure" transform="translate({o.px}, {o.py})">
          <circle class="fig-head" cx="0" cy="-15" r="5" />
          <path class="fig-limb" d="M0 -10 L0 -1" />
          <path class="fig-limb" d="M0 -8 L-8 -13" />
          <path class="fig-limb" d="M0 -8 L8 -13" />
        </g>
        <text
          class="rider-name"
          x={o.lx + (o.right ? 8 : -8)}
          y={o.ly - 1}
          text-anchor={o.right ? "start" : "end"}
        >{o.name}</text>
        <text
          class="rider-val"
          x={o.lx + (o.right ? 8 : -8)}
          y={o.ly + 16}
          text-anchor={o.right ? "start" : "end"}
        >{o.pct}% · {o.hits} of {o.attempts}</text>
      </g>
    {/each}

    <text class="warning" x={CX} y={H - 12} text-anchor="middle">
      Five different tests on one wheel. Do not trust this chart.
    </text>
  </svg>
  {#if focusRow}
    <p class="note"><strong>{focusRow.name}:</strong> {focusRow.measures}.</p>
  {:else}
    <p class="note">
      Hover any rider for what it actually measured. They are not comparable,
      and that is the finding.
    </p>
  {/if}
</figure>

<style>
  .rim-outer,
  .rim-inner {
    fill: none;
    stroke: var(--ink-brass);
    stroke-width: 2;
    opacity: 0.75;
  }
  .rim {
    fill: none;
    stroke: var(--brass);
    stroke-width: 9;
    opacity: 0.42;
  }
  .spoke { stroke: var(--baseline); stroke-width: 1.6; }
  .hub { fill: var(--surface-1); stroke: var(--ink-brass); stroke-width: 2.4; }
  .hub-ring { fill: none; stroke: var(--ink-brass); stroke-width: 1; opacity: 0.6; }
  .tick-mark { stroke: var(--text-muted); stroke-width: 1.6; }
  .tick {
    font-family: var(--sans);
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
    font-family: var(--body);
    font-size: 14px;
    font-style: italic;
    fill: var(--text-muted);
  }
  .rider {
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  .rider.on { opacity: 1; }
  .leader { stroke: var(--baseline); stroke-width: 1.2; stroke-dasharray: 2 3; }
  .seat { stroke: var(--surface-1); stroke-width: 2.4; }
  /* Tone is a category of finding, not a status token: bad = worse than
     shouting at random, mid = around a coin flip, good = the octopus. Every
     rider carries its name and value as text, so hue is never alone. */
  .seat-bad { fill: var(--series-red); }
  .seat-mid { fill: var(--series-blue); }
  .seat-good { fill: var(--series-green); }
  .fig-head { fill: var(--text-primary); }
  .fig-limb {
    fill: none;
    stroke: var(--text-primary);
    stroke-width: 2.6;
    stroke-linecap: round;
  }
  .rider-name,
  .rider-val {
    paint-order: stroke fill;
    stroke: var(--surface-1);
    stroke-width: 3.4px;
    stroke-linejoin: round;
  }
  .rider-name {
    font-family: var(--display);
    font-size: 15px;
    font-weight: 700;
    fill: var(--text-secondary);
  }
  .rider.focus .rider-name { fill: var(--text-primary); }
  .rider-val {
    font-family: var(--sans);
    font-size: 11.5px;
    fill: var(--text-muted);
    font-variant-numeric: tabular-nums;
  }
  .warning {
    font-family: var(--body);
    font-size: 14.5px;
    font-style: italic;
    fill: var(--text-muted);
  }
</style>
