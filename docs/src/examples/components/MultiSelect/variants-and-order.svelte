<script lang="ts">
  import { MultiSelect } from '@layerstack/ui';

  const options = ['Apple', 'Banana', 'Cherry', 'Dragonfruit'].map((label) => ({
    label,
    value: label.toLowerCase(),
  }));
</script>

<div class="grid grid-cols-3 gap-4">
  {#each ['checkbox', 'checkmark', 'fill'] as const as variant (variant)}
    <div>
      <div class="text-xs uppercase text-surface-content/50 mb-1">{variant}</div>
      <div class="rounded border border-surface-content/10">
        <MultiSelect {options} value={['banana']} mode="immediate" optionProps={{ variant }} />
      </div>
    </div>
  {/each}
</div>

<div class="mt-4">
  <div class="text-xs uppercase text-surface-content/50 mb-1">
    maintainOrder — selected options stay in place instead of floating to the top
  </div>
  <div class="max-w-xs rounded border border-surface-content/10">
    <MultiSelect {options} value={['dragonfruit']} mode="immediate" maintainOrder />
  </div>
</div>
