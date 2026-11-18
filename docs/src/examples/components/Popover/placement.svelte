<script lang="ts">
  import { Button, Popover } from '@layerstack/ui';

  const placements = ['top', 'right', 'bottom', 'left'] as const;
  let openPlacement = $state<(typeof placements)[number] | null>(null);
</script>

<div class="flex flex-wrap gap-3">
  {#each placements as placement (placement)}
    <div class="relative inline-block">
      <Button
        variant="outline"
        onclick={() => (openPlacement = openPlacement === placement ? null : placement)}
      >
        {placement}
      </Button>

      <Popover
        open={openPlacement === placement}
        {placement}
        offset={8}
        onClose={() => (openPlacement = null)}
      >
        <div class="bg-surface-100 border rounded-sm shadow-sm p-2 text-sm">{placement}</div>
      </Popover>
    </div>
  {/each}
</div>
