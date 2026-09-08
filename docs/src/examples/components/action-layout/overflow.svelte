<script lang="ts">
  import { Button } from 'svelte-ux';
  import { overflow } from '@layerstack/svelte-actions';

  let overflowX = 0;
  let overflowY = 0;
  let overflowItems = 1;
</script>

<div class="mb-2">
  <Button on:click={() => (overflowItems += 1)} variant="fill" color="primary">+ item</Button>
  <Button
    on:click={() => (overflowItems -= overflowItems > 1 ? 1 : 0)}
    variant="fill"
    color="primary">- item</Button
  >
</div>
<div
  class="w-1/2 h-[100px] border rounded-lg bg-surface-100 whitespace-nowrap truncate p-4 resize overflow-auto"
  use:overflow
  on:overflow={(e) => {
    overflowX = e.detail.overflowX;
    overflowY = e.detail.overflowY;
  }}
>
  {#each { length: overflowItems } as _}
    <div>Resize the window to see text truncate and watch values</div>
  {/each}
</div>
<div>overflowX: {overflowX}</div>
<div>overflowY: {overflowY}</div>
