<script lang="ts">
  import { SelectField } from '@layerstack/ui';
  import { mdiChartLine, mdiChartBar, mdiChartPie } from '@mdi/js';

  const options = [
    { label: 'Line', value: 'line', icon: mdiChartLine },
    { label: 'Bar', value: 'bar', icon: mdiChartBar },
    { label: 'Pie', value: 'pie', icon: mdiChartPie },
  ];

  let value = $state<string | null>('bar');
</script>

<div class="max-w-sm">
  <SelectField label="Chart" {options} bind:value stepper activeOptionIcon />
</div>

<div class="mt-3 text-sm text-surface-content/70">Value: {value ?? '(none)'}</div>
