<script lang="ts">
  import { MenuField } from '@layerstack/ui';
  import { mdiChartLine, mdiChartBar, mdiChartPie } from '@mdi/js';

  const options = [
    { label: 'Line', value: 'line', icon: mdiChartLine },
    { label: 'Bar', value: 'bar', icon: mdiChartBar },
    { label: 'Pie', value: 'pie', icon: mdiChartPie },
  ];

  let value = $state('bar');
  let empty = $state<string | null>(null);
</script>

<div class="grid gap-4 max-w-sm">
  <!-- Options carry their own icons -->
  <MenuField label="Chart" {options} bind:value />

  <!-- A field icon, and an empty selection -->
  <MenuField label="Chart" {options} icon={mdiChartLine} bind:value={empty} />

  <!-- `menuProps` reaches the underlying Menu -->
  <MenuField
    label="Fixed width menu"
    {options}
    bind:value
    menuProps={{ matchWidth: false, placement: 'bottom-end' }}
  />
</div>
