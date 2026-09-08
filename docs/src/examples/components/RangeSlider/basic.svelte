<script lang="ts">
  import { RangeSlider } from '@layerstack/ui';

  let value = $state<[number, number]>([20, 70]);
</script>

<div class="max-w-md pt-8">
  <RangeSlider bind:value min={0} max={100} step={1} />
</div>

<div class="mt-4 text-sm text-surface-content/70">
  Range: {value[0]} – {value[1]}
</div>
