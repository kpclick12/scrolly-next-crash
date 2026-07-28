<script>
  // The books, as a shelf. This replaces three paragraphs of prose about the
  // prediction boom with an object you can look at: 174 years of people
  // explaining exactly this, still in print, still being bought.
  //
  // Hover or tap a spine and its line appears. That is the whole section —
  // the reader is meant to breathe here, not read an essay.
  let { data, forecasts } = $props();

  let picked = $state(7); // The Signal and the Noise, the one people know.
  const shelf = $derived(data.shelf);
  const book = $derived(shelf[picked]);

  const SPINE = {
    brown: ["#6d4326", "#f0e2c8"],
    blue: ["#2f4a63", "#e8f0f6"],
    red: ["#7a2f2a", "#f6e6e2"],
    green: ["#2c5344", "#e4f1ea"],
    slate: ["#454a57", "#eceef2"],
    ink: ["#1d2029", "#e6e8ee"],
    sand: ["#a8874e", "#2a2214"],
  };
  // Heights vary so it reads as a shelf and not a bar chart. Deterministic.
  const H = [86, 94, 82, 97, 88, 100, 91, 96, 84];
</script>

<section class="books section" aria-label="The books">
  <div class="wrap">
    <div class="column">
      <p class="eyebrow">Two · the bookshelf</p>
      <h2 class="big">People have been explaining this for 174 years</h2>
      <p class="standfirst">
        Every one of these is still in print. Pick one.
      </p>
    </div>
  </div>

  <div class="wrap">
    <div class="shelf-wrap">
      <div class="shelf" role="radiogroup" aria-label="Choose a book">
        {#each shelf as b, i (b.title)}
          {@const c = SPINE[b.spine]}
          <button
            class="spine"
            class:on={picked === i}
            role="radio"
            aria-checked={picked === i}
            aria-label="{b.title}, {b.author}, {b.year}"
            tabindex={picked === i ? 0 : -1}
            style="--h: {H[i]}%; --bg: {c[0]}; --fg: {c[1]};"
            onclick={() => (picked = i)}
            onmouseenter={() => (picked = i)}
            onfocus={() => (picked = i)}
          >
            <span class="spine-text">
              <span class="spine-title">{b.short}</span>
              <span class="spine-year">{b.year}</span>
            </span>
          </button>
        {/each}
      </div>
      <div class="board" aria-hidden="true"></div>
    </div>

    <div class="column blurb" aria-live="polite">
      <p class="blurb-title">{book.title}</p>
      <p class="blurb-meta">{book.author} · {book.year}</p>
      <p class="blurb-line">{book.line}</p>
    </div>
  </div>

  <div class="wrap">
    <div class="column">
      <div class="body-copy tight">
        <p>
          A hundred and seventy-four years of it. And the profession is still
          getting the actual question wrong <strong>ninety-seven percent</strong>
          of the time.
        </p>
      </div>
      <div class="scoreline">
        <p class="hero-num">{forecasts.recessions.predicted}<span>/{forecasts.recessions.total}</span></p>
        <p class="hero-num-label">
          recessions the forecasting consensus saw coming a year ahead, across
          {forecasts.recessions.countries} countries, {forecasts.recessions.from}–{forecasts.recessions.to}.
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  .books { background: var(--paper-2); }
  .shelf-wrap { margin: clamp(30px, 5vw, 52px) 0 0; }
  .shelf {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 7px;
    height: clamp(190px, 26vw, 260px);
    padding: 0 4px;
  }
  .spine {
    appearance: none;
    border: none;
    cursor: pointer;
    flex: 1 1 0;
    min-width: 0;
    max-width: 74px;
    height: var(--h);
    background: var(--bg);
    color: var(--fg);
    border-radius: 3px 3px 0 0;
    padding: 10px 0 12px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    box-shadow: inset -3px 0 6px rgba(0, 0, 0, 0.3), inset 3px 0 0 rgba(255, 255, 255, 0.14);
    transition: transform 0.16s ease, filter 0.16s ease;
    filter: saturate(0.72) brightness(0.88);
  }
  .spine.on {
    transform: translateY(-14px);
    filter: none;
  }
  .spine:focus-visible { outline: 3px solid var(--ink-1); outline-offset: 3px; }
  /* Spine lettering reads bottom-to-top, the way a spine on a shelf does. */
  .spine-text {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    display: flex;
    align-items: baseline;
    gap: 8px;
    white-space: nowrap;
    overflow: hidden;
  }
  .spine-title {
    font-family: var(--display);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.01em;
  }
  .spine-year {
    font-family: var(--sans);
    font-size: 10.5px;
    opacity: 0.7;
    font-variant-numeric: tabular-nums;
  }
  .board {
    height: 12px;
    background: linear-gradient(180deg, #b9a88c, #8c7d66);
    border-radius: 2px;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
  }

  .blurb {
    margin-top: 26px;
    text-align: center;
    min-height: 128px;
  }
  .blurb-title {
    font-family: var(--display);
    font-size: clamp(19px, 2.8vw, 25px);
    font-weight: 800;
    color: var(--ink-1);
    text-wrap: balance;
  }
  .blurb-meta {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--ink-3);
    margin: 4px 0 12px;
  }
  .blurb-line {
    font-size: clamp(17px, 2.2vw, 20px);
    line-height: 1.5;
    color: var(--ink-2);
    max-width: 520px;
    margin: 0 auto;
    text-wrap: balance;
  }

  .tight { margin-top: clamp(40px, 6vw, 68px); }
  .tight p { font-size: clamp(19px, 2.4vw, 23px); line-height: 1.5; }
  .scoreline {
    display: flex;
    align-items: center;
    gap: clamp(18px, 3vw, 34px);
    margin-top: 26px;
    flex-wrap: wrap;
  }
  .scoreline .hero-num span {
    font-size: 0.42em;
    color: var(--ink-3);
  }

  @media (max-width: 700px) {
    .shelf { gap: 4px; height: 168px; }
    .spine { padding: 6px 0 8px; }
    .spine-title { font-size: 11px; }
    .spine-year { display: none; }
  }
</style>
