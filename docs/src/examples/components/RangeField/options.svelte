<script lang="ts">
  import { RangeField } from '@layerstack/ui';

  let ratio = $state(0.4);
  let price = $state(2500);
</script>

<div class="grid gap-4 max-w-sm">
  <RangeField label="Steps of 0.1" min={0} max={10} step={0.1} value={5} />

  <!-- `format` applies a format preset to the displayed number -->
  <RangeField label="Percent" bind:value={ratio} min={0} max={1} step={0.01} format="percent" />
  <RangeField
    label="Currency"
    bind:value={price}
    min={0}
    max={10000}
    step={100}
    format="currency"
  />

  <RangeField label="Disabled" value={30} disabled />
</div>
