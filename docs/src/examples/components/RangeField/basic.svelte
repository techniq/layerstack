<script lang="ts">
  import { RangeField } from '@layerstack/ui';

  let volume = $state(60);
  let rate = $state(0.25);
</script>

<div class="grid gap-4 max-w-sm">
  <RangeField label="Volume" bind:value={volume} />
  <RangeField label="Rate" bind:value={rate} min={0} max={1} step={0.05} format="percentRound" />
</div>
