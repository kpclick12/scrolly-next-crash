<script>
  import Scrolly from "../components/Scrolly.svelte";
  import BookShelf from "../components/BookShelf.svelte";
  import RecessionWaffle from "../components/RecessionWaffle.svelte";

  let { data } = $props();
  let currentStep = $state(0);

  const f = $derived(data.forecasts);
  // Two visuals, both mounted, crossfaded — never remounted.
  const onShelf = $derived(currentStep <= 3);
</script>

<section
  class="act"
  aria-label="The Magician: the prediction business"
  style="--act-accent: var(--ink-blue); --step-min: 340px; --step-min-mobile: 400px;"
>
  <div class="act-head">
    <p class="act-kicker">The Magician</p>
    <h2>Then someone made it a career</h2>
    <p class="act-dek">
      Predicting things is very old. Predicting things <em>for a living, on
      television, with a laptop open</em> is quite new, and it is worth being
      precise about when that happened.
    </p>
  </div>

  <Scrolly onStepChange={(i) => (currentStep = i)}>
    {#snippet visual()}
      <div class="visual-frame-stack" style="--stack-height: 430px; --stack-height-mobile: clamp(300px, 44svh, 400px);">
        <div class="frame" class:is-active={onShelf}>
          <BookShelf books={f.books} step={currentStep} />
        </div>
        <div class="frame" class:is-active={!onShelf}>
          <RecessionWaffle data={f.recessions} step={currentStep - 4} />
        </div>
      </div>
    {/snippet}

    <section class="scrolly-step">
      <p class="kicker">The old magic</p>
      <h3>Statistics did not arrive with machine learning</h3>
      <p>
        The mathematics of chance was worked out on gambling problems three
        hundred years ago. Insurers have been pricing uncertain futures since
        the seventeenth century, and doing it well enough to stay solvent.
      </p>
      <p>
        What changed recently is not the method. It is the audience.
      </p>
    </section>

    <section class="scrolly-step">
      <p class="kicker">1718</p>
      <h3>The maths was never the hard part</h3>
      <p>
        De Moivre wrote down the shape of chance while working out dice
        problems in a London coffee house. Nothing in modern forecasting would
        have surprised him very much — except how famous it got.
      </p>
    </section>

    <section class="scrolly-step">
      <p class="kicker">1841</p>
      <h3>Somebody wrote all this down already</h3>
      <p>
        Charles Mackay catalogued the manias — tulips, the South Sea, the
        railway boom — and concluded that people go mad in herds and recover
        their senses one at a time. It has been in print continuously for
        nearly two centuries. It has prevented nothing.
      </p>
    </section>

    <section class="scrolly-step">
      <p class="kicker">2000, and then 2012</p>
      <h3>The one that landed, and the one that sold</h3>
      <p>
        Robert Shiller published <em>Irrational Exuberance</em> in March 2000,
        the month the Nasdaq peaked. That is about as good as market timing
        gets, and he has spent the years since explaining that he was not
        timing anything.
      </p>
      <p>
        Twelve years later Nate Silver called 49 of 50 states in 2008 and all
        50 in 2012, and forecasting acquired something it had never had
        before: fans.
      </p>
    </section>

    <section class="scrolly-step">
      <p class="kicker">The scoreboard</p>
      <h3>So how is the profession actually doing?</h3>
      <p>
        Three IMF economists asked the boring version of that question. They
        took every recession in 63 countries between 1992 and 2014 — 153 of
        them — and checked whether the forecasting consensus had seen each one
        coming a year in advance.
      </p>
      <p>Here they all are, one dot each.</p>
    </section>

    <section class="scrolly-step">
      <p class="kicker">Five</p>
      <h3>Five out of a hundred and fifty-three</h3>
      <p>
        Not five percent. <strong>Five.</strong> The other 148 recessions
        arrived without the consensus having them on the books the previous
        April.
      </p>
      <div class="callout">
        <p class="callout-num">3%</p>
        <p class="callout-label">
          of recessions were forecast a year ahead. This is the professional
          state of the art, produced by people who are good at their jobs.
        </p>
      </div>
    </section>

    <section class="scrolly-step beat">
      <p class="kicker">Say it kindly</p>
      <h3>The forecasts are not bad. The thing being forecast is just extremely rude about it.</h3>
    </section>
  </Scrolly>
</section>
