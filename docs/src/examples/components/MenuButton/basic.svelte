<script lang="ts">
  import { MenuButton } from '@layerstack/ui';

  const options = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];

  let value = $state('week');
</script>

<div class="flex gap-4 items-center">
  <MenuButton {options} bind:value />
  <MenuButton {options} bind:value variant="fill" color="primary" />
  <MenuButton {options} bind:value menuIcon={false} />
</div>

<div class="mt-3 text-sm text-surface-content/70">Value: {value}</div>
