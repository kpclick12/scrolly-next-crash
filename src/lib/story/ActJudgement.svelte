<script>
  import Scrolly from "../components/Scrolly.svelte";
  import StoppedClock from "../components/StoppedClock.svelte";
  import BaseRate from "../components/BaseRate.svelte";

  let { data } = $props();
  let currentStep = $state(0);

  const d = $derived(data.doomers);
  const onClock = $derived(currentStep <= 2);
</script>

<section
  class="act"
  aria-label="Judgement: the doomers"
  style="--act-accent: var(--ink-brass); --step-min: 320px; --step-min-mobile: 390px;"
>
  <div class="act-head">
    <p class="act-kicker">Judgement</p>
    <h2>The end is always nigh</h2>
    <p class="act-dek">
      There is a second kind of forecaster, and he never revises. He has one
      prediction, he has had it for years, and one day he is going to be
      magnificently right.
    </p>
  </div>

  <Scrolly onStepChange={(i) => (currentStep = i)}>
    {#snippet visual()}
      <div class="visual-frame-stack" style="--stack-height: 430px; --stack-height-mobile: clamp(300px, 44svh, 400px);">
        <div class="frame" class:is-active={onClock}>
          <StoppedClock data={d} step={currentStep} />
        </div>
        <div class="frame" class:is-active={!onClock}>
          <BaseRate data={d} step={currentStep - 3} />
        </div>
      </div>
    {/snippet}

    <section class="scrolly-step">
      <p class="kicker">The permanent forecast</p>
      <h3>Somebody has predicted the next crash today</h3>
      <p>
        Somebody predicted it yesterday too, and will again tomorrow. Not the
        same crash — the next one, always the next one, always about eighteen
        months out, which is far enough away to be unfalsifiable and close
        enough to be alarming.
      </p>
    </section>

    <section class="scrolly-step">
      <p class="kicker">The mechanism</p>
      <h3>It is a very old business model</h3>
      <p>
        Prophecy has always paid better than probability. "There is a 28
        percent chance of a difficult year" does not sell a newsletter. "It is
        five minutes to midnight" sells rather a lot of them, and it never
        needs updating.
      </p>
    </section>

    <section class="scrolly-step">
      <p class="kicker">The clock</p>
      <h3>And twice a day, he is exactly right</h3>
      <p>
        Then the crash comes, as crashes do, and the clip of him predicting it
        goes round the world. Nobody circulates the eleven years of the same
        clip.
      </p>
    </section>

    <section class="scrolly-step">
      <p class="kicker">The base rate</p>
      <h3>Here is every year since 1928</h3>
      <p>
        The honest way to score a permanent forecast is to ask what it would
        score by accident. So: one square per year, and shade in the ones that
        contained a fall of 20 percent or more.
      </p>
    </section>

    <section class="scrolly-step">
      <p class="kicker">27 of 96</p>
      <h3>You get 28% for free</h3>
      <p>
        Shout "crash" every January, do no research whatsoever, and roughly
        every fourth year you will be right — and in those years you will be
        right <em>loudly</em>.
      </p>
      <div class="callout">
        <p class="callout-num">28%</p>
        <p class="callout-label">
          is the score for having no method at all. Any forecaster worth
          listening to has to beat a man with a sign, and most of the famous
          ones are not obviously doing so.
        </p>
      </div>
    </section>

    <section class="scrolly-step">
      <p class="kicker">The unfair part</p>
      <h3>Being early is indistinguishable from being wrong</h3>
      <p>
        This is what makes the doomer hard to dismiss. Some of them <em>are</em>
        looking at something real — leverage, concentration, a price that makes
        no sense — and are simply years too soon. From the outside, at the time,
        that looks identical to being a crank.
      </p>
      <p>
        Which is a fact about the audience, not the analyst. So let us talk
        about the audience.
      </p>
    </section>
  </Scrolly>
</section>
