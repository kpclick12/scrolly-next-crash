<script>
  // Four spines on a shelf, three centuries apart. Not a chart — an object,
  // and the only thing it encodes is chronology, left to right. The step prop
  // pulls one book forward at a time.
  let { books, step = 0 } = $props();

  const W = 620;
  const H = 430;
  const SHELF_Y = 362;
  const SPINE_W = 100;
  const GAP = 26;
  const totalW = $derived(books.length * SPINE_W + (books.length - 1) * GAP);
  const X0 = $derived((W - totalW) / 2);

  // Each spine gets its own height and cloth colour so the shelf reads as a
  // shelf and not a bar chart. Height carries no meaning; the years do.
  const SPINES = [
    { h: 250, fill: "#6d4326", ink: "#f0e2c8" },
    { h: 288, fill: "#2f4a63", ink: "#e8f0f6" },
    { h: 232, fill: "#7a2f2a", ink: "#f6e6e2" },
    { h: 270, fill: "#3f3a5e", ink: "#eee9f6" },
  ];

  // The act's fourth card names Shiller AND Silver in one breath, so that step
  // lights both spines. Anything else leaves Silver on the shelf unlit while
  // the card is talking about him.
  const active = $derived(
    step <= 0 ? [] : step >= 3 ? [2, 3] : [step - 1]
  );
  const blurb = $derived(active.length ? books[active[active.length - 1]].blurb : "");
</script>

<figure class="chart">
  <figcaption>Three hundred years of trying</figcaption>
  <svg
    viewBox="0 0 {W} {H}"
    role="img"
    aria-label="A shelf of four books: {books.map((b) => `${b.title}, ${b.author}, ${b.year}`).join('; ')}."
  >
    <!-- The shelf itself -->
    <rect class="shelf" x="40" y={SHELF_Y} width={W - 80} height="12" rx="2" />
    <rect class="shelf-shadow" x="40" y={SHELF_Y + 12} width={W - 80} height="7" rx="2" />

    {#each books as b, i (b.title)}
      {@const s = SPINES[i % SPINES.length]}
      {@const isOn = active.includes(i)}
      {@const lift = isOn ? 14 : 0}
      {@const bx = X0 + i * (SPINE_W + GAP)}
      <g class="book" class:on={isOn} transform="translate({bx}, {SHELF_Y - s.h - lift})">
        <rect width={SPINE_W} height={s.h} rx="3" fill={s.fill} />
        <rect x="6" y="10" width={SPINE_W - 12} height="3" fill={s.ink} opacity="0.5" />
        <rect x="6" y={s.h - 13} width={SPINE_W - 12} height="3" fill={s.ink} opacity="0.5" />
        <!-- Spine lettering, rotated the way a spine is actually read -->
        <text
          class="spine-title"
          fill={s.ink}
          transform="translate({SPINE_W / 2 - 5}, {s.h - 26}) rotate(-90)"
        >{b.short}</text>
        <text
          class="spine-year"
          fill={s.ink}
          transform="translate({SPINE_W / 2 + 15}, {s.h - 26}) rotate(-90)"
        >{b.author} · {b.year}</text>
      </g>
    {/each}

    {#if blurb}
      <text class="blurb" x={W / 2} y={H - 26} text-anchor="middle">{blurb}</text>
    {/if}
  </svg>
</figure>

<style>
  .shelf {
    fill: var(--baseline);
  }
  .shelf-shadow {
    fill: var(--gridline);
  }
  .book {
    transition: transform 0.4s ease;
  }
  .book rect:first-child {
    transition: filter 0.4s ease;
    filter: saturate(0.45) brightness(0.86);
  }
  .book.on rect:first-child {
    filter: none;
  }
  .spine-title {
    font-family: var(--display);
    font-size: 13.5px;
    font-weight: 700;
  }
  .spine-year {
    font-size: 10.5px;
    opacity: 0.85;
  }
  .blurb {
    font-size: 13.5px;
    font-style: italic;
    fill: var(--text-secondary);
  }
</style>
