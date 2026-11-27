<script lang="ts">
  import { NumberStepper } from '@layerstack/ui';
</script>

<div class="flex gap-4">
  <NumberStepper class="w-32" value={10}>
    {#snippet prefix()}
      <span class="text-surface-content/50 pl-2">$</span>
    {/snippet}
  </NumberStepper>

  <NumberStepper class="w-32" value={70}>
    {#snippet suffix()}
      <span class="text-surface-content/50 pr-2">kg</span>
    {/snippet}
  </NumberStepper>
</div>
