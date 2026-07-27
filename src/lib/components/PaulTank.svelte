<script>
  // Paul, in his tank, between two boxes of mussels. The one he opened first
  // was the forecast. He is the last visual in the piece because he is the
  // only forecaster in it who retired at the top.
  let { paul, step = 0 } = $props();

  const W = 620;
  const H = 430;
  const chosen = $derived(step >= 1);
</script>

<figure class="chart">
  <figcaption>Oberhausen, 2010</figcaption>
  <svg
    viewBox="0 0 {W} {H}"
    role="img"
    aria-label="An octopus in a tank between two boxes, each marked with a flag. He has wrapped an arm around the left-hand box. Paul called {paul.total.hits} of {paul.total.attempts} matches correctly, including all {paul.worldCup2010.attempts} at the 2010 World Cup."
  >
    <!-- Water -->
    <rect class="water" x="46" y="52" width={W - 92} height="322" rx="6" />
    <rect class="glass" x="46" y="52" width={W - 92} height="322" rx="6" />
    <!-- Light from above, one soft wedge -->
    <path class="beam" d="M250 52 L370 52 L448 374 L172 374 Z" />
    <!-- Sand and a couple of stones -->
    <path class="sand" d="M46 374 L46 340 Q180 322 310 344 Q460 368 574 336 L574 374 Z" />
    <ellipse class="stone" cx="150" cy="352" rx="26" ry="11" />
    <ellipse class="stone" cx="470" cy="346" rx="20" ry="9" />

    <!-- The two boxes. The chosen one lifts its lid. -->
    <g class="box" class:picked={chosen} transform="translate(120, 236)">
      <rect class="box-body" x="0" y="18" width="96" height="76" rx="5" />
      <rect class="box-lid" x="-4" y="0" width="104" height="20" rx="4" />
      <rect class="flag" x="16" y="36" width="64" height="40" rx="2" />
      <rect class="flag-band" x="16" y="36" width="64" height="13.3" />
      <rect class="flag-band alt" x="16" y="62.6" width="64" height="13.4" />
    </g>
    <g class="box" transform="translate(404, 236)">
      <rect class="box-body" x="0" y="18" width="96" height="76" rx="5" />
      <rect class="box-lid" x="-4" y="0" width="104" height="20" rx="4" />
      <rect class="flag" x="16" y="36" width="64" height="40" rx="2" />
      <rect class="flag-band other" x="16" y="36" width="21.3" height="40" />
      <rect class="flag-band other-2" x="58.7" y="36" width="21.3" height="40" />
    </g>

    <!-- Paul -->
    <g class="paul" class:reaching={chosen}>
      <!-- arms: two reaching left toward the chosen box, the rest trailing -->
      <path class="arm" d="M296 214 Q232 226 190 250 Q168 262 176 276" />
      <path class="arm" d="M300 226 Q246 250 214 282 Q198 298 210 308" />
      <path class="arm" d="M330 236 Q344 286 386 312 Q404 322 398 334" />
      <path class="arm" d="M340 226 Q378 258 428 262 Q448 264 448 276" />
      <path class="arm" d="M312 240 Q306 296 288 330 Q280 346 292 352" />
      <path class="arm" d="M322 240 Q334 300 356 336 Q364 350 354 358" />
      <!-- mantle and eyes -->
      <ellipse class="mantle" cx="318" cy="186" rx="52" ry="60" />
      <ellipse class="mantle-shade" cx="332" cy="196" rx="34" ry="44" />
      <ellipse class="eye-white" cx="298" cy="196" rx="13" ry="11" />
      <ellipse class="eye-white" cx="340" cy="196" rx="13" ry="11" />
      <ellipse class="pupil" cx="299" cy="198" rx="6" ry="3.4" />
      <ellipse class="pupil" cx="341" cy="198" rx="6" ry="3.4" />
    </g>

    <text class="score" x={W / 2} y="34" text-anchor="middle">
      {paul.total.hits} of {paul.total.attempts} · {paul.worldCup2010.hits} of {paul.worldCup2010.attempts} at the World Cup
    </text>
  </svg>
  <p class="note">
    Two boxes, each with a mussel and a flag. Whichever he opened first was the
    prediction. Paul died on {paul.died}, undefeated.
  </p>
</figure>

<style>
  .water {
    fill: var(--series-blue);
    opacity: 0.16;
  }
  .glass {
    fill: none;
    stroke: var(--baseline);
    stroke-width: 3;
  }
  .beam {
    fill: var(--surface-1);
    opacity: 0.3;
  }
  .sand {
    fill: var(--baseline);
    opacity: 0.55;
  }
  .stone {
    fill: var(--baseline);
  }
  .box-body {
    fill: var(--text-muted);
    opacity: 0.5;
  }
  .box-lid {
    fill: var(--text-secondary);
    opacity: 0.7;
    transform-origin: 0 10px;
    transition: transform 0.6s ease;
  }
  .box.picked .box-lid {
    transform: rotate(-24deg) translateY(-6px);
  }
  .flag {
    fill: var(--surface-1);
  }
  .flag-band { fill: var(--text-primary); opacity: 0.75; }
  .flag-band.alt { fill: var(--series-red); }
  .flag-band.other { fill: var(--series-red); }
  .flag-band.other-2 { fill: var(--series-blue); }
  .arm {
    fill: none;
    stroke: var(--ink-violet);
    stroke-width: 15;
    stroke-linecap: round;
    opacity: 0.9;
  }
  .mantle {
    fill: var(--ink-violet);
  }
  .mantle-shade {
    fill: var(--surface-1);
    opacity: 0.12;
  }
  .eye-white {
    fill: var(--surface-1);
  }
  .pupil {
    fill: var(--text-primary);
  }
  .score {
    font-family: var(--display);
    font-size: 16px;
    font-weight: 700;
    fill: var(--text-primary);
    font-variant-numeric: tabular-nums;
  }
</style>
