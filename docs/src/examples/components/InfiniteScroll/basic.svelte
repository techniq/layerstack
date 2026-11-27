<script lang="ts">
  import { InfiniteScroll } from '@layerstack/ui';

  const items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
</script>

<div class="h-48 overflow-auto border rounded-sm p-2">
  <InfiniteScroll {items} perPage={10}>
    {#snippet children({ visibleItems })}
      {#each visibleItems as item (item)}
        <div class="py-1 text-sm border-b">{item}</div>
      {/each}
      <div class="py-2 text-xs text-surface-content/50">
        Showing {visibleItems.length} of {items.length}
      </div>
    {/snippet}
  </InfiniteScroll>
</div>
