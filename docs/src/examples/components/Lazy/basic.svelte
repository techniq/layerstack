<script lang="ts">
  import { Lazy } from '@layerstack/ui';
</script>

<div class="h-48 overflow-auto border rounded-sm p-2">
  {#each Array.from({ length: 30 }, (_, i) => i) as n (n)}
    <Lazy height={40} class="border-b">
      <div class="p-2 text-sm">Item {n} (mounted when scrolled into view)</div>
    </Lazy>
  {/each}
</div>
