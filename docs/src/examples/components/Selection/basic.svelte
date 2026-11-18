<script lang="ts">
  import { Button, Selection } from '@layerstack/ui';

  const options = ['Red', 'Green', 'Blue'];
</script>

<Selection all={options}>
  {#snippet children({ selected, isSelected, toggleSelected, toggleAll, isAllSelected, clear })}
    <div class="flex flex-wrap gap-2">
      {#each options as option (option)}
        <Button
          variant={isSelected(option) ? 'fill' : 'outline'}
          color="primary"
          onclick={() => toggleSelected(option)}
        >
          {option}
        </Button>
      {/each}
    </div>

    <div class="flex gap-2 mt-3">
      <Button variant="outline" onclick={toggleAll}>
        {isAllSelected() ? 'Deselect all' : 'Select all'}
      </Button>
      <Button variant="outline" onclick={clear}>Clear</Button>
    </div>

    <div class="mt-3 text-sm text-surface-content/70">
      Selected: {selected.join(', ') || '(none)'}
    </div>
  {/snippet}
</Selection>
