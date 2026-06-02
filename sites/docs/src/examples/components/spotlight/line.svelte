<script lang="ts">
  import { cls } from '@layerstack/tailwind';
  import { spotlight } from '@layerstack/svelte-actions';

  const itemCount = 12;
  $: items = Array.from({ length: itemCount }).map((_, i) => `Item ${i + 1}`);
</script>

<svelte:window
  on:mousemove={(e) => {
    const body = window.document.body;
    body.style.setProperty('--x', e.clientX + 'px');
    body.style.setProperty('--y', e.clientY + 'px');
  }}
/>

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
