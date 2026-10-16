<script lang="ts">
  import { SelectField } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Dragonfruit', value: 'dragonfruit' },
  ];

  let value = $state<string | null>('banana');
</script>

<div class="grid gap-4 max-w-sm">
  <SelectField label="Fruit" {options} bind:value />
  <SelectField label="Fruit" {options} bind:value clearable />
  <SelectField label="Fruit" {options} bind:value dense />
  <SelectField label="Fruit" {options} bind:value disabled />
</div>

<div class="mt-3 text-sm text-surface-content/70">Value: {value ?? '(none)'}</div>
