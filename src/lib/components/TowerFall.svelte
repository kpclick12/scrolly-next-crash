<script>
  import { scaleLinear } from "d3-scale";

  // The Tower, struck — and three figures falling off it.
  //
  // This is a drawdown chart wearing the act's own tarot card. The axes are
  // real and unchanged: the tower's parapet is the peak (0%), the stone
  // courses down the wall are the −20/−40/−60/−80 gridlines, the horizontal
  // is time since each crash's own high, and every vertex on every trail is a
  // dated closing value from crashes.json. What changed is that the lines are
  // now the paths of three bodies coming off a tower, with a figure at the end
  // of each one.
  //
  // The time axis is SQUARE-ROOTED, and the label says so. On a linear
  // 36-month axis 1987's entire crash — peak to floor in under two months — is
  // about four pixels wide, which hides the one thing that crash is known for.
  //
  // `focus` is the id of the crash being talked about, or null for all three.
  // De-emphasis NEVER carries identity: the dimmed palette measures at ΔE ~4
  // (see app.css), so every figure keeps its label lit at all times.
  let { crashes, focus = null } = $props();

  const W = 640;
  const H = 470;
  // The depth labels sit to the LEFT of the tower. They used to share the
  // right-hand margin with the fall labels, and the 1929 figure landed on top
  // of the −80% mark. The right side now belongs entirely to the fallers.
  const TOWER_X = 52;
  const TOWER_W = 96;
  const TOP = 62; // the parapet — 0%, the peak
  const BOT = H - 74; // −100%
  const RIGHT = W - 118;

  const sq = (m) => Math.sqrt(Math.min(m, 36));
  const xs = $derived(scaleLinear([0, 6], [TOWER_X + TOWER_W, RIGHT]));
  const x = $derived((m) => xs(sq(m)));
  const y = $derived(scaleLinear([-100, 0], [BOT, TOP]));

  const shown = $derived(
    crashes.map((c) => {
      const pts = c.path.map((d) => [x(Math.min(d.m, 36)), y(d.dd)]);
      const end = pts[pts.length - 1];
      const prev = pts[pts.length - 2] ?? pts[0];
      return {
        ...c,
        d: pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`).join(""),
        end,
        // The figure tumbles along its own direction of travel.
        tilt: (Math.atan2(end[1] - prev[1], end[0] - prev[0]) * 180) / Math.PI,
        dim: focus !== null && focus !== c.id,
      };
    })
  );

  // Label lanes, assigned in priority order so the crash being talked about
  // keeps the lane it wants. Measured in the SVG's own units.
  const MIN_GAP = 34;
  const labels = $derived(
    [...shown]
      .sort((a, b) => (a.dim === b.dim ? a.end[1] - b.end[1] : a.dim ? 1 : -1))
      .reduce((placed, c) => {
        let ly = c.end[1];
        let moved = true;
        let guard = 0;
        while (moved && guard++ < 12) {
          moved = false;
          for (const p of placed) {
            if (Math.abs(p.ly - ly) < MIN_GAP) {
              ly = p.ly + (ly >= p.ly ? MIN_GAP : -MIN_GAP);
              moved = true;
            }
          }
        }
        return [...placed, { ...c, ly: Math.min(Math.max(ly, TOP + 14), BOT + 8) }];
      }, [])
  );

  const summary = $derived(
    focus
      ? (() => {
          const c = crashes.find((k) => k.id === focus);
          return `${c.name}, ${c.year}: the Dow fell ${Math.abs(c.drawdown)} percent from its peak of ${c.peakDate}, reaching bottom ${c.monthsToTrough} months later, and did not close back at the old peak until ${c.backToEven}.`;
        })()
      : "Three falling figures drop away from a tower, one per crash, each trail showing how far below its own peak the Dow fell: 1929 by 89 percent over 34 months, 1987 by 36 percent in under two, and 2008 by 54 percent over 17 months."
  );

  // Stone courses double as the depth gridlines.
  const COURSES = [-20, -40, -60, -80];
</script>

<figure class="chart">
  <figcaption>The Tower · how far below the peak, Dow Jones</figcaption>
  <svg viewBox="0 0 {W} {H}" role="img" aria-label={summary}>
    <defs>
      <linearGradient id="stone" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="var(--baseline)" />
        <stop offset="55%" stop-color="var(--gridline)" />
        <stop offset="100%" stop-color="var(--baseline)" />
      </linearGradient>
    </defs>

    <!-- The tower. Its parapet is the peak line; every course below is a
         depth gridline, so the masonry is the axis. -->
    <rect class="tower" x={TOWER_X} y={TOP} width={TOWER_W} height={BOT - TOP + 14} fill="url(#stone)" />
    {#each [0, 1, 2, 3, 4] as i}
      <rect class="crenel" x={TOWER_X + i * (TOWER_W / 5) + 3} y={TOP - 16} width={TOWER_W / 5 - 6} height="16" />
    {/each}
    {#each COURSES as c}
      <line class="course" x1={TOWER_X} x2={TOWER_X + TOWER_W} y1={y(c)} y2={y(c)} />
    {/each}
    <!-- A window, and the crack the lightning opened. -->
    <path class="window" d="M{TOWER_X + 30} {y(-46)} L{TOWER_X + 30} {y(-32)} Q{TOWER_X + 42} {y(-24)} {TOWER_X + 54} {y(-32)} L{TOWER_X + 54} {y(-46)} Z" />
    <path class="crack" d="M{TOWER_X + 62} {TOP} l-9 26 l11 14 l-13 30 l8 22 l-10 26" />

    <!-- The lightning bolt, and the crown coming off the top. -->
    <path class="bolt" d="M{TOWER_X + 108} 4 l-36 44 h21 l-25 36 l55 -42 h-22 z" />
    <g class="crown" transform="translate({TOWER_X + TOWER_W + 34}, {TOP - 40}) rotate(26)">
      <path d="M0 14 L4 0 L10 9 L16 0 L22 9 L28 0 L32 14 Z" />
      <rect x="0" y="14" width="32" height="5" rx="1" />
    </g>

    <!-- Depth gridlines continue out across the sky, faintly. -->
    {#each COURSES as c}
      <line class="sky-rule" x1={TOWER_X + TOWER_W} x2={RIGHT} y1={y(c)} y2={y(c)} />
      <text class="depth" x={TOWER_X - 8} y={y(c) + 4} text-anchor="end">{c}%</text>
    {/each}
    <line class="peak-rule" x1={TOWER_X + TOWER_W} x2={RIGHT} y1={TOP} y2={TOP} />
    <text class="depth peak" x={TOWER_X - 8} y={TOP + 4} text-anchor="end">0%</text>
    <text class="peak-note" x={TOWER_X - 8} y={TOP - 12} text-anchor="end">the peak</text>

    <!-- Time -->
    {#each [1, 3, 6, 12, 24, 36] as t}
      <text class="tick" x={x(t)} y={BOT + 24} text-anchor="middle">{t}</text>
    {/each}
    <text class="axis-lbl" x={(TOWER_X + TOWER_W + RIGHT) / 2} y={H - 12} text-anchor="middle">
      months after the peak — spaced by √time, so the first weeks are readable
    </text>

    <!-- The fall itself: one trail and one figure per crash. -->
    {#each shown as c (c.id)}
      <path class="trail trail-{c.color}" class:dim={c.dim} d={c.d} />
    {/each}
    {#each shown as c (c.id)}
      <g
        class="faller faller-{c.color}"
        class:dim={c.dim}
        transform="translate({c.end[0]}, {c.end[1]}) rotate({c.tilt})"
      >
        <title>{c.year} {c.name}: {c.drawdown}% from peak</title>
        <!-- A tumbling body, drawn small enough to read as a mark. -->
        <circle class="head" cx="0" cy="-9" r="5.4" />
        <path class="limb" d="M0 -4 L0 8" />
        <path class="limb" d="M0 -1 L-9 -8" />
        <path class="limb" d="M0 -1 L9 -6" />
        <path class="limb" d="M0 8 L-7 17" />
        <path class="limb" d="M0 8 L8 16" />
      </g>
    {/each}

    <!-- Direct labels, always on. They are the reason the dimmed state is
         allowed to exist at all — identity never rests on hue here. -->
    {#each labels as c (c.id)}
      <text class="yr yr-{c.color}" x={c.end[0] + 16} y={c.ly - 2}>{c.label}</text>
      <text class="yr-sub" x={c.end[0] + 16} y={c.ly + 14}>{c.drawdown}%</text>
    {/each}
  </svg>
  <p class="note">
    Straight lines between dated closing values — the real fall wandered
    between them. The 1929 figure keeps going past the bottom of this card, to
    −89% in July 1932.
  </p>
</figure>

<style>
  .tower { stroke: var(--baseline); stroke-width: 1.5; }
  .crenel { fill: var(--baseline); }
  .course { stroke: var(--baseline); stroke-width: 1.6; opacity: 0.85; }
  .window { fill: var(--velvet); opacity: 0.75; }
  .crack {
    fill: none;
    stroke: var(--velvet);
    stroke-width: 2;
    opacity: 0.5;
    stroke-linejoin: round;
  }
  .bolt { fill: var(--brass); stroke: var(--brass-deep); stroke-width: 1.2; }
  .crown { fill: var(--brass); stroke: var(--brass-deep); stroke-width: 1.2; }
  .sky-rule { stroke: var(--gridline); stroke-dasharray: 2 6; }
  .peak-rule { stroke: var(--baseline); stroke-width: 1.4; }
  .depth {
    font-family: var(--sans);
    font-size: 11.5px;
    fill: var(--text-muted);
    font-variant-numeric: tabular-nums;
  }
  .depth.peak { fill: var(--text-secondary); font-weight: 700; }
  .peak-note {
    font-family: var(--body);
    font-style: italic;
    font-size: 12.5px;
    fill: var(--text-muted);
  }
  .tick {
    font-family: var(--sans);
    font-size: 11.5px;
    fill: var(--text-muted);
    font-variant-numeric: tabular-nums;
  }
  .axis-lbl {
    font-family: var(--sans);
    font-size: 11px;
    fill: var(--text-muted);
  }
  .trail {
    fill: none;
    stroke-width: 2.4;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-dasharray: 7 5;
    transition: opacity 0.4s ease, stroke-width 0.4s ease;
  }
  .trail.dim { opacity: 0.4; stroke-width: 1.5; }
  .trail-red { stroke: var(--series-red); }
  .trail-blue { stroke: var(--series-blue); }
  .trail-green { stroke: var(--series-green); }
  .faller { transition: opacity 0.4s ease; }
  .faller.dim { opacity: 0.42; }
  .faller .head { stroke: var(--surface-1); stroke-width: 1.6; }
  .faller .limb { fill: none; stroke-width: 3.4; stroke-linecap: round; }
  .faller-red .head { fill: var(--series-red); }
  .faller-red .limb { stroke: var(--series-red); }
  .faller-blue .head { fill: var(--series-blue); }
  .faller-blue .limb { stroke: var(--series-blue); }
  .faller-green .head { fill: var(--series-green); }
  .faller-green .limb { stroke: var(--series-green); }
  /* Halo: the labels sit over whichever trail happens to cross there, and at
     phone width the 2008 label lands right on the 1929 fall. */
  .yr,
  .yr-sub {
    paint-order: stroke fill;
    stroke: var(--surface-1);
    stroke-width: 3.4px;
    stroke-linejoin: round;
  }
  .yr {
    font-family: var(--display);
    font-size: 15px;
    font-weight: 700;
  }
  .yr-red { fill: var(--ink-red); }
  .yr-blue { fill: var(--ink-blue); }
  .yr-green { fill: var(--ink-green); }
  .yr-sub {
    font-family: var(--sans);
    font-size: 11.5px;
    fill: var(--text-muted);
    font-variant-numeric: tabular-nums;
  }
</style>
