<script lang="ts">
  import { cls } from '@layerstack/tailwind';
  import { spotlight } from '@layerstack/svelte-actions';

  import Code from '$docs/Code.svelte';
  import Preview from '$docs/Preview.svelte';

  const itemCount = 12;
  $: items = Array.from({ length: itemCount }).map((_, i) => `Item ${i + 1}`);
</script>

<h1>Usage</h1>

<Code source={`import { spotlight } from '@layerstack/svelte-actions';`} language="javascript" />

<svelte:window
  on:mousemove={(e) => {
    const body = window.document.body;
    body.style.setProperty('--x', e.clientX + 'px');
    body.style.setProperty('--y', e.clientY + 'px');
  }}
/>

<h2>Using global context and options</h2>

<Preview>
  <div class="grid grid-cols-sm gap-3">
    {#each items as item, i}
      <div
        use:spotlight={{
          radius: '200px',
          borderWidth: '1px',
          borderColorStops: 'var(--border_base), var(--border_base), transparent',
          surfaceColorStops: 'var(--surface_base), var(--surface_base)',
          hover: {
            radius: '400px',
            borderWidth: '2px',
            borderColorStops: 'var(--border_hover_1) 5%, var(--border_hover_2)',
            surfaceColorStops: 'var(--surface_hover_1), var(--surface_hover_2)',
          },
        }}
        class={cls(
          'border p-4 transition-shadow hover:shadow-md rounded-lg before:rounded-lg',
          '[--border_base:var(--color-surface-content)]/50',
          '[--border_hover_1:var(--color-primary)]',
          '[--border_hover_2:var(--color-secondary)]',
          '[--surface_base:var(--color-surface-200)]',
          '[--surface_hover_1:var(--color-surface-100)]/90',
          '[--surface_hover_2:var(--color-surface-100)]'
        )}
      >
        {item}
      </div>
    {/each}
  </div>
</Preview>

<h2>Using global context and CSS variables</h2>

<Preview>
  <div class="grid grid-cols-sm gap-3">
    {#each items as item, i}
      <div
        use:spotlight
        class={cls(
          'border p-4 transition-shadow hover:shadow-md rounded-lg before:rounded-lg',
          '[--spotlight-radius:200px]',
          '[--spotlight-border-width:1px]',
          '[--spotlight-border-color-stops:--var(--color-surface-content/50%),--var(--color-surface-content/50%),transparent]',
          '[--spotlight-surface-color-stops:var(--color-surface-200),var(--color-surface-200)]',
          'hover:[--spotlight-border-width:2px]',
          'hover:[--spotlight-border-color-stops:var(--color-primary)_5%,var(--color-secondary)]',
          'hover:[--spotlight-surface-color-stops:--var(--color-surface-100/90%),var(--color-surface-100)]'
        )}
      >
        {item}
      </div>
    {/each}
  </div>
</Preview>

<h2>Line example</h2>

<Preview>
  <div class="grid grid-cols-sm gap-3">
    {#each items as item, i}
      <div
        use:spotlight
        class={cls(
          'border px-4 py-8 transition-shadow hover:shadow-md rounded-lg before:rounded-lg',
          '[--spotlight-radius:100px]',
          '[--spotlight-border-width:1px]',
          '[--spotlight-border-color-stops:--var(--color-surface-content/50%),--var(--color-surface-content/50%),transparent]',
          '[--spotlight-surface-color-stops:var(--color-surface-200),var(--color-surface-200)]',
          'hover:[--spotlight-radius:50px]',
          'hover:[--spotlight-border-width:2px]',
          'hover:[--spotlight-border-color-stops:var(--color-primary)_100%,transparent]',
          'hover:[--spotlight-surface-color-stops:--var(--color-surface-200/90%),var(--color-surface-200)]'
        )}
      >
        {item}
      </div>
    {/each}
  </div>
</Preview>
