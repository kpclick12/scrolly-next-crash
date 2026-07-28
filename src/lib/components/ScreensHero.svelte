<script>
  import { onMount } from "svelte";
  import * as THREE from "three";

  // Three screens, and the reader OPERATES each one.
  //
  // The earlier version of this scene flew a camera past three objects sitting
  // on a table, which is a slideshow. This one puts each object in your hands
  // and makes the scroll do the verb:
  //   0.00–0.10  title, over the folded paper
  //   0.10–0.30  THE NEWSPAPER OPENS — two hinged halves swing apart as you
  //              scroll, and the headline is only readable once you have
  //              actually opened it
  //   0.30–0.36  the paper drops away
  //   0.36–0.56  THE COMPUTER WAKES — the CRT powers on with a scanline
  //              sweep, the phosphor warms, and the chart draws itself across
  //              the screen at the rate you scroll, then breaks
  //   0.56–0.62  the monitor recedes
  //   0.62–0.86  THE PHONE SCROLLS — the screen's content moves under your
  //              thumb. This is a texture offset, so your scroll literally is
  //              the scroll, and the price falls as the list goes by
  //   0.86–1.00  hand-over card
  //
  // One eased scalar drives all of it, so scrubbing the scrollbar scrubs the
  // whole sequence. All geometry and every texture is procedural.

  let wrap;
  let canvas;
  let cardEls = [];
  let chipEls = [];
  let webglFailed = $state(false);

  const cards = [
    {
      band: [0.0, 0.08],
      eyebrow: "A short story about forecasting",
      title: "Nobody saw it coming",
      sub: "They never do. Scroll.",
      hint: true,
    },
    {
      band: [0.88, 1.01],
      body:
        "Every crash arrives on the newest screen in the house — and every screen only ever shows you " +
        "the one that has already started. So we do the next best thing, and ask somebody to tell us " +
        "what happens next.",
    },
  ];

  const chips = [
    { label: "1929 — you found out when the paper landed", band: [0.14, 0.29] },
    { label: "1987 — the selling was done by machines, faster than the room could read", band: [0.40, 0.55] },
    { label: "2008 — the first one you could watch in your own hand", band: [0.66, 0.85] },
  ];

  function bandOpacity(p, [a, b]) {
    const fade = 0.045;
    if (p <= a - fade || p >= b + fade) return 0;
    if (p < a) return (p - (a - fade)) / fade;
    if (p > b) return (b + fade - p) / fade;
    return 1;
  }
  const smooth = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  onMount(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Budget before beauty: pick a tier from what the device admits to, then
    // scale pixel ratio, antialiasing and the frame cap off it. Capping the
    // frame rate is the biggest battery win in a scene this simple.
    const cores = navigator.hardwareConcurrency || 4;
    const mem = navigator.deviceMemory || 4;
    const small = Math.min(window.innerWidth, window.innerHeight) < 700;
    const tier = cores <= 4 || mem <= 4 || small ? "low" : "high";
    const frameBudget = 1 / (tier === "low" ? 30 : 60);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: tier === "high" });
    } catch {
      webglFailed = true;
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier === "low" ? 1.25 : 1.75));

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0d1016");
    scene.fog = new THREE.Fog("#0d1016", 7, 22);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40);
    camera.position.set(0, 0, 6);

    scene.add(new THREE.AmbientLight("#8fa3c4", 0.55));
    const key = new THREE.DirectionalLight("#fff4e2", 1.05);
    key.position.set(2.5, 4, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight("#5f7bd0", 0.35);
    fill.position.set(-4, -1, 2);
    scene.add(fill);
    // Each screen lights the room when it is the one being used.
    const screenLight = new THREE.PointLight("#9ecbff", 0, 9, 2);
    screenLight.position.set(0, 0, 2.2);
    scene.add(screenLight);

    function tex(w, h, draw) {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      draw(c.getContext("2d"));
      const t = new THREE.CanvasTexture(c);
      t.anisotropy = 4;
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }

    // ===== 1929 · THE NEWSPAPER, which the reader opens ====================
    // Built as two hinged halves. Folded, you see the right half's back and a
    // sliver of masthead; open, the spread reads across both.
    const paperGroup = new THREE.Group();
    const PW = 1.55; // half width
    const PH = 2.1;

    // The full spread is drawn once and split across the two halves by UVs.
    function spreadTex(side) {
      return tex(560, 760, (g) => {
        g.fillStyle = "#e3dac2";
        g.fillRect(0, 0, 560, 760);
        g.fillStyle = "#242018";
        g.textAlign = "center";
        if (side === "left") {
          // Masthead and date sit on the left leaf.
          g.font = "700 34px Georgia, serif";
          g.fillText("VARIETY", 280, 62);
          g.lineWidth = 3;
          g.strokeStyle = "#242018";
          g.beginPath();
          g.moveTo(40, 84); g.lineTo(520, 84);
          g.moveTo(40, 92); g.lineTo(520, 92);
          g.stroke();
          g.font = "400 20px Georgia, serif";
          g.fillText("WEDNESDAY, OCTOBER 30, 1929", 280, 124);
          g.font = "900 96px Georgia, serif";
          g.fillText("WALL ST.", 280, 250);
          g.fillStyle = "#6d6553";
          for (let col = 0; col < 2; col++)
            for (let line = 0; line < 26; line++)
              g.fillRect(48 + col * 250, 320 + line * 16, 205 - (line % 5) * 18, 5);
        } else {
          g.font = "900 96px Georgia, serif";
          g.fillText("LAYS AN EGG", 280, 250);
          g.strokeStyle = "#242018";
          g.lineWidth = 2;
          g.beginPath(); g.moveTo(40, 290); g.lineTo(520, 290); g.stroke();
          g.fillStyle = "#6d6553";
          for (let col = 0; col < 2; col++)
            for (let line = 0; line < 18; line++)
              g.fillRect(48 + col * 250, 320 + line * 16, 205 - (line % 4) * 22, 5);
          // A small printed chart, the way papers did it.
          g.fillStyle = "#d8cfb4";
          g.fillRect(48, 620, 464, 110);
          g.strokeStyle = "#8a2f22";
          g.lineWidth = 4;
          g.beginPath();
          for (let i = 0; i < 40; i++) {
            const t = i / 39;
            const v = t < 0.4 ? t * 0.85 : 0.34 - (t - 0.4) * 1.5;
            const px = 56 + t * 448;
            const py = 716 - (Math.max(0, v) + 0.06) * 96 + Math.sin(i * 2.3) * 3;
            i ? g.lineTo(px, py) : g.moveTo(px, py);
          }
          g.stroke();
        }
      });
    }
    const backTex = tex(64, 64, (g) => {
      g.fillStyle = "#d6cdb4";
      g.fillRect(0, 0, 64, 64);
    });
    function leaf(side) {
      const geo = new THREE.PlaneGeometry(PW, PH, 1, 1);
      // Hinge at the inner edge: shift the geometry so it rotates about x=0.
      geo.translate(side === "left" ? -PW / 2 : PW / 2, 0, 0);
      const m = new THREE.Mesh(geo, [
        new THREE.MeshLambertMaterial({ map: spreadTex(side), side: THREE.FrontSide }),
      ][0]);
      const back = new THREE.Mesh(
        geo.clone(),
        new THREE.MeshLambertMaterial({ map: backTex, side: THREE.BackSide })
      );
      const g = new THREE.Group();
      g.add(m, back);
      return g;
    }
    const leafL = leaf("left");
    const leafR = leaf("right");
    paperGroup.add(leafL, leafR);
    paperGroup.position.set(0, -0.1, 0.6);
    scene.add(paperGroup);

    // ===== 1987 · THE COMPUTER, which the reader wakes =====================
    const crt = new THREE.Group();
    const caseMat = new THREE.MeshLambertMaterial({ color: "#cbc3ac" });
    const shell = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.1, 2.0), caseMat);
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.72, 0.08), new THREE.MeshLambertMaterial({ color: "#b8b09a" }));
    bezel.position.z = 1.0;
    const stand = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.22, 1.6), caseMat);
    stand.position.y = -1.16;
    const keyboard = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.14, 0.9), caseMat);
    keyboard.position.set(0, -1.3, 1.7);
    keyboard.rotation.x = -0.07;

    // The screen is a canvas redrawn as the chart advances — the ONLY texture
    // in the scene that updates per frame, and only while the CRT is on.
    const scrW = 512, scrH = 400;
    const scrCanvas = document.createElement("canvas");
    scrCanvas.width = scrW;
    scrCanvas.height = scrH;
    const sg = scrCanvas.getContext("2d");
    const scrTex = new THREE.CanvasTexture(scrCanvas);
    scrTex.colorSpace = THREE.SRGBColorSpace;
    // The 1987 tape: up, then the cliff.
    const TAPE = Array.from({ length: 120 }, (_, i) => {
      const t = i / 119;
      const rise = t < 0.62 ? t * 1.25 : 0.775 - (t - 0.62) * 2.9;
      return Math.max(0.04, rise + Math.sin(i * 0.9) * 0.035 + Math.sin(i * 0.31) * 0.025);
    });
    let lastDrawn = -1;
    function drawScreen(progress, warm) {
      const n = Math.max(1, Math.round(progress * TAPE.length));
      if (n === lastDrawn && warm > 0.98) return;
      lastDrawn = n;
      sg.fillStyle = "#04120a";
      sg.fillRect(0, 0, scrW, scrH);
      if (warm <= 0.02) { scrTex.needsUpdate = true; return; }
      sg.globalAlpha = warm;
      sg.fillStyle = "#37d17a";
      sg.font = "700 21px monospace";
      sg.fillText("DJIA", 22, 38);
      const shown = TAPE.slice(0, n);
      const last = shown[shown.length - 1];
      const peak = Math.max(...shown);
      const dd = peak > 0 ? ((last - peak) / peak) * 100 : 0;
      sg.font = "700 40px monospace";
      sg.fillText(dd < -1 ? `${dd.toFixed(1)}%` : "19-OCT-87", 22, 84);
      // The trace
      sg.strokeStyle = dd < -12 ? "#ff5c46" : "#37d17a";
      sg.lineWidth = 3.5;
      sg.lineJoin = "round";
      sg.beginPath();
      shown.forEach((v, i) => {
        const px = 26 + (i / (TAPE.length - 1)) * (scrW - 52);
        const py = scrH - 34 - v * (scrH - 150);
        i ? sg.lineTo(px, py) : sg.moveTo(px, py);
      });
      sg.stroke();
      sg.globalAlpha = 1;
      // Scanlines last, so they sit over the trace.
      sg.fillStyle = "rgba(0,0,0,0.26)";
      for (let y = 0; y < scrH; y += 4) sg.fillRect(0, y, scrW, 2);
      scrTex.needsUpdate = true;
    }
    drawScreen(0, 0);
    const screenMat = new THREE.MeshBasicMaterial({ map: scrTex });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.02, 1.56), screenMat);
    screen.position.z = 1.05;
    // The power-on sweep: a bright band that wipes down the dark tube.
    const sweep = new THREE.Mesh(
      new THREE.PlaneGeometry(2.02, 0.1),
      new THREE.MeshBasicMaterial({ color: "#d8ffe9", transparent: true, opacity: 0 })
    );
    sweep.position.z = 1.07;
    crt.add(shell, bezel, screen, sweep, stand, keyboard);
    crt.position.set(0, 0, -1.4);
    crt.visible = false;
    scene.add(crt);

    // ===== 2008 · THE PHONE, whose screen the reader scrolls ===============
    const phone = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 3.0, 0.12),
      new THREE.MeshStandardMaterial({ color: "#1b1e26", metalness: 0.6, roughness: 0.38 })
    );
    // A tall strip: the visible screen is a WINDOW onto it, and scrolling is a
    // texture offset. This is the cheapest possible way to make the reader's
    // scroll be the phone's scroll, and it is also the most literal.
    const stripH = 2400, stripW = 600;
    const feedTex = tex(stripW, stripH, (g) => {
      g.fillStyle = "#0b0d12";
      g.fillRect(0, 0, stripW, stripH);
      // A long falling line down the whole strip.
      g.strokeStyle = "#ff5c46";
      g.lineWidth = 7;
      g.lineJoin = "round";
      g.beginPath();
      for (let i = 0; i < 260; i++) {
        const t = i / 259;
        const v = t < 0.22 ? 0.86 + t * 0.2 : 0.9 - (t - 0.22) * 0.95;
        const px = 46 + Math.sin(i * 0.7) * 12 + (i % 2) * 6;
        const py = 120 + t * (stripH - 260);
        const x = 60 + (1 - v) * (stripW - 150) + px * 0.15;
        i ? g.lineTo(x, py) : g.moveTo(x, py);
      }
      g.stroke();
      // Rows of a falling ticker beside it. DELIBERATELY NUMBERLESS: an
      // earlier version printed percentages here, and they were invented —
      // scene dressing is still a figure if it has numbers on it. The rows
      // carry a name and a red bar, which claims nothing.
      g.textAlign = "left";
      for (let r = 0; r < 40; r++) {
        const y = 150 + r * 56;
        g.fillStyle = "#20242e";
        g.fillRect(300, y - 26, 260, 44);
        g.fillStyle = "#8d93a3";
        g.font = "600 22px system-ui, sans-serif";
        g.fillText(["DJIA", "S&P", "FTSE", "DAX", "NIKKEI"][r % 5], 316, y + 4);
        g.fillStyle = "#ff5c46";
        const bar = 30 + ((r * 37) % 60);
        g.fillRect(546 - bar, y - 7, bar, 12);
        // A small down-caret, so the direction reads without a number.
        g.beginPath();
        g.moveTo(536, y - 14);
        g.lineTo(546, y - 14);
        g.lineTo(541, y - 22);
        g.closePath();
        g.fill();
      }
    });
    feedTex.wrapS = feedTex.wrapT = THREE.RepeatWrapping;
    // Show one screenful of the strip at a time.
    feedTex.repeat.set(1, 0.28);
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(1.34, 2.72),
      new THREE.MeshBasicMaterial({ map: feedTex })
    );
    glass.position.z = 0.065;
    phone.add(body, glass);
    phone.position.set(0, 0, -1.4);
    phone.visible = false;
    scene.add(phone);

    // ===== scroll → progress ==============================================
    let targetP = 0;
    let p = 0;
    function onScroll() {
      const rect = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      targetP = clamp01(-rect.top / total);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function resize() {
      const w = wrap.clientWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // Pull back on narrow screens so each object still fits the frame.
      camera.position.z = w / h < 0.75 ? 8.4 : 6;
    }
    window.addEventListener("resize", resize);
    resize();

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(wrap);

    const clock = new THREE.Clock();
    let elapsed = 0;
    let acc = 0;
    let raf;

    function frame() {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!visible || document.hidden) return;
      acc += dt;
      if (acc < frameBudget) return;
      acc = 0;
      elapsed += dt * (reduceMotion ? 0.15 : 1);
      p += (targetP - p) * Math.min(1, dt * 6);
      const t = elapsed;
      // Ambient idle motion is switched OFF entirely under reduced motion, not
      // merely slowed: a slow loop is still a loop, and at rest the frame has
      // to be genuinely still. Everything scroll-driven stays — that motion is
      // the reader's own.
      const idle = reduceMotion ? 0 : 1;

      // ---- the newspaper -------------------------------------------------
      const open = smooth(0.1, 0.3, p);
      const paperGone = smooth(0.3, 0.37, p);
      paperGroup.visible = paperGone < 0.99;
      if (paperGroup.visible) {
        // Folded (closed) = both leaves rotated to meet face to face.
        leafL.rotation.y = (1 - open) * (Math.PI / 2) * 1.02;
        leafR.rotation.y = -(1 - open) * (Math.PI / 2) * 1.02;
        // It lifts and settles as it opens, then falls away.
        paperGroup.position.y = -0.1 + open * 0.06 - paperGone * 3.4;
        paperGroup.rotation.x = -0.34 + open * 0.26 - paperGone * 0.5;
        paperGroup.rotation.z = (1 - open) * 0.06 + Math.sin(t * 0.5) * 0.008 * idle;
        paperGroup.scale.setScalar(1 + open * 0.06);
      }

      // ---- the computer --------------------------------------------------
      const crtIn = smooth(0.34, 0.42, p);
      const crtOut = smooth(0.56, 0.63, p);
      crt.visible = crtIn > 0.01 && crtOut < 0.99;
      if (crt.visible) {
        // Power-on: a warm-up, a sweep band, then the trace draws.
        const warm = smooth(0.37, 0.45, p);
        const trace = smooth(0.42, 0.56, p);
        drawScreen(trace, warm);
        const sweepPhase = smooth(0.36, 0.43, p);
        sweep.material.opacity = sweepPhase > 0 && sweepPhase < 1 ? 0.85 * (1 - Math.abs(sweepPhase * 2 - 1)) : 0;
        sweep.position.y = 0.78 - sweepPhase * 1.56;
        screenLight.intensity = warm * (1 - crtOut) * 2.6;
        screenLight.color.set(trace > 0.86 ? "#ff8a72" : "#7fe3a8");
        crt.position.z = -1.4 + crtIn * 1.4 - crtOut * 5.0;
        crt.position.y = -crtOut * 0.7;
        crt.rotation.y = (1 - crtIn) * 0.5 + Math.sin(t * 0.22) * 0.02 * idle;
        crt.scale.setScalar(0.7 + crtIn * 0.3);
      }

      // ---- the phone -----------------------------------------------------
      const phoneIn = smooth(0.6, 0.68, p);
      const phoneOut = smooth(0.9, 1.0, p);
      phone.visible = phoneIn > 0.01;
      if (phone.visible) {
        // THE SCROLL IS THE SCROLL: reader progress maps straight to the
        // texture's vertical offset, so the feed moves under the thumb.
        const feed = clamp01((p - 0.62) / 0.26);
        feedTex.offset.y = 0.72 - feed * 0.72;
        phone.position.z = -1.4 + phoneIn * 2.5;
        phone.position.y = -phoneOut * 1.2;
        phone.rotation.y = (1 - phoneIn) * -0.6 + Math.sin(t * 0.3) * 0.03 * idle;
        phone.rotation.x = 0.06 - phoneIn * 0.04;
        phone.scale.setScalar(0.8 + phoneIn * 0.2);
        screenLight.intensity = Math.max(screenLight.intensity, phoneIn * (1 - phoneOut) * 2.2);
        if (phoneIn > 0.5) screenLight.color.set("#ff8a72");
      }

      camera.lookAt(0, 0, 0);
      if (!reduceMotion) {
        camera.position.x = Math.sin(t * 0.24) * 0.12;
        camera.position.y = Math.sin(t * 0.19) * 0.07;
      }

      cards.forEach((c, i) => {
        const el = cardEls[i];
        if (!el) return;
        const o = bandOpacity(p, c.band);
        el.style.opacity = o;
        el.style.visibility = o > 0.01 ? "visible" : "hidden";
      });
      chips.forEach((c, i) => {
        const el = chipEls[i];
        if (!el) return;
        const o = bandOpacity(p, c.band);
        el.style.opacity = o;
        el.style.visibility = o > 0.01 ? "visible" : "hidden";
      });

      renderer.render(scene, camera);
    }
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      io.disconnect();
      renderer.dispose();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
            if (m.map) m.map.dispose();
            m.dispose();
          }
        }
      });
    };
  });
</script>

<div
  class="hero"
  bind:this={wrap}
  aria-label="A 3D sequence in three parts: a 1929 newspaper that unfolds as you scroll to reveal the headline WALL ST. LAYS AN EGG, a 1987 computer monitor that powers on and draws a rising chart that then falls off a cliff, and a 2008 phone whose screen scrolls under your thumb as prices drop."
>
  <div class="hero-sticky">
    {#if webglFailed}
      <div class="hero-fallback">
        <p class="fb-eyebrow">A short story about forecasting</p>
        <h1>Nobody saw it coming</h1>
        <p class="fb-body">
          They never do. Every crash arrives on the newest screen in the house — a newspaper in 1929,
          a computer in 1987, a phone in 2008 — and every screen only ever shows you the one that has
          already started.
        </p>
      </div>
    {:else}
      <canvas bind:this={canvas}></canvas>
      {#each cards as card, i}
        <div class="hero-card" bind:this={cardEls[i]}>
          {#if card.eyebrow}<p class="card-eyebrow">{card.eyebrow}</p>{/if}
          {#if card.title}<h1>{card.title}</h1>{/if}
          {#if card.sub}<p class="card-sub">{card.sub}</p>{/if}
          {#if card.body}<p class="card-body">{card.body}</p>{/if}
          {#if card.hint}<p class="scroll-hint" aria-hidden="true"><span>↓</span></p>{/if}
        </div>
      {/each}
      {#each chips as chip, i}
        <p class="hero-chip" bind:this={chipEls[i]}>{chip.label}</p>
      {/each}
    {/if}
  </div>
</div>

<style>
  .hero {
    height: 460svh;
    position: relative;
    background: #0d1016;
  }
  .hero-sticky {
    position: sticky;
    top: 0;
    height: 100svh;
    overflow: hidden;
  }
  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
  /* Vignette in CSS: one composited layer instead of a post-processing pass
     every frame. Above the canvas, below the copy. */
  .hero-sticky::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    background: radial-gradient(
      120% 90% at 50% 46%,
      rgba(13, 16, 22, 0) 38%,
      rgba(13, 16, 22, 0.5) 78%,
      rgba(8, 10, 15, 0.86) 100%
    );
  }
  .hero-card {
    position: absolute;
    left: 50%;
    top: 12%;
    transform: translateX(-50%);
    width: min(680px, calc(100% - 44px));
    text-align: center;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    z-index: 2;
  }
  .card-eyebrow {
    font-family: var(--sans);
    color: var(--signal);
    font-size: 12.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 12px;
  }
  .hero-card h1 {
    font-family: var(--display);
    font-size: clamp(46px, 9vw, 104px);
    font-weight: 800;
    line-height: 0.96;
    letter-spacing: -0.02em;
    color: #ffffff;
    margin: 0 0 14px;
    text-shadow: 0 2px 30px rgba(0, 0, 0, 0.6);
  }
  .card-sub {
    font-family: var(--sans);
    color: rgba(255, 255, 255, 0.66);
    font-size: 17px;
  }
  .card-body {
    font-family: var(--sans);
    color: rgba(255, 255, 255, 0.94);
    font-size: clamp(16px, 2.1vw, 20px);
    line-height: 1.55;
    background: rgba(13, 16, 22, 0.86);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 18px 22px;
  }
  .scroll-hint {
    margin-top: 22px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 22px;
  }
  .scroll-hint span {
    display: inline-block;
    animation: bob 1.6s ease-in-out infinite;
  }
  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(8px); }
  }
  .hero-chip {
    position: absolute;
    left: 50%;
    bottom: 7%;
    transform: translateX(-50%);
    max-width: min(560px, calc(100% - 40px));
    text-align: center;
    font-family: var(--sans);
    color: rgba(255, 255, 255, 0.9);
    background: rgba(13, 16, 22, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 999px;
    padding: 9px 20px;
    font-size: 14.5px;
    line-height: 1.4;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    z-index: 2;
  }
  .hero-fallback {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 24px;
  }
  .fb-eyebrow {
    font-family: var(--sans);
    color: var(--signal);
    font-size: 12.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 12px;
  }
  .hero-fallback h1 {
    font-family: var(--display);
    font-size: clamp(42px, 9vw, 96px);
    font-weight: 800;
    line-height: 0.98;
    color: #ffffff;
    margin: 0 0 16px;
  }
  .fb-body {
    font-family: var(--sans);
    color: rgba(255, 255, 255, 0.85);
    max-width: 560px;
    line-height: 1.6;
  }
</style>
