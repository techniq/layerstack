<script lang="ts">
  import { ProgressCircle } from '@layerstack/ui';

  let value = $state(65);
</script>

<div class="grid gap-4 justify-items-start">
  <ProgressCircle {value} size={80} width={6} track class="text-primary">
    <span class="text-sm font-medium tabular-nums">{value}%</span>
  </ProgressCircle>

  <input type="range" bind:value min={0} max={100} />
</div>
