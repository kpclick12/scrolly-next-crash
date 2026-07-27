<script>
  // The Moon, played straight: one night field, two things in it, never
  // remounted. An analyst's couch under a lamp, and then — same ground, same
  // sky — a flock under a full moon. The step prop crossfades between them
  // inside a single SVG, which is the act's joke made structural: you came for
  // the couch, the answer was the flock.
  //
  // The scene carries its own night, rather than sitting on the page's paper.
  // That is deliberate: this is the one act about what happens in the dark,
  // and it should not look like the others.
  //
  // Step 0–1: the couch. Step 2+: the flock. Step 3: one sheep turns around.
  let { step = 0 } = $props();

  const W = 640;
  const H = 470;
  const HORIZON = 344;

  const showCouch = $derived(step <= 1);
  const showHerd = $derived(step >= 2);
  const oneTurns = $derived(step >= 3);

  // A flock on a shallow perspective grid — nearer sheep bigger and lower.
  // Deterministic, so it never reshuffles between renders.
  const FLOCK = Array.from({ length: 20 }, (_, i) => {
    const row = Math.floor(i / 5);
    const col = i % 5;
    const jitter = Math.sin(i * 12.9898) * 0.5;
    return {
      i,
      x: 82 + col * 102 + jitter * 22 + row * 16,
      y: 250 + row * 54 + jitter * 8,
      s: 0.62 + row * 0.16,
      delay: (i % 7) * 0.05 + row * 0.04,
    };
  });

  // The one that turns is in the front row and off-centre, so it is findable
  // without being the first thing you see.
  const REBEL = 17;

  // A fixed star field — no Math.random, so the sky is the same every load.
  const STARS = Array.from({ length: 46 }, (_, i) => ({
    i,
    x: ((Math.sin(i * 78.233) + 1) / 2) * W,
    y: ((Math.sin(i * 12.9898) + 1) / 2) * (HORIZON - 30) + 8,
    r: 0.7 + Math.abs(Math.sin(i * 41.7)) * 1.3,
    o: 0.28 + Math.abs(Math.cos(i * 23.1)) * 0.55,
  }));
</script>

<figure class="chart">
  <figcaption>{showHerd ? "The Moon · herd behaviour" : "The Moon · the other kind of psychology"}</figcaption>
  <svg
    viewBox="0 0 {W} {H}"
    role="img"
    aria-label={showHerd
      ? "A flock of sheep on a moonlit field, all facing the same way, except for one near the front that has turned to look back."
      : "An empty analyst's couch and armchair in a darkened room, a notebook left on the floor."}
  >
    <defs>
      <radialGradient id="moonglow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stop-color="#f6efd6" stop-opacity="0.5" />
        <stop offset="100%" stop-color="#f6efd6" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="night" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#120c22" />
        <stop offset="100%" stop-color="#2b1f52" />
      </linearGradient>
      <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#241a44" />
        <stop offset="100%" stop-color="#150e2c" />
      </linearGradient>
    </defs>

    <!-- The night field the whole act happens in -->
    <rect class="sky" x="0" y="0" width={W} height={H} rx="10" fill="url(#night)" />
    {#each STARS as s (s.i)}
      <circle class="star" cx={s.x} cy={s.y} r={s.r} opacity={s.o} />
    {/each}
    <circle class="glow" cx="514" cy="104" r="130" fill="url(#moonglow)" />
    <circle class="moon" cx="514" cy="104" r="46" />
    <!-- Two craters, so it reads as the moon and not a lamp -->
    <circle class="crater" cx="500" cy="92" r="9" />
    <circle class="crater" cx="526" cy="118" r="6" />
    <circle class="crater" cx="507" cy="123" r="4" />
    <rect class="ground" x="0" y={HORIZON} width={W} height={H - HORIZON} fill="url(#ground)" />
    <line class="horizon" x1="0" y1={HORIZON} x2={W} y2={HORIZON} />

    <!-- The couch, in the dark of the consulting room -->
    <g class="layer" class:on={showCouch}>
      <rect class="couch" x="140" y="260" width="360" height="44" rx="10" />
      <rect class="couch-leg" x="162" y="304" width="13" height="46" rx="4" />
      <rect class="couch-leg" x="464" y="304" width="13" height="46" rx="4" />
      <path class="couch-back" d="M140 260 L140 204 Q140 186 162 186 L276 186 Q294 186 294 206 L294 260 Z" />
      <ellipse class="bolster" cx="192" cy="247" rx="44" ry="18" />
      <rect class="chair" x="512" y="272" width="62" height="15" rx="6" />
      <path class="chair-back" d="M519 272 L519 214 Q519 202 536 202 L556 202 Q572 202 572 216 L572 272 Z" />
      <rect class="couch-leg" x="524" y="287" width="9" height="38" rx="3" />
      <rect class="couch-leg" x="560" y="287" width="9" height="38" rx="3" />
      <path class="pad" d="M352 350 L412 342 L414 364 L354 372 Z" />
      <line class="pad-rule" x1="362" y1="354" x2="404" y2="348" />
      <line class="pad-rule" x1="363" y1="361" x2="398" y2="356" />
      <text class="scene-lbl" x="118" y="140" text-anchor="middle">Vienna, 1899</text>
    </g>

    <!-- The flock -->
    <g class="layer" class:on={showHerd}>
      {#each FLOCK as s (s.i)}
        {@const turned = oneTurns && s.i === REBEL}
        <g
          class="sheep"
          class:turned
          style="--d: {s.delay}s"
          transform="translate({s.x}, {s.y}) scale({s.s}) {turned ? 'scale(-1, 1)' : ''}"
        >
          <rect class="leg" x="-16" y="16" width="6" height="24" rx="3" />
          <rect class="leg" x="8" y="16" width="6" height="24" rx="3" />
          <circle class="fleece" cx="-14" cy="2" r="17" />
          <circle class="fleece" cx="6" cy="-4" r="19" />
          <circle class="fleece" cx="22" cy="4" r="15" />
          <circle class="fleece" cx="0" cy="10" r="16" />
          <ellipse class="head" cx="34" cy="10" rx="11" ry="9" />
          <ellipse class="ear" cx="28" cy="2" rx="6" ry="3.5" transform="rotate(-24 28 2)" />
          <circle class="eye" cx="38" cy="8" r="1.9" />
        </g>
      {/each}
      {#if oneTurns}
        <text class="scene-lbl" x="150" y="196" text-anchor="middle">Being early</text>
        <text class="scene-lbl" x="150" y="222" text-anchor="middle">looks like being wrong</text>
      {/if}
    </g>
  </svg>
</figure>

<style>
  /* This scene brings its own surface, so every colour in it is literal
     rather than a token — the tokens are tuned for paper and would invert
     under a dark-mode page, which is exactly what must NOT happen here. */
  .layer {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.55s ease;
  }
  .layer.on {
    opacity: 1;
    visibility: visible;
  }
  .star { fill: #f3e8d2; }
  .moon { fill: #f6efd6; }
  .crater { fill: #e2d8bb; opacity: 0.55; }
  .horizon { stroke: rgba(243, 232, 210, 0.22); stroke-width: 1.5; }
  .couch { fill: #7a2f4a; }
  .couch-back { fill: #632740; }
  .bolster { fill: #f3e8d2; opacity: 0.34; }
  .couch-leg { fill: #d9a441; opacity: 0.7; }
  .chair,
  .chair-back { fill: #3a2f63; }
  .pad { fill: #f3e8d2; opacity: 0.86; }
  .pad-rule { stroke: #8a8296; stroke-width: 1.4; }
  .sheep .fleece {
    fill: #f3ecdc;
    stroke: #b9ae95;
    stroke-width: 1.8;
  }
  .sheep .head,
  .sheep .ear { fill: #3c3450; }
  .sheep .eye { fill: #f3ecdc; }
  .sheep .leg { fill: #3c3450; }
  .sheep {
    transition: transform 0.6s ease;
    transition-delay: var(--d);
  }
  /* The one that turned is the only coloured thing on the field. */
  .sheep.turned .fleece {
    fill: #4f9bea;
    stroke: #a9cdf5;
  }
  .scene-lbl {
    font-family: var(--display);
    font-size: 17px;
    fill: #f3e8d2;
    opacity: 0.86;
    letter-spacing: 0.04em;
  }
</style>
