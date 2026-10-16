<script lang="ts">
  import { RangeSlider } from '@layerstack/ui';

  let fine = $state<[number, number]>([0.2, 0.8]);
  let coarse = $state<[number, number]>([20, 60]);
</script>

<div class="grid gap-8 max-w-sm">
  <!-- Fractional steps -->
  <RangeSlider bind:value={fine} min={0} max={1} step={0.01} />

  <!-- Coarse steps snap the thumbs -->
  <RangeSlider bind:value={coarse} min={0} max={100} step={20} />

  <!-- Hide the value bubbles -->
  <RangeSlider value={[30, 70]} disableTooltips />

  <RangeSlider value={[30, 70]} disabled />
</div>

<div class="mt-3 text-sm text-surface-content/70">
  {fine.join(' – ')} &middot; {coarse.join(' – ')}
</div>
