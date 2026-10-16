<script lang="ts">
  import { InfiniteScroll } from '@layerstack/ui';

  const items = Array.from({ length: 500 }, (_, i) => `Item ${i + 1}`);
</script>

<!-- Only `perPage` more items are added each time the sentinel scrolls into view -->
<div class="h-64 overflow-auto border border-surface-content/10 rounded max-w-sm">
  <InfiniteScroll {items} perPage={25}>
    {#snippet children({ visibleItems })}
      {#each visibleItems as item (item)}
        <div class="px-3 py-1 text-sm border-b border-surface-content/5">{item}</div>
      {/each}
    {/snippet}
  </InfiniteScroll>
</div>
