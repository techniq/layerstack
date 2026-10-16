<script lang="ts">
  import { Tabs } from '@layerstack/ui';

  const options = [
    { label: 'One', value: 'a' },
    { label: 'Two', value: 'b' },
  ];

  const placements = ['top', 'bottom', 'left', 'right'] as const;
</script>

<div class="grid gap-6">
  {#each placements as placement (placement)}
    <div>
      <div class="text-xs text-surface-content/50 mb-1">{placement}</div>
      <Tabs value="a" {options} {placement}>
        {#snippet content()}
          <div class="p-4 text-sm text-surface-content/70">Panel</div>
        {/snippet}
      </Tabs>
    </div>
  {/each}
</div>
