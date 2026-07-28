<script>
  import { onMount } from "svelte";
  import WorstDays from "./WorstDays.svelte";

  // A wide chart wants a wide column, so this section does NOT use the house
  // two-column Scrolly: the figure sticks to the top of the viewport at full
  // width and the copy runs underneath it. The step-detection is the same
  // nearest-midpoint-to-viewport-centre rule Scrolly.svelte uses — that part
  // is the bit worth keeping, and an IntersectionObserver would leave dead
  // zones between widely-spaced cards here just as it would there.
  let { data } = $props();

  let container;
  let step = $state(0);

  const reveal = $derived(step >= 1);
  const focus = $derived([null, null, "1987", "2020", "1929", null][Math.min(step, 5)]);

  onMount(() => {
    const steps = [...container.querySelectorAll(".beat")];
    let ticking = false;
    function update() {
      ticking = false;
      // The reference point is BELOW centre because the sticky figure occupies
      // the top of the screen — using the true centre would activate each beat
      // while it was still hidden behind the chart.
      const ref = window.innerHeight * 0.72;
      let best = 0;
      let bestD = Infinity;
      steps.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - ref);
        if (d < bestD) { bestD = d; best = i; }
      });
      steps.forEach((el, i) => el.classList.toggle("on", i === best));
      step = best;
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  });
</script>

<section class="days" bind:this={container} aria-label="The worst days">
  <div class="wrap">
    <div class="column intro">
      <p class="eyebrow">One · the worst days</p>
      <h2 class="big">The ten worst days in the market's life</h2>
      <p class="standfirst">
        Every one of these is a day somebody stood on a trading floor and
        thought: this is it, this is the big one. Watch which ones were right.
      </p>
    </div>
  </div>

  <div class="stickyfig">
    <div class="wrap">
      <WorstDays {data} {reveal} {focus} />
    </div>
  </div>

  <div class="wrap">
    <div class="column beats">
      <div class="beat">
        <p>
          Ten candles, one per day, worst on the left. The biggest is
          <strong>19 October 1987</strong> — the Dow lost more than a fifth of
          itself between breakfast and dinner, which has never been beaten
          before or since.
        </p>
      </div>

      <div class="beat">
        <p>
          Now colour them by which episode they belong to. Four are
          <span class="badge badge-red">1929</span>, two are
          <span class="badge badge-blue">1987</span>, two are
          <span class="badge badge-green">2020</span> — and two belong to
          panics nobody has thought about in a century.
        </p>
      </div>

      {#each data.afters as a (a.era)}
        <div class="beat after">
          <p class="after-head">{a.headline}</p>
          <p class="after-day">{a.day} · {a.pct}%</p>
          <p>{a.next}</p>
          <p class="verdict tone-{a.tone}">{a.verdict}</p>
        </div>
      {/each}

      <div class="beat punch">
        <p>
          So here is the awkward thing. <strong>1987 and 1929 are almost the
          same candle.</strong> Same size, same colour, a few decades apart —
          and one of them was over by Christmas while the other took
          twenty-five years to undo.
        </p>
        <p>
          Standing there on the day, you cannot tell which one you are in.
          Nothing in the size of the fall tells you what comes next. That is
          not a failure of analysis. It is the shape of the problem.
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  .days { padding-block: clamp(64px, 9vw, 110px) clamp(72px, 11vw, 132px); }
  .intro { margin-bottom: clamp(28px, 5vw, 52px); }

  /* The figure pins to the top of the viewport while the copy scrolls past
     underneath it. Its height is fixed so nothing shifts as the chart changes. */
  .stickyfig {
    position: sticky;
    top: 0;
    z-index: 1;
    background: var(--paper);
    padding-block: 16px 10px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 8svh;
  }

  .beats {
    display: flex;
    flex-direction: column;
    gap: 46svh;
    padding-top: 18svh;
    padding-bottom: 30svh;
  }
  .beat > :global(*) {
    opacity: 0.32;
    transition: opacity 0.35s ease;
  }
  .beat :global(.on) { opacity: 1; }
  .beat.on > :global(*) { opacity: 1; }
  .beat p {
    font-size: clamp(19px, 2.5vw, 24px);
    line-height: 1.5;
    margin-bottom: 14px;
  }
  .beat p:last-child { margin-bottom: 0; }
  .beat strong { color: var(--ink-1); font-weight: 800; }

  .after-head {
    font-family: var(--display);
    font-weight: 800;
    color: var(--ink-1);
  }
  .after-day {
    font-family: var(--sans);
    font-size: 14px !important;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-3);
    margin-bottom: 12px !important;
  }
  .verdict {
    font-family: var(--display);
    font-style: italic;
    font-size: clamp(20px, 2.8vw, 27px) !important;
    line-height: 1.32;
    padding-left: 16px;
    border-left: 4px solid var(--ink-3);
  }
  .verdict.tone-good { border-left-color: var(--series-green); }
  .verdict.tone-bad { border-left-color: var(--series-red); }
  .punch p { font-size: clamp(20px, 2.7vw, 26px); }

  @media (max-width: 700px) {
    .beats { gap: 40svh; }
    .stickyfig { padding-block: 10px 6px; }
  }
</style>
