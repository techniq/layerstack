<script lang="ts">
  import { Progress } from '@layerstack/ui';

  let value = $state(40);
</script>

<div class="grid gap-3 max-w-sm">
  <Progress {value} max={100} />
  <Progress value={100} max={100} class="[--color:var(--color-success)]" />
  <input type="range" bind:value min={0} max={100} />
</div>
