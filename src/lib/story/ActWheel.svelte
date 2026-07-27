<script>
  import Scrolly from "../components/Scrolly.svelte";
  import FortuneWheel from "../components/FortuneWheel.svelte";
  import PaulTank from "../components/PaulTank.svelte";

  let { data } = $props();
  let currentStep = $state(0);

  const o = $derived(data.oracles);
  // The board builds row by row across steps 1–5, then hands over to Paul.
  const boardStep = $derived(Math.min(Math.max(currentStep - 1, -1), o.oracles.length - 1));
  const onBoard = $derived(currentStep <= 5);
</script>

<section
  class="act mat-card"
  aria-label="Wheel of Fortune: who to trust"
  style="--act-accent: var(--ink-green); --step-min: 393px; --step-min-mobile: 506px;"
>
  <div class="act-head">
    <p class="act-kicker">Wheel of Fortune</p>
    <h2>Choose your oracle</h2>
    <p class="act-dek">
      Five forecasters, five real records with real denominators. Watch what
      happens when you hang all five on the same wheel — and then watch what
      that tells you about every ranking you have ever been shown.
    </p>
  </div>

  <Scrolly onStepChange={(i) => (currentStep = i)}>
    {#snippet visual()}
      <!-- The wheel is the tallest visual in the piece, so this act gets the
           tallest stack. Both frames still share one fixed height — a stack
           that resizes on swap shifts layout mid-scroll. -->
      <div class="visual-frame-stack" style="--stack-height: 515px; --stack-height-mobile: clamp(320px, 48svh, 430px);">
        <div class="frame" class:is-active={onBoard}>
          <FortuneWheel data={o} step={boardStep} />
        </div>
        <div class="frame" class:is-active={!onBoard}>
          <PaulTank paul={o.paul} step={currentStep - 6} />
        </div>
      </div>
    {/snippet}

    <section class="scrolly-step">
      <p class="kicker">The wheel</p>
      <h3>Everyone gets a seat</h3>
      <p>
        Nobody here is invented and nothing here is estimated. Each rider sits at
        a count of hits over a count of attempts, published by someone who
        wrote the denominator down.
      </p>
      <p>Keep an eye on what each one is actually counting.</p>
    </section>

    <section class="scrolly-step">
      <p class="kicker">The economists</p>
      <h3>3 percent, and they are the ones doing it properly</h3>
      <p>
        Five recessions out of 153, called a year ahead. Worth saying plainly:
        these forecasters are competent, and the number is low because the
        question is close to impossible, not because they are lazy.
      </p>
    </section>

    <section class="scrolly-step">
      <p class="kicker">The man with the sign</p>
      <h3>28 percent, achieved by shouting</h3>
      <p>
        He beats the economists by a factor of nine and has never opened a
        spreadsheet. He is also not, in any useful sense, predicting anything —
        he is collecting the base rate and taking the credit.
      </p>
    </section>

    <section class="scrolly-step">
      <p class="kicker">The dartboard</p>
      <h3>39 percent, achieved by a piece of cork</h3>
      <p>
        In 1973 Burton Malkiel wrote that a blindfolded monkey throwing darts
        at the financial pages would do about as well as the experts. The
        <em>Wall Street Journal</em> spent fourteen years testing it with real
        darts and real stock pickers, 142 rounds in all.
      </p>
      <div class="callout">
        <p class="callout-num">55 / 142</p>
        <p class="callout-label">
          rounds went to the darts. The professionals won — but not by nearly
          as much as a professional would like.
        </p>
      </div>
    </section>

    <section class="scrolly-step">
      <p class="kicker">The professionals</p>
      <h3>54 percent, which is a coin</h3>
      <p>
        Because here is the same contest scored against the market itself
        rather than against the cork: the pros beat the Dow in 76 of 142
        rounds. That is a coin flip, and a coin flip does not charge a
        management fee.
      </p>
      <p>
        Philip Tetlock found the same thing at industrial scale — 284 experts,
        82,361 forecasts, twenty years — and the summary everyone quotes is
        "dart-throwing chimpanzee". Tetlock says he never quite wrote that. What
        he did find was that a rule which simply assumed next year resembles
        last year beat the humans.
      </p>
    </section>

    <section class="scrolly-step">
      <p class="kicker">The octopus</p>
      <h3>86 percent, achieved by eating</h3>
      <p>
        Paul lived in a tank in Oberhausen. Before each match they lowered two
        boxes into the water, each holding a mussel and a flag. Whichever he
        opened first was the forecast.
      </p>
      <div class="callout">
        <p class="callout-num">12 / 14</p>
        <p class="callout-label">
          matches called correctly — including all eight at the 2010 World Cup,
          which by chance alone is a 1-in-256 run.
        </p>
      </div>
    </section>

    <section class="scrolly-step">
      <p class="kicker">The catch</p>
      <h3>This wheel is rubbish, and so are most of the charts</h3>
      <p>
        Five riders, five completely different tests. Recessions and football
        matches and stock-picking rounds do not belong on one rim, and the
        moment you hang them there the ranking starts to look like a finding.
      </p>
      <p>
        A fairground wheel at least has the decency to look like one. Most charts
        that do exactly this arrive in a neat grid with an axis, and you were
        comparing the heights before you ever asked what they measured.
      </p>
    </section>

    <section class="scrolly-step">
      <p class="kicker">Oberhausen</p>
      <h3>Why we loved him anyway</h3>
      <p>
        Paul never explained himself. He never gave an interview about
        structural headwinds, never revised his target, never said he had been
        directionally right. He walked into a box and ate a mussel.
      </p>
      <p>
        Every human forecaster in this piece hands you a story along with the
        number. The story is the part that persuades you, and the story is the
        part that is worth nothing.
      </p>
    </section>

    <section class="scrolly-step">
      <p class="kicker">26 October 2010</p>
      <h3>He retired at the top, which nobody else here managed</h3>
      <p>
        Paul died in his tank a few months after the World Cup, aged about two
        and a half, with a career record of 12 from 14 and no comeback tour. It
        is the single most impressive thing about him.
      </p>
    </section>
  </Scrolly>
</section>
