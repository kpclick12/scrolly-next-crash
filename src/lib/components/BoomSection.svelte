<script>
  // Text-forward on purpose: no sticky panel, no scroll mechanic, one narrow
  // column and a single figure that is really just a very large number with a
  // field of dots next to it. After a wide sticky chart and before a
  // full-bleed interactive screen, this section's job is to be QUIET.
  let { data } = $props();

  const r = $derived(data.recessions);
  // 153 dots, five of them lit. One mark per recession, small enough to read
  // as a texture — the ratio is the whole point and a 3%-vs-97% bar would
  // hide exactly how few five is.
  const HITS = new Set([9, 38, 71, 104, 137]);
  const COLS = 17;
  const R = 5.2;
  const GAP = 3.6;
  const cell = R * 2 + GAP;
  const W = COLS * cell - GAP;
  const rows = Math.ceil(153 / COLS);
  const H = rows * cell - GAP;
</script>

<section class="boom section" aria-label="The prediction boom">
  <div class="wrap">
    <div class="column">
      <p class="eyebrow">Two · the prediction boom</p>
      <h2 class="big">Then predicting things became a career</h2>

      <div class="body-copy">
        <p>
          The maths of chance is three hundred years old and insurers have been
          pricing uncertain futures since the seventeenth century. None of that
          is new. What is new is the <em>audience</em>.
        </p>
        <p>
          In November 2008 a baseball statistician called Nate Silver got
          <strong>{data.silver.states2008} of the {data.silver.statesTotal}
          states</strong> right, missing only Indiana. Four years later he got
          all fifty. Forecasting acquired something it had never had before:
          fans.
        </p>
        <p>
          Everything since has pointed the same way. Models trained on
          everything. Prediction markets on anything you like. A widely held
          feeling that with enough data, the future is basically an engineering
          problem — and if we can call an election to the state, surely we can
          call a crash.
        </p>
      </div>
    </div>
  </div>

  <div class="wrap">
    <div class="scorecard">
      <div class="score-num">
        <p class="hero-num">5</p>
        <p class="hero-num-label">
          recessions the professional forecasting consensus saw coming a year
          ahead — out of <strong>{r.total}</strong>, across {r.countries}
          countries, between {r.from} and {r.to}.
        </p>
      </div>
      <figure class="chart dots">
        <svg
          viewBox="0 0 {W} {H}"
          role="img"
          aria-label="A field of {r.total} dots, one per recession between {r.from} and {r.to}. Exactly {r.predicted} are filled in — the ones the forecasting consensus had on its books a year in advance."
        >
          {#each Array(r.total) as _, i}
            <circle
              class="dot"
              class:hit={HITS.has(i)}
              cx={(i % COLS) * cell + R}
              cy={Math.floor(i / COLS) * cell + R}
              r={R}
            />
          {/each}
        </svg>
        <figcaption>Each dot is one recession. The filled ones were called.</figcaption>
      </figure>
    </div>
  </div>

  <div class="wrap">
    <div class="column">
      <div class="body-copy">
        <p>
          Not five percent. <strong>Five.</strong> And these are not fools —
          they are careful people with good models, and the number is that low
          because the question is close to impossible, not because they are
          bad at it.
        </p>
      </div>
      <blockquote class="pull">
        <p>{data.quote.text}</p>
        <cite>{data.quote.who}, {data.quote.where}</cite>
      </blockquote>
      <div class="body-copy">
        <p>
          You have probably heard that as "economists have predicted nine of
          the last five recessions". Samuelson was being ruder than that — he
          was talking about the market itself. The joke got improved on its way
          to you, which is, more or less, the whole subject of this piece.
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  .boom { background: var(--paper-2); }
  .scorecard {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: clamp(24px, 5vw, 56px);
    align-items: center;
    margin: clamp(36px, 6vw, 64px) 0;
    padding: clamp(24px, 4vw, 40px);
    background: var(--paper);
    border: 1px solid var(--border);
    border-radius: 16px;
  }
  .score-num { min-width: 0; }
  .score-num .hero-num-label { margin-top: 14px; }
  .score-num :global(strong) { color: var(--ink-1); font-weight: 700; }
  .dots { min-width: 0; }
  .dot { fill: var(--rule); }
  .dot.hit { fill: var(--series-blue); }
  figcaption {
    font-family: var(--sans);
    font-size: 13px;
    color: var(--ink-3);
    margin-top: 10px;
  }
  .pull {
    margin: clamp(28px, 5vw, 44px) 0;
    padding-left: 20px;
    border-left: 5px solid var(--signal);
  }
  .pull p {
    font-family: var(--display);
    font-style: italic;
    font-size: clamp(22px, 3.4vw, 32px);
    line-height: 1.24;
    color: var(--ink-1);
    margin-bottom: 12px;
    text-wrap: balance;
  }
  .pull cite {
    font-family: var(--sans);
    font-style: normal;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-3);
  }
  @media (max-width: 760px) {
    .scorecard { grid-template-columns: minmax(0, 1fr); }
  }
</style>
