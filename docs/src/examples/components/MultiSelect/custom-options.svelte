<script lang="ts">
  import { MultiSelect, MultiSelectOption } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple', count: 12 },
    { label: 'Banana', value: 'banana', count: 4 },
    { label: 'Cherry', value: 'cherry', count: 27 },
  ];

  let value = $state<string[]>(['apple']);
</script>

<div class="max-w-xs rounded border border-surface-content/10">
  <MultiSelect {options} bind:value indeterminateSelected={['cherry']} mode="immediate">
    {#snippet option({ option, checked, indeterminate, disabled, onChange })}
      <MultiSelectOption {checked} {indeterminate} {disabled} {onChange}>
        <span class="flex-1">{option.label}</span>
        <span class="text-xs text-surface-content/50">{option.count}</span>
      </MultiSelectOption>
    {/snippet}
  </MultiSelect>
</div>
