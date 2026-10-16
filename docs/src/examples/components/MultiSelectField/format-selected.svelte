<script lang="ts">
  import { MultiSelectField } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
  ];

  let value = $state<string[]>(['apple', 'banana']);
</script>

<div class="max-w-sm">
  <!-- `options` in the callback are the *selected* options -->
  <MultiSelectField
    label="Fruit"
    {options}
    bind:value
    formatSelected={({ options: selectedOptions }) =>
      selectedOptions.length === options.length
        ? 'All fruit'
        : selectedOptions.length
          ? selectedOptions.map((o) => o.label).join(', ')
          : 'None'}
  />
</div>
