<script>
  // A church tower with a stopped clock. The gold hands are the forecast —
  // frozen at five to midnight, where they have been for years. The thin
  // hands are the actual time, and they sweep. Twice a day the two agree,
  // and on those two occasions the tower is a prophet.
  //
  // The sweep is driven by the STEP prop, not a timer: at step 2 the hands
  // run a full revolution and stop exactly on the frozen pair, which is the
  // moment the joke lands.
  let { data, step = 0 } = $props();

  const W = 620;
  const H = 430;
  const CX = W / 2;
  const CY = 186;
  const R = 84;
  // The tower stops well short of the frame so the caption has its own band
  // underneath it — an earlier version put the caption at clock-face height
  // and it landed on top of the belfry windows.
  const BASE = 364;

  // 23:55 → the hour hand sits just shy of 12, the minute hand just shy of 12.
  const FROZEN_MIN = -6; // degrees from 12 o'clock
  const FROZEN_HR = -2.5;

  // Step 2 spins the live hands one full turn and lands them on the frozen
  // pair. Reduced motion gets the end state via the CSS transition being
  // neutered, which is the right behaviour: the two hands still coincide.
  const liveMin = $derived(step >= 2 ? 360 + FROZEN_MIN : 128);
  const liveHr = $derived(step >= 2 ? 360 + FROZEN_HR : 74);

  const hand = (deg, len, cx = CX, cy = CY) => {
    const r = ((deg - 90) * Math.PI) / 180;
    return [cx + Math.cos(r) * len, cy + Math.sin(r) * len];
  };
</script>

<figure class="chart">
  <figcaption>The permanent forecast</figcaption>
  <svg
    viewBox="0 0 {W} {H}"
    role="img"
    aria-label="A church tower clock. Its gold hands are frozen at five to midnight — the permanent forecast. A second pair of thin hands shows the real time and sweeps around; twice a day they line up with the frozen pair, and on those two occasions the stopped clock is right."
  >
    <!-- Tower -->
    <path class="stone" d="M{CX - 104} {BASE} L{CX - 104} 104 L{CX} 22 L{CX + 104} 104 L{CX + 104} {BASE} Z" />
    <path class="stone-shade" d="M{CX} 22 L{CX + 104} 104 L{CX + 104} {BASE} L{CX} {BASE} Z" />
    <!-- Spire cross -->
    <rect class="brass" x={CX - 2.5} y="2" width="5" height="24" rx="1" />
    <rect class="brass" x={CX - 11} y="9" width="22" height="5" rx="1" />
    <!-- A door and two windows, so it reads as a church and not a graph frame -->
    <path class="opening" d="M{CX - 24} {BASE} L{CX - 24} 318 Q{CX} 288 {CX + 24} 318 L{CX + 24} {BASE} Z" />
    <path class="opening" d="M{CX - 78} 306 L{CX - 78} 288 Q{CX - 64} 270 {CX - 50} 288 L{CX - 50} 306 Z" />
    <path class="opening" d="M{CX + 50} 306 L{CX + 50} 288 Q{CX + 64} 270 {CX + 78} 288 L{CX + 78} 306 Z" />

    <!-- Clock face -->
    <circle class="face" cx={CX} cy={CY} r={R} />
    <circle class="face-ring" cx={CX} cy={CY} r={R} />
    {#each Array(12) as _, i}
      {@const a = ((i * 30 - 90) * Math.PI) / 180}
      <line
        class="tickmark"
        x1={CX + Math.cos(a) * (R - 12)}
        y1={CY + Math.sin(a) * (R - 12)}
        x2={CX + Math.cos(a) * (R - 4)}
        y2={CY + Math.sin(a) * (R - 4)}
      />
    {/each}

    <!-- The real time, sweeping -->
    <g class="live" style="--min: {liveMin}deg; --hr: {liveHr}deg; --pivot: {CX}px {CY}px;">
      <line class="live-hand hr" x1={CX} y1={CY} x2={hand(0, R * 0.5)[0]} y2={hand(0, R * 0.5)[1]} />
      <line class="live-hand min" x1={CX} y1={CY} x2={hand(0, R * 0.78)[0]} y2={hand(0, R * 0.78)[1]} />
    </g>

    <!-- The forecast, frozen -->
    <line
      class="frozen"
      x1={CX} y1={CY}
      x2={hand(FROZEN_HR, R * 0.52)[0]} y2={hand(FROZEN_HR, R * 0.52)[1]}
    />
    <line
      class="frozen"
      x1={CX} y1={CY}
      x2={hand(FROZEN_MIN, R * 0.8)[0]} y2={hand(FROZEN_MIN, R * 0.8)[1]}
    />
    <circle class="pin" cx={CX} cy={CY} r="6" />

    <text class="caption" x={CX} y={H - 16} text-anchor="middle">
      {step >= 2 ? "…and twice a day, it is exactly right." : "Stopped at five to midnight since 2011."}
    </text>
  </svg>
  <p class="note">
    Illustrative. The gold hands stand for a forecast that never changes; the
    thin hands are the world going past it.
  </p>
</figure>

<style>
  .stone {
    fill: var(--gridline);
  }
  .stone-shade {
    fill: var(--baseline);
    opacity: 0.32;
  }
  .brass {
    fill: var(--brass-deep);
  }
  .opening {
    fill: var(--velvet);
    opacity: 0.72;
  }
  .face {
    fill: var(--surface-1);
  }
  .face-ring {
    fill: none;
    stroke: var(--brass-deep);
    stroke-width: 5;
  }
  .tickmark {
    stroke: var(--text-muted);
    stroke-width: 2.5;
    stroke-linecap: round;
  }
  .live-hand {
    stroke: var(--text-primary);
    stroke-linecap: round;
    transform-origin: var(--pivot);
    transition: transform 2.4s cubic-bezier(0.34, 0, 0.2, 1);
  }
  .live-hand.hr {
    stroke-width: 3;
    transform: rotate(var(--hr));
  }
  .live-hand.min {
    stroke-width: 2;
    transform: rotate(var(--min));
  }
  .frozen {
    stroke: var(--brass);
    stroke-width: 5.5;
    stroke-linecap: round;
  }
  .pin {
    fill: var(--brass-deep);
  }
  .caption {
    font-size: 13.5px;
    font-style: italic;
    fill: var(--text-secondary);
  }
</style>
