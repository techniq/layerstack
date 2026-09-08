<script lang="ts">
  import { Badge, Button } from '@layerstack/ui';
</script>

<div class="flex gap-8 items-center">
  {#each ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const as placement (placement)}
    <Badge value={3} {placement}>
      <Button variant="outline">{placement}</Button>
    </Badge>
  {/each}
</div>
