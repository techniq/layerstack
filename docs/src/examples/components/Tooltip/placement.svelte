<script lang="ts">
  import { Button, Tooltip } from '@layerstack/ui';
</script>

<div class="grid gap-6">
  <div class="flex gap-3">
    {#each ['top', 'right', 'bottom', 'left'] as const as placement (placement)}
      <Tooltip title="Hello" {placement}>
        <Button variant="outline">{placement}</Button>
      </Tooltip>
    {/each}
  </div>

  <!-- `offset` pushes the tooltip away from the trigger -->
  <div class="flex gap-3">
    {#each [0, 4, 8, 16] as offset (offset)}
      <Tooltip title="Hello" {offset}>
        <Button variant="outline">offset {offset}</Button>
      </Tooltip>
    {/each}
  </div>
</div>
