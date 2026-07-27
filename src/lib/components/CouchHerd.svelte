<script>
  // One scene, two things in it, never remounted: an analyst's couch that
  // empties out, and a flock that fills the same floor. The step prop
  // crossfades between them inside a single SVG, which is the joke made
  // structural — you came for the couch, the answer was the flock.
  //
  // Step 0-1: the couch. Step 2+: the flock. Step 3: one sheep turns around.
  let { step = 0 } = $props();

  const W = 620;
  const H = 430;

  const showCouch = $derived(step <= 1);
  const showHerd = $derived(step >= 2);
  const oneTurns = $derived(step >= 3);

  // A flock laid out on a shallow perspective grid — nearer sheep bigger and
  // lower. Deterministic, so it never reshuffles between renders. The grid is
  // sized to fill the frame: an earlier version left the flock in the
  // bottom-left sixth of the panel with everything above it empty.
  const FLOCK = Array.from({ length: 20 }, (_, i) => {
    const row = Math.floor(i / 5);
    const col = i % 5;
    const jitter = Math.sin(i * 12.9898) * 0.5;
    return {
      i,
      x: 74 + col * 98 + jitter * 22 + row * 16,
      y: 128 + row * 66 + jitter * 10,
      s: 0.7 + row * 0.18,
      delay: (i % 7) * 0.05 + row * 0.04,
    };
  });

  // The one that turns is in the front row and off-centre, so it is findable
  // without being the first thing you see.
  const REBEL = 17;
</script>

<figure class="chart">
  <figcaption>{showHerd ? "Herd behaviour" : "The other kind of psychology"}</figcaption>
  <svg
    viewBox="0 0 {W} {H}"
    role="img"
    aria-label={showHerd
      ? "A flock of sheep, all facing the same way, except for one near the front that has turned to look back."
      : "An empty analyst's couch beside an armchair and a notebook."}
  >
    <line class="floor" x1="24" y1="404" x2={W - 24} y2="404" />

    <!-- The couch -->
    <g class="layer" class:on={showCouch}>
      <!-- chaise: base, back roll, bolster pillow -->
      <rect class="couch-shadow" x="120" y="374" width="392" height="10" rx="5" />
      <rect class="couch" x="128" y="272" width="376" height="46" rx="10" />
      <rect class="couch-leg" x="150" y="318" width="14" height="58" rx="4" />
      <rect class="couch-leg" x="466" y="318" width="14" height="58" rx="4" />
      <path class="couch-back" d="M128 272 L128 214 Q128 196 150 196 L268 196 Q286 196 286 216 L286 272 Z" />
      <ellipse class="bolster" cx="182" cy="258" rx="46" ry="19" />
      <!-- the armchair, empty, at a professional angle -->
      <rect class="chair" x="516" y="286" width="66" height="16" rx="6" />
      <path class="chair-back" d="M524 286 L524 224 Q524 212 542 212 L562 212 Q578 212 578 226 L578 286 Z" />
      <rect class="couch-leg" x="528" y="302" width="10" height="42" rx="3" />
      <rect class="couch-leg" x="566" y="302" width="10" height="42" rx="3" />
      <!-- a notebook on the floor, pages open -->
      <path class="pad" d="M348 366 L410 358 L412 380 L350 388 Z" />
      <line class="pad-rule" x1="358" y1="370" x2="402" y2="364" />
      <line class="pad-rule" x1="359" y1="377" x2="396" y2="372" />
      <text class="scene-lbl" x={W / 2} y="126" text-anchor="middle">Vienna, 1899</text>
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
          <!-- legs -->
          <rect class="leg" x="-16" y="16" width="6" height="24" rx="3" />
          <rect class="leg" x="8" y="16" width="6" height="24" rx="3" />
          <!-- body: overlapping fleece lobes -->
          <circle class="fleece" cx="-14" cy="2" r="17" />
          <circle class="fleece" cx="6" cy="-4" r="19" />
          <circle class="fleece" cx="22" cy="4" r="15" />
          <circle class="fleece" cx="0" cy="10" r="16" />
          <!-- head -->
          <ellipse class="head" cx="34" cy="10" rx="11" ry="9" />
          <ellipse class="ear" cx="28" cy="2" rx="6" ry="3.5" transform="rotate(-24 28 2)" />
          <circle class="eye" cx="38" cy="8" r="1.9" />
        </g>
      {/each}
      {#if oneTurns}
        <!-- Below the floor line: at flock height this label landed on the
             back row's fleece. -->
        <text class="scene-lbl" x={W / 2} y="426" text-anchor="middle">
          Being early looks exactly like being wrong
        </text>
      {/if}
    </g>
  </svg>
</figure>

<style>
  .layer {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.55s ease;
  }
  .layer.on {
    opacity: 1;
    visibility: visible;
  }
  .floor {
    stroke: var(--gridline);
    stroke-width: 2;
  }
  .couch {
    fill: var(--series-red);
    opacity: 0.82;
  }
  .couch-back {
    fill: var(--series-red);
    opacity: 0.62;
  }
  .bolster {
    fill: var(--surface-1);
    opacity: 0.55;
  }
  .couch-shadow {
    fill: var(--gridline);
  }
  .couch-leg {
    fill: var(--baseline);
  }
  .chair,
  .chair-back {
    fill: var(--baseline);
    opacity: 0.75;
  }
  .pad {
    fill: var(--surface-1);
    stroke: var(--baseline);
    stroke-width: 1.5;
  }
  .pad-rule {
    stroke: var(--baseline);
    stroke-width: 1.5;
  }
  .sheep .fleece {
    fill: var(--surface-1);
    stroke: var(--baseline);
    stroke-width: 2;
  }
  .sheep .head,
  .sheep .ear {
    fill: var(--text-secondary);
  }
  .sheep .eye {
    fill: var(--surface-1);
  }
  .sheep .leg {
    fill: var(--text-secondary);
  }
  .sheep {
    transition: transform 0.6s ease;
    transition-delay: var(--d);
  }
  /* The one that turned is the only coloured thing on the screen. */
  .sheep.turned .fleece {
    fill: var(--series-blue);
    stroke: var(--ink-blue);
  }
  .scene-lbl {
    font-family: var(--serif);
    font-size: 17px;
    font-style: italic;
    fill: var(--text-secondary);
  }
</style>
