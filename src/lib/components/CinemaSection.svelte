<script>
  // The cinema: the medium that made a forecaster famous, and the section
  // where the herd turns up.
  //
  // The YouTube embed is a CLICK-TO-LOAD FACADE. The poster is our own
  // drawing, so nothing at all is requested from YouTube until the reader
  // actually asks for the clip — and when they do it goes to
  // youtube-nocookie.com. A page that quietly phones a third party on load is
  // not something this piece is going to do just for a video.
  let { data } = $props();

  let playing = $state(false);
  const v = $derived(data.video);
  const b = $derived(data.burry);
  const src = $derived(
    `https://www.youtube-nocookie.com/embed/${v.videoId}?autoplay=1&rel=0&modestbranding=1`
  );
</script>

<section class="cinema section section-dark" aria-label="The film, and the herd">
  <div class="wrap">
    <div class="column">
      <p class="eyebrow">Three · the film</p>
      <h2 class="big">Then a film gave us a hero</h2>
      <p class="standfirst">
        <em>The Big Short</em> turned one fund manager into the man who saw it
        coming. Here he is, in the middle of being right.
      </p>
    </div>
  </div>

  <div class="wrap">
    <div class="theatre">
      {#if playing}
        <div class="frame" class:portrait={v.shorts}>
          <iframe
            {src}
            title={v.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      {:else}
        <button class="poster" class:portrait={v.shorts} onclick={() => (playing = true)}>
          <!-- Our own poster art, so the page requests nothing until asked. -->
          <span class="poster-art" aria-hidden="true">
            <svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="cin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#242938" />
                  <stop offset="100%" stop-color="#0e1017" />
                </linearGradient>
              </defs>
              <rect width="640" height="360" fill="url(#cin)" />
              <!-- a falling line, low and red, behind everything -->
              <path
                d="M0 150 L90 138 L150 176 L220 150 L300 210 L380 190 L470 268 L560 246 L640 320"
                fill="none" stroke="#e0332a" stroke-width="5" opacity="0.5" stroke-linejoin="round"
              />
              <!-- projector beam -->
              <path d="M320 0 L470 360 L170 360 Z" fill="#ffffff" opacity="0.05" />
            </svg>
          </span>
          <span class="play" aria-hidden="true">
            <svg viewBox="0 0 68 48"><path d="M8 6 v36 l52 -18 z" /></svg>
          </span>
          <span class="poster-text">
            <span class="poster-title">{v.title}</span>
            <span class="poster-credit">{v.credit} · plays on YouTube</span>
          </span>
        </button>
      {/if}
      <p class="theatre-cap">{v.why}</p>
    </div>
  </div>

  <div class="wrap">
    <div class="column">
      <div class="body-copy beats">
        <p>{b.callLine}</p>
        <p>{b.costLine}</p>
        <p class="turn">{b.sinceLine}</p>
        <p class="verdict">{b.verdict}</p>
      </div>
    </div>
  </div>

  <div class="wrap">
    <div class="column herd">
      <h3>And the rest of us watched the same film</h3>
      <p>
        Everybody came out of that cinema quietly certain they would have been
        the one who saw it. Which is the joke, because the film is about a man
        whose own investors tried to destroy him for being early.
      </p>
      <div class="asch">
        <p class="asch-num">{data.asch.conformed}%</p>
        <p class="asch-line">{data.asch.line}</p>
      </div>
      <p>
        That is the thing being forecast. Not companies, not interest rates —
        a room full of people all watching each other for a clue about what to
        do next.
      </p>
    </div>
  </div>
</section>

<style>
  .cinema { background: #12151b; }
  .theatre { margin: clamp(28px, 5vw, 48px) 0 clamp(28px, 4vw, 44px); }
  .frame, .poster {
    position: relative;
    display: block;
    width: 100%;
    max-width: 860px;
    margin: 0 auto;
    aspect-ratio: 16 / 9;
  }
  /* A YouTube Short is vertical. Giving it a 16:9 box would letterbox it into
     a tiny strip, so the frame goes 9:16 and narrows to phone width. */
  .frame.portrait, .poster.portrait {
    aspect-ratio: 9 / 16;
    max-width: min(380px, 82vw);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: #0e1017;
  }
  .frame iframe { width: 100%; height: 100%; border: 0; display: block; }
  .poster {
    appearance: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
  }
  .poster-art { position: absolute; inset: 0; }
  .poster-art svg { width: 100%; height: 100%; display: block; }
  .play {
    position: absolute;
    left: 50%;
    top: 46%;
    transform: translate(-50%, -50%);
    width: 74px;
    height: 52px;
    border-radius: 10px;
    background: rgba(224, 51, 42, 0.92);
    display: grid;
    place-items: center;
    transition: transform 0.15s ease, background 0.15s ease;
  }
  .play svg { width: 30px; fill: #fff; }
  .poster:hover .play { transform: translate(-50%, -50%) scale(1.08); background: #e0332a; }
  .poster:focus-visible { outline: 3px solid var(--signal); outline-offset: 3px; }
  .poster-text {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    background: linear-gradient(180deg, transparent, rgba(9, 11, 16, 0.9));
  }
  .poster-title {
    font-family: var(--display);
    font-size: clamp(17px, 2.6vw, 23px);
    font-weight: 800;
    color: #fff;
  }
  .poster-credit {
    font-family: var(--sans);
    font-size: 12.5px;
    color: rgba(255, 255, 255, 0.6);
  }
  .theatre-cap {
    max-width: 620px;
    margin: 12px auto 0;
    font-size: 14px !important;
    color: rgba(255, 255, 255, 0.52) !important;
    font-style: italic;
  }

  .beats p {
    font-size: clamp(18px, 2.3vw, 21px);
    line-height: 1.5;
    margin-bottom: 16px;
  }
  .turn { color: #fff !important; }
  .verdict {
    font-family: var(--display);
    font-style: italic;
    font-size: clamp(20px, 2.9vw, 27px) !important;
    line-height: 1.35;
    color: var(--signal) !important;
    padding-left: 18px;
    border-left: 4px solid var(--signal);
    margin-top: 26px;
    text-wrap: balance;
  }

  .herd { margin-top: clamp(48px, 8vw, 84px); }
  .herd h3 {
    font-size: clamp(24px, 3.8vw, 34px);
    color: #fff;
    margin-bottom: 16px;
    text-wrap: balance;
  }
  .herd p {
    font-size: 18px;
    line-height: 1.6;
    margin-bottom: 18px;
  }
  .asch {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px 0;
    margin: 8px 0 20px;
    border-block: 1px solid rgba(255, 255, 255, 0.14);
    flex-wrap: wrap;
  }
  /* Two classes, so this beats `.herd p` — which was flattening it to body
     size. */
  .asch .asch-num {
    font-family: var(--display);
    font-size: clamp(48px, 9vw, 76px);
    font-weight: 900;
    line-height: 0.9;
    color: var(--signal) !important;
    font-variant-numeric: tabular-nums;
  }
  .asch .asch-line {
    flex: 1 1 260px;
    font-size: 15.5px !important;
    line-height: 1.5;
    margin-bottom: 0 !important;
    color: rgba(255, 255, 255, 0.72) !important;
  }
</style>
