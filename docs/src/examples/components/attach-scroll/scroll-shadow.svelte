<script lang="ts">
  import { scrollShadow } from '@layerstack/svelte-attachments';

  const itemCount = 30;
  const items = Array.from({ length: itemCount }).map((_, i) => `Item: ${i}`);
</script>

<div class="h-40 border rounded-sm" {@attach scrollShadow()}>
  {#each items as item (item)}
    <div>{item}</div>
  {/each}
</div>
