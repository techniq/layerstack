<script lang="ts">
  import { flip } from 'svelte/animate';
  import { Button } from 'svelte-ux';
  import { scrollShadow } from '@layerstack/svelte-actions';

  let filterItems = false;

  const itemCount = 30;
  $: items = Array.from({ length: itemCount })
    .map((_, i) => `Item: ${i}`)
    .filter((_, i) => (filterItems ? i > 25 : true));
</script>

<div class="h-40 border rounded-sm" use:scrollShadow>
  {#each items as item, i (item)}
    <div animate:flip={{ duration: 300 }}>{item}</div>
  {/each}
</div>

<div>
  <Button variant="fill" color="primary" on:click={() => (filterItems = !filterItems)}>
    Toggle filter
  </Button>
</div>
