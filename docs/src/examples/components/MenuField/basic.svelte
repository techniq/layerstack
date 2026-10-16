<script lang="ts">
  import { MenuField } from '@layerstack/ui';

  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
  ];

  let value = $state('apple');
</script>

<div class="grid gap-4 max-w-sm">
  <MenuField label="Fruit" {options} bind:value />
  <MenuField label="Fruit" {options} bind:value dense />
</div>

<div class="mt-3 text-sm text-surface-content/70">Value: {value}</div>
