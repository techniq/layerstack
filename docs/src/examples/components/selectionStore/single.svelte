<script lang="ts">
  import { Radio } from 'svelte-ux';
  import { selectionStore } from '@layerstack/svelte-stores';

  const data = Array.from({ length: 5 }).map((_, i) => ({ id: i + 1 }));

  const selection = selectionStore({ single: true });
</script>

{#each data as d}
  <div>
    <Radio
      group={$selection.selected}
      value={d.id}
      on:change={() => $selection.toggleSelected(d.id)}
    >
      {d.id}
    </Radio>
  </div>
{/each}
selected: {JSON.stringify($selection.selected)}
