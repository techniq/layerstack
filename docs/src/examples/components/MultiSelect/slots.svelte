<script lang="ts">
  import { Button, MultiSelect } from '@layerstack/ui';

  const options = Array.from({ length: 200 }, (_, i) => ({
    label: `Option ${i + 1}`,
    value: `option-${i + 1}`,
  }));

  let value = $state<string[]>([]);
</script>

<!-- `infiniteScroll` renders a long list in chunks as it is scrolled -->
<div class="max-w-xs rounded border border-surface-content/10 max-h-80 flex flex-col">
  <MultiSelect {options} bind:value search infiniteScroll max={5} classes={{ options: 'flex-1' }}>
    {#snippet beforeOptions({ selection })}
      <div class="px-2 py-1 text-xs text-surface-content/50">
        {(selection.current ?? []).length} of 5 selected
      </div>
    {/snippet}

    {#snippet afterOptions({ selection })}
      <div class="px-2 py-1">
        <Button size="sm" onclick={() => selection.clear()}>Clear</Button>
      </div>
    {/snippet}
  </MultiSelect>
</div>

<div class="mt-3 text-sm text-surface-content/70">{value.join(', ') || '(none)'}</div>
