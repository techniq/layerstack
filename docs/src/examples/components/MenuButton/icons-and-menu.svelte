<script lang="ts">
  import { MenuButton } from '@layerstack/ui';
  import { mdiChartLine, mdiChartBar, mdiChartPie, mdiTune } from '@mdi/js';

  const options = [
    { label: 'Line', value: 'line', icon: mdiChartLine },
    { label: 'Bar', value: 'bar', icon: mdiChartBar },
    { label: 'Pie', value: 'pie', icon: mdiChartPie },
  ];

  let value = $state('bar');
</script>

<div class="flex gap-4 items-center">
  <MenuButton {options} bind:value icon={mdiTune} variant="outline" />

  <!-- Icon-only: the label is replaced and the chevron removed -->
  <MenuButton {options} bind:value icon={mdiTune} menuIcon={null} class="p-3">
    {#snippet selection()}
      <span class="sr-only">Chart type</span>
    {/snippet}
  </MenuButton>

  <!-- `menuProps` reaches the underlying Menu -->
  <MenuButton
    {options}
    bind:value
    variant="fill-light"
    color="primary"
    menuProps={{ placement: 'bottom-end', matchWidth: true }}
  />
</div>
