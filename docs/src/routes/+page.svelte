<script lang="ts">
  import { onMount } from 'svelte';
  import type { Component } from 'svelte';

  import IconZap from '~icons/lucide/zap';
  import IconActivity from '~icons/lucide/activity';
  import IconDatabase from '~icons/lucide/database';
  import IconTable from '~icons/lucide/table';
  import IconPalette from '~icons/lucide/palette';
  import IconParentheses from '~icons/lucide/parentheses';
  import IconComponent from '~icons/lucide/component';
  import IconArrowRight from '~icons/lucide/arrow-right';
  import IconArrowUpRight from '~icons/lucide/arrow-up-right';
  import IconGithub from '~icons/lucide/github';

  type Pkg = {
    slug: string;
    short: string;
    name: string;
    desc: string;
    icon: Component;
    href: string;
    soon?: boolean;
  };

  // Order = bottom → top of the stack.
  const packages: Pkg[] = [
    {
      slug: 'utils',
      short: 'utils',
      name: '@layerstack/utils',
      desc: 'Framework-agnostic utilities — dates, formatting, arrays, objects, and more.',
      icon: IconParentheses,
      href: '/docs/utils',
    },
    {
      slug: 'tailwind',
      short: 'tailwind',
      name: '@layerstack/tailwind',
      desc: 'Tailwind theming + utilities — the design system powering this site.',
      icon: IconPalette,
      href: '/docs/tailwind',
    },
    {
      slug: 'svelte-actions',
      short: 'actions',
      name: '@layerstack/svelte-actions',
      desc: 'Svelte actions — input, mouse, observer, popover, portal, scroll, and more.',
      icon: IconZap,
      href: '/docs/svelte-actions',
    },
    {
      slug: 'svelte-stores',
      short: 'stores',
      name: '@layerstack/svelte-stores',
      desc: 'Composable stores — fetch, change, graph, pagination, query params, and more.',
      icon: IconDatabase,
      href: '/docs/svelte-stores',
    },
    {
      slug: 'svelte-state',
      short: 'state',
      name: '@layerstack/svelte-state',
      desc: 'Reactive state primitives — Selection, Pagination, Timer, Unique, MediaQuery.',
      icon: IconActivity,
      href: '/docs/svelte-state',
    },
    {
      slug: 'svelte-table',
      short: 'table',
      name: '@layerstack/svelte-table',
      desc: 'Headless table model — grouping, sorting, and aggregation.',
      icon: IconTable,
      href: '/docs/svelte-table',
    },
    {
      slug: 'ui',
      short: 'ui',
      name: '@layerstack/ui',
      desc: 'UI components, migrated from Svelte UX. In the works.',
      icon: IconComponent,
      href: '/docs',
      soon: true,
    },
  ];

  const shipped = packages.filter((p) => !p.soon);
  const coming = packages.find((p) => p.soon)!;

  const ecosystem = [
    {
      name: 'LayerChart',
      desc: 'Composable, data-driven charts for Svelte.',
      href: 'https://layerchart.com',
    },
    {
      name: 'Svelte UX',
      desc: 'A large collection of Svelte components & actions.',
      href: 'https://svelte-ux.techniq.dev',
    },
  ];

  let mounted = $state(false);
  onMount(() => {
    // next frame so the entrance transition runs
    requestAnimationFrame(() => (mounted = true));
  });
</script>

<div class="landing">
  <!-- ───────────────────────── HERO ───────────────────────── -->
  <section class="hero">
    <span class="reg reg-tl" aria-hidden="true">+</span>
    <span class="reg reg-tr" aria-hidden="true">+</span>
    <div class="hero-glow" aria-hidden="true"></div>

    <div class="hero-grid">
      <!-- left: identity -->
      <div class="hero-copy" class:in={mounted}>
        <p class="eyebrow">
          <span class="tick"></span>
          SVELTE&nbsp;5 · TAILWIND · TYPESCRIPT
        </p>

        <h1 class="sr-only">LayerStack — layered primitives for building Svelte apps</h1>
        <div class="wordmark" aria-hidden="true">
          <span class="word word-fill">LAYER</span>
          <span class="word word-line">STACK</span>
        </div>

        <p class="lede">
          A stack of small, composable packages for building Svelte apps — actions, state, stores,
          tables, Tailwind theming, and utilities. Install one, or layer them all.
        </p>

        <div class="cta-row">
          <a class="btn btn-primary" href="/docs/svelte-actions">
            Read the docs
            <IconArrowRight class="size-4.5" />
          </a>
          <a
            class="btn btn-ghost"
            href="https://github.com/techniq/layerstack"
            target="_blank"
            rel="noreferrer"
          >
            <IconGithub class="size-4.5" />
            GitHub
          </a>
        </div>

        <div class="install" aria-hidden="true">
          <span class="prompt">$</span> pnpm add
          <span class="pkg-accent">@layerstack/svelte-state</span>
        </div>
      </div>

      <!-- right: the stack -->
      <div class="hero-figure" class:in={mounted}>
        <div class="scene">
          <div class="stack">
            {#each packages as p, i (p.slug)}
              {@const Icon = p.icon}
              <div class="layer" class:soon={p.soon} style="--i:{i}">
                <div class="face">
                  <span class="face-idx">{String(i + 1).padStart(2, '0')}</span>
                  <Icon class="face-icon" />
                  <span class="face-label">{p.short}</span>
                </div>
              </div>
            {/each}
          </div>
          <span class="fig-tag">FIG.01 — THE STACK</span>
        </div>
      </div>
    </div>

    <div class="hero-foot" class:in={mounted}>
      <span>{packages.filter((p) => !p.soon).length} packages</span>
      <span class="sep">/</span>
      <span>MIT licensed</span>
      <span class="sep">/</span>
      <span>by techniq</span>
    </div>
  </section>

  <!-- ───────────────────────── PACKAGES ───────────────────────── -->
  <section class="section" id="stack">
    <header class="section-head">
      <span class="section-no">02</span>
      <h2 class="section-title">The packages</h2>
      <p class="section-sub">
        Each ships on its own and composes with the rest. Pick what you need.
      </p>
    </header>

    <div class="cards">
      {#each shipped as p, i (p.slug)}
        {@const Icon = p.icon}
        <a class="card" class:soon={p.soon} href={p.href} style="--d:{i * 55}ms">
          <span class="card-no">{String(i + 1).padStart(2, '0')}</span>
          <span class="card-ic"><Icon class="size-5" /></span>
          <span class="card-name">
            <span class="ns">@layerstack/</span>{p.slug}
          </span>
          <span class="card-desc">{p.desc}</span>
          <span class="card-cta">
            {#if p.soon}
              <span class="soon-badge">In&nbsp;progress</span>
            {:else}
              Documentation <IconArrowRight class="size-3.5" />
            {/if}
          </span>
        </a>
      {/each}
    </div>

    {#if coming}
      {@const Icon = coming.icon}
      <a class="card-wide" href={coming.href}>
        <span class="cw-no">07</span>
        <span class="cw-ic"><Icon class="size-5" /></span>
        <span class="cw-text">
          <span class="card-name"><span class="ns">@layerstack/</span>{coming.slug}</span>
          <span class="card-desc">{coming.desc}</span>
        </span>
        <span class="soon-badge">In&nbsp;progress</span>
      </a>
    {/if}
  </section>

  <!-- ───────────────────────── USAGE ───────────────────────── -->
  <section class="section usage">
    <header class="section-head">
      <span class="section-no">03</span>
      <h2 class="section-title">Small surface, real ergonomics</h2>
      <p class="section-sub">Primitives that read like the problem you're solving.</p>
    </header>

    <div class="code-card">
      <div class="code-bar">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        <span class="code-file">selection.svelte.ts</span>
      </div>
      <pre class="code"><span class="c-kw">import</span> &lbrace; <span class="c-ty"
          >SelectionState</span
        > &rbrace; <span class="c-kw">from</span> <span class="c-st"
          >'@layerstack/svelte-state'</span
        >;

<span class="c-kw">const</span> selection = <span class="c-kw">new</span> <span class="c-ty"
          >SelectionState</span
        >(&lbrace; all: rows.<span class="c-fn">map</span>((r) =&gt; r.id) &rbrace;);

selection.<span class="c-fn">toggle</span>(id);        <span class="c-cm">// select / deselect</span
        >
selection.<span class="c-fn">isSelected</span>(id);    <span class="c-cm">// → boolean</span>
selection.current;          <span class="c-cm">// → selected ids</span>
selection.<span class="c-fn">toggleAll</span>();       <span class="c-cm">// select all / none</span
        ></pre>
    </div>
  </section>

  <!-- ───────────────────────── ECOSYSTEM ───────────────────────── -->
  <section class="section">
    <header class="section-head">
      <span class="section-no">04</span>
      <h2 class="section-title">Built on the stack</h2>
      <p class="section-sub">Companion libraries that use these packages under the hood.</p>
    </header>

    <div class="eco">
      {#each ecosystem as e (e.name)}
        <a class="eco-card" href={e.href} target="_blank" rel="noreferrer">
          <span class="eco-name">{e.name}<IconArrowUpRight class="size-4 eco-arrow" /></span>
          <span class="eco-desc">{e.desc}</span>
        </a>
      {/each}
    </div>
  </section>

  <!-- ───────────────────────── FOOTER ───────────────────────── -->
  <footer class="foot">
    <div class="foot-mark">LAYERSTACK</div>
    <div class="foot-meta">
      <a href="https://github.com/techniq/layerstack" target="_blank" rel="noreferrer">GitHub</a>
      <a href="https://discord.gg/697JhMPD3t" target="_blank" rel="noreferrer">Discord</a>
      <a href="https://twitter.com/techniq35" target="_blank" rel="noreferrer">Twitter</a>
      <span>MIT © techniq</span>
    </div>
  </footer>
</div>

<style>
  .landing {
    --edge: clamp(1.25rem, 5vw, 6rem);
    font-feature-settings: 'ss01', 'cv01';
    color: var(--color-surface-content);
  }

  /* ── Hero ────────────────────────────────────────────── */
  .hero {
    position: relative;
    min-height: calc(100vh - 4rem);
    padding: clamp(2rem, 7vw, 6rem) var(--edge) 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
  }
  .hero-glow {
    position: absolute;
    inset: -20% -10% auto -10%;
    height: 80%;
    background: radial-gradient(
      60% 60% at 70% 0%,
      color-mix(in oklab, var(--color-primary) 22%, transparent),
      transparent 70%
    );
    filter: blur(10px);
    pointer-events: none;
  }
  .reg {
    position: absolute;
    font-family: var(--font-pixel);
    font-size: 1rem;
    line-height: 1;
    color: color-mix(in oklab, var(--color-primary) 60%, transparent);
    pointer-events: none;
  }
  .reg-tl {
    top: 1.1rem;
    left: 1.1rem;
  }
  .reg-tr {
    top: 1.1rem;
    right: 1.1rem;
  }

  .hero-grid {
    position: relative;
    width: 100%;
    display: grid;
    gap: clamp(2rem, 5vw, 4rem);
    align-items: center;
  }
  @media (min-width: 1024px) {
    .hero-grid {
      grid-template-columns: 1.05fr 0.95fr;
    }
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    font-family: var(--font-pixel);
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    color: color-mix(in oklab, var(--color-surface-content) 62%, transparent);
    margin-bottom: 1.4rem;
  }
  .tick {
    width: 0.5rem;
    height: 0.5rem;
    background: var(--color-primary);
    box-shadow: 0 0 12px color-mix(in oklab, var(--color-primary) 80%, transparent);
    animation: pulse 2.4s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.35;
    }
  }

  .wordmark {
    font-weight: 800;
    line-height: 0.82;
    letter-spacing: -0.045em;
    font-size: clamp(3.5rem, 11vw, 8.5rem);
    margin-bottom: 1.6rem;
  }
  .word {
    display: block;
  }
  .word-fill {
    color: var(--color-surface-content);
  }
  .word-line {
    margin-left: 0.06em;
    color: transparent;
    -webkit-text-stroke: 2px var(--color-primary);
  }

  .lede {
    max-width: 34rem;
    font-size: clamp(1rem, 1.4vw, 1.15rem);
    line-height: 1.6;
    color: color-mix(in oklab, var(--color-surface-content) 72%, transparent);
    margin-bottom: 2rem;
  }

  .cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1.6rem;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 1.2rem;
    font-weight: 600;
    font-size: 0.95rem;
    border-radius: 0.5rem;
    transition:
      transform 0.15s ease,
      background-color 0.15s ease,
      border-color 0.15s ease;
  }
  .btn:hover {
    transform: translateY(-2px);
  }
  .btn-primary {
    background: var(--color-primary);
    color: var(--color-primary-content, white);
    box-shadow: 0 10px 30px -10px color-mix(in oklab, var(--color-primary) 70%, transparent);
  }
  .btn-primary:hover {
    background: color-mix(in oklab, var(--color-primary) 88%, black);
  }
  .btn-ghost {
    border: 1px solid color-mix(in oklab, var(--color-surface-content) 22%, transparent);
    color: var(--color-surface-content);
  }
  .btn-ghost:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .install {
    font-family: var(--font-pixel);
    font-size: 0.82rem;
    color: color-mix(in oklab, var(--color-surface-content) 60%, transparent);
    border: 1px dashed color-mix(in oklab, var(--color-surface-content) 22%, transparent);
    border-radius: 0.4rem;
    padding: 0.6rem 0.85rem;
    width: fit-content;
    max-width: 100%;
    overflow-x: auto;
    white-space: nowrap;
  }
  .install .prompt {
    color: var(--color-primary);
    margin-right: 0.4rem;
  }
  .install .pkg-accent {
    color: var(--color-surface-content);
  }

  .hero-foot {
    position: relative;
    margin-top: clamp(2rem, 5vw, 4rem);
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    font-family: var(--font-pixel);
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    color: color-mix(in oklab, var(--color-surface-content) 50%, transparent);
  }
  .hero-foot .sep {
    color: var(--color-primary);
  }

  /* ── The isometric stack ─────────────────────────────── */
  .hero-figure {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 360px;
  }
  .scene {
    --gap: 30px;
    --w: clamp(220px, 26vw, 320px);
    --h: calc(var(--w) * 0.66);
    position: relative;
    width: var(--w);
    height: calc(var(--h) + 8 * var(--gap));
    perspective: 1500px;
    perspective-origin: 50% 40%;
  }
  .scene:hover {
    --gap: 46px;
  }
  .stack {
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--w);
    height: var(--h);
    margin: calc(var(--h) / -2) 0 0 calc(var(--w) / -2);
    transform-style: preserve-3d;
    animation: float 9s ease-in-out infinite;
  }
  @keyframes float {
    0%,
    100% {
      transform: rotateX(56deg) rotateZ(-45deg) translateZ(0);
    }
    50% {
      transform: rotateX(56deg) rotateZ(-45deg) translateZ(16px);
    }
  }
  .layer {
    position: absolute;
    inset: 0;
    transform: translateZ(calc(var(--i) * var(--gap))) translateY(var(--enter, 90px));
    opacity: 0;
    transition:
      transform 0.9s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.7s ease;
    transition-delay: calc(var(--i) * 80ms);
  }
  .hero-figure.in .layer {
    --enter: 0px;
    opacity: 1;
  }
  .face {
    position: absolute;
    inset: 0;
    border-radius: 8px;
    border: 1px solid color-mix(in oklab, var(--color-primary) 55%, transparent);
    background: color-mix(in oklab, var(--color-primary) 11%, transparent);
    box-shadow:
      inset 0 1px 0 color-mix(in oklab, var(--color-primary) 70%, transparent),
      inset 0 0 40px color-mix(in oklab, var(--color-primary) 8%, transparent),
      0 22px 40px -22px color-mix(in oklab, var(--color-primary) 55%, transparent);
    backdrop-filter: blur(3px);
  }
  .layer.soon .face {
    border-style: dashed;
    border-color: color-mix(in oklab, var(--color-surface-content) 35%, transparent);
    background: color-mix(in oklab, var(--color-surface-content) 5%, transparent);
    box-shadow: inset 0 1px 0 color-mix(in oklab, var(--color-surface-content) 25%, transparent);
  }
  .face-idx {
    position: absolute;
    top: 0.55rem;
    left: 0.7rem;
    font-family: var(--font-pixel);
    font-size: 0.7rem;
    color: color-mix(in oklab, var(--color-primary) 85%, var(--color-surface-content));
  }
  :global(.face .face-icon) {
    position: absolute;
    bottom: 0.55rem;
    left: 0.7rem;
    width: 1.15rem;
    height: 1.15rem;
    color: color-mix(in oklab, var(--color-primary) 80%, var(--color-surface-content));
  }
  .face-label {
    position: absolute;
    bottom: 0.5rem;
    right: 0.8rem;
    font-family: var(--font-pixel);
    font-size: 0.8rem;
    letter-spacing: 0.04em;
    color: color-mix(in oklab, var(--color-surface-content) 80%, transparent);
  }
  .fig-tag {
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    font-family: var(--font-pixel);
    font-size: 0.66rem;
    letter-spacing: 0.18em;
    white-space: nowrap;
    color: color-mix(in oklab, var(--color-surface-content) 45%, transparent);
  }

  /* ── Sections ────────────────────────────────────────── */
  .section {
    position: relative;
    padding: clamp(3.5rem, 8vw, 7rem) var(--edge);
    border-top: 1px solid color-mix(in oklab, var(--color-surface-content) 10%, transparent);
    background: var(--color-surface-100);
  }
  .section-head {
    max-width: 40rem;
    margin-bottom: 2.5rem;
  }
  .section-no {
    font-family: var(--font-pixel);
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    color: var(--color-primary);
  }
  .section-title {
    font-size: clamp(1.75rem, 3.5vw, 2.75rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.05;
    margin: 0.5rem 0 0.6rem;
  }
  .section-sub {
    color: color-mix(in oklab, var(--color-surface-content) 65%, transparent);
    font-size: 1.02rem;
  }

  /* ── Package cards ───────────────────────────────────── */
  .cards {
    display: grid;
    gap: 1px;
    grid-template-columns: 1fr;
    background: color-mix(in oklab, var(--color-surface-content) 10%, transparent);
    border: 1px solid color-mix(in oklab, var(--color-surface-content) 10%, transparent);
    border-radius: 0.75rem;
    overflow: hidden;
  }
  @media (min-width: 640px) {
    .cards {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (min-width: 1024px) {
    .cards {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
  .card {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas: 'no ic' 'name name' 'desc desc' 'cta cta';
    gap: 0.35rem 0.75rem;
    padding: 1.5rem 1.4rem 1.3rem;
    background: var(--color-surface-100);
    transition:
      background-color 0.2s ease,
      transform 0.2s ease;
  }
  .card:hover {
    background: var(--color-surface-200);
  }
  .card-no {
    grid-area: no;
    font-family: var(--font-pixel);
    font-size: 0.72rem;
    color: color-mix(in oklab, var(--color-surface-content) 45%, transparent);
  }
  .card-ic {
    grid-area: ic;
    justify-self: end;
    color: var(--color-primary);
    transition: transform 0.2s ease;
  }
  .card:hover .card-ic {
    transform: translateY(-2px) scale(1.08);
  }
  .card-name {
    grid-area: name;
    margin-top: 0.4rem;
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: -0.01em;
  }
  .card-name .ns {
    color: color-mix(in oklab, var(--color-surface-content) 45%, transparent);
    font-weight: 500;
  }
  .card-desc {
    grid-area: desc;
    margin-top: 0.15rem;
    font-size: 0.9rem;
    line-height: 1.5;
    color: color-mix(in oklab, var(--color-surface-content) 65%, transparent);
  }
  .card-cta {
    grid-area: cta;
    margin-top: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-family: var(--font-pixel);
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    color: var(--color-primary);
  }
  .card-cta :global(svg) {
    transition: transform 0.2s ease;
  }
  .card:hover .card-cta :global(svg) {
    transform: translateX(3px);
  }
  .card.soon {
    background: color-mix(in oklab, var(--color-surface-content) 3%, var(--color-surface-100));
  }
  .card.soon .card-ic,
  .card.soon .card-name {
    color: color-mix(in oklab, var(--color-surface-content) 55%, transparent);
  }
  .soon-badge {
    color: color-mix(in oklab, var(--color-surface-content) 55%, transparent);
    border: 1px solid currentColor;
    border-radius: 1rem;
    padding: 0.05rem 0.55rem;
    font-family: var(--font-pixel);
    font-size: 0.66rem;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }

  .card-wide {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    padding: 1.2rem 1.5rem;
    border: 1px dashed color-mix(in oklab, var(--color-surface-content) 24%, transparent);
    border-radius: 0.75rem;
    background: color-mix(in oklab, var(--color-surface-content) 3%, var(--color-surface-100));
    transition:
      border-color 0.2s ease,
      transform 0.2s ease;
  }
  .card-wide:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
  }
  .cw-no {
    font-family: var(--font-pixel);
    font-size: 0.72rem;
    color: color-mix(in oklab, var(--color-surface-content) 40%, transparent);
  }
  .cw-ic {
    color: color-mix(in oklab, var(--color-surface-content) 55%, transparent);
  }
  .cw-text {
    flex: 1;
    min-width: 0;
  }
  .card-wide .card-desc {
    margin-top: 0.1rem;
  }

  /* ── Usage / code ────────────────────────────────────── */
  .code-card {
    max-width: 46rem;
    border: 1px solid color-mix(in oklab, var(--color-surface-content) 14%, transparent);
    border-radius: 0.75rem;
    overflow: hidden;
    background: var(--color-surface-200);
    box-shadow: 0 30px 60px -30px color-mix(in oklab, var(--color-primary) 30%, transparent);
  }
  .code-bar {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.7rem 1rem;
    border-bottom: 1px solid color-mix(in oklab, var(--color-surface-content) 12%, transparent);
    background: var(--color-surface-300);
  }
  .dot {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: color-mix(in oklab, var(--color-surface-content) 25%, transparent);
  }
  .code-file {
    margin-left: 0.5rem;
    font-family: var(--font-pixel);
    font-size: 0.72rem;
    color: color-mix(in oklab, var(--color-surface-content) 55%, transparent);
  }
  .code {
    margin: 0;
    padding: 1.3rem 1.4rem;
    font-family: var(--font-pixel);
    font-size: 0.82rem;
    line-height: 1.8;
    overflow-x: auto;
    color: color-mix(in oklab, var(--color-surface-content) 88%, transparent);
  }
  .c-kw {
    color: var(--color-primary);
  }
  .c-ty {
    color: color-mix(in oklab, var(--color-primary) 55%, var(--color-surface-content));
    font-weight: 600;
  }
  .c-st {
    color: color-mix(in oklab, var(--color-surface-content) 70%, transparent);
  }
  .c-fn {
    color: color-mix(in oklab, var(--color-primary) 70%, var(--color-surface-content));
  }
  .c-cm {
    color: color-mix(in oklab, var(--color-surface-content) 40%, transparent);
  }

  /* ── Ecosystem ───────────────────────────────────────── */
  .eco {
    display: grid;
    gap: 1rem;
  }
  @media (min-width: 640px) {
    .eco {
      grid-template-columns: 1fr 1fr;
    }
  }
  .eco-card {
    padding: 1.6rem;
    border: 1px solid color-mix(in oklab, var(--color-surface-content) 14%, transparent);
    border-radius: 0.75rem;
    background: var(--color-surface-100);
    transition:
      border-color 0.2s ease,
      transform 0.2s ease;
  }
  .eco-card:hover {
    border-color: var(--color-primary);
    transform: translateY(-3px);
  }
  .eco-name {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-weight: 700;
    font-size: 1.2rem;
  }
  .eco-card :global(.eco-arrow) {
    color: var(--color-primary);
    transition: transform 0.2s ease;
  }
  .eco-card:hover :global(.eco-arrow) {
    transform: translate(2px, -2px);
  }
  .eco-desc {
    display: block;
    margin-top: 0.3rem;
    color: color-mix(in oklab, var(--color-surface-content) 65%, transparent);
  }

  /* ── Footer ──────────────────────────────────────────── */
  .foot {
    padding: clamp(2.5rem, 6vw, 4rem) var(--edge);
    border-top: 1px solid color-mix(in oklab, var(--color-surface-content) 10%, transparent);
    background: var(--color-surface-100);
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 1.5rem;
  }
  .foot-mark {
    font-weight: 800;
    letter-spacing: -0.03em;
    font-size: clamp(1.5rem, 5vw, 2.5rem);
    color: color-mix(in oklab, var(--color-surface-content) 18%, transparent);
  }
  .foot-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.2rem;
    font-family: var(--font-pixel);
    font-size: 0.74rem;
    letter-spacing: 0.05em;
    color: color-mix(in oklab, var(--color-surface-content) 50%, transparent);
  }
  .foot-meta a:hover {
    color: var(--color-primary);
  }

  /* ── Entrance (copy) ─────────────────────────────────── */
  .hero-copy > *,
  .hero-foot {
    opacity: 0;
    transform: translateY(18px);
  }
  .hero-copy.in > *,
  .hero-foot.in {
    opacity: 1;
    transform: none;
    transition:
      opacity 0.7s ease,
      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .hero-copy.in > :nth-child(1) {
    transition-delay: 0.05s;
  }
  .hero-copy.in > :nth-child(2),
  .hero-copy.in > :nth-child(3) {
    transition-delay: 0.13s;
  }
  .hero-copy.in > :nth-child(4) {
    transition-delay: 0.22s;
  }
  .hero-copy.in > :nth-child(5) {
    transition-delay: 0.3s;
  }
  .hero-copy.in > :nth-child(6) {
    transition-delay: 0.38s;
  }

  @media (prefers-reduced-motion: reduce) {
    .stack {
      animation: none;
    }
    .layer,
    .hero-copy > *,
    .hero-foot {
      transition: none !important;
      opacity: 1 !important;
      transform: translateZ(calc(var(--i, 0) * var(--gap))) !important;
    }
    .tick {
      animation: none;
    }
  }
</style>
