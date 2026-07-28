<script>
  import { appData as data } from "./lib/data/load.js";
  import ScreensHero from "./lib/components/ScreensHero.svelte";
  import DaysSection from "./lib/components/DaysSection.svelte";
  import BooksSection from "./lib/components/BooksSection.svelte";
  import CinemaSection from "./lib/components/CinemaSection.svelte";
  import PlayerSelect from "./lib/components/PlayerSelect.svelte";
</script>

<ScreensHero />

<main>
  <!-- Four sections, four different shapes on purpose, and each one is a
       different medium: a wide sticky chart with the copy running under it,
       a shelf you pick books off, a cinema, and a screen you play. -->
  <DaysSection data={data.worstdays} />
  <BooksSection data={data.books} forecasts={data.forecasts} />
  <CinemaSection data={data.cinema} />

  <section class="select section section-dark" aria-label="Player select">
    <div class="wrap">
      <div class="column select-intro">
        <p class="eyebrow">Four · choose your forecaster</p>
        <h2 class="big">So who do you actually listen to?</h2>
        <p class="standfirst">
          Eight of them. Pick one.
        </p>
      </div>
    </div>
    <div class="wrap">
      <PlayerSelect data={data.roster} />
    </div>
    <div class="wrap">
      <div class="column select-outro">
        <p>
          The one worth copying is the boring one. The superforecaster never
          says a crash is coming — they say fifteen percent, then twelve, then
          twenty, and tell you what moved.
        </p>
        <p>
          Three of the eight have no published record at all. Nobody keeps
          score on them, and that is the most comfortable job in forecasting.
        </p>
      </div>
    </div>
  </section>
</main>

<section class="closing section section-dark" aria-label="Closing">
  <div class="wrap">
    <div class="column">
      <h2 class="big">Can you predict the next crash?</h2>
      <div class="body-copy">
        <p>
          No. Not the date, not the trigger, not the depth. Five out of a
          hundred and fifty-three is the honest state of the art, and the
          people who sound most certain are usually the ones nobody is scoring.
        </p>
        <p>
          What you <em>can</em> know is the base rate — roughly one bad year in
          four, and it has been that for a century. What you can look at is
          fragility: how much borrowed money, how concentrated, how many people
          are holding on only because everyone else is. Fragility is visible.
          Timing is not.
        </p>
        <p class="kicker">
          And if you want somebody to just tell you, take the octopus. He had
          the two qualities nobody else on that screen managed: he never
          explained himself, and he stopped.
        </p>
      </div>
    </div>
  </div>
</section>

<section class="sources" aria-label="Methodology and sources">
  <div class="wrap">
    <div class="column">
      <h2>Methodology &amp; sources</h2>
      <p class="intro">
        Every figure here is an <strong>approximation, rounded for
        readability</strong> — read each number as "about", not "exactly".
        Where something is an editorial judgement rather than a measurement, it
        says so where it appears, not just down here.
      </p>
      <ul>
        <li>
          <strong>The ten worst days</strong> — the largest one-day percentage
          declines in the Dow Jones Industrial Average, close to close. They
          are drawn as candle <em>bodies only</em>: a real candle's body runs
          open to close and its wicks show the intraday high and low, and
          dependable intraday ranges back to 1899 are not something we have.
          The figure says so on itself.
        </li>
        <li>
          <strong>What happened next</strong> — 1987: the Dow closed that year
          at 1938.83 against 1895.95 at the end of 1986, i.e. up on the year,
          and regained its August 1987 peak in August 1989. 2020: the low came
          on 23 March 2020 at 18,591.93, and the Dow closed above 30,000 for
          the first time on 24 November 2020. 1929: the slide ran on to 41.22
          on 8 July 1932 — 89 percent below the September 1929 peak — and the
          old high was not seen again until 23 November 1954.
        </li>
        <li>
          <strong>The forecasting record</strong> — Zidong An, João Tovar
          Jalles and Prakash Loungani, "How Well Do Economists Forecast
          Recessions?", IMF Working Paper WP/18/39 (2018): of 153 recessions
          across 63 countries between 1992 and 2014, the private-sector
          consensus had five on its books by the April of the preceding year.
          Which five dots are filled in the figure is arbitrary — the paper
          counts them rather than naming them.
        </li>
        <li>
          <strong>Nate Silver</strong> — 49 of 50 states in 2008 (Indiana was
          the miss) and all 50 in 2012. <strong>Paul Samuelson</strong> —
          Newsweek, 19 September 1966: "Wall Street indexes predicted nine out
          of the last five recessions!"
        </li>
        <li>
          <strong>The roster</strong> — the base rate is 27 bear markets in the
          96 years 1928–2024 (Ned Davis Research). The dartboard and the stock
          pickers are the Wall Street Journal's Investment Dartboard, 142
          contests 1988–2002: the darts beat the pros in 55, and the pros beat
          the Dow itself in 76. The superforecaster is Philip Tetlock and
          Barbara Mellers' work in IARPA's ACE tournament, where the best
          forecasters beat the control group by wide margins and outperformed
          intelligence analysts with access to classified reporting. Octopus
          Paul went 4 of 6 at Euro 2008 and 8 of 8 at the 2010 World Cup, and
          died on 26 October 2010.
        </li>
        <li>
          <strong>The bookshelf</strong> — titles, authors and years as printed
          on each first edition, in publication order, 1841 to 2015. The
          one-line glosses are our characterisation of each book, not
          quotations from it.
        </li>
        <li>
          <strong>The film, and Michael Burry</strong> — <em>The Big Short</em>,
          dir. Adam McKay, Paramount Pictures, 2015, from Michael Lewis's book
          (2010). Burry ran Scion Capital and began buying credit default swaps
          against subprime mortgage bonds in 2005; his investors tried to
          withdraw and he restricted redemptions before the position paid off
          in 2007–08. In January 2023 he posted a one-word tweet, "Sell." The
          S&amp;P 500 rose sharply over the rest of that year, and in October
          2023 he posted "I was wrong to say sell." The clip is a click-to-load
          embed through youtube-nocookie.com — nothing is requested from
          YouTube unless you press play.
        </li>
        <li>
          <strong>Conformity</strong> — Solomon Asch (1951, 1956): about three
          quarters of participants agreed with an obviously wrong majority at
          least once.
        </li>
        <li>
          <strong>The stat bars are not all data.</strong> Only "Record" is
          measured. "Confidence" and "Changes their mind" are our reading of
          how each one behaves, they are labelled as such on the screen, and no
          two records on that roster measure the same thing — so it is not a
          league table, however much a row of bars looks like one.
        </li>
        <li>
          <strong>Colour</strong> — the categorical palette was validated with
          the <code>dataviz</code> validator against both surfaces, all pairs,
          and passes every check in light and dark. The dimmed state does not,
          so every mark carries a printed value rather than relying on hue.
        </li>
        <li>
          <strong>Tools</strong> — data assembled and checked against the
          sources above by hand; the figures are hand-built SVG; the opening
          sequence is procedural Three.js with no model files. Built with
          Claude Code as a pair, with the figure-checking, the sourcing calls
          and the editorial decisions made here.
        </li>
      </ul>
    </div>
  </div>
</section>

<footer>
  <div class="wrap">
    <p>
      This explains how forecasting behaves. It is not investment advice, and
      if it were, the advice would be "nobody knows the date".
    </p>
  </div>
</footer>

<style>
  .select-intro { margin-bottom: clamp(28px, 5vw, 48px); }
  .select-outro {
    margin-top: clamp(28px, 5vw, 48px);
  }
  .select-outro p {
    font-size: 17.5px;
    line-height: 1.62;
    margin-bottom: 16px;
  }
  .select-outro p:last-child { margin-bottom: 0; }

  .closing { background: var(--screen); }
  .closing .body-copy p { font-size: 19px; line-height: 1.62; }
  .closing .kicker {
    font-family: var(--display);
    font-style: italic;
    font-size: clamp(21px, 3vw, 27px) !important;
    line-height: 1.38;
    color: var(--signal) !important;
    margin-top: 28px;
    text-wrap: balance;
  }

  .sources {
    background: var(--paper-2);
    border-top: 1px solid var(--border);
    padding-block: clamp(52px, 8vw, 76px);
  }
  .sources h2 {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ink-3);
    margin-bottom: 16px;
  }
  .sources .intro {
    font-size: 15.5px;
    line-height: 1.6;
    margin-bottom: 20px;
  }
  .sources ul { margin: 0; padding-left: 20px; }
  .sources li {
    font-size: 14.5px;
    line-height: 1.6;
    color: var(--ink-3);
    margin-bottom: 12px;
  }
  .sources li:last-child { margin-bottom: 0; }
  .sources strong { color: var(--ink-2); }

  footer {
    padding-block: 40px 76px;
    text-align: center;
    background: var(--paper);
    border-top: 1px solid var(--border);
  }
  footer p {
    font-size: 14.5px;
    color: var(--ink-3);
    max-width: 480px;
    margin: 0 auto;
  }
</style>
