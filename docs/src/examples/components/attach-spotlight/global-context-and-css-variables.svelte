<script lang="ts">
  import { cls } from '@layerstack/tailwind';
  import { spotlight } from '@layerstack/svelte-attachments';

  const itemCount = 12;
  const items = Array.from({ length: itemCount }).map((_, i) => `Item ${i + 1}`);
</script>

<svelte:window
  onmousemove={(e) => {
    const body = window.document.body;
    body.style.setProperty('--x', e.clientX + 'px');
    body.style.setProperty('--y', e.clientY + 'px');
  }}
/>

<div class="grid grid-cols-sm gap-3">
  {#each items as item}
    <div
      {@attach spotlight()}
      class={cls(
        'border p-4 transition-shadow hover:shadow-md rounded-lg before:rounded-lg',
        '[--spotlight-radius:200px]',
        '[--spotlight-border-width:1px]',
        '[--spotlight-border-color-stops:var(--border_base),var(--border_base),transparent]',
        '[--spotlight-surface-color-stops:var(--color-surface-200),var(--color-surface-200)]',
        '[--border_base:color-mix(in_oklab,var(--color-surface-content)_50%,transparent)]',
        'hover:[--spotlight-border-width:2px]',
        'hover:[--spotlight-border-color-stops:var(--color-primary)_5%,var(--color-secondary)]',
        'hover:[--spotlight-surface-color-stops:color-mix(in_oklab,var(--color-surface-100)_90%,transparent),var(--color-surface-100)]'
      )}
    >
      {item}
    </div>
  {/each}
</div>
