<script lang="ts">
  import { Collapse } from '@layerstack/ui';

  // A shared `group` makes only one panel open at a time
  let group = $state<string | undefined>('a');
</script>

<div class="border rounded-sm divide-y">
  {#each [{ value: 'a', name: 'Alpha' }, { value: 'b', name: 'Beta' }, { value: 'c', name: 'Gamma' }] as item (item.value)}
    <Collapse bind:group value={item.value} name={item.name} class="px-3 py-2">
      <p class="text-sm text-surface-content/70 pb-2">Content for {item.name}.</p>
    </Collapse>
  {/each}
</div>

<div class="mt-3 text-sm text-surface-content/70">Open: {group ?? '(none)'}</div>
