<script lang="ts">
  import { MultiSelectField } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Dragonfruit', value: 'dragonfruit' },
  ];

  let value = $state<string[]>(['apple', 'cherry']);
</script>

<div class="grid gap-4 max-w-sm">
  <MultiSelectField label="Fruit" {options} bind:value />
  <MultiSelectField label="Fruit" {options} bind:value clearable dense />
</div>

<div class="mt-3 text-sm text-surface-content/70">Value: {value.join(', ') || '(none)'}</div>
