<script lang="ts">
  import { scrollIntoView } from '@layerstack/svelte-actions';
  import { cls } from '@layerstack/tailwind';

  const itemCount = 30;
  const items = Array.from({ length: itemCount }).map((_, i) => `Item: ${i}`);
  let scrolledIndex = 0;
</script>

<input type="range" bind:value={scrolledIndex} min={0} max={itemCount - 1} />
{scrolledIndex}
<div class="h-40 overflow-auto border rounded-sm">
  {#each items as item, i}
    <div
      use:scrollIntoView={{ condition: scrolledIndex === i }}
      class={cls(scrolledIndex === i && 'bg-surface-content/10')}
    >
      {item}
    </div>
  {/each}
</div>
