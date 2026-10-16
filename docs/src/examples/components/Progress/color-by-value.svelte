<script lang="ts">
  import { Progress } from '@layerstack/ui';

  let value = $state(50);

  const color = $derived(
    value > 90
      ? '[--color:var(--color-danger)]'
      : value > 50
        ? '[--color:var(--color-warning)]'
        : '[--color:var(--color-success)]'
  );
</script>

<div class="grid gap-3">
  <Progress {value} max={100} class={color} />
  <input type="range" bind:value class="w-full" />
  <div class="text-sm text-surface-content/70">{value}%</div>
</div>
