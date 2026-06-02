<script lang="ts">
  import { scrollFade } from '@layerstack/svelte-actions';

  const itemCount = 30;
  const items = Array.from({ length: itemCount }).map((_, i) => `Item: ${i}`);
</script>

<div class="h-20 border rounded-sm" use:scrollFade>
  <div class="flex whitespace-nowrap gap-2 p-2">
    {#each items as item, i}
      <div class="p-4 border">{item}</div>
    {/each}
  </div>
</div>
