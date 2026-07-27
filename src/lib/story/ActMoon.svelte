<script>
  import Scrolly from "../components/Scrolly.svelte";
  import CouchHerd from "../components/CouchHerd.svelte";

  let { data } = $props();
  let currentStep = $state(0);

  const p = $derived(data.psychology);
</script>

<section
  class="act"
  aria-label="The Moon: the psychology"
  style="--act-accent: var(--ink-violet); --step-min: 300px; --step-min-mobile: 360px;"
>
  <div class="act-head">
    <p class="act-kicker">The Moon</p>
    <h2>So it's psychology, then</h2>
    <p class="act-dek">
      Every explanation of every bubble eventually arrives at the word
      "psychology". It is worth being clear about which psychology we mean,
      because it is not the one on the poster.
    </p>
  </div>

  <Scrolly onStepChange={(i) => (currentStep = i)}>
    {#snippet visual()}
      <div class="visual-frame-stack" style="--stack-height: 430px; --stack-height-mobile: clamp(290px, 42svh, 390px);">
        <div class="frame is-active">
          <CouchHerd step={currentStep} />
        </div>
      </div>
    {/snippet}

    <section class="scrolly-step">
      <p class="kicker">Vienna, 1899</p>
      <h3>Sigmund Freud lies the market down on the couch</h3>
      <p>
        The investor's fear of loss, he might say, originates in an unresolved
        relationship with his father. The bull market is a wish. The crash is
        the return of the repressed. Tell me about your portfolio.
      </p>
    </section>

    <section class="scrolly-step beat">
      <p class="kicker">Correction</p>
      <h3>No. Not that kind of psychology.</h3>
    </section>

    <section class="scrolly-step">
      <p class="kicker">1951</p>
      <h3>This kind</h3>
      <p>
        Solomon Asch sat people in a room and asked them which of three lines
        was longest. The answer was obvious. Everyone else in the room — all
        actors — confidently said something else.
      </p>
      <div class="callout">
        <p class="callout-num">{p.asch.conformedAtLeastOnce}%</p>
        <p class="callout-label">
          of people went along with the obviously wrong answer at least once.
          Not because they couldn't see the lines. Because everyone else was
          looking at them.
        </p>
      </div>
    </section>

    <section class="scrolly-step">
      <p class="kicker">1936</p>
      <h3>You are not picking the best stock</h3>
      <p>
        Keynes described the market as a newspaper beauty contest where the
        prize goes to whoever picks the face <em>most other people</em> pick.
        So nobody picks the prettiest face. They pick the face they think
        everyone else thinks everyone else will pick.
      </p>
      <p>
        A market full of people doing that can rise for years on nothing but
        the belief that it will keep rising. This is not irrational. It is just
        not about the companies.
      </p>
    </section>

    <section class="scrolly-step">
      <p class="kicker">The trap</p>
      <h3>Which is why the warnings don't work</h3>
      <p>
        The sheep that turns around first isn't rewarded. It's early, it's
        alone, and it looks ridiculous — right up until the moment everybody
        else turns around at once, which is the thing we call a crash.
      </p>
      <p>
        So: whose warning should you have listened to? Everyone in this piece
        has now made their pitch. Time to score them.
      </p>
    </section>
  </Scrolly>
</section>
