<script lang="ts">
  import { flip } from 'svelte/animate';
  import { Button } from 'svelte-ux';
  import { scrollFade } from '@layerstack/svelte-actions';

  let filterItems = false;

  const itemCount = 30;
  $: items = Array.from({ length: itemCount })
    .map((_, i) => `Item: ${i}`)
    .filter((_, i) => (filterItems ? i > 25 : true));
</script>

<div class="max-h-40 border rounded-sm" use:scrollFade>
  {#each items as item, i (item)}
    <div animate:flip={{ duration: 3000 }}>{item}</div>
  {/each}
</div>

<div>
  <Button variant="fill" color="primary" on:click={() => (filterItems = !filterItems)}>
    Toggle filter
  </Button>
</div>
