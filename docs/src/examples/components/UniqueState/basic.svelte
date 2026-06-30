<script lang="ts">
  import { UniqueState } from '@layerstack/svelte-state';
  import { Checkbox } from 'svelte-ux';

  const data = Array.from({ length: 5 }).map((_, i) => {
    return {
      id: i + 1,
    };
  });

  const state = new UniqueState();
</script>

{#each data as d}
  <div>
    <Checkbox checked={state.current.has(d.id)} on:change={() => state.toggle(d.id)}>
      {d.id}
    </Checkbox>
  </div>
{/each}
selected: {JSON.stringify([...state.current])}
