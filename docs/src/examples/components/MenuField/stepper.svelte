<script lang="ts">
  import { MenuField } from '@layerstack/ui';

  const options = [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
  ];

  let value = $state('md');
</script>

<div class="max-w-sm">
  <MenuField label="Size" {options} bind:value stepper />
</div>

<div class="mt-3 text-sm text-surface-content/70">Value: {value}</div>
