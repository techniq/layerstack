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
      {@attach spotlight({
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
      })}
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
