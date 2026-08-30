<script lang="ts">
  import { NumberStepper } from '@layerstack/ui';

  let quantity = $state(1);
</script>

<div class="grid gap-4 justify-items-start">
  <NumberStepper bind:value={quantity} min={0} max={10} />
  <div class="text-sm text-surface-content/70">Quantity: {quantity}</div>

  <NumberStepper value={0} step={5} label="Step of 5" />
</div>
