<script>
  // PLAYER SELECT.
  //
  // Eight forecasters in a 2x4 grid with stat cards, straight off a console
  // character screen. This is the one section with no scroll mechanic at all —
  // you pick, and the card below changes. The skill's rule about playful
  // rather than gamified holds: nothing is scored, nothing is unlocked, there
  // are no points. It is the argument made touchable, which is the only kind
  // of play these pieces do.
  //
  // Only ONE of the three stat bars is a measurement. That is stated on the
  // screen, next to the bars, in as many words — an editorial judgement drawn
  // as a bar chart is exactly the sort of thing this whole piece is warning
  // about, so it does not get to pretend otherwise.
  let { data } = $props();

  let selected = $state(0);
  const cast = $derived(data.characters);
  const who = $derived(cast[selected]);

  // Faces are drawn, not loaded — one small procedural portrait each, keyed
  // off the id so the roster and the art cannot drift apart.
  const FACE = {
    economist: { skin: "#e6b98f", hair: "#4a3a2c", acc: "specs" },
    permabear: { skin: "#d9a877", hair: "#6b6b6b", acc: "sign" },
    pundit: { skin: "#f0c49b", hair: "#2f2f33", acc: "mic" },
    algorithm: { skin: "#b9c6d8", hair: "#5a6a86", acc: "robot" },
    dartboard: { skin: "#c9a06a", hair: "#3b2a1c", acc: "dart" },
    stockpicker: { skin: "#e8bd93", hair: "#3a2b20", acc: "tie" },
    superforecaster: { skin: "#d6a982", hair: "#8a6a4a", acc: "chart" },
    paul: { skin: "#8e6bb8", hair: "#8e6bb8", acc: "octo" },
  };

  function onKey(e, i) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selected = i;
    }
    // Arrow keys walk the grid, the way the real screen does.
    const moves = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 4, ArrowUp: -4 };
    if (moves[e.key] !== undefined) {
      e.preventDefault();
      const next = i + moves[e.key];
      if (next >= 0 && next < cast.length) {
        selected = next;
        document.getElementById(`ps-${next}`)?.focus();
      }
    }
  }
</script>

<div class="cabinet">
  <p class="marquee">Player Select</p>

  <div class="grid" role="radiogroup" aria-label="Choose a forecaster">
    {#each cast as c, i (c.id)}
      {@const f = FACE[c.id]}
      <div class="slot">
      <button
        id="ps-{i}"
        class="tile tone-{c.tone}"
        class:on={selected === i}
        role="radio"
        aria-checked={selected === i}
        tabindex={selected === i ? 0 : -1}
        onclick={() => (selected = i)}
        onkeydown={(e) => onKey(e, i)}
      >
        <span class="portrait">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <circle class="halo" cx="32" cy="32" r="30" />
            {#if f.acc === "octo"}
              <ellipse cx="32" cy="26" rx="17" ry="19" fill={f.skin} />
              {#each [-14, -7, 0, 7, 14] as dx}
                <path
                  d="M{32 + dx} 40 q{dx * 0.5} 12 {dx * 0.9} 18"
                  stroke={f.skin}
                  stroke-width="5"
                  fill="none"
                  stroke-linecap="round"
                />
              {/each}
              <circle cx="25" cy="24" r="4.6" fill="#fff" />
              <circle cx="39" cy="24" r="4.6" fill="#fff" />
              <ellipse cx="25" cy="25" rx="2.2" ry="1.3" fill="#22242c" />
              <ellipse cx="39" cy="25" rx="2.2" ry="1.3" fill="#22242c" />
            {:else}
              <path d="M14 58 q4 -14 18 -14 q14 0 18 14 z" fill="#2a2f3a" />
              <circle cx="32" cy="28" r="15" fill={f.skin} />
              <path d="M17 24 q3 -14 15 -14 q12 0 15 14 q-15 -6 -30 0 z" fill={f.hair} />
              <circle cx="26" cy="29" r="1.9" fill="#22242c" />
              <circle cx="38" cy="29" r="1.9" fill="#22242c" />
              {#if f.acc === "specs"}
                <g stroke="#22242c" stroke-width="1.6" fill="none">
                  <circle cx="26" cy="29" r="5.4" />
                  <circle cx="38" cy="29" r="5.4" />
                  <path d="M31.4 29 h1.2" />
                </g>
              {/if}
              {#if f.acc === "mic"}
                <rect x="44" y="30" width="7" height="13" rx="3.5" fill="#22242c" />
              {/if}
              {#if f.acc === "sign"}
                <rect x="8" y="30" width="14" height="11" rx="1" fill="#f2efe7" stroke="#22242c" stroke-width="1.4" />
                <path d="M11 34 h8 M11 37 h5" stroke="#22242c" stroke-width="1.4" />
              {/if}
              {#if f.acc === "robot"}
                <rect x="18" y="18" width="28" height="22" rx="4" fill="#8f9cb5" />
                <rect x="24" y="26" width="6" height="4" rx="1" fill="#22242c" />
                <rect x="34" y="26" width="6" height="4" rx="1" fill="#22242c" />
                <path d="M32 18 v-6" stroke="#8f9cb5" stroke-width="2.5" />
                <circle cx="32" cy="10" r="2.6" fill="#8f9cb5" />
              {/if}
              {#if f.acc === "dart"}
                <circle cx="46" cy="20" r="8" fill="#f2efe7" stroke="#22242c" stroke-width="1.4" />
                <circle cx="46" cy="20" r="3.4" fill="#d93a2b" />
              {/if}
              {#if f.acc === "tie"}
                <path d="M32 44 l4 5 l-4 11 l-4 -11 z" fill="#d93a2b" />
              {/if}
              {#if f.acc === "chart"}
                <path d="M40 46 l5 -6 l4 4 l6 -9" stroke="#0f8f63" stroke-width="2.6" fill="none" stroke-linecap="round" />
              {/if}
            {/if}
          </svg>
        </span>
        {#if selected === i}<span class="p1" aria-hidden="true">1P</span>{/if}
      </button>
      <span class="plate" class:on={selected === i}>{c.name}</span>
    </div>
    {/each}
  </div>

  <div class="card" aria-live="polite">
    <div class="card-head">
      <h3>{who.name}</h3>
      <p class="tag">{who.tag}</p>
    </div>

    <div class="stats">
      <div class="stat">
        <span class="label">Record</span>
        {#if who.pct === null}
          <span class="unpub">unpublished</span>
        {:else}
          <span class="bars" aria-hidden="true">
            {#each Array(5) as _, n}
              <i class:fill={n < Math.round(who.pct / 20)}></i>
            {/each}
          </span>
          <span class="val">{who.pct}% · {who.hits} of {who.attempts}</span>
        {/if}
      </div>
      <div class="stat">
        <span class="label">Confidence</span>
        <span class="bars" aria-hidden="true">
          {#each Array(5) as _, n}<i class:fill={n < who.confidence}></i>{/each}
        </span>
        <span class="val soft">{who.confidence} / 5</span>
      </div>
      <div class="stat">
        <span class="label">Changes their mind</span>
        <span class="bars" aria-hidden="true">
          {#each Array(5) as _, n}<i class:fill={n < who.updates}></i>{/each}
        </span>
        <span class="val soft">{who.updates} / 5</span>
      </div>
    </div>

    <p class="measures"><strong>Measured on:</strong> {who.measures}</p>
    <p class="line">{who.line}</p>
    <p class="disclaimer">{data.statNote} And no two records here measure the same thing, so the bars are not a league table however much they look like one.</p>
  </div>
</div>

<style>
  /* Styled after the Mario Kart 64 character screen: a green marbled panel, a
     fat yellow title with a hard dark outline, portrait tiles in steel-blue
     frames, the name on a plate UNDER each tile, and a 1P tag on the one you
     have chosen. */
  .cabinet {
    background:
      radial-gradient(120% 90% at 25% 15%, rgba(255, 255, 255, 0.11), transparent 60%),
      radial-gradient(90% 80% at 80% 80%, rgba(0, 0, 0, 0.3), transparent 60%),
      linear-gradient(160deg, #3f6b3b 0%, #2c4f2c 45%, #24422a 100%);
    border: 4px solid #1a2f1c;
    border-radius: 14px;
    padding: 22px 18px 22px;
    box-shadow: 0 20px 60px rgba(10, 12, 18, 0.4), inset 0 0 60px rgba(0, 0, 0, 0.28);
    max-width: 940px;
    margin: 0 auto;
  }
  .marquee {
    font-family: var(--display);
    font-size: clamp(28px, 5.6vw, 54px);
    font-weight: 900;
    letter-spacing: 0.01em;
    text-align: center;
    color: #ffd83d;
    margin: 0 0 20px;
    text-transform: uppercase;
    /* The hard outline is what makes it read as a console title. */
    -webkit-text-stroke: 3px #17240f;
    paint-order: stroke fill;
    text-shadow: 0 5px 0 rgba(0, 0, 0, 0.45);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px 12px;
  }
  .slot { min-width: 0; display: flex; flex-direction: column; align-items: stretch; }
  .tile {
    position: relative;
    appearance: none;
    background: linear-gradient(180deg, #9fc3e4 0%, #6f9bc4 55%, #52789e 100%);
    border: 3px solid #24405c;
    border-radius: 10px;
    padding: 8px 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.5);
    transition: transform 0.12s ease, filter 0.12s ease, border-color 0.12s ease;
  }
  .tile:hover { transform: translateY(-2px); }
  .tile.on {
    border-color: #ffd83d;
    filter: saturate(1.15) brightness(1.08);
    transform: translateY(-3px);
    box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.6), 0 0 0 3px #e0332a;
  }
  .tile:focus-visible { outline: 3px solid #ffd83d; outline-offset: 3px; }
  .p1 {
    position: absolute;
    left: -6px;
    top: -8px;
    background: #e0332a;
    color: #fff;
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.04em;
    padding: 2px 6px;
    border-radius: 4px;
    border: 2px solid #fff;
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.4);
  }
  .portrait { display: block; width: min(100%, 84px); aspect-ratio: 1; }
  .portrait svg { width: 100%; height: 100%; display: block; }
  .halo { fill: rgba(255, 255, 255, 0.22); }
  .tile.on .halo { fill: rgba(255, 255, 255, 0.4); }
  /* The name plate sits under the tile on its own strip, as on the console. */
  .plate {
    margin-top: 5px;
    background: #f2efe4;
    border: 2px solid #24405c;
    border-radius: 5px;
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: #1d2a3a;
    text-align: center;
    line-height: 1.15;
    padding: 3px 2px;
    hyphens: none;
    min-height: 2.4em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .plate.on { background: #ffd83d; border-color: #17240f; }

  .card {
    margin-top: 18px;
    background: rgba(9, 16, 11, 0.62);
    border: 2px solid rgba(255, 255, 255, 0.14);
    border-radius: 10px;
    padding: 18px 18px 16px;
  }
  .card-head h3 {
    font-family: var(--display);
    font-size: clamp(21px, 3.4vw, 29px);
    font-weight: 800;
    color: #ffffff;
    margin: 0;
  }
  .tag {
    font-family: var(--sans);
    font-size: 13.5px;
    color: #ffd83d;
    margin: 2px 0 14px;
    font-weight: 700;
  }
  .stats { display: grid; gap: 9px; margin-bottom: 14px; }
  .stat {
    display: grid;
    grid-template-columns: 156px auto 1fr;
    align-items: center;
    gap: 12px;
  }
  .label {
    font-family: var(--sans);
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.6);
  }
  .bars { display: flex; gap: 3px; }
  .bars i {
    width: 20px;
    height: 12px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.16);
    border: 1px solid rgba(0, 0, 0, 0.25);
  }
  .bars i.fill { background: #ffd83d; }
  .val {
    font-family: var(--sans);
    font-size: 13px;
    color: rgba(255, 255, 255, 0.9);
    font-variant-numeric: tabular-nums;
  }
  .val.soft { color: rgba(255, 255, 255, 0.48); }
  .unpub {
    grid-column: 2 / -1;
    font-family: var(--sans);
    font-size: 13.5px;
    font-weight: 800;
    font-style: italic;
    color: #ff9d8a;
  }
  .measures, .line, .disclaimer { font-family: var(--sans); margin: 0 0 9px; }
  .measures { font-size: 13px; color: rgba(255, 255, 255, 0.58); }
  .measures strong { color: rgba(255, 255, 255, 0.8); }
  .line { font-size: 16px; line-height: 1.5; color: rgba(255, 255, 255, 0.94); }
  .disclaimer {
    font-size: 12px;
    line-height: 1.45;
    color: rgba(255, 255, 255, 0.42);
    margin-bottom: 0;
  }

  @media (max-width: 620px) {
    /* Two columns on a phone. Four across leaves each tile about 74px wide,
       which is not enough for "The Superforecaster" on a plate. */
    .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .portrait { width: min(100%, 66px); }
  }
  @media (max-width: 700px) {
    .cabinet { padding: 16px 10px; border-radius: 10px; }
    .grid { gap: 12px 8px; }
    .plate { font-size: 10.5px; }
    .stat {
      grid-template-columns: 1fr;
      gap: 4px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .unpub { grid-column: 1; }
    .line { font-size: 15px; }
  }
</style>
