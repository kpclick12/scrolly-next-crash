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
        <span class="plate">{c.name}</span>
      </button>
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
  .cabinet {
    background: var(--screen);
    border-radius: 18px;
    padding: 26px 22px 24px;
    box-shadow: 0 20px 60px rgba(10, 12, 18, 0.28);
    max-width: 1000px;
    margin: 0 auto;
  }
  .marquee {
    font-family: var(--display);
    font-size: clamp(24px, 4.4vw, 40px);
    font-weight: 900;
    letter-spacing: 0.02em;
    text-align: center;
    color: var(--signal);
    margin: 0 0 20px;
    text-transform: uppercase;
    text-shadow: 0 3px 0 rgba(0, 0, 0, 0.28);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }
  .tile {
    appearance: none;
    background: rgba(255, 255, 255, 0.06);
    border: 2px solid rgba(255, 255, 255, 0.16);
    border-radius: 12px;
    padding: 10px 6px 8px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-width: 0;
    transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
  }
  .tile:hover { transform: translateY(-3px); }
  .tile.on {
    border-color: var(--signal);
    background: rgba(255, 255, 255, 0.13);
    transform: translateY(-4px);
  }
  /* The dark cabinet needs its own focus ring — the page's dark-ink one is
     invisible here. */
  .tile:focus-visible {
    outline: 3px solid var(--signal);
    outline-offset: 3px;
  }
  .portrait {
    display: block;
    width: min(100%, 78px);
    aspect-ratio: 1;
  }
  .portrait svg { width: 100%; height: 100%; display: block; }
  .halo { fill: rgba(255, 255, 255, 0.1); }
  .tile.on .halo { fill: rgba(255, 255, 255, 0.2); }
  .plate {
    font-family: var(--sans);
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.72);
    text-align: center;
    line-height: 1.2;
    /* NOT overflow-wrap: anywhere — it broke names mid-word into
       "THE ECONOMIS / T". Let them wrap on spaces and give the tile enough
       width instead. */
    hyphens: none;
  }
  .tile.on .plate { color: #ffffff; }

  .card {
    margin-top: 18px;
    background: rgba(0, 0, 0, 0.24);
    border-radius: 12px;
    padding: 20px 20px 18px;
  }
  .card-head h3 {
    font-family: var(--display);
    font-size: clamp(22px, 3.4vw, 30px);
    font-weight: 800;
    color: #ffffff;
    margin: 0;
  }
  .tag {
    font-family: var(--sans);
    font-size: 14px;
    color: var(--signal);
    margin: 2px 0 16px;
    font-weight: 600;
  }
  .stats {
    display: grid;
    gap: 10px;
    margin-bottom: 16px;
  }
  .stat {
    display: grid;
    grid-template-columns: 168px auto 1fr;
    align-items: center;
    gap: 12px;
  }
  .label {
    font-family: var(--sans);
    font-size: 12.5px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.62);
  }
  .bars { display: flex; gap: 4px; }
  .bars i {
    width: 22px;
    height: 13px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.14);
  }
  .bars i.fill { background: var(--signal); }
  .val {
    font-family: var(--sans);
    font-size: 13.5px;
    color: rgba(255, 255, 255, 0.9);
    font-variant-numeric: tabular-nums;
  }
  .val.soft { color: rgba(255, 255, 255, 0.5); }
  .unpub {
    grid-column: 2 / -1;
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 700;
    font-style: italic;
    color: #ffb4a2;
  }
  .measures,
  .line,
  .disclaimer {
    font-family: var(--sans);
    margin: 0 0 10px;
  }
  .measures {
    font-size: 13.5px;
    color: rgba(255, 255, 255, 0.6);
  }
  .measures strong { color: rgba(255, 255, 255, 0.82); }
  .line {
    font-size: 16.5px;
    line-height: 1.55;
    color: rgba(255, 255, 255, 0.94);
  }
  .disclaimer {
    font-size: 12.5px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.44);
    margin-bottom: 0;
  }

  @media (max-width: 620px) {
    /* Two columns on a phone. Four tiles across leaves each one about 74px
       wide, which is not enough for "The Superforecaster" on one line. */
    .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .portrait { width: min(100%, 62px); }
  }
  @media (max-width: 700px) {
    .cabinet { padding: 20px 12px 18px; border-radius: 12px; }
    .grid { gap: 8px; }
    .tile { padding: 8px 4px 6px; border-radius: 9px; }
    .plate { font-size: 11px; letter-spacing: 0; }
    .stat {
      grid-template-columns: 1fr;
      gap: 4px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .unpub { grid-column: 1; }
    .line { font-size: 15.5px; }
  }
</style>
