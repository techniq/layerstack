<script lang="ts">
  import { Avatar, Badge } from '@layerstack/ui';
  import { mdiBell } from '@mdi/js';
  import { Icon } from '@layerstack/ui';

  let count = $state(3);
</script>

<div class="flex items-center gap-8">
  <Badge value={count}>
    <Icon data={mdiBell} class="text-3xl" />
  </Badge>

  <Badge value={count} small placement="bottom-right">
    <Avatar class="bg-surface-200">AB</Avatar>
  </Badge>

  <Badge value={count} dot>
    <Icon data={mdiBell} class="text-3xl" />
  </Badge>
</div>

<div class="flex gap-2 mt-4">
  <button class="border rounded-sm px-2 py-1" onclick={() => (count = Math.max(0, count - 1))}
    >−</button
  >
  <button class="border rounded-sm px-2 py-1" onclick={() => count++}>+</button>
  <span class="text-sm text-surface-content/70 self-center">A badge of 0 is hidden</span>
</div>
