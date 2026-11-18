<script lang="ts">
  import { Button, Drawer } from '@layerstack/ui';

  let open = $state<string | null>(null);
  const sizes = { top: 'h-64', bottom: 'h-64', left: 'w-96', right: 'w-96' } as const;
</script>

<div class="flex gap-3">
  {#each ['top', 'bottom', 'left', 'right'] as const as placement (placement)}
    <Button variant="outline" onclick={() => (open = placement)}>{placement}</Button>

    <Drawer
      open={open === placement}
      {placement}
      class={sizes[placement]}
      onClose={() => (open = null)}
    >
      <div class="p-4">Contents</div>

      {#snippet actions({ close })}
        <Button onclick={() => close()}>Close</Button>
      {/snippet}
    </Drawer>
  {/each}
</div>
