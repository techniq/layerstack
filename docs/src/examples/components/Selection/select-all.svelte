<script lang="ts">
  import { Checkbox, Selection } from '@layerstack/ui';

  const data = [1, 2, 3, 4, 5];
</script>

<div class="grid gap-6 max-w-sm">
  <Selection all={data} initial={[2]}>
    {#snippet children({
      selected,
      isSelected,
      toggleSelected,
      toggleAll,
      isAllSelected,
      isAnySelected,
    })}
      <!-- Indeterminate while only some are selected -->
      <Checkbox
        checked={isAllSelected()}
        indeterminate={isAnySelected() && !isAllSelected()}
        onchange={() => toggleAll()}
      >
        Select all
      </Checkbox>

      <div class="ml-6">
        {#each data as d (d)}
          <Checkbox checked={isSelected(d)} onchange={() => toggleSelected(d)}>Item {d}</Checkbox>
        {/each}
      </div>

      <div class="text-sm text-surface-content/70">selected: {JSON.stringify(selected)}</div>
    {/snippet}
  </Selection>

  <!-- `single` allows only one, `max` caps the count -->
  <Selection single>
    {#snippet children({ selected, isSelected, toggleSelected })}
      {#each data as d (d)}
        <Checkbox checked={isSelected(d)} onchange={() => toggleSelected(d)}>Item {d}</Checkbox>
      {/each}
      <div class="text-sm text-surface-content/70">single: {JSON.stringify(selected)}</div>
    {/snippet}
  </Selection>

  <Selection max={2}>
    {#snippet children({ selected, isSelected, isDisabled, toggleSelected })}
      {#each data as d (d)}
        <Checkbox
          checked={isSelected(d)}
          disabled={isDisabled(d)}
          onchange={() => toggleSelected(d)}
        >
          Item {d}
        </Checkbox>
      {/each}
      <div class="text-sm text-surface-content/70">max 2: {JSON.stringify(selected)}</div>
    {/snippet}
  </Selection>
</div>
