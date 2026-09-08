<script lang="ts">
  import { Checkbox } from 'svelte-ux';
  import { uniqueStore } from '@layerstack/svelte-stores';

  const data = Array.from({ length: 5 }).map((_, i) => ({ id: i + 1 }));

  const selected = uniqueStore();
</script>

{#each data as d}
  <div>
    <Checkbox checked={$selected.has(d.id)} on:change={() => selected.toggle(d.id)}>
      {d.id}
    </Checkbox>
  </div>
{/each}
selected: {JSON.stringify([...$selected])}
