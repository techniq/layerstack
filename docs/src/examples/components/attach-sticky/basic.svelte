<script lang="ts">
  import { sticky, stickyContext } from '@layerstack/svelte-attachments';

  const rows = Array.from({ length: 40 }).map((_, i) => `Row ${i + 1}`);
</script>

<!-- `container` makes this element the scroll container, so offsets are measured against it -->
<div class="h-64 border rounded-sm" {@attach stickyContext({ type: 'container' })}>
  <div class="bg-surface-200 border-b px-3 py-2 text-sm font-medium" {@attach sticky()}>
    Sticky header
  </div>

  {#each rows as row}
    <div class="px-3 py-2 text-sm border-b border-surface-content/10">{row}</div>
  {/each}

  <div
    class="bg-surface-200 border-t px-3 py-2 text-sm font-medium"
    {@attach sticky({ bottom: true })}
  >
    Sticky footer
  </div>
</div>
