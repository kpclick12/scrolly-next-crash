<script>
  import { onMount } from "svelte";
  import * as THREE from "three";

  // Scroll-driven 3D prologue: one séance table, laid for four.
  //
  // Three places are taken by the screen each crash arrived on — a 1929
  // newspaper, a 1987 computer, a 2008 phone. The fourth place is empty, and
  // that emptiness is the question the essay asks. One eased value drives
  // everything — `p` in [0,1], following the reader's scroll — so scrubbing
  // the scrollbar scrubs the séance:
  //   0.00–0.13  the dark table, title card, the objects still unlit
  //   0.13–0.34  the newspaper: WALL ST. LAYS AN EGG
  //   0.34–0.55  the computer: the selling done faster than anyone could read
  //   0.55–0.74  the phone: the first crash you could hold
  //   0.74–0.90  the camera finds the empty fourth place — a crystal ball
  //              fades in, and shows nothing but static
  //   0.90–1.00  hand-over card to the first act
  // All geometry is procedural — canvas textures for the screens, no model
  // files, no external assets.

  let wrap;
  let canvas;
  let cardEls = [];
  let chipEls = [];
  let webglFailed = $state(false);

  const cards = [
    {
      band: [0.0, 0.12],
      eyebrow: "A visual essay about forecasting",
      title: "How do you predict the next crash?",
      hint: true,
    },
    {
      band: [0.9, 1.01],
      body:
        "Every crash arrives on the newest screen in the house. The trick is that the screen only " +
        "ever shows you the one that has already started. So we do the next best thing: we ask " +
        "someone to tell us the future. This is about the people we ask — and about the one " +
        "forecaster who retired undefeated.",
    },
  ];

  const chips = [
    { label: "1929 · the crash came by newspaper, and the ticker ran hours behind the selling", band: [0.16, 0.33] },
    { label: "1987 · the selling was done by computers, faster than anyone in the room could read", band: [0.38, 0.54] },
    { label: "2008 · the first crash you could watch in your own pocket", band: [0.58, 0.72] },
    { label: "And the next one? Nobody has built that screen yet.", band: [0.78, 0.89] },
  ];

  function bandOpacity(p, [a, b]) {
    const fade = 0.05;
    if (p <= a - fade || p >= b + fade) return 0;
    if (p < a) return (p - (a - fade)) / fade;
    if (p > b) return (b + fade - p) / fade;
    return 1;
  }

  const smooth = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  onMount(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Budget before beauty. Pick a tier from what the device admits to, and
    // scale pixel ratio, antialiasing and the frame cap off it. Capping the
    // frame rate is the single biggest battery win in a scene this simple.
    const cores = navigator.hardwareConcurrency || 4;
    const mem = navigator.deviceMemory || 4;
    const small = Math.min(window.innerWidth, window.innerHeight) < 700;
    const tier = cores <= 4 || mem <= 4 || small ? "low" : "high";
    const maxFps = tier === "low" ? 30 : 60;
    const frameBudget = 1 / maxFps;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: tier === "high" });
    } catch {
      webglFailed = true;
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier === "low" ? 1.25 : 1.75));

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#120c22", 9, 30);
    scene.background = new THREE.Color("#120c22");
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 60);

    // --- Light: one low lamp over a card table, and a cold glow that only
    // arrives with the crystal ball. ---
    scene.add(new THREE.AmbientLight("#8f7ec4", 0.42));
    const lamp = new THREE.DirectionalLight("#ffe7bb", 1.0);
    lamp.position.set(3, 9, 6);
    scene.add(lamp);
    const rim = new THREE.DirectionalLight("#7f6ad2", 0.4);
    rim.position.set(-7, 4, -5);
    scene.add(rim);
    const ballGlow = new THREE.PointLight("#bfe4ff", 0, 9, 2);
    ballGlow.position.set(6.4, 1.1, 0);
    scene.add(ballGlow);

    // --- The velvet table, stretching past the fog. ---
    const cloth = new THREE.Mesh(
      new THREE.CircleGeometry(26, 44),
      new THREE.MeshLambertMaterial({ color: "#241a44" })
    );
    cloth.rotation.x = -Math.PI / 2;
    cloth.position.y = -0.02;
    scene.add(cloth);

    // Contact shadow: one radial-gradient sprite drawn once, rather than a
    // second render pass every frame. Its only job is to sit the objects on
    // the cloth instead of letting them float.
    const shadowTex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      const g = c.getContext("2d");
      const rg = g.createRadialGradient(128, 128, 20, 128, 128, 126);
      rg.addColorStop(0, "rgba(0,0,0,0.8)");
      rg.addColorStop(0.6, "rgba(0,0,0,0.28)");
      rg.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = rg;
      g.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(c);
    })();
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.6,
    });
    const shadowGeom = new THREE.PlaneGeometry(3.2, 3.2);
    function contactShadow(x, z, s = 1) {
      const m = new THREE.Mesh(shadowGeom, shadowMat);
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, 0.005, z);
      m.scale.setScalar(s);
      scene.add(m);
    }

    // --- Canvas-texture helper: every screen in the scene is drawn, not
    // loaded. Each is built ONCE here, so the lettering costs nothing per
    // frame — the loop only moves the camera and a few transforms. ---
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

    // A falling line, drawn the same way on all three screens so the reader
    // reads them as the same event in three decades.
    function drawCrashLine(g, x0, y0, w, h, stroke, lw, seed) {
      const pts = [];
      const n = 46;
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        // Rise, roll over, then fall away — with a little deterministic noise
        // so it looks like a market and not a parabola.
        const shape = t < 0.42 ? t * 0.9 : 0.378 - (t - 0.42) * 1.42;
        const jitter = Math.sin((i + seed) * 2.7) * 0.045 + Math.sin((i + seed) * 0.9) * 0.03;
        pts.push([x0 + t * w, y0 + h - (Math.max(0, shape) + jitter + 0.14) * h]);
      }
      g.strokeStyle = stroke;
      g.lineWidth = lw;
      g.lineJoin = "round";
      g.beginPath();
      pts.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py)));
      g.stroke();
    }

    // === 1929 · the newspaper ================================================
    // "WALL ST. LAYS AN EGG" is the real Variety front page of 30 October 1929.
    const paperTex = tex(700, 900, (g) => {
      g.fillStyle = "#e8dfc6";
      g.fillRect(0, 0, 700, 900);
      g.fillStyle = "#2a2418";
      g.textAlign = "center";
      g.font = "700 26px Georgia, serif";
      g.fillText("V A R I E T Y", 350, 58);
      g.strokeStyle = "#2a2418";
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(40, 80);
      g.lineTo(660, 80);
      g.moveTo(40, 88);
      g.lineTo(660, 88);
      g.stroke();
      g.font = "400 19px Georgia, serif";
      g.fillText("WEDNESDAY, OCTOBER 30, 1929", 350, 118);
      g.font = "900 74px Georgia, serif";
      g.fillText("WALL ST.", 350, 232);
      g.fillText("LAYS AN EGG", 350, 316);
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(60, 356);
      g.lineTo(640, 356);
      g.stroke();
      // Columns of unreadable body type — grey rules, the way print reads at
      // this distance anyway.
      g.fillStyle = "#6d6555";
      for (let col = 0; col < 3; col++) {
        for (let line = 0; line < 22; line++) {
          const w = 150 - (line % 5) * 13;
          g.fillRect(56 + col * 200, 392 + line * 15, w, 5);
        }
      }
      // A small chart tucked into the page, the way papers did it.
      g.fillStyle = "#e2d8bc";
      g.fillRect(56, 720, 588, 150);
      drawCrashLine(g, 66, 726, 568, 138, "#8a2f22", 4, 1);
    });

    const paper = new THREE.Mesh(
      new THREE.PlaneGeometry(1.9, 2.44),
      new THREE.MeshLambertMaterial({ map: paperTex })
    );
    paper.rotation.x = -Math.PI / 2;
    paper.rotation.z = 0.16;
    paper.position.set(-6.4, 0.02, 0.1);
    scene.add(paper);
    contactShadow(-6.4, 0.1, 0.95);

    // === 1987 · the computer =================================================
    const crt = new THREE.Group();
    const caseMat = new THREE.MeshLambertMaterial({ color: "#cfc6ab" });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.25, 1.25), caseMat);
    body.position.y = 0.63;
    const foot = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.12, 1.05), caseMat);
    foot.position.y = 0.06;
    const screenTex = tex(512, 400, (g) => {
      g.fillStyle = "#08150f";
      g.fillRect(0, 0, 512, 400);
      g.fillStyle = "#2fbb6a";
      g.font = "700 22px monospace";
      g.fillText("DJIA  19-OCT-87", 24, 40);
      g.font = "700 40px monospace";
      g.fillText("-508.00", 24, 92);
      g.font = "700 24px monospace";
      g.fillText("-22.61%", 250, 90);
      drawCrashLine(g, 28, 118, 456, 250, "#2fbb6a", 4, 4);
      // Scanlines — cheap, and it is what sells a CRT.
      g.fillStyle = "rgba(0,0,0,0.22)";
      for (let y = 0; y < 400; y += 4) g.fillRect(0, y, 512, 2);
    });
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.16, 0.9),
      new THREE.MeshBasicMaterial({ map: screenTex })
    );
    screen.position.set(0, 0.68, 0.635);
    const keyboard = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 0.6), caseMat);
    keyboard.position.set(0, 0.05, 1.15);
    keyboard.rotation.x = -0.06;
    crt.add(body, foot, screen, keyboard);
    crt.position.set(-1.6, 0, 0);
    crt.rotation.y = 0.2;
    scene.add(crt);
    contactShadow(-1.5, 0.35, 1.15);

    // === 2008 · the phone ====================================================
    const phone = new THREE.Group();
    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 0.06, 1.24),
      new THREE.MeshStandardMaterial({ color: "#22222a", metalness: 0.55, roughness: 0.42 })
    );
    const phoneTex = tex(320, 640, (g) => {
      g.fillStyle = "#0d0d12";
      g.fillRect(0, 0, 320, 640);
      g.fillStyle = "#8e8e9c";
      g.font = "600 20px system-ui, sans-serif";
      g.fillText("Markets", 20, 46);
      g.fillStyle = "#f24b3a";
      g.font = "700 44px system-ui, sans-serif";
      g.fillText("-777.68", 20, 106);
      g.fillStyle = "#8e8e9c";
      g.font = "600 20px system-ui, sans-serif";
      g.fillText("DOW  29 SEP 2008", 20, 140);
      drawCrashLine(g, 20, 170, 280, 300, "#f24b3a", 5, 7);
      g.fillStyle = "#3a3a46";
      for (let i = 0; i < 5; i++) g.fillRect(20, 510 + i * 26, 280 - (i % 3) * 40, 8);
    });
    const phoneScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.54, 1.1),
      new THREE.MeshBasicMaterial({ map: phoneTex })
    );
    phoneScreen.rotation.x = -Math.PI / 2;
    phoneScreen.position.y = 0.032;
    phone.add(shell, phoneScreen);
    phone.position.set(2.9, 0.03, 0.15);
    phone.rotation.y = -0.34;
    scene.add(phone);
    contactShadow(2.9, 0.15, 0.55);

    // === The empty fourth place · the crystal ball ============================
    // It arrives late, and what it shows is static.
    const staticTex = tex(256, 256, (g) => {
      const img = g.createImageData(256, 256);
      for (let i = 0; i < img.data.length; i += 4) {
        // Deterministic noise: a hash of the pixel index, so the texture is
        // the same on every load and nothing is left to Math.random.
        const n = ((i * 2654435761) % 4294967296) / 4294967296;
        const v = 90 + n * 165;
        img.data[i] = v * 0.78;
        img.data[i + 1] = v * 0.9;
        img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      g.putImageData(img, 0, 0);
    });
    staticTex.wrapS = staticTex.wrapT = THREE.RepeatWrapping;

    const ballGroup = new THREE.Group();
    const ballInner = new THREE.Mesh(
      new THREE.SphereGeometry(0.52, 24, 18),
      new THREE.MeshBasicMaterial({ map: staticTex, transparent: true, opacity: 0 })
    );
    const ballGlass = new THREE.Mesh(
      new THREE.SphereGeometry(0.62, 28, 20),
      new THREE.MeshStandardMaterial({
        color: "#cfe6ff",
        transparent: true,
        opacity: 0,
        metalness: 0.1,
        roughness: 0.06,
      })
    );
    const standMat = new THREE.MeshStandardMaterial({
      color: "#d9a441",
      metalness: 0.85,
      roughness: 0.3,
      transparent: true,
      opacity: 0,
    });
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.44, 0.16, 20), standMat);
    stand.position.y = 0.08;
    ballInner.position.y = 0.72;
    ballGlass.position.y = 0.72;
    ballGroup.add(stand, ballInner, ballGlass);
    ballGroup.position.set(6.6, 0, 0);
    scene.add(ballGroup);
    contactShadow(6.6, 0, 0.7);

    // --- Scroll → séance progress ---
    let targetP = 0;
    let p = 0;
    function onScroll() {
      const rect = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      targetP = Math.min(1, Math.max(0, -rect.top / total));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function resize() {
      const w = wrap.clientWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
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
    const camPos = new THREE.Vector3();
    const lookAt = new THREE.Vector3();

    // Camera keyframes: a slow dolly down the length of the table, from the
    // newspaper at one end to the empty place at the other, rising slightly so
    // the last shot takes in the whole laid table at once.
    const KEY = [
      { t: 0.0, pos: [-6.6, 3.4, 5.6], look: [-6.2, 0.3, 0.2] },
      { t: 0.24, pos: [-6.2, 2.0, 3.4], look: [-6.3, 0.1, 0.1] },
      { t: 0.45, pos: [-1.5, 1.85, 3.5], look: [-1.6, 0.7, 0.1] },
      { t: 0.65, pos: [2.9, 1.5, 2.5], look: [2.9, 0.1, 0.1] },
      { t: 0.84, pos: [6.6, 1.6, 3.4], look: [6.6, 0.7, 0.0] },
      { t: 1.0, pos: [1.4, 6.6, 9.4], look: [0.4, 0.4, 0.0] },
    ];
    function cameraAt(x) {
      let i = 0;
      while (i < KEY.length - 2 && x > KEY[i + 1].t) i++;
      const a = KEY[i];
      const b = KEY[i + 1];
      const k = smooth(a.t, b.t, x);
      camPos.fromArray(a.pos).lerp(new THREE.Vector3().fromArray(b.pos), k);
      lookAt.fromArray(a.look).lerp(new THREE.Vector3().fromArray(b.look), k);
    }

    function frame() {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!visible || document.hidden) return;
      // Frame cap: skip the render entirely until the budget is used up.
      acc += dt;
      if (acc < frameBudget) return;
      acc = 0;

      elapsed += dt * (reduceMotion ? 0.15 : 1);
      p += (targetP - p) * Math.min(1, dt * 5);
      const t = elapsed;

      // The crystal ball materialises at the empty place, and its static
      // churns. Reduced motion keeps the fade but stops the churn.
      const ballIn = smooth(0.72, 0.84, p);
      ballGlass.material.opacity = ballIn * 0.34;
      ballInner.material.opacity = ballIn * 0.9;
      standMat.opacity = ballIn;
      ballGlow.intensity = ballIn * 2.4;
      staticTex.offset.set(
        reduceMotion ? 0.31 : (t * 0.9) % 1,
        reduceMotion ? 0.17 : (t * 0.37) % 1
      );
      ballInner.rotation.y = reduceMotion ? 0.4 : t * 0.25;

      // Each object leans very slightly toward the camera as it takes its
      // turn — enough to feel handled, not enough to read as animation.
      const lean = (a, b) => smooth(a, a + 0.06, p) - smooth(b, b + 0.06, p);
      paper.position.y = 0.02 + lean(0.13, 0.34) * 0.05;
      crt.position.y = lean(0.34, 0.55) * 0.05;
      phone.position.y = 0.03 + lean(0.55, 0.74) * 0.04;

      // Camera along the dolly, with a breath of drift so a stationary reader
      // still sees a living scene. Under reduced motion the drift is dropped
      // entirely rather than merely slowed: a slow loop is still a loop, and
      // at rest the frame must be genuinely still. The scroll-driven
      // progression is untouched — that is the reader's own motion.
      cameraAt(p);
      if (!reduceMotion) {
        camPos.x += Math.sin(t * 0.23) * 0.1;
        camPos.y += Math.sin(t * 0.3) * 0.05;
      }
      camera.position.copy(camPos);
      camera.lookAt(lookAt);

      // HTML overlay opacities follow the same scroll value.
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
  aria-label="A 3D scene: a velvet table laid for four. Three places hold the screen each crash arrived on — a 1929 newspaper, a 1987 computer, a 2008 phone. The fourth place is empty until a crystal ball appears there, showing static."
>
  <div class="hero-sticky">
    {#if webglFailed}
      <div class="hero-fallback">
        <p class="fb-eyebrow">A visual essay about forecasting</p>
        <h1>How do you predict the next crash?</h1>
        <p class="fb-body">
          Every crash arrives on the newest screen in the house — a newspaper in 1929, a computer
          in 1987, a phone in 2008. The trouble is that the screen only ever shows you the one that
          has already started.
        </p>
      </div>
    {:else}
      <canvas bind:this={canvas}></canvas>
      {#each cards as card, i}
        <div class="hero-card" bind:this={cardEls[i]}>
          {#if card.eyebrow}<p class="card-eyebrow">{card.eyebrow}</p>{/if}
          {#if card.title}<h1>{card.title}</h1>{/if}
          {#if card.body}<p class="card-body">{card.body}</p>{/if}
          {#if card.hint}
            <p class="scroll-hint" aria-hidden="true">Scroll to consult the table <span>↓</span></p>
          {/if}
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
    height: 400svh;
    position: relative;
    background: var(--velvet-deep);
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
  /* Vignette: pure CSS over the canvas, so it costs one composited layer
     rather than a post-processing pass every frame. Sinks the corners into
     the velvet and keeps the eye on the table. */
  .hero-sticky::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    /* Above the canvas, below the copy — a generated ::after paints last, so
       without this it would dim the title instead of the table. */
    z-index: 1;
    background: radial-gradient(
      120% 88% at 50% 48%,
      rgba(18, 12, 34, 0) 36%,
      rgba(18, 12, 34, 0.46) 76%,
      rgba(12, 8, 24, 0.82) 100%
    );
  }
  .hero-card {
    position: absolute;
    left: 50%;
    top: 13%;
    transform: translateX(-50%);
    width: min(660px, calc(100% - 48px));
    text-align: center;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    z-index: 2;
  }
  .card-eyebrow {
    color: var(--brass);
    font-size: 13px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 14px;
    text-shadow: 0 1px 10px rgba(0, 0, 0, 0.7);
  }
  .hero-card h1 {
    font-family: var(--serif);
    font-size: clamp(38px, 6.6vw, 72px);
    line-height: 1.04;
    color: #ffffff;
    margin: 0 0 18px;
    text-shadow: 0 2px 24px rgba(0, 0, 0, 0.7);
  }
  .card-body {
    color: rgba(255, 255, 255, 0.94);
    font-size: clamp(15.5px, 2.1vw, 18.5px);
    line-height: 1.62;
    text-shadow: 0 1px 12px rgba(0, 0, 0, 0.75);
    background: rgba(18, 12, 34, 0.5);
    border-radius: 10px;
    padding: 18px 22px;
  }
  .scroll-hint {
    margin-top: 26px;
    color: rgba(255, 255, 255, 0.75);
    font-size: 14px;
    letter-spacing: 0.08em;
  }
  .scroll-hint span {
    display: inline-block;
    animation: bob 1.6s ease-in-out infinite;
  }
  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(6px); }
  }
  .hero-chip {
    position: absolute;
    left: 50%;
    bottom: 9%;
    transform: translateX(-50%);
    max-width: min(560px, calc(100% - 48px));
    text-align: center;
    color: var(--parlour-cream);
    background: rgba(18, 12, 34, 0.68);
    border: 1px solid rgba(217, 164, 65, 0.3);
    border-radius: 999px;
    padding: 9px 20px;
    font-size: 14.5px;
    line-height: 1.45;
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
    background: radial-gradient(120% 90% at 50% 12%, var(--velvet) 0%, var(--velvet-deep) 100%);
  }
  .fb-eyebrow {
    color: var(--brass);
    font-size: 13px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 14px;
  }
  .hero-fallback h1 {
    font-family: var(--serif);
    font-size: clamp(36px, 6.6vw, 68px);
    color: #ffffff;
    margin: 0 0 16px;
  }
  .fb-body {
    color: rgba(255, 255, 255, 0.9);
    max-width: 560px;
    line-height: 1.6;
  }
</style>
