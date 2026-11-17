<script lang="ts">
  import { SelectionState } from '@layerstack/svelte-state';
  import { Button, Checkbox } from 'svelte-ux';

  const data = Array.from({ length: 5 }).map((_, i) => {
    return {
      id: i + 1,
    };
  });

  const selection = new SelectionState();
</script>

<Button on:click={() => (selection.current = [1, 2, 3])}>Select first 3</Button>
<Button on:click={() => (selection.current = [4, 5])}>Select last 2</Button>
<Button on:click={() => selection.clear()}>Clear</Button>
{#each data as d}
  <div>
    <Checkbox checked={selection.isSelected(d.id)} on:change={() => selection.toggle(d.id)}>
      {d.id}
    </Checkbox>
  </div>
{/each}
selected: {JSON.stringify(selection.current)}
