<script lang="ts">
  import { NumberStepper } from '@layerstack/ui';

  let bounded = $state(5);
  let precise = $state(1);
</script>

<div class="grid gap-4 max-w-sm">
  <!-- Buttons disable at the bounds -->
  <NumberStepper label="0 – 10" bind:value={bounded} min={0} max={10} />

  <NumberStepper label="Step 0.1" bind:value={precise} step={0.1} />

  <NumberStepper label="Dense" dense />
</div>

<div class="mt-3 text-sm text-surface-content/70">{bounded} &middot; {precise}</div>
