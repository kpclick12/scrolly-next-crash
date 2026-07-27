<script>
  import Scrolly from "../components/Scrolly.svelte";
  import DrawdownChart from "../components/DrawdownChart.svelte";

  let { data } = $props();
  let currentStep = $state(0);

  // One chart instance for the whole act; only `focus` changes.
  const focus = $derived([null, "1929", "1987", "2008", null][Math.min(currentStep, 4)]);
</script>

<section
  class="act"
  aria-label="The Tower: three crashes"
  style="--act-accent: var(--ink-red); --step-min: 330px; --step-min-mobile: 400px;"
>
  <div class="act-head">
    <p class="act-kicker">The Tower</p>
    <h2>Three times the floor gave way</h2>
    <p class="act-dek">
      In the tarot, the Tower is the card of the thing that falls without
      warning. It is also, conveniently, a decent description of the Dow. Here
      are the three big ones, lined up from the day each one peaked.
    </p>
  </div>

  <Scrolly onStepChange={(i) => (currentStep = i)}>
    {#snippet visual()}
      <div class="visual-frame-stack" style="--stack-height: 430px; --stack-height-mobile: clamp(300px, 44svh, 400px);">
        <div class="frame is-active">
          <DrawdownChart crashes={data.crashes.crashes} {focus} />
        </div>
      </div>
    {/snippet}

    <section class="scrolly-step">
      <p class="kicker">Same index, same clock</p>
      <h3>Nobody rings a bell at the top</h3>
      <p>
        Three crashes, one index, each one starting from its own high. The
        first thing you notice is that they do not look alike at all. A crash
        is not one shape.
      </p>
      <p>
        The second thing you notice is that all three lines start in exactly
        the same place — flat, at zero, on a day that felt completely normal.
      </p>
    </section>

    <section class="scrolly-step">
      <p class="kicker">1929 · the newspaper</p>
      <h3>The one that took three years</h3>
      <p>
        Everyone remembers <span class="badge badge-red">1929</span> as a
        single terrible October. It wasn't. After Black Tuesday the market
        rallied for six months, and by April 1930 it had recovered half of
        what it lost. Plenty of people called the bottom.
      </p>
      <div class="callout">
        <p class="callout-num">−89%</p>
        <p class="callout-label">
          from the peak of 3 September 1929 to the floor on 8 July 1932. The
          Dow did not close back at the old high until November 1954.
        </p>
      </div>
    </section>

    <section class="scrolly-step">
      <p class="kicker">1987 · the computer</p>
      <h3>The one that took a day</h3>
      <p>
        On Monday 19 October 1987 the Dow fell
        <strong>22.6 percent</strong> — still the worst single day it has ever
        had, worse than any day in 1929. Portfolio-insurance programs sold
        automatically into a falling market, and the falling market told them
        to sell more.
      </p>
      <p>
        And then <span class="badge badge-blue">1987</span> finished the year
        <em>up</em>. If you had been on a long holiday you would never have
        known.
      </p>
    </section>

    <section class="scrolly-step">
      <p class="kicker">2008 · the phone</p>
      <h3>The one you could watch happening</h3>
      <p>
        <span class="badge badge-green">2008</span> was the first crash that
        fitted in a pocket. Seventeen months of it, live, refreshable, with the
        number going red in your hand on the train.
      </p>
      <div class="callout">
        <p class="callout-num">−777.68</p>
        <p class="callout-label">
          points in one afternoon, 29 September 2008, after Congress voted down
          the first bank rescue. It was the biggest points drop ever recorded,
          and the market had another five months of falling left to do.
        </p>
      </div>
    </section>

    <section class="scrolly-step">
      <p class="kicker">The awkward bit</p>
      <h3>All three are obvious now</h3>
      <p>
        Every one of these has a tidy explanation: margin debt, program
        trading, subprime mortgages. The explanations are good. They were all
        written afterwards.
      </p>
      <p>
        Which raises the question this whole piece is about. If we can explain
        them so well looking back, how are we doing looking forward?
      </p>
    </section>
  </Scrolly>
</section>
