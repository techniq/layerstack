<script lang="ts">
  import { SelectionState } from '@layerstack/svelte-state';
  import { Checkbox } from 'svelte-ux';

  const data = Array.from({ length: 5 }).map((_, i) => {
    return {
      id: i + 1,
    };
  });

  const selection = new SelectionState();
</script>

{#each data as d}
  <div>
    <Checkbox checked={selection.isSelected(d.id)} on:change={() => selection.toggle(d.id)}>
      {d.id}
    </Checkbox>
  </div>
{/each}
selected: {JSON.stringify(selection.current)}
