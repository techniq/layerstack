<script lang="ts">
  import { scrollShadow } from '@layerstack/svelte-actions';

  const itemCount = 30;
  const items = Array.from({ length: itemCount }).map((_, i) => `Item: ${i}`);
</script>

<div
  class="h-40 border rounded-sm"
  use:scrollShadow={{
    bottom: { color: 'hsl(var(--color-surface-100))', offset: 30, blur: 30, scrollRatio: 0 },
  }}
>
  {#each items as item, i}
    <div>{item}</div>
  {/each}
</div>
