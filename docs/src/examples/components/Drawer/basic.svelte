<script lang="ts">
  import { Button, Drawer } from '@layerstack/ui';

  let open = $state(false);
  let placement = $state<'left' | 'right' | 'top' | 'bottom'>('right');

  function show(next: typeof placement) {
    placement = next;
    open = true;
  }
</script>

<div class="flex flex-wrap gap-2">
  {#each ['left', 'right', 'top', 'bottom'] as p (p)}
    <Button variant="outline" onclick={() => show(p as typeof placement)}>{p}</Button>
  {/each}
</div>

<Drawer bind:open {placement} class="w-80 max-w-[80vw] p-4">
  {#snippet children(ctx)}
    <h3 class="text-lg font-medium mb-2">Drawer ({placement})</h3>
    <p class="text-sm text-surface-content/70">Click the backdrop or press Escape to close.</p>
  {/snippet}

  {#snippet actions(ctx)}
    <Button onclick={() => ctx.close()}>Close</Button>
  {/snippet}
</Drawer>
