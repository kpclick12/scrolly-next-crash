<script>
  import { appData as data } from "./lib/data/load.js";
  import OracleDesk from "./lib/components/OracleDesk.svelte";
  import ActTower from "./lib/story/ActTower.svelte";
  import ActMagician from "./lib/story/ActMagician.svelte";
  import ActJudgement from "./lib/story/ActJudgement.svelte";
  import ActMoon from "./lib/story/ActMoon.svelte";
  import ActWheel from "./lib/story/ActWheel.svelte";

  const q = data.forecasts.quote;
</script>

<OracleDesk />

<main>
  <ActTower {data} />
  <ActMagician {data} />

</main>

<!-- A full-bleed quote between acts, to break the head/cards/handover rhythm
     before it starts reading as a template. It sits OUTSIDE `main` rather
     than breaking out of it with `100vw`, which would have counted the
     scrollbar and put a horizontal scrollbar on the page. -->
<section class="interlude" aria-label="Interlude">
    <div class="interlude-inner">
      <p class="quote-mark" aria-hidden="true">“</p>
      <blockquote>
        <p>{q.text}</p>
        <cite>{q.who} — {q.where}</cite>
      </blockquote>
      <p class="interlude-note">
        You have heard this as "economists have predicted nine of the last five
        recessions". Samuelson was being ruder than that: he was talking about
        the market itself. The joke has been improved in transmission, which is
        also more or less what this piece is about.
      </p>
    </div>
</section>

<main>
  <ActJudgement {data} />
  <ActMoon {data} />
  <ActWheel {data} />
</main>

<section class="closing" aria-label="Closing">
  <div class="closing-inner">
    <svg class="closing-ball" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M14 56 Q32 48 50 56 L50 60 H14 Z" fill="#d9a441" />
      <circle cx="32" cy="30" r="22" fill="rgba(207,230,255,0.22)" stroke="#d9a441" stroke-width="2" />
      <path d="M22 34 L28 26 L34 33 L42 20" fill="none" stroke="#d9a441" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <h2>So — can you predict the next crash?</h2>
    <p>
      No. Not the date, not the trigger, not the depth. The record on that is
      about as clear as records get: five out of a hundred and fifty-three, and
      the people who sound most certain are usually the ones running the
      permanent forecast.
    </p>
    <p>
      But notice what the question smuggles in. A fortune teller's prediction
      doesn't change your future — you can be told you'll meet a tall stranger
      and it makes no odds. A crash forecast is not like that. Enough people
      believing it is the thing itself. The market is the only client who reads
      the reading and then rearranges the future to match.
    </p>
    <p>
      What you <em>can</em> know is the base rate, which is roughly one bad year
      in four and has been for a century. What you can look at is fragility —
      how much borrowed money, how concentrated, how many people are holding on
      only because everyone else is. Fragility is visible. Timing is not. Every
      honest forecaster in this piece is really telling you the first thing while
      being asked for the second.
    </p>
    <p class="closing-kicker">
      And if you want an oracle anyway, take the octopus. He had the only two
      qualities that ever mattered: he never explained himself, and he stopped.
    </p>
  </div>
</section>

<section class="sources" aria-label="Methodology and sources">
  <div class="sources-inner">
    <h2>Methodology &amp; sources</h2>
    <p class="sources-intro">
      Every figure on this page is an <strong>approximation, rounded for
      readability</strong>. This is an explainer, not primary statistics — read
      each number as "about", not "exactly". Where something is illustrative
      rather than measured, it says so on the page where it appears, not just
      down here.
    </p>
    <ul>
      <li>
        <strong>The three crashes</strong> — all three use the same index, the
        Dow Jones Industrial Average, so the comparison is like for like. Every
        vertex on the chart is a dated closing value and the segments between
        them are straight lines, which the chart's own caption states. 1929:
        peak 381.17 (3 Sep 1929), 230.07 on Black Tuesday (29 Oct), 198.60 (13
        Nov), a recovery to 294.07 (17 Apr 1930), floor at 41.22 (8 Jul 1932) —
        a fall of 89.2 percent — and back to the old peak on 23 Nov 1954. 1987:
        peak 2722.42 (25 Aug), 2246.74 (16 Oct), 1738.74 after Black Monday (19
        Oct) — a one-day fall of 508.00 points, or 22.61 percent, still the
        worst on record — closing the year at 1938.83, up on the year as a
        whole. 2008: peak 14164.53 (9 Oct 2007), 10917.51 the day Lehman filed
        (15 Sep 2008), 10365.45 after the first rescue vote failed (29 Sep 2008,
        −777.68 points), floor at 6547.05 (9 Mar 2009) — a fall of 53.8 percent
        — and back above the old peak on 5 Mar 2013. Percentages are computed
        from those closes.
      </li>
      <li>
        <strong>The forecasting record</strong> — Zidong An, João Tovar Jalles
        and Prakash Loungani, "How Well Do Economists Forecast Recessions?",
        IMF Working Paper WP/18/39 (March 2018): of 153 recessions across 63
        countries between 1992 and 2014, the private-sector forecasting
        consensus had five on the books by the April of the preceding year. The
        dots in the waffle are one per recession; which five are lit is
        arbitrary, since the paper counts them rather than naming them.
      </li>
      <li>
        <strong>The Samuelson line</strong> — Paul Samuelson, Newsweek, 19
        September 1966: "Wall Street indexes predicted nine out of the last five
        recessions!" The common version, which puts economists rather than the
        market in the frame, is a later improvement.
      </li>
      <li>
        <strong>Nate Silver</strong> — 49 of 50 states called correctly in 2008
        (Indiana was the miss) and all 50 in 2012; <em>The Signal and the
        Noise</em>, Penguin, 2012.
      </li>
      <li>
        <strong>The base rate</strong> — 27 bear markets in the S&amp;P 500
        between 1928 and 2024, against 28 bull markets (Ned Davis Research,
        widely republished by Hartford Funds). Across 96 years that is about 28
        percent of years, which is the number the perma-bear is quietly
        collecting. In the year-grid, <em>the count is real and the placement
        is not</em>: the shaded squares are spread to show the rate, not to date
        each bear market, and the chart says so.
      </li>
      <li>
        <strong>The stopped clock</strong> is an illustration, not data. So is
        the couch, and so is the flock.
      </li>
      <li>
        <strong>"The market can remain irrational longer than you can remain
        solvent"</strong> is attributed to Keynes everywhere and appears
        nowhere in Keynes. The earliest printed version anyone has traced is A.
        Gary Shilling, in Forbes, 1993. We have left it out of the piece for
        that reason and mention it here instead.
      </li>
      <li>
        <strong>Conformity</strong> — Solomon Asch, "Effects of group pressure
        upon the modification and distortion of judgments" (1951) and "Studies
        of independence and conformity" (Psychological Monographs, 1956): about
        three quarters of participants agreed with the obviously wrong majority
        at least once, and roughly a third of all critical answers followed the
        majority.
      </li>
      <li>
        <strong>The beauty contest</strong> — John Maynard Keynes, <em>The
        General Theory of Employment, Interest and Money</em> (1936), chapter
        12. Freud, <em>The Interpretation of Dreams</em> (1899), is in the piece
        purely to be shown the door.
      </li>
      <li>
        <strong>Darts and stock pickers</strong> — Burton Malkiel, <em>A Random
        Walk Down Wall Street</em> (1973), for the blindfolded monkey; the
        <em>Wall Street Journal</em>'s Investment Dartboard contest, 142 rounds
        between 1988 and 2002, for the test — the professionals' picks beat the
        darts in 87 rounds and beat the Dow itself in 76. Note the contest has
        a known flaw in the pros' favour: their picks were published, which
        moved them.
      </li>
      <li>
        <strong>Experts</strong> — Philip Tetlock, <em>Expert Political
        Judgment</em> (2005): 284 experts, 82,361 forecasts, roughly twenty
        years. The "dart-throwing chimpanzee" phrasing is the press's, not
        Tetlock's.
      </li>
      <li>
        <strong>Paul</strong> — a common octopus, hatched near Weymouth in
        January 2008, resident at the Sea Life Centre in Oberhausen. Four of six
        correct at Euro 2008 and eight of eight at the 2010 World Cup, for 12 of
        14 overall. Eight consecutive two-way calls is a 1-in-256 run by chance.
        He died on 26 October 2010.
      </li>
      <li>
        <strong>The oracle scoreboard</strong> deliberately puts five
        incomparable records on one axis, and says so on the chart. It is the
        one figure in this piece built to be distrusted.
      </li>
      <li>
        <strong>Colour</strong> — the categorical palette was validated against
        both page surfaces with the <code>dataviz</code> validator, all pairs,
        and passes every check in both light and dark. The dimmed state does
        not, which is why every series in every chart carries an always-on
        direct label rather than relying on hue.
      </li>
      <li>
        <strong>Tools</strong> — data assembled, checked against the sources
        above and written by hand; charts hand-built in SVG; the opening scene
        is procedural Three.js. Built with Claude Code as a pair, with the
        figure-checking, the sourcing decisions and the editorial calls made
        here.
      </li>
    </ul>
  </div>
</section>

<footer>
  <p>
    This page explains how forecasting behaves. It is not investment advice,
    and if it were, the advice would be "nobody knows the date". If you take
    one thing away, make it the base rate — and the fact that the confident
    voice is the one to check first.
  </p>
</footer>

<style>
  main {
    max-width: 1100px;
    margin: 0 auto;
  }

  /* ---- Interlude: a full-bleed dark quote between two acts ---- */
  .interlude {
    background: radial-gradient(120% 100% at 50% 0%, var(--velvet) 0%, var(--velvet-deep) 100%);
    margin-top: 96px;
  }
  .interlude-inner {
    max-width: 680px;
    margin: 0 auto;
    padding: 76px 24px 80px;
    text-align: center;
  }
  .quote-mark {
    font-family: var(--serif);
    font-size: 72px;
    line-height: 0.6;
    color: var(--brass);
    margin: 0 0 12px;
  }
  .interlude blockquote {
    margin: 0 0 26px;
  }
  .interlude blockquote p {
    font-family: var(--serif);
    font-size: clamp(23px, 3.6vw, 34px);
    line-height: 1.28;
    color: #ffffff;
    margin: 0 0 16px;
  }
  .interlude cite {
    font-style: normal;
    font-size: 13px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--brass);
  }
  /* Always-dark section: set colour on the elements themselves. A global
     `p { color: var(--text-secondary) }` tuned for paper beats inheritance
     from this wrapper, and the text would render at about 1.5:1. */
  .interlude-note {
    font-size: 14.5px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.6);
    max-width: 520px;
    margin: 0 auto;
  }
  .interlude :global(a:focus-visible) {
    outline-color: var(--brass);
  }

  /* ---- Closing ---- */
  .closing {
    background: radial-gradient(120% 90% at 50% 0%, var(--velvet) 0%, var(--velvet-deep) 100%);
    text-align: center;
  }
  .closing-inner {
    max-width: 640px;
    margin: 0 auto;
    padding: 96px 24px 104px;
  }
  .closing-ball {
    width: 76px;
    height: auto;
    margin-bottom: 22px;
  }
  .closing h2 {
    font-family: var(--serif);
    font-size: clamp(30px, 5vw, 42px);
    color: #ffffff;
    margin: 0 0 20px;
  }
  .closing p {
    font-size: 17px;
    line-height: 1.65;
    color: rgba(255, 255, 255, 0.92);
    margin: 0 0 16px;
  }
  .closing .closing-kicker {
    margin: 28px 0 0;
    font-family: var(--serif);
    font-size: 19px;
    line-height: 1.5;
    color: var(--brass);
  }

  /* ---- Sources ---- */
  .sources {
    background: var(--surface-1);
    border-top: 1px solid var(--border);
  }
  .sources-inner {
    max-width: 680px;
    margin: 0 auto;
    padding: 64px 24px;
  }
  .sources h2 {
    font-family: var(--serif);
    font-size: 22px;
    margin: 0 0 16px;
    color: var(--text-primary);
  }
  .sources-intro {
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-secondary);
    margin: 0 0 20px;
  }
  .sources ul {
    margin: 0;
    padding-left: 20px;
  }
  .sources li {
    font-size: 13.5px;
    line-height: 1.6;
    color: var(--text-muted);
    margin-bottom: 10px;
  }
  .sources li:last-child {
    margin-bottom: 0;
  }
  footer {
    padding: 40px 24px 80px;
    text-align: center;
    color: var(--text-muted);
    font-size: 13px;
    border-top: 1px solid var(--border);
    background: var(--page-plane);
  }
  footer p {
    max-width: 520px;
    margin: 0 auto;
  }
</style>
