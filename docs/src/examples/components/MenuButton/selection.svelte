<script lang="ts">
  import { MenuButton } from '@layerstack/ui';
  import { mdiChartLine, mdiChartBar, mdiChartPie } from '@mdi/js';

  const options = [
    { label: 'Line', value: 'line', icon: mdiChartLine },
    { label: 'Bar', value: 'bar', icon: mdiChartBar },
    { label: 'Pie', value: 'pie', icon: mdiChartPie },
  ];

  let value = $state('bar');
</script>

<MenuButton {options} bind:value variant="outline">
  {#snippet selection({ value: option })}
    <span class="font-semibold">{option?.label ?? 'Pick a chart'}</span>
  {/snippet}
</MenuButton>
